import { IncomingForm } from 'formidable'
import fs from 'fs'
import path from 'path'

export const config = {
    api: {
        bodyParser: false
    }
}

export default async function handler(req, res) {
    console.log('[Upload] Request received')

    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST'])
        
return res.status(405).end(`Method ${req.method} Not Allowed`)
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads')

    try {
        if (!fs.existsSync(uploadDir)) {
            console.log('[Upload] Creating directory:', uploadDir)
            fs.mkdirSync(uploadDir, { recursive: true })
        }
    } catch (err) {
        console.error('[Upload] Error creating directory:', err)
        
return res.status(500).json({ error: 'Server configuration error' })
    }

    const form = new IncomingForm({
        uploadDir: uploadDir, // Configure upload dir directly if possible (v2/v3 support)
        keepExtensions: true,
        filename: (name, ext, part, form) => {
            return `${Date.now()}_${part.originalFilename.replace(/\s/g, '_')}` // v3 custom filename
        }
    })

    // Note: formatting of filename option depends on formidable version. 
    // v2 uses simple generic names. v3 allows function.
    // Safety: Let's parse and then move/rename if needed.

    form.parse(req, async (err, fields, files) => {
        if (err) {
            console.error('[Upload] Formidable Error:', err)
            
return res.status(500).json({ error: 'Error parsing file' })
        }

        console.log('[Upload] Fields:', Object.keys(fields), 'Files:', Object.keys(files))

        const uploadedFile = Array.isArray(files.file) ? files.file[0] : files.file

        if (!uploadedFile) {
            console.error('[Upload] No "file" field in request')
            
return res.status(400).json({ error: 'No file uploaded' })
        }

        // Determine paths
        // Formidable (depending on ver) might store in temp or uploadDir if configured.
        // If we didn't confirm uploadDir in options, it's likely in temp.
        const tempPath = uploadedFile.filepath || uploadedFile.path
        if (!tempPath) {
            console.error('[Upload] File object missing path:', uploadedFile)
            
return res.status(500).json({ error: 'File upload failed (no path)' })
        }

        const fileName = uploadedFile.originalFilename
            ? `${Date.now()}_${uploadedFile.originalFilename.replace(/\s/g, '_')}`
            : `${Date.now()}_uploaded`

        const targetPath = path.join(uploadDir, fileName)

        console.log(`[Upload] Moving from ${tempPath} to ${targetPath}`)

        try {
            // Use copyFile + unlink to support cross-partition moves (Windows temp -> C:)
            await fs.promises.copyFile(tempPath, targetPath)
            await fs.promises.unlink(tempPath)

            const fileUrl = `/uploads/${fileName}`

            const newFile = {
                id: Date.now(),
                fileName: fileName,
                fileUrl: fileUrl,
                absolutePath: targetPath,
                fileType: uploadedFile.mimetype || 'application/octet-stream',
                fileSize: uploadedFile.size,
                createdAt: new Date()
            }

            console.log('[Upload] Success:', newFile)
            res.status(201).json(newFile)

        } catch (moveErr) {
            console.error('[Upload] Move Error:', moveErr)
            res.status(500).json({ error: 'Error saving file to disk' })
        }
    })
}

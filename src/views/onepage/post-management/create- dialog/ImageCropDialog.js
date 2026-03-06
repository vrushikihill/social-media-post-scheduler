import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Box, Button, Dialog, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import ReactCrop from 'react-image-crop'
import toast from 'react-hot-toast'
import 'react-image-crop/dist/ReactCrop.css'
import { getCroppedImg } from './utils'

export const ImageCropDialog = ({ open, onClose, imageFile, onCropComplete }) => {
  const [crop, setCrop] = useState({ unit: '%', width: 90, height: 90, x: 5, y: 5 })
  const [completedCrop, setCompletedCrop] = useState(null)
  const imgRef = useRef(null)
  const [imageSrc, setImageSrc] = useState('')
  const [currentAspect, setCurrentAspect] = useState(undefined)

  useEffect(() => {
    if (imageFile && open) {
      const reader = new FileReader()
      reader.addEventListener('load', () => setImageSrc(reader.result?.toString() || ''))
      reader.readAsDataURL(imageFile)

      // Reset crop when opening
      setCrop({ unit: '%', width: 90, height: 90, x: 5, y: 5 })
      setCurrentAspect(undefined)
    }
  }, [imageFile, open])

  const onImageLoad = useCallback(img => {
    imgRef.current = img.currentTarget

    // Set initial crop based on image dimensions
    const { width, height } = img.currentTarget

    const initialCrop = {
      unit: 'px',
      width: width * 0.9,
      height: height * 0.9,
      x: width * 0.05,
      y: height * 0.05
    }

    setCrop(initialCrop)

    // Auto-set completed crop for immediate availability
    setCompletedCrop(initialCrop)
  }, [])

  const handleCropComplete = async () => {
    if (!imgRef.current || !completedCrop?.width || !completedCrop?.height) {
      toast.error('Please wait for the image to load or adjust the crop area')

      return
    }

    try {
      const croppedImageBlob = await getCroppedImg(imgRef.current, completedCrop, imageFile.name)

      const croppedFile = new File([croppedImageBlob], imageFile.name, {
        type: imageFile.type,
        lastModified: Date.now()
      })

      // Create preview URL for the cropped image
      const previewUrl = URL.createObjectURL(croppedFile)

      onCropComplete({
        file: croppedFile,
        originalFile: imageFile,
        previewUrl: previewUrl
      })
      onClose()
    } catch (error) {
      toast.error('Failed to crop image')
    }
  }

  const handleAspectRatioChange = aspectRatio => {
    setCurrentAspect(aspectRatio)

    if (!imgRef.current) return

    const { width: imgWidth, height: imgHeight } = imgRef.current
    let newCrop

    if (aspectRatio === undefined) {
      // Free crop - reset to 90% of image
      newCrop = {
        unit: 'px',
        width: imgWidth * 0.9,
        height: imgHeight * 0.9,
        x: imgWidth * 0.05,
        y: imgHeight * 0.05
      }
    } else {
      // Calculate crop dimensions based on aspect ratio
      let cropWidth, cropHeight

      if (aspectRatio >= 1) {
        // Landscape or square - fit to width
        cropWidth = Math.min(imgWidth * 0.9, imgHeight * 0.9 * aspectRatio)
        cropHeight = cropWidth / aspectRatio
      } else {
        // Portrait - fit to height
        cropHeight = Math.min(imgHeight * 0.9, (imgWidth * 0.9) / aspectRatio)
        cropWidth = cropHeight * aspectRatio
      }

      // Center the crop
      const x = (imgWidth - cropWidth) / 2
      const y = (imgHeight - cropHeight) / 2

      newCrop = {
        unit: 'px',
        width: cropWidth,
        height: cropHeight,
        x: Math.max(0, x),
        y: Math.max(0, y)
      }
    }

    setCrop(newCrop)

    // Auto-set completed crop so it's immediately available
    setCompletedCrop(newCrop)
  }

  const getAspectRatioPresets = () => [
    { label: 'Free', value: undefined },
    { label: 'Square (1:1)', value: 1 },
    { label: 'Portrait (4:5)', value: 4 / 5 },
    { label: 'Landscape (5:4)', value: 5 / 4 },
    { label: 'Story (9:16)', value: 9 / 16 },
    { label: 'Wide (16:9)', value: 16 / 9 }
  ]

  return (
    <Dialog open={open} onClose={onClose} maxWidth='md' fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant='h6'>Crop Image</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant='body2' color='text.secondary' sx={{ mb: 1 }}>
            Aspect Ratio Presets:
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {getAspectRatioPresets().map(preset => (
              <Button
                key={preset.label}
                size='small'
                variant={currentAspect === preset.value ? 'contained' : 'outlined'}
                onClick={() => handleAspectRatioChange(preset.value)}
              >
                {preset.label}
              </Button>
            ))}
          </Box>
        </Box>

        {imageSrc && (
          <Box sx={{ mb: 2, maxHeight: '400px', overflow: 'hidden', display: 'flex', justifyContent: 'center' }}>
            <ReactCrop
              crop={crop}
              onChange={newCrop => setCrop(newCrop)}
              onComplete={c => setCompletedCrop(c)}
              aspect={currentAspect}
              keepSelection
              ruleOfThirds
            >
              <img
                ref={imgRef}
                alt='Crop me'
                src={imageSrc}
                style={{ maxHeight: '400px', width: 'auto' }}
                onLoad={onImageLoad}
              />
            </ReactCrop>
          </Box>
        )}

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant='contained' onClick={handleCropComplete}>
            Apply Crop
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

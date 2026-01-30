import CloseIcon from '@mui/icons-material/Close'
import DeleteIcon from '@mui/icons-material/Delete'
import PhotoCameraBackIcon from '@mui/icons-material/PhotoCameraBack'
import { Box, Button, Dialog, Divider, IconButton, Typography } from '@mui/material'
import { unwrapResult } from '@reduxjs/toolkit'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { useAuth } from 'src/hooks/useAuth'
import { uploadFiles } from 'src/store/common'
import { updateOrganizationLogo } from 'src/store/settings/user/user'

const LogoUpload = ({ open, onClose }) => {
  const [showFile, setShowFile] = useState(null) // Store the single file to show
  const [file, setFile] = useState(null) // Store a single uploaded file
  const dispatch = useDispatch()
  const { user } = useAuth()

  const handleFileChange = e => {
    const selectedFile = e.target.files[0]
    const maxSize = 5 // Max size in MB

    if (selectedFile) {
      const size = selectedFile.size / 1024 / 1024 // Convert size to MB
      if (size > maxSize) {
        alert(`File size should be less than ${maxSize}MB`)

        return
      }

      if (selectedFile.type.split('/')[0] === 'image') {
        setShowFile({
          name: selectedFile.name,
          url: URL.createObjectURL(selectedFile),
          fileType: selectedFile.type
        })
        setFile(selectedFile)
      }
    }
  }

  const handleDelete = () => {
    setShowFile(null)
    setFile(null)
  }

  const handleSave = async () => {
    try {
      if (file) {
        let uploadFile = await dispatch(uploadFiles([file]))
        uploadFile = unwrapResult(uploadFile)

        await dispatch(
          updateOrganizationLogo({
            id: user.organizationId,
            url: uploadFile.data.files[0].url
          })
        )

        toast.success('Logo updated successfully!')
        onClose()
      } else {
        toast.error('User information not found')
      }
    } catch (err) {
      toast.error(err?.message || 'Failed to update address')
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <Box sx={{ display: 'flex', alignItems: 'center', p: 4, justifyContent: 'space-between' }}>
        <Typography variant='h6'>Upload Logo here</Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      {!showFile ? (
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            border: theme => `1px dashed ${theme.palette.divider}`,
            borderRadius: 1,
            my: 8,
            mx: 7,
            cursor: 'pointer',
            '&:hover': {
              borderColor: theme => theme.palette.primary.main
            },
            minHeight: 250
          }}
          onClick={() => {
            document.getElementById('logo-image').click()
          }}
        >
          <>
            <PhotoCameraBackIcon sx={{ fontSize: 40 }} />
            <Typography variant='body1'>Upload image here</Typography>
            <Typography variant='body1'>or</Typography>
            <Typography variant='body2' sx={{ textAlign: 'center', px: 2 }}>
              You can add an image of your item, not exceeding 5 MB.
            </Typography>
          </>
        </Box>
      ) : (
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            flexDirection: 'column'
          }}
        >
          <Box
            sx={{
              minHeight: 180,
              border: theme => `1px solid ${theme.palette.divider}`,
              borderRadius: 1,
              my: 8,
              mx: 7,
              p: 2,
              display: 'flex',
              justifyContent: 'space-between',
              flexDirection: 'column'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <img src={showFile?.url} alt='img' style={{ width: 200, height: 140 }} />
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                p: 2,
                alignItems: 'center'
              }}
            >
              <Typography variant='body1'>{showFile?.name}</Typography>
              <IconButton size='small' onClick={handleDelete}>
                <DeleteIcon fontSize='small' color='error' />
              </IconButton>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 8, pb: 8 }}>
            <Button variant='contained' onClick={handleSave}>
              Save
            </Button>
          </Box>
        </Box>
      )}
      <input
        type='file'
        accept='.pdf, image/jpeg, image/png, image/jpg'
        id='logo-image'
        hidden
        onChange={handleFileChange}
      />
    </Dialog>
  )
}

export default LogoUpload

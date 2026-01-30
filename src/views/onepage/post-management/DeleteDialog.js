import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material'
import React from 'react'

const DeleteDialog = ({ deleteDialogOpen, setDeleteDialogOpen, selectedPost, handleConfirmDelete }) => {
  return (
    <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
      <DialogTitle>Delete Post</DialogTitle>
      <DialogContent>
        <Alert severity='warning' sx={{ mb: 2 }}>
          This action cannot be undone.
        </Alert>
        <Typography variant='body1'>Are you sure you want to delete this post?</Typography>
        <Typography variant='body2' color='text.secondary' sx={{ mt: 1 }}>
          "{selectedPost?.content?.substring(0, 100)}..."
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
        <Button onClick={handleConfirmDelete} color='error' variant='contained'>
          Delete Post
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteDialog

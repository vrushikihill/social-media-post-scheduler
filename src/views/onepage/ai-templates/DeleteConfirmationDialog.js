import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
  Box,
  IconButton
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'

const DeleteConfirmationDialog = ({ open, onClose, onConfirm, templateName }) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: 3,
          width: '100%',
          maxWidth: 400,
          p: 2
        }
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box 
          sx={{ 
            display: 'flex', 
            bgcolor: 'error.lighter', 
            color: 'error.main', 
            p: 1, 
            borderRadius: 1 
          }}
        >
          <DeleteForeverIcon />
        </Box>
        <Typography variant="h6" fontWeight={700}>
          Delete Template?
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 16,
            top: 16,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ pb: 1 }}>
        <DialogContentText sx={{ color: 'text.primary', mb: 2 }}>
          Are you sure you want to delete <strong>"{templateName}"</strong>?
        </DialogContentText>
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1.5, 
            p: 2, 
            bgcolor: 'warning.lighter', 
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'warning.light'
          }}
        >
          <WarningAmberIcon color="warning" />
          <Typography variant="caption" color="warning.dark" fontWeight={600}>
            This action is permanent and cannot be undone.
          </Typography>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button 
          onClick={onClose} 
          variant="outlined" 
          color="inherit" 
          fullWidth
          sx={{ borderRadius: 2 }}
        >
          Cancel
        </Button>
        <Button 
          onClick={onConfirm} 
          variant="contained" 
          color="error" 
          fullWidth
          sx={{ borderRadius: 2 }}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteConfirmationDialog

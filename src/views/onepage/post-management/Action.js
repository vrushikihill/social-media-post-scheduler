import { Divider, Menu, MenuItem } from '@mui/material'
import React from 'react'
import EditIcon from '@mui/icons-material/Edit'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import PublishIcon from '@mui/icons-material/Publish'
import RefreshIcon from '@mui/icons-material/Refresh'
import DeleteIcon from '@mui/icons-material/Delete'
import { useRouter } from 'next/router'

const Action = ({
  handleRetryPost,
  handleDeletePost,
  handlePublishNow,
  handleDuplicatePost,
  selectedPost,
  setMenuAnchor,
  menuAnchor
}) => {
  const router = useRouter()

  return (
    <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={() => setMenuAnchor(null)}>
      <MenuItem onClick={() => router.push(`/one-page-tabs?tab=create-post&edit=${selectedPost?.id}`)}>
        <EditIcon sx={{ mr: 1 }} />
        Edit Post
      </MenuItem>
      <MenuItem onClick={() => handleDuplicatePost(selectedPost)}>
        <ContentCopyIcon sx={{ mr: 1 }} />
        Duplicate
      </MenuItem>
      {selectedPost?.status === 'draft' && (
        <MenuItem onClick={() => handlePublishNow(selectedPost)}>
          <PublishIcon sx={{ mr: 1 }} />
          Publish Now
        </MenuItem>
      )}
      {selectedPost?.status === 'failed' && (
        <MenuItem onClick={() => handleRetryPost(selectedPost)}>
          <RefreshIcon sx={{ mr: 1 }} />
          Retry Post
        </MenuItem>
      )}
      <Divider />
      <MenuItem onClick={() => handleDeletePost(selectedPost)} sx={{ color: 'error.main' }}>
        <DeleteIcon sx={{ mr: 1 }} />
        Delete
      </MenuItem>
    </Menu>
  )
}

export default Action

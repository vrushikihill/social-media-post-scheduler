import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Paper, Typography } from '@mui/material'

const TemplateDialog = ({ templates, templateDialogOpen, setTemplateDialogOpen, handleTemplateSelect }) => {
  // Static templates as fallback
  const staticTemplates = [
    {
      id: 1,
      name: 'Festival Post',
      category: 'festival',
      description: 'Create engaging posts for festivals and holidays',
      template: '🎉 Celebrate [festival name] with us! [custom message] #festival #celebration'
    },
    {
      id: 2,
      name: 'Product Promotion',
      category: 'product_promotion',
      description: 'Promote your products effectively',
      template: '🚀 Introducing [product name]! [product description] Get [discount]% off today! #newproduct #sale'
    },
    {
      id: 3,
      name: 'Offer Announcement',
      category: 'offer',
      description: 'Announce special offers and deals',
      template: "🔥 Limited Time Offer! [offer details] Valid until [expiry date]. Don't miss out! #limitedoffer #sale"
    },
    {
      id: 4,
      name: 'Educational Post',
      category: 'educational',
      description: 'Share knowledge and educate your audience',
      template:
        '💡 Did you know? [fact or tip] [detailed explanation] What do you think? Share your thoughts below! #education #tips'
    },
    {
      id: 5,
      name: 'Quote Post',
      category: 'quote',
      description: 'Share inspirational quotes',
      template: '✨ "[quote text]" - [author] [personal reflection] #motivation #inspiration #quotes'
    },
    {
      id: 6,
      name: 'Before/After Showcase',
      category: 'before_after',
      description: 'Showcase transformations and results',
      template:
        '🌟 Amazing transformation! [transformation description] Results: [results achieved] #transformation #results'
    }
  ]

  // Use static templates if no templates provided or empty
  const templatesToShow = templates && templates.length > 0 ? templates : staticTemplates

  return (
    <Dialog open={templateDialogOpen} onClose={() => setTemplateDialogOpen(false)} maxWidth='md' fullWidth>
      <DialogTitle>
        <Typography variant='h6' sx={{ fontWeight: 600 }}>
          Choose a Template
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          Select a predefined template to get started quickly
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={4}>
          {templatesToShow?.map(template => (
            <Grid key={template.id} item xs={12} sm={6} md={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: '12px',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 2,
                    borderColor: 'primary.main'
                  }
                }}
                onClick={() => handleTemplateSelect(template)}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant='subtitle2' sx={{ fontWeight: 600 }}>
                    {template.name}
                  </Typography>
                </Box>

                <Typography variant='body2' color='text.secondary' sx={{ fontSize: '13px' }}>
                  {template.description}
                </Typography>

                <Typography
                  variant='body2'
                  color='text.secondary'
                  sx={{
                    mb: 1,
                    p: 2,
                    fontSize: '12px',
                    borderRadius: 1,
                    border: theme => `1px solid ${theme.palette.divider}`
                  }}
                >
                  {template.template.substring(0, 80)}...
                </Typography>

                <Button size='medium' variant='outlined' sx={{ mt: 'auto' }}>
                  Use This Template
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button variant='outlined' color='error' onClick={() => setTemplateDialogOpen(false)}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default TemplateDialog

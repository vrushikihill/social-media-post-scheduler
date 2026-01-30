import { Box, Tab, Tabs } from '@mui/material'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import Dashboard from './dashboard'
import CreatePost from './create-post'
import AITemplates from './ai-templates'
import PostManagement from './post-management'
import Settings from './settings'

function TabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <div role='tabpanel' hidden={value !== index} {...other}>
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  )
}

const OnePageTabs = () => {
  const router = useRouter()
  const [value, setValue] = useState(4)

  const tabMap = useMemo(
    () => ({
      dashboard: 0,
      'create-post': 1,
      'ai-templates': 2,
      'post-management': 3,
      settings: 4
    }),
    []
  )

  const handleChange = (event, newValue) => {
    setValue(newValue)

    // update URL without navigating away
    const tabKey = Object.keys(tabMap).find(key => tabMap[key] === newValue)
    if (tabKey) router.replace({ pathname: router.pathname, query: { tab: tabKey } }, undefined, { shallow: true })
  }

  useEffect(() => {
    const t = router.query.tab
    if (t && typeof t === 'string' && tabMap[t] !== undefined) {
      setValue(tabMap[t])
    }
  }, [router.query.tab, tabMap])

  return (
    <Box>
      <Tabs
        value={value}
        onChange={handleChange}
        variant='scrollable'
        scrollButtons='auto'
        allowScrollButtonsMobile
        sx={{
          mb: 4
        }}
      >
        <Tab label='Dashboard' />
        <Tab label='Create Post' />
        <Tab label='AI Templates' />
        <Tab label='Post Management' />
        <Tab label='Settings' />
      </Tabs>

      <TabPanel value={value} index={0}>
        <Dashboard />
      </TabPanel>

      <TabPanel value={value} index={1}>
        <CreatePost />
      </TabPanel>

      <TabPanel value={value} index={2}>
        <AITemplates />
      </TabPanel>

      <TabPanel value={value} index={3}>
        <PostManagement />
      </TabPanel>

      <TabPanel value={value} index={4}>
        <Settings />
      </TabPanel>
    </Box>
  )
}

export default OnePageTabs

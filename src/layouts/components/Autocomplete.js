// ** React Imports
import { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useAuth } from 'src/hooks/useAuth'

// ** Next Imports
import { useRouter } from 'next/router'

// ** MUI Imports
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Component Imports
import SearchResultDialog from './SearchResultDialog'

// ** Store Imports
import { fetchUsers } from 'src/store/settings/user/user'
import { fetchMediaAssets } from 'src/store/media-library/mediaLibrary'
import { fetchCategory } from 'src/store/category/category'
import { fetchSubCategory } from 'src/store/category/subCategory'
import { fetchWarehouse } from 'src/store/warehouse/warehouse'
import { fetchBranch } from 'src/store/branch/branch'
import { fetchTrustedPeople } from 'src/store/trusted-people/trustedPeople'

const AutocompleteComponent = ({ hidden, settings }) => {
  const [isMounted, setIsMounted] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const [options, setOptions] = useState([])

  const debounceTimeout = useRef(null)
  const { searchValue, setSearchValue } = useAuth()
  const router = useRouter()
  const dispatch = useDispatch()
  const { layout } = settings
  const wrapper = useRef(null)

  const { users: { data: users = [] } = {} } = useSelector(state => state.settings)

  const { mediaAssets: { data: mediaAssets = [] } = {} } = useSelector(state => state.mediaLibrary)

  const { categories: { data: categories = [] } = {} } = useSelector(state => state.category)

  const { subCategories: { data: subCategories = [] } = {} } = useSelector(state => state.subCategory)

  const { warehouses: { data: warehouses = [] } = {} } = useSelector(state => state.warehouse)

  const { branches: { data: branches = [] } = {} } = useSelector(state => state.branch)

  const { trustedPeoples: { data: trustedPeoples = [] } = {} } = useSelector(state => state.trustedPeople)

  useEffect(() => {
    setIsMounted(true)

    return () => setIsMounted(false)
  }, [])

  const handleSearchChange = value => {
    const keyword = value.toString().trim()
    setSearchValue(keyword)
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current)

    debounceTimeout.current = setTimeout(() => {
      if (!keyword) return setOptions([])
      dispatch(fetchUsers({ search: keyword }))
      dispatch(fetchMediaAssets({ search: keyword }))
      dispatch(fetchCategory({ search: keyword }))
      dispatch(fetchSubCategory({ search: keyword }))
      dispatch(fetchWarehouse({ search: keyword }))
      dispatch(fetchBranch({ search: keyword }))
      dispatch(fetchTrustedPeople({ search: keyword }))
    }, 300)
  }

  useEffect(() => {
    const keyword = searchValue?.toLowerCase()?.trim()
    if (!keyword) return setOptions([])

    const results = []

    // Users
    results.push(
      ...users
        .filter(i => {
          const userEmail = i?.email?.toLowerCase?.() || ''

          return userEmail.includes(keyword)
        })
        .slice(0, 5)
        .map(i => ({
          label: 'Users',
          title: `${i.email || ''} `,
          url: `/user/?us-search=${encodeURIComponent(searchValue)}&us-id=${i.id}`
        }))
    )

    // Media Library
    results.push(
      ...mediaAssets
        .filter(i => {
          const mediaName = i?.name?.toLowerCase?.() || ''

          return mediaName.includes(keyword)
        })
        .slice(0, 5)
        .map(i => ({
          label: 'Media Assets',
          title: `${i.name || ''} `,
          url: `/media-library/?md-search=${encodeURIComponent(searchValue)}`
        }))
    )

    // Category
    results.push(
      ...categories
        .filter(i => {
          const categoryName = i?.name?.toLowerCase?.() || ''

          return categoryName.includes(keyword)
        })
        .slice(0, 5)
        .map(i => ({
          label: 'Category',
          title: `${i.name || ''} `,
          url: `/category/?ca-search=${encodeURIComponent(searchValue)}`
        }))
    )

    // Sub Category
    results.push(
      ...subCategories
        .filter(i => {
          const subCategoryName = i?.name?.toLowerCase?.() || ''

          return subCategoryName.includes(keyword)
        })
        .slice(0, 5)
        .map(i => ({
          label: 'Sub Category',
          title: `${i.name || ''} `,
          url: `/subcategory/?sc-search=${encodeURIComponent(searchValue)}`
        }))
    )

    // Warehouse
    results.push(
      ...warehouses
        .filter(i => {
          const warehouseName = i?.warehouseName?.toLowerCase?.() || ''

          return warehouseName.includes(keyword)
        })
        .slice(0, 5)
        .map(i => ({
          label: 'Warehouse',
          title: `${i.warehouseName || ''}`,
          url: `/warehouse/?wa-search=${encodeURIComponent(searchValue)}`
        }))
    )

    // Branches
    results.push(
      ...branches
        .filter(i => {
          const branchName = i?.branchName?.toLowerCase?.() || ''

          return branchName.includes(keyword)
        })
        .slice(0, 5)
        .map(i => ({
          label: 'Branches',
          title: `${i.branchName || ''}`,
          url: `/branch/?br-search=${encodeURIComponent(searchValue)}`
        }))
    )

    // Trusted People
    results.push(
      ...trustedPeoples
        .filter(i => {
          const trustedPeopleName = i?.name?.toLowerCase?.() || ''

          return trustedPeopleName.includes(keyword)
        })
        .slice(0, 5)
        .map(i => ({
          label: 'Trusted People',
          title: `${i.name || ''}`,
          url: `/trusted-people/?tp-search=${encodeURIComponent(searchValue)}`
        }))
    )

    setOptions(results)
  }, [branches, categories, mediaAssets, searchValue, subCategories, trustedPeoples, users, warehouses])

  const handleDialogClose = () => setOpenDialog(false)

  const handleOptionClick = option => {
    if (option?.url) router.push(option.url)
    setOpenDialog(false)
  }

  const handleKeydown = useCallback(
    e => {
      if (!openDialog && e.ctrlKey && e.which === 191) setOpenDialog(true)
    },
    [openDialog]
  )

  const handleKeyUp = useCallback(
    e => {
      if (openDialog && e.keyCode === 27) setOpenDialog(false)
    },
    [openDialog]
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKeydown)
    document.addEventListener('keyup', handleKeyUp)

    return () => {
      document.removeEventListener('keydown', handleKeydown)
      document.removeEventListener('keyup', handleKeyUp)
    }
  }, [handleKeyUp, handleKeydown])

  if (!isMounted) return null

  return (
    <Box
      ref={wrapper}
      onClick={() => {
        if (!openDialog) {
          setOpenDialog(true)
          setTimeout(() => {
            wrapper.current?.querySelector('input')?.focus()
          }, 0)
        }
      }}
      sx={{ display: 'flex', cursor: 'pointer', alignItems: 'center' }}
    >
      <IconButton color='inherit' sx={!hidden && layout === 'vertical' ? { mr: 0.5, ml: -2.75 } : {}}>
        <Icon fontSize='1.5rem' icon='tabler:search' />
      </IconButton>

      {!hidden && layout === 'vertical' && (
        <Typography sx={{ userSelect: 'none', color: 'text.disabled' }}>
          {searchValue
            ? `Search for "${searchValue}"`
            : `Search ${
                router.pathname === '/user'
                  ? 'Users...'
                  : router.pathname === '/media-library'
                  ? 'Media Assets...'
                  : router.pathname === '/category'
                  ? 'Categories...'
                  : router.pathname === '/subcategory'
                  ? 'Sub Categories...'
                  : router.pathname === '/warehouse'
                  ? 'Warehouses...'
                  : router.pathname === '/branch'
                  ? 'Branches...'
                  : router.pathname === '/trusted-people'
                  ? 'Trusted People...'
                  : '(ctrl + /)...'
              }`}
        </Typography>
      )}
      {openDialog && (
        <SearchResultDialog
          open={openDialog}
          onClose={handleDialogClose}
          searchValue={searchValue}
          options={options}
          handleOptionClick={handleOptionClick}
          setOpenDialog={setOpenDialog}
          handleSearchChange={handleSearchChange}
        />
      )}
    </Box>
  )
}

export default AutocompleteComponent

import { useGlobalStore } from '@/store'
import { Box, useTheme } from '@mui/material'

export const IconoLogo = () => {
  const { openDrawer } = useGlobalStore()
  const theme = useTheme()
  return (
    <Box
      sx={{
        backgroundColor: 'white',
        padding: '5px',
        width: 'fit-content',
        borderRadius: 3,
        rotate: !openDrawer ? '45%' : '0%',
      }}
    >
      <Box
        sx={{
          backgroundColor: theme.palette.primary.main,
          height: '1.7rem',
          width: '1.7rem',
          borderRadius: 3,
        }}
      />
    </Box>
  )
}

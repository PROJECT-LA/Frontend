'use client'
import { Constantes } from '@/config'
import { Card, useMediaQuery, useTheme } from '@mui/material'
import React from 'react'

const MainCard = ({ children }: { children: React.ReactNode }) => {
  const theme = useTheme()
  const matchDownMd = useMediaQuery(theme.breakpoints.down('md'))
  return (
    <Card
      sx={{
        border: 1,
        borderRadius: Constantes.borderRadius,
        borderColor: theme.palette.divider,
        backgroundColor:
          theme.palette.mode === 'light'
            ? theme.palette.background.paper
            : 'transparent !important',
        padding: !matchDownMd ? '2rem' : '1rem',
      }}
    >
      {children}
    </Card>
  )
}

export default MainCard

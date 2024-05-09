'use client'
import { Constantes } from '@/config'
import { Card, useTheme } from '@mui/material'
import React from 'react'

const MainCard = ({ children }: { children: React.ReactNode }) => {
  const theme = useTheme()
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
        padding: '2rem',
      }}
    >
      {children}
    </Card>
  )
}

export default MainCard

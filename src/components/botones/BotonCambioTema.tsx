import { IconButton, IconButtonProps, Tooltip, useTheme } from '@mui/material'
import { Icono } from '../Icono'
import { useThemeContext } from '@/theme/RegistroTema'
import { Sun, Moon } from 'lucide-react'

export const BotonCambioTema = ({ ...rest }: IconButtonProps) => {
  const { themeMode, toggleTheme } = useThemeContext()
  const theme = useTheme()

  return (
    <Tooltip
      sx={{
        border: 1,
        borderRadius: '50%',
        borderColor: theme.palette.divider,
        backgroundColor:
          theme.palette.mode === 'light'
            ? theme.palette.background.paper
            : 'transparent',
      }}
      title={
        themeMode.includes('light')
          ? `Cambiar a modo oscuro`
          : `Cambiar a modo claro`
      }
    >
      <IconButton {...rest} onClick={toggleTheme}>
        {themeMode.includes('light') ? (
          <Icono>
            <Sun color={theme.palette.text.primary} />
          </Icono>
        ) : (
          <Icono>
            <Moon color={theme.palette.text.primary} />
          </Icono>
        )}
      </IconButton>
    </Tooltip>
  )
}

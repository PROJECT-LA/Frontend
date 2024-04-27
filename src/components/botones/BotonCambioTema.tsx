import { IconButton, IconButtonProps, Tooltip } from '@mui/material'
import { Icono } from '../Icono'
import { useThemeContext } from '@/theme/RegistroTema'
import { Sun, Moon } from 'lucide-react'

export const BotonCambioTema = ({ ...rest }: IconButtonProps) => {
  const { themeMode, toggleTheme } = useThemeContext()
  return (
    <Tooltip
      title={
        themeMode.includes('light')
          ? `Cambiar a modo oscuro`
          : `Cambiar a modo claro`
      }
    >
      <IconButton {...rest} onClick={toggleTheme}>
        {themeMode.includes('light') ? (
          <Icono color={'primary'}>
            <Sun />
          </Icono>
        ) : (
          <Icono color={'primary'}>
            <Moon />
          </Icono>
        )}
      </IconButton>
    </Tooltip>
  )
}

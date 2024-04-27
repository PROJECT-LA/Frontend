// material-ui
import { ButtonBase, Stack, Typography, useTheme } from '@mui/material'

import { FilePieChart } from 'lucide-react'

const LogoSection = () => {
  const theme = useTheme()

  return (
    <ButtonBase disableRipple>
      <Stack direction="row" gap={1} alignItems="center">
        {/* <img src={LogoSpike} alt="Logo spike" height={35} /> */}
        <FilePieChart size="2rem" color={theme.palette.primary.dark} />
        <Stack>
          <Typography variant="h5" color={theme.palette.text.primary}>
            Boletín
          </Typography>

          <Typography variant="h3" color={theme.palette.primary.main}>
            IOP
          </Typography>
        </Stack>
      </Stack>
    </ButtonBase>
  )
}

export default LogoSection

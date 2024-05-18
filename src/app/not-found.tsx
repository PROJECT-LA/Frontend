import { Typography, Link, Container, Grid, Button } from '@mui/material'

const NotFoundPage = () => {
  return (
    <Container
      sx={{
        height: '100vh',
        px: 4,
        py: { xs: 16, sm: 24 },
        display: 'grid',
        placeItems: 'center',
        '@media (min-width: 768px)': {
          px: 8,
        },
      }}
    >
      <Container sx={{ mx: 'auto' }}>
        <Grid container alignItems="center">
          <Typography
            variant="h1"
            component="p"
            sx={{
              fontSize: { xs: '4xl', sm: '5xl' },
              fontWeight: 'bold',
              letterSpacing: 'tight',
              backgroundClip: 'text',
            }}
          >
            404
          </Typography>
          <Grid item xs={12} sm={6} ml={{ sm: 6 }}>
            <Container
              sx={{
                borderLeft: { sm: '1px solid #e5e7eb' },
                paddingLeft: { sm: 6 },
              }}
            >
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '4xl', sm: '5xl' },
                  fontWeight: 'bold',
                  letterSpacing: 'tight',
                  color: 'text.primary',
                }}
              >
                Página no encontrada
              </Typography>
              <Typography variant="body1" mt={2} color="text.secondary">
                Porfavor verifica la URL en la barra de navegación e intenta
                otra vez.
              </Typography>
            </Container>
            <Container
              sx={{
                mt: 10,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Button>Volver</Button>
            </Container>
          </Grid>
        </Grid>
      </Container>
    </Container>
  )
}

export default NotFoundPage

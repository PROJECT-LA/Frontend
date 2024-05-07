import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { RolCRUDType } from '@/types/roles'
import { useSession } from '@/hooks/useSession'
import { toast } from 'sonner'
import { delay, InterpreteMensajes } from '@/utils/utilidades'
import { Constantes } from '@/config'

import { imprimir } from '@/utils/imprimir'
import { Button, DialogActions, DialogContent, Grid } from '@mui/material'
import { FormInputText } from '@/components/forms'

import Box from '@mui/material/Box'
import { ProgresoLineal } from '@/components/progreso/ProgresoLineal'

export interface ModalRolType {
  rol?: RolCRUDType
  accionCorrecta: () => void
  accionCancelar: () => void
}

export const VistaModalRol = ({
  rol,
  accionCorrecta,
  accionCancelar,
}: ModalRolType) => {
  const [loadingModal, setLoadingModal] = useState<boolean>(false)

  // Proveedor de la sesión
  const { sesionPeticion } = useSession()

  const { handleSubmit, control } = useForm<RolCRUDType>({
    defaultValues: {
      id: rol?.id,
      name: rol?.name,
      description: rol?.description,
    },
  })

  const guardarActualizarRol = async (data: RolCRUDType) => {
    await guardarActualizarRolesPeticion(data)
  }

  const guardarActualizarRolesPeticion = async (Rol: RolCRUDType) => {
    try {
      setLoadingModal(true)
      await delay(1000)
      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/roles${
          Rol.id ? `/${Rol.id}` : ''
        }`,
        tipo: !!Rol.id ? 'patch' : 'post',
        body: Rol,
      })
      toast.success(InterpreteMensajes(respuesta))
      accionCorrecta()
    } catch (e) {
      imprimir(`Error al crear o actualizar rol`, e)
      toast.error(InterpreteMensajes(e))
    } finally {
      setLoadingModal(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(guardarActualizarRol)}>
      <DialogContent dividers>
        <Grid container direction={'column'} justifyContent="space-evenly">
          <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
            <Grid item xs={12} sm={12} md={6}>
              <FormInputText
                id={'rol'}
                control={control}
                name="name"
                label="Rol"
                disabled={loadingModal}
                rules={{ required: 'Este campo es requerido' }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <FormInputText
                id={'nombre'}
                control={control}
                name="description"
                label="Nombre"
                disabled={loadingModal}
                rules={{ required: 'Este campo es requerido' }}
              />
            </Grid>
          </Grid>
          <Box height={'20px'} />
          <ProgresoLineal mostrar={loadingModal} />
        </Grid>
      </DialogContent>
      <DialogActions
        sx={{
          my: 1,
          mx: 2,
          justifyContent: {
            lg: 'flex-end',
            md: 'flex-end',
            xs: 'center',
            sm: 'center',
          },
        }}
      >
        <Button
          variant={'outlined'}
          disabled={loadingModal}
          onClick={accionCancelar}
        >
          Cancelar
        </Button>
        <Button variant={'contained'} disabled={loadingModal} type={'submit'}>
          Guardar
        </Button>
      </DialogActions>
    </form>
  )
}

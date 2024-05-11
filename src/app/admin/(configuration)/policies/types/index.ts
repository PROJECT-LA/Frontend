/// CRUD de políticas
import { optionType } from '@/components/forms/FormInputDropdown'

export interface PoliticaCRUDType {
  subject: string
  object: string
  action: string
  app: string
}

export interface CrearEditarPoliticaCRUDType {
  subject: string
  object: string
  action: optionType[]
  app: string
}

export interface guardarPoliticaCRUDType {
  subject: string
  object: string
  action: string
  app: string
}

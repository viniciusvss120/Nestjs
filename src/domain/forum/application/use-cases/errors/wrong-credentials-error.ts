/* eslint-disable prettier/prettier */
import { UseCaseError } from '@/core/errors/use-case-error'

export class WrongCredentialsError extends Error implements UseCaseError {
  constructor(){
    super(`Credential are not valid.`)
  }
}

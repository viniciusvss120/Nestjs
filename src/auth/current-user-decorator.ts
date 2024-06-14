/* eslint-disable prettier/prettier */
import { ExecutionContext, createParamDecorator } from '@nestjs/common'
import { UserSchema } from './jwt.strategy'
// Aqui estamos contruindo um decorator para extrair partes de uma requisção. Como vamos usar esse decorator em uma variavel, então usaremos o métordo createParamDecorator para criar o decorator, nele passamos como primeiro parâmetro um argumento que pode ser utilizado com filtro e o outro vai ser o contexto.
export const CurrentUser = createParamDecorator(
  (_: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest()

    return request.user as UserSchema
  }
)
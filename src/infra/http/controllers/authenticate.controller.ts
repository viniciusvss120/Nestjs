/* eslint-disable prettier/prettier */
import { BadRequestException, Body, Controller, Post, UnauthorizedException, UsePipes } from '@nestjs/common';

import { z } from 'zod';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipes';
import { AuthenticateStudentUseCase } from '@/domain/forum/application/use-cases/authenticate-student';
import { WrongCredentialsError } from '@/domain/forum/application/use-cases/errors/wrong-credentials-error';
import { Public } from '@/infra/auth/public';

// Aqui estamos determinando os tipos das requisições vindas do body
const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string()
})

// Aqui estamos inferindo os tipos
type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>

@Controller('/sessions')
@Public()
export class AuthenticateController {
  constructor(
    private authenticateStudent: AuthenticateStudentUseCase
  ) { }


  @Post()
  // @HttpCode(201)
  // Usamos esse decorator para globalizar as validações do zod e fazer uma tratativa melhor dos erros
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handle(@Body() body: AuthenticateBodySchema) {
    const { email, password } = body
    
    const result = await this.authenticateStudent.execute({
      email,
      password
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case WrongCredentialsError:
          throw new UnauthorizedException(error.message)
        default: 
        throw new BadRequestException(error.message)
      }
    }

    const {acessToken} = result.value
    return {
      access_token: acessToken
    }
  }
}

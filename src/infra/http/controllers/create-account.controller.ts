/* eslint-disable prettier/prettier */
import { BadRequestException, Body, ConflictException, Controller, HttpCode, Post, UsePipes } from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipes';
import { RegisterStudentUseCase } from '@/domain/forum/application/use-cases/register-student';
import { StudentAlreadyExistsError } from '@/domain/forum/application/use-cases/errors/student-already-exists-error';
import { Public } from '@/infra/auth/public';

// Aqui estamos determinando os tipos das requisições vindas do body
const createAccountBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string()
})

// Aqui estamos inferindo os tipos
type createAccountBodySchema = z.infer<typeof createAccountBodySchema>

@Controller('/account')
@Public()
export class CreateAccount {
  constructor(private registerStudent: RegisterStudentUseCase) { }


  @Post()
  @HttpCode(201)
  // Usamos esse decorator para globalizar as validações do zod e fazer uma tratativa melhor dos erros
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handle(@Body() body: createAccountBodySchema) {
    const { name, email, password } = body

    const result = await this.registerStudent.execute({
      name,
      email,
      password,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case StudentAlreadyExistsError:
          throw new ConflictException(error.message)
        default: 
        throw new BadRequestException(error.message)
      }
    }

  }
}

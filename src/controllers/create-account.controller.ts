/* eslint-disable prettier/prettier */
import { Body, ConflictException, Controller, HttpCode, Post, UsePipes } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {hash} from 'bcrypt'
import { z } from 'zod';
import { ZodValidationPipe } from 'src/pipes/zod-validation-pipes';

// Aqui estamos determinando os tipos das requisições vindas do body
const createAccountBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string()
})

// Aqui estamos inferindo os tipos
type createAccountBodySchema = z.infer<typeof createAccountBodySchema>

@Controller('/account')
export class CreateAccount {
  constructor(private prisma: PrismaService) {}


  @Post()
  @HttpCode(201)
   // Usamos esse decorator para globalizar as validações do zod e fazer uma tratativa melhor dos erros
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handle(@Body() body: createAccountBodySchema) {
    const {name, email, password} = body
  

    const userWhitSomeEmail = await this.prisma.user.findUnique({
      where: {
        email
      }
    })

    if (userWhitSomeEmail) {
      throw new ConflictException('Existe um usuário com esse email !')
    }

    const hashPassword = await hash(password, 8)
    await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashPassword
      }
    })
  }
}

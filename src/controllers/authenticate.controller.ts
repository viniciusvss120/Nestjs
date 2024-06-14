/* eslint-disable prettier/prettier */
import { Body, Controller, Post, UnauthorizedException, UsePipes } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
// import { PrismaService } from '@/prisma/prisma.service';
// import {hash} from 'bcrypt'
import { z } from 'zod';
import { ZodValidationPipe } from '@/pipes/zod-validation-pipes';
import { PrismaService } from '@/prisma/prisma.service';
import { compare } from 'bcrypt';

// Aqui estamos determinando os tipos das requisições vindas do body
const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string()
})

// Aqui estamos inferindo os tipos
type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>

@Controller('/sessions')
export class AuthenticateController {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService
  ) { }


  @Post()
  // @HttpCode(201)
  // Usamos esse decorator para globalizar as validações do zod e fazer uma tratativa melhor dos erros
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handle(@Body() body: AuthenticateBodySchema) {
    const { email, password } = body
    const user = await this.prisma.user.findUnique({
      where: {
        email
      }
    })

    if (!user) {
      console.log('Não foi possível encontrar o usuário')
      throw new UnauthorizedException('User credentials do not watch.')
    }

    const isPasswordValid = await compare(password, user.password)

    if (!isPasswordValid) {
      console.log('Senha incorreta!')
      throw new UnauthorizedException('User credentials do not watch.')
    }

    const accessToken = this.jwt.sign({ sub: user.id })

    return {
      access_token: accessToken
    }
  }
}

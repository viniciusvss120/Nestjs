/* eslint-disable prettier/prettier */
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/auth/jwt-auth';
import { ZodValidationPipe } from '@/pipes/zod-validation-pipes';
import { PrismaService } from '@/prisma/prisma.service';
import { z } from 'zod';

// Aqui estamos tipando a QueryParams, ela vem como uma string, é opcional, por padrão começa com 1, transforma em numero e definimos que o valor minimo é 1
const pageQueryParams = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

// Aqui criamos um tipo onde é inferido o tipo do pageQueryParams
type Page = z.infer<typeof pageQueryParams>

const validationPage = new ZodValidationPipe(pageQueryParams)

@Controller('/question')
@UseGuards(JwtAuthGuard)
export class FetchRecentQuestion {
  constructor(
    private prisma: PrismaService
  ) { }

  @Get()
  async handle(@Query('page', validationPage) page: Page) {
    // Aqui estamos fazendo a busca, onde definimos a quantidade de registro que tem q aparecer, a paginação e a ordem
    const questions = await this.prisma.question.findMany({
      take: 1,
      skip: (page - 1) * 1,
      orderBy: {
        createdAt: 'desc'
      }
    })

    return {
      questions
    }
  }

}

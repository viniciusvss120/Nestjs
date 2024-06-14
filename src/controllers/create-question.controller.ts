/* eslint-disable prettier/prettier */
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '@/auth/current-user-decorator';
import { JwtAuthGuard } from '@/auth/jwt-auth';
import { UserSchema } from '@/auth/jwt.strategy';
import { ZodValidationPipe } from '@/pipes/zod-validation-pipes';
import { PrismaService } from '@/prisma/prisma.service';
import { z } from 'zod';

// Aqui estamos determinando os tipos das requisições vindas do body
const createQuestionSchema = z.object({
  title: z.string(),
  content: z.string()
})

// Aqui estamos inferindo os tipos
type CreateQuestionSchema = z.infer<typeof createQuestionSchema>

const bodyValidation = new ZodValidationPipe(createQuestionSchema)

@Controller('/question')
@UseGuards(JwtAuthGuard)
export class CreateQuestion {
  constructor(
    private prisma: PrismaService
  ) { }

  @Post()
  async handle(
    @Body(bodyValidation) body: CreateQuestionSchema,
    @CurrentUser() user: UserSchema
  ) {
    const { title, content } = body
    const slugConvert = this.convertSlug(title)
    await this.prisma.question.create({
      data: {
        authorId: user.sub,
        title,
        content,
        slug: slugConvert
      }
    })
  }

  private convertSlug(title: string): string {
    return title
      .toLocaleLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
  }
}

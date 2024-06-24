/* eslint-disable prettier/prettier */
import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserSchema } from '@/infra/auth/jwt.strategy';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipes';
// import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { z } from 'zod';
import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question';

// Aqui estamos determinando os tipos das requisições vindas do body
const createQuestionSchema = z.object({
  title: z.string(),
  content: z.string()
})

// Aqui estamos inferindo os tipos
type CreateQuestionSchema = z.infer<typeof createQuestionSchema>

const bodyValidation = new ZodValidationPipe(createQuestionSchema)

@Controller('/question')
export class CreateQuestion {
  constructor(
    private createQuestion: CreateQuestionUseCase
  ) { }

  @Post()
  async handle(
    @Body(bodyValidation) body: CreateQuestionSchema,
    @CurrentUser() user: UserSchema
  ) {
    const { title, content } = body
    const userId = user.sub
    const result = await this.createQuestion.execute({
      title,
      content,
      authorId: userId,
      attachmentsIds: []
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }

  // private convertSlug(title: string): string {
  //   return title
  //     .toLocaleLowerCase()
  //     .normalize('NFD')
  //     .replace(/[\u0300-\u036f]/g, '')
  //     .replace(/[^\w\s-]/g, '')
  //     .replace(/\s+/g, '-')
  // }
}

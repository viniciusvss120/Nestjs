/* eslint-disable prettier/prettier */
import { BadRequestException, Body, Controller, Param, Post } from '@nestjs/common';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserSchema } from '@/infra/auth/jwt.strategy';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipes';
// import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { z } from 'zod';
import { CommentOnQuestionUseCase } from '@/domain/forum/application/use-cases/comment-on-question';

// Aqui estamos determinando os tipos das requisições vindas do body
const commentsQuestionSchema = z.object({
  content: z.string()
})

// Aqui estamos inferindo os tipos
type CommentsQuestionSchema = z.infer<typeof commentsQuestionSchema>

const bodyValidation = new ZodValidationPipe(commentsQuestionSchema)

@Controller('/question/:questionId/comments')
export class CommentsQuestionController {
  constructor(
    private commentsQuestion: CommentOnQuestionUseCase
  ) {}

  @Post()
  async handle(
    @Body(bodyValidation) body: CommentsQuestionSchema,
    @CurrentUser() user: UserSchema,
    @Param('questionId') questionId: string
  ) {
    const { content } = body
    const userId = user.sub
    const result = await this.commentsQuestion.execute({
      authorId: userId,
      questionId,
      content,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}

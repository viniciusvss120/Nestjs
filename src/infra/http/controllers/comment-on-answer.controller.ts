/* eslint-disable prettier/prettier */
import { BadRequestException, Body, Controller, Param, Post } from '@nestjs/common';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserSchema } from '@/infra/auth/jwt.strategy';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipes';
// import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { z } from 'zod';
import { CommentOnAnswerUseCase } from '@/domain/forum/application/use-cases/comment-on-answer';

// Aqui estamos determinando os tipos das requisições vindas do body
const commentsAnswerSchema = z.object({
  content: z.string()
})

// Aqui estamos inferindo os tipos
type CommentsAnswerSchema = z.infer<typeof commentsAnswerSchema>

const bodyValidation = new ZodValidationPipe(commentsAnswerSchema)

@Controller('/answer/:answerId/comments')
export class CommentsAnswerController {
  constructor(
    private commentsAnswer: CommentOnAnswerUseCase
  ) {}

  @Post()
  async handle(
    @Body(bodyValidation) body: CommentsAnswerSchema,
    @CurrentUser() user: UserSchema,
    @Param('answerId') answerId: string
  ) {
    const { content } = body
    const userId = user.sub
    const result = await this.commentsAnswer.execute({
      authorId: userId,
      answerId,
      content,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}

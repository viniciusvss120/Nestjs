/* eslint-disable prettier/prettier */
import { BadRequestException, Body, Controller, Param, Post } from '@nestjs/common';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserSchema } from '@/infra/auth/jwt.strategy';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipes';
// import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { z } from 'zod';
import { AnswerQuestionUseCase } from '@/domain/forum/application/use-cases/answer-question';

// Aqui estamos determinando os tipos das requisições vindas do body
const answerQuestionSchema = z.object({
  content: z.string(),
  attachments: z.array(z.string().uuid())
})

const bodyValidation = new ZodValidationPipe(answerQuestionSchema)

// Aqui estamos inferindo os tipos
type AnswerQuestionSchema = z.infer<typeof answerQuestionSchema>


@Controller('/questions/:questionId/answers')
export class AnswerQuestionController {
  constructor(
    private answerQuestion: AnswerQuestionUseCase
  ) {}

  @Post()
  async handle(
    @Body(bodyValidation) body: AnswerQuestionSchema,
    @CurrentUser() user: UserSchema,
    @Param('questionId') questionId: string
  ) {
    const { content, attachments } = body
    const userId = user.sub
    console.log('result')
    try { 
      const result = await this.answerQuestion.execute({
        questionId,
        content,
        authorId: userId,
        attachmentsIds: attachments
      })

      if (result.isLeft()) {
        throw new BadRequestException()
      }
    } catch (error) {
      console.log(error)
    }
 
  }
}

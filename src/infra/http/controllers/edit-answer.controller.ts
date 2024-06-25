/* eslint-disable prettier/prettier */
import { BadRequestException, Body, Controller, HttpCode, Param, Put } from '@nestjs/common';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserSchema } from '@/infra/auth/jwt.strategy';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipes';
import { z } from 'zod';
import { EditAnswerUseCase } from '@/domain/forum/application/use-cases/edit-answer';

const editAnswerSchema = z.object({
  content: z.string()
})

// Aqui estamos inferindo os tipos
type EditAnswerSchema = z.infer<typeof editAnswerSchema>

const bodyValidation = new ZodValidationPipe(editAnswerSchema)

@Controller('/answer/:id')
export class EditAnswer {
  constructor(
    private editAnswer: EditAnswerUseCase
  ) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(bodyValidation) body: EditAnswerSchema,
    @CurrentUser() user: UserSchema,
    @Param('id') answerId: string
  ) {
    const { content } = body
    const userId = user.sub
    const result = await this.editAnswer.execute({
      authorId: userId,
      answerId,
      content,
      attachmentsIds: [],
    })
    console.log(answerId)
    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }

}

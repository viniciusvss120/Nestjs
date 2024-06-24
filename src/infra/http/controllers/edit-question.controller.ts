/* eslint-disable prettier/prettier */
import { BadRequestException, Body, Controller, HttpCode, Param, Put } from '@nestjs/common';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserSchema } from '@/infra/auth/jwt.strategy';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipes';
import { z } from 'zod';
import { EditQuestionUseCase } from '@/domain/forum/application/use-cases/edit-question';

const editQuestionSchema = z.object({
  title: z.string(),
  content: z.string()
})

// Aqui estamos inferindo os tipos
type EditQuestionSchema = z.infer<typeof editQuestionSchema>

const bodyValidation = new ZodValidationPipe(editQuestionSchema)

@Controller('/question/:id')
export class EditQuestion {
  constructor(
    private editQuestion: EditQuestionUseCase
  ) { }

  @Put()
  @HttpCode(204)
  async handle(
    @Body(bodyValidation) body: EditQuestionSchema,
    @CurrentUser() user: UserSchema,
    @Param('id') questionId: string
  ) {
    const { title, content } = body
    const userId = user.sub
    const result = await this.editQuestion.execute({
      title,
      content,
      authorId: userId,
      attachmentsIds: [],
      questionId
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }

}

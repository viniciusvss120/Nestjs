/* eslint-disable prettier/prettier */
import { BadRequestException, Controller, Delete, HttpCode, Param } from '@nestjs/common';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserSchema } from '@/infra/auth/jwt.strategy';
import { DeleteAnswerCommentUseCase } from '@/domain/forum/application/use-cases/delete-answer-comment';


// Aqui estamos inferindo os tipos

@Controller('/answer/comments/:id')
export class DeleteAnswerCommentsController {
  constructor(
    private deleteAnswerComments: DeleteAnswerCommentUseCase
  ) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserSchema,
    @Param('id') answerCommentId: string
  ) {
    const userId = user.sub
    const result = await this.deleteAnswerComments.execute({
      authorId: userId,
      answerCommentId
    })
    
    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }

}

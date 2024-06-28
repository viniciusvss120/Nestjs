/* eslint-disable prettier/prettier */
import { BadRequestException, Controller, Delete, HttpCode, Param } from '@nestjs/common';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserSchema } from '@/infra/auth/jwt.strategy';
import { DeleteQuestionCommentUseCase } from '@/domain/forum/application/use-cases/delete-question-comment';


// Aqui estamos inferindo os tipos

@Controller('/question/comments/:id')
export class DeleteQuestionCommentsController {
  constructor(
    private deleteQuestionComments: DeleteQuestionCommentUseCase
  ) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserSchema,
    @Param('id') questionCommentId: string
  ) {
    const userId = user.sub
    const result = await this.deleteQuestionComments.execute({
      authorId: userId,
      questionCommentId
    })
    
    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }

}

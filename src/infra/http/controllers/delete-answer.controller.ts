/* eslint-disable prettier/prettier */
import { BadRequestException, Controller, Delete, HttpCode, Param } from '@nestjs/common';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserSchema } from '@/infra/auth/jwt.strategy';
import { DeleteAnswerUseCase } from '@/domain/forum/application/use-cases/delete-answer';


// Aqui estamos inferindo os tipos

@Controller('/answer/:id')
export class DeleteAnswerController {
  constructor(
    private deleteAnswer: DeleteAnswerUseCase
  ) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserSchema,
    @Param('id') answerId: string
  ) {
    const userId = user.sub

    try {
      const result = await this.deleteAnswer.execute({
        answerId,
        authorId: userId,
      })
      
      if (result.isLeft()) {
        throw new BadRequestException()
      }
    } catch (error) {
      console.log(error)
      
    }
   
  }

}

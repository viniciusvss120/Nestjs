/* eslint-disable prettier/prettier */
import { BadRequestException, Controller, HttpCode, Param, Patch, } from '@nestjs/common';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserSchema } from '@/infra/auth/jwt.strategy';
import { ChooseQuestionBestAnswerUseCase } from '@/domain/forum/application/use-cases/choose-question-best-answer';


@Controller('/answer/:answerId/choose-as-best')
export class ChooseQuestionBestAnswerController {
  constructor(
    private chooseQuestionAnswer: ChooseQuestionBestAnswerUseCase
  ) {}

  @Patch()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserSchema,
    @Param('answerId') answerId: string
  ) {
    const userId = user.sub
    const result = await this.chooseQuestionAnswer.execute({
      authorId: userId,
      answerId,
    })
  
    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }

}

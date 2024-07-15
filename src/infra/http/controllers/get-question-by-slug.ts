/* eslint-disable prettier/prettier */
import { BadRequestException, Controller, Get, Param } from '@nestjs/common';
import { GetQuestionBySlugUseCase } from '@/domain/forum/application/use-cases/get-question-by-slug';
import { QuestionDetailsPresenter } from '../presenters/question-details-presenter';

@Controller('/question/:slug')
export class GetQuestionBySlugController {
  constructor(
    private getQuestionBySlug: GetQuestionBySlugUseCase
  ) {}

  @Get()
  async handle(@Param('slug') slug: string) {
    // Aqui estamos fazendo a busca, onde definimos a quantidade de registro que tem q aparecer, a paginação e a ordem
    const result = await this.getQuestionBySlug.execute({
      slug
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    return {
      questions: QuestionDetailsPresenter.toHttp(result.value.question)
    }
  }

}

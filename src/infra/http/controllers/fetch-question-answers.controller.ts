/* eslint-disable prettier/prettier */
import { BadRequestException, Controller, Get, Param, Query } from '@nestjs/common';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipes';
// import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { z } from 'zod';
import { FetchQuestionAnswersUseCase } from '@/domain/forum/application/use-cases/fetch-question-answers';
import { AnswerPresenter } from '../presenters/answer-presenter';

// Aqui estamos tipando a QueryParams, ela vem como uma string, é opcional, por padrão começa com 1, transforma em numero e definimos que o valor minimo é 1
const pageQueryParams = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

// Aqui criamos um tipo onde é inferido o tipo do pageQueryParams
type Page = z.infer<typeof pageQueryParams>

const validationPage = new ZodValidationPipe(pageQueryParams)

@Controller('/question/:questionId/answer')
export class FetchQuestionAnswersController {
  constructor(
    private fetchQuestionAnswer: FetchQuestionAnswersUseCase
  ) {}

  @Get()
  async handle(
    @Query('page', validationPage) page: Page,
    @Param('questionId') questionId: string
  ) {
    // Aqui estamos fazendo a busca, onde definimos a quantidade de registro que tem q aparecer, a paginação e a ordem
    const result = await this.fetchQuestionAnswer.execute({
      page,
      questionId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const answers = result.value.answers
    return {
      answers: answers.map(AnswerPresenter.toHttp)
    }
  }

}

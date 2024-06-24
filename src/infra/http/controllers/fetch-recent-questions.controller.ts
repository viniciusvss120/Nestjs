/* eslint-disable prettier/prettier */
import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipes';
// import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { z } from 'zod';
import { FetchRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/fetch-recent-questions';
import { QuestionPresenter } from '../presenters/question-presenter';

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

@Controller('/question')
export class FetchRecentQuestion {
  constructor(
    private fetchRecentQuestion: FetchRecentQuestionsUseCase
  ) {}

  @Get()
  async handle(@Query('page', validationPage) page: Page) {
    // Aqui estamos fazendo a busca, onde definimos a quantidade de registro que tem q aparecer, a paginação e a ordem
    const result = await this.fetchRecentQuestion.execute({
      page
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const questions = result.value.questions
    return {
      questions: questions.map(QuestionPresenter.toHttp)
    }
  }

}

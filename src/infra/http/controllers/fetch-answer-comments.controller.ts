/* eslint-disable prettier/prettier */
import { BadRequestException, Controller, Get, Param, Query } from '@nestjs/common';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipes';
// import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { z } from 'zod';
import { FetchAnswerCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-answer-comments';
import { CommentPresenter } from '../presenters/comments-presenter';

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

@Controller('/answer/:answerId/comments')
export class FetchAnswerCommentsController {
  constructor(
    private fetchAnswerComments: FetchAnswerCommentsUseCase
  ) {}

  @Get()
  async handle(
    @Query('page', validationPage) page: Page,
    @Param('answerId') answerId: string
  ) {
    // Aqui estamos fazendo a busca, onde definimos a quantidade de registro que tem q aparecer, a paginação e a ordem
    const result = await this.fetchAnswerComments.execute({
      page,
      answerId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const answersComments = result.value.answerComments
    return {
      comments: answersComments.map(CommentPresenter.toHttp)
    }
  }

}

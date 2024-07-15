/* eslint-disable prettier/prettier */
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
// import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AnswerFactory } from 'test/factories/make-answer'
import { AnswerCommentFactory } from 'test/factories/make-answer-comment'
import { QuestionFactory } from 'test/factories/make-question'
import { StudentFactory } from 'test/factories/make-student'


describe('Fetch answer comments (E2E)', () => {
  let app: INestApplication
  // let prisma: PrismaService
  let studentFactory: StudentFactory
  let answerFactory: AnswerFactory
  let answerCommentFactory: AnswerCommentFactory
  let questionFectory: QuestionFactory
  let jwt: JwtService
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, AnswerFactory, AnswerCommentFactory]
    })
      .compile()

    app = moduleRef.createNestApplication()

    // prisma = moduleRef.get(PrismaService)
    studentFactory = moduleRef.get(StudentFactory)
    answerFactory = moduleRef.get(AnswerFactory)
    answerCommentFactory = moduleRef.get(AnswerCommentFactory)
    questionFectory = moduleRef.get(QuestionFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('(GET) /answe/answerId/comments', async () => {
    const user = await studentFactory.makePrismaStudent({
      name: 'Vinicius Silva'
    })

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const question = await questionFectory.makePrismaQuestion({
      authorId: user.id
    })
    
    const answer = await answerFactory.makePrismaAnswer({authorId: user.id, questionId: question.id})

    await Promise.all([
      answerCommentFactory.makePrismaAnswerComments({authorId: user.id, answerId: answer.id, content: 'Conteúdo da answer 1'}),
      answerCommentFactory.makePrismaAnswerComments({authorId: user.id, answerId: answer.id, content: 'Conteúdo da answer 2'})
    ])

    const answerId = answer.id.toString()
    try {
      const response = await request(app.getHttpServer())
      .get(`/answer/${answerId}/comments`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()
    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      comments: expect.arrayContaining([
        expect.objectContaining({ content: 'Conteúdo da pergunta 1', authorName: 'Vinicius Silva'}),
        expect.objectContaining({ content: 'Conteúdo da pergunta 21', authorName: 'Vinicius Silva'})
      ])
    })
    } catch (error) {
      console.log(error)
    }

  })
})
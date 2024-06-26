/* eslint-disable prettier/prettier */
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
// import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AnswerFactory } from 'test/factories/make-answer'
import { QuestionFactory } from 'test/factories/make-question'
import { StudentFactory } from 'test/factories/make-student'


describe('Fetch question answer(E2E)', () => {
  let app: INestApplication
  // let prisma: PrismaService
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let answerFactory: AnswerFactory
  let jwt: JwtService
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, AnswerFactory]
    })
      .compile()

    app = moduleRef.createNestApplication()

    // prisma = moduleRef.get(PrismaService)
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    answerFactory = moduleRef.get(AnswerFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('(GET) /question/:questionId/answer', async () => {
    const user = await studentFactory.makePrismaStudent()

    const accessToken = jwt.sign({ sub: user.id.toString() })

    
    const question = await questionFactory.makePrismaQuestion({authorId: user.id})

    await Promise.all([
      answerFactory.makePrismaAnswer({authorId: user.id, questionId:  question.id, content: 'answer 1'}),
      answerFactory.makePrismaAnswer({authorId: user.id, questionId:  question.id, content: 'answer 2'})
    ])

    const questionId = question.id.toString()

    const response = await request(app.getHttpServer())
      .get(`/question/${questionId}/answer`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      answers: expect.arrayContaining([
        expect.objectContaining({ content: 'answer 1' }),
        expect.objectContaining({ content: 'answer 2' })
      ])
    })
  })
})
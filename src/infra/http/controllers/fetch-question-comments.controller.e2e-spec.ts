/* eslint-disable prettier/prettier */
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
// import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { QuestionFactory } from 'test/factories/make-question'
import { QuestionCommentFactory } from 'test/factories/make-question-comment'
import { StudentFactory } from 'test/factories/make-student'


describe('Fetch question comments (E2E)', () => {
  let app: INestApplication
  // let prisma: PrismaService
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let questionCommentFactory: QuestionCommentFactory
  let jwt: JwtService
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, QuestionCommentFactory]
    })
      .compile()

    app = moduleRef.createNestApplication()

    // prisma = moduleRef.get(PrismaService)
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    questionCommentFactory = moduleRef.get(QuestionCommentFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('(GET) /question', async () => {
    const user = await studentFactory.makePrismaStudent({
      name: 'Vinicius Silva'
    })

    const accessToken = jwt.sign({ sub: user.id.toString() })
    
    const question = await questionFactory.makePrismaQuestion({authorId: user.id})

    await Promise.all([
      questionCommentFactory.makePrismaQuestionComments({authorId: user.id, questionId: question.id, content: 'Conteúdo da pergunta 1'}),
      questionCommentFactory.makePrismaQuestionComments({authorId: user.id, questionId: question.id, content: 'Conteúdo da pergunta 2'})
    ])

    const questionId = question.id.toString()
    try {
      const response = await request(app.getHttpServer())
      .get(`/question/${questionId}/comments`)
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
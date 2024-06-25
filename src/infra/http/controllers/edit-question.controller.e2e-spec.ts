/* eslint-disable prettier/prettier */
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { hash } from 'bcrypt'
import request from 'supertest'
import { QuestionFactory } from 'test/factories/make-question'
import { StudentFactory } from 'test/factories/make-student'


describe('Edit question (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let jwt: JwtService
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory]
    })
      .compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('(PUT) /question/:id', async () => {
    const user = await studentFactory.makePrismaStudent({
      email: 'vinicius@gmail.com',
      password: await hash('123456', 8)
    })

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id
    })

    const questionId = question.id.toString()
    const response = await request(app.getHttpServer())
      .put(`/question/${questionId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Novo título da pergunta',
        content: 'Conteúdo da pergunta',
      })
      
    expect(response.statusCode).toBe(204)


    const questionOnDatabase = await prisma.question.findFirst({
      where: {
        title: 'Novo título da pergunta',
        content: 'Conteúdo da pergunta',
      }
    })

    expect(questionOnDatabase).toBeTruthy()
  })
})
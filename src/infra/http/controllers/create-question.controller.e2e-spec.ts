/* eslint-disable prettier/prettier */
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { hash } from 'bcrypt'
import request from 'supertest'
import { StudentFactory } from 'test/factories/make-student'


describe('Create question (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let studentFactory: StudentFactory
  let jwt: JwtService
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory]
    })
      .compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    studentFactory = moduleRef.get(StudentFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('(POST) /question', async () => {
    const user = await studentFactory.makePrismaStudent({
       email: 'vinicius@gmail.com',
        password: await hash('123456', 8)
    })

    const accessToken = jwt.sign({ sub: user.id.toString() })
    const response = await request(app.getHttpServer())
      .post('/question')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Título da pergunta',
        content: 'Conteúdo da pergunta',
      })

    expect(response.statusCode).toBe(201)


    const questionOnDatabase = await prisma.question.findFirst({
      where: {
        title: 'Título da pergunta'
      }
    })

    expect(questionOnDatabase).toBeTruthy()
  })
})
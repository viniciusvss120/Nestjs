/* eslint-disable prettier/prettier */
import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'


describe('Create question (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('(POST) /question', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'Vinicius Silva',
        email: 'vinicius@gmail.com',
        password: '123456'
      }
    })

    const accessToken = jwt.sign({ sub: user.id })
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
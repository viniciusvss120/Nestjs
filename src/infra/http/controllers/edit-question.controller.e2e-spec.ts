/* eslint-disable prettier/prettier */
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { hash } from 'bcrypt'
import request from 'supertest'
import { AttachmentFactory } from 'test/factories/make-attachment'
import { QuestionFactory } from 'test/factories/make-question'
import { QuestionAttachmentFactory } from 'test/factories/make-question-attachments'
import { StudentFactory } from 'test/factories/make-student'


describe('Edit question (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let studentFactory: StudentFactory
  let attachmentFactory: AttachmentFactory
  let questionAttachmentsFactory: QuestionAttachmentFactory
  let questionFactory: QuestionFactory
  let jwt: JwtService
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, QuestionAttachmentFactory, AttachmentFactory]
    })
      .compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    studentFactory = moduleRef.get(StudentFactory)
    attachmentFactory = moduleRef.get(AttachmentFactory)
    questionAttachmentsFactory = moduleRef.get(QuestionAttachmentFactory)
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

    const attachment1 = await attachmentFactory.makePrismaAttachement()

    const attachment2 = await attachmentFactory.makePrismaAttachement()

    await questionAttachmentsFactory.makePrismaQuestionAttachement({
      attachmentId: attachment1.id,
      questionId: question.id
    })

    await questionAttachmentsFactory.makePrismaQuestionAttachement({
      attachmentId: attachment2.id,
      questionId: question.id
    })

    const attachment3 = await attachmentFactory.makePrismaAttachement()

    const questionId = question.id.toString()
    const response = await request(app.getHttpServer())
      .put(`/question/${questionId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Novo título da pergunta',
        content: 'Conteúdo da pergunta',
        attachments: [attachment1.id.toString(), attachment3.id.toString()]
      })
      
    expect(response.statusCode).toBe(204)


    const questionOnDatabase = await prisma.question.findFirst({
      where: {
        title: 'Novo título da pergunta',
        content: 'Conteúdo da pergunta',
      }
    })

    expect(questionOnDatabase).toBeTruthy()

    const attachmentOnDatabase = await prisma.attachment.findMany({
      where: {
        questionId: questionOnDatabase?.id
      }
    })

    expect(attachmentOnDatabase).toHaveLength(2)
    expect(attachmentOnDatabase).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: attachment1.id.toString()
        }),
        expect.objectContaining({
          id: attachment2.id.toString()
        })
      ])
    )
    
    
  })
})
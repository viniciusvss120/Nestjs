/* eslint-disable prettier/prettier */
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AnswerFactory } from 'test/factories/make-answer'
import { AnswerAttachmentFactory } from 'test/factories/make-answer-attachments'
import { AttachmentFactory } from 'test/factories/make-attachment'
import { QuestionFactory } from 'test/factories/make-question'
import { StudentFactory } from 'test/factories/make-student'


describe('Edit answer (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let attachmentFectory: AttachmentFactory
  let answerAttachmentFectory: AnswerAttachmentFactory
  let answerFactory: AnswerFactory
  let jwt: JwtService
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, AnswerFactory, AnswerAttachmentFactory, AttachmentFactory]
    })
      .compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    attachmentFectory = moduleRef.get(AttachmentFactory)
    answerAttachmentFectory = moduleRef.get(AnswerAttachmentFactory)
    answerFactory = moduleRef.get(AnswerFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('(PUT) /answer/:id', async () => {
    const user = await studentFactory.makePrismaStudent()

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id
    })

    const answer = await answerFactory.makePrismaAnswer({
      questionId: question.id,
      authorId: user.id,
    })

    const attachment1 = await attachmentFectory.makePrismaAttachement()
    const attachment2 = await attachmentFectory.makePrismaAttachement()
  
    await answerAttachmentFectory.makePrismaAnswerAttachement({
      attachmentId: attachment1.id,
      answerId: answer.id
    })

    await answerAttachmentFectory.makePrismaAnswerAttachement({
      attachmentId: attachment2.id,
      answerId: answer.id
    })

    const attachment3 = await attachmentFectory.makePrismaAttachement()
    const answerId = answer.id.toString()
    const response = await request(app.getHttpServer())
      .put(`/answer/${answerId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        content: 'Novo Conteúdo da pergunta',
        attachments: [
          attachment1.id.toString(),
          attachment3.id.toString(),
        ]
      })
      
    expect(response.statusCode).toBe(204)


    const answerOnDatabase = await prisma.answer.findFirst({
      where: {
        content: 'Novo Conteúdo da pergunta',
      }
    })

    expect(answerOnDatabase).toBeTruthy()

    const attachmentOnDatabase = await prisma.attachment.findMany({
      where: {
        answerId: answerOnDatabase?.id
      }
    })
    console.log(attachmentOnDatabase)
    expect(attachmentOnDatabase).toHaveLength(2)
    expect(attachmentOnDatabase).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: attachment1.id.toString(),
        }),
        expect.objectContaining({
          id: attachment3.id.toString(),
        }),
      ]),
    )
    
  })
})
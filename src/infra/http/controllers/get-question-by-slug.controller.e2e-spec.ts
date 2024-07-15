/* eslint-disable prettier/prettier */
import { AppModule } from '@/infra/app.module'
// import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { StudentFactory } from 'test/factories/make-student'
import { QuestionFactory } from 'test/factories/make-question'
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'
import { AttachmentFactory } from 'test/factories/make-attachment'
import { QuestionAttachmentFactory } from 'test/factories/make-question-attachments'


describe('Get question (E2E)', () => {
  let app: INestApplication
  // let prisma: PrismaService
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let attachmentFactory: AttachmentFactory
  let questionAttachmentFactory: QuestionAttachmentFactory
  let jwt: JwtService
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, AttachmentFactory, QuestionAttachmentFactory]
    })
      .compile()

    app = moduleRef.createNestApplication()

    // prisma = moduleRef.get(PrismaService)
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    attachmentFactory = moduleRef.get(AttachmentFactory)
    questionAttachmentFactory = moduleRef.get(QuestionAttachmentFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('(GET) /question/:slug', async () => {
    const user = await studentFactory.makePrismaStudent({ name: 'Vinicius Silva'})

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
      title: 'Question 1',
      slug: Slug.create('question-1')
    })

    const attachment = await attachmentFactory.makePrismaAttachement({
      title: 'Some attachment'
    })

    await questionAttachmentFactory.makePrismaQuestionAttachement({
      attachmentId: attachment.id,
      questionId: question.id
    })

    const response = await request(app.getHttpServer())
      .get('/question/question-1')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      questions: expect.objectContaining({ 
        title: 'Question 1',
        author: 'Vinicius Silva',
        attachments: [
          expect.objectContaining({
            title: 'Some attachment'
          })
        ]
      }),
    })
  })
})
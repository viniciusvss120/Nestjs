/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common'
import { AuthenticateController } from './controllers/authenticate.controller'
import { CreateAccount } from './controllers/create-account.controller'
import { CreateQuestion } from './controllers/create-question.controller'
import { FetchRecentQuestion } from './controllers/fetch-recent-questions.controller'
// import { PrismaService } from '../database/prisma/prisma.service'
import { DatabaseModule } from '../database/database.module'
import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question'
import { FetchRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/fetch-recent-questions'
import { RegisterStudentUseCase } from '@/domain/forum/application/use-cases/register-student'
import { AuthenticateStudentUseCase } from '@/domain/forum/application/use-cases/authenticate-student'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { GetQuestionBySlugController } from './controllers/get-question-by-slug'
import { GetQuestionBySlugUseCase } from '@/domain/forum/application/use-cases/get-question-by-slug'
import { EditQuestion } from './controllers/edit-question.controller'
import { EditQuestionUseCase } from '@/domain/forum/application/use-cases/edit-question'
import { DeleteQuestionController } from './controllers/delete-question.controller'
import { DeleteQuestionUseCase } from '@/domain/forum/application/use-cases/delete-question'
import { AnswerQuestionController } from './controllers/answer-question.controller'
import { AnswerQuestionUseCase } from '@/domain/forum/application/use-cases/answer-question'
import { EditAnswer } from './controllers/edit-answer.controller'
import { EditAnswerUseCase } from '@/domain/forum/application/use-cases/edit-answer'
import { DeleteAnswerController } from './controllers/delete-answer.controller'
import { DeleteAnswerUseCase } from '@/domain/forum/application/use-cases/delete-answer'
import { FetchQuestionAnswersController } from './controllers/fetch-question-answers.controller'
import { FetchQuestionAnswersUseCase } from '@/domain/forum/application/use-cases/fetch-question-answers'
import { ChooseQuestionBestAnswerUseCase } from '@/domain/forum/application/use-cases/choose-question-best-answer'
import { ChooseQuestionBestAnswerController } from './controllers/chose-question-bats-answer.controller'
import { CommentsQuestionController } from './controllers/comment-on-question.controller'
import { CommentOnQuestionUseCase } from '@/domain/forum/application/use-cases/comment-on-question'
import { DeleteQuestionCommentsController } from './controllers/delete-question-comments.controller'
import { DeleteQuestionCommentUseCase } from '@/domain/forum/application/use-cases/delete-question-comment'
import { CommentsAnswerController } from './controllers/comment-on-answer.controller'
import { CommentOnAnswerUseCase } from '@/domain/forum/application/use-cases/comment-on-answer'
import { DeleteAnswerCommentsController } from './controllers/delete-answer-comment.controller'
import { DeleteAnswerCommentUseCase } from '@/domain/forum/application/use-cases/delete-answer-comment'
import { FetchQuestionCommentsController } from './controllers/fetch-question-comments.controller'
import { FetchQuestionCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-question-comments'
import { FetchAnswerCommentsController } from './controllers/fetch-answer-comments.controller'
import { FetchAnswerCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-answer-comments'
import { UploadAttachmentController } from './controllers/upload-attachment.controller'
import { UploadAndCreateAttachmentUseCase } from '@/domain/forum/application/use-cases/upload-and-create-attachment'
import { StorageModule } from '../storage/storage.module'

@Module({
  imports: [
    DatabaseModule,
    CryptographyModule,
    StorageModule
  ],
  controllers: [
    CreateAccount,
    AuthenticateController,
    CreateQuestion,
    FetchRecentQuestion,
    GetQuestionBySlugController,
    EditQuestion,
    DeleteQuestionController,
    AnswerQuestionController,
    EditAnswer,
    DeleteAnswerController,
    FetchQuestionAnswersController,
    ChooseQuestionBestAnswerController,

    CommentsQuestionController,
    DeleteQuestionCommentsController,
    FetchQuestionCommentsController,

    CommentsAnswerController,
    DeleteAnswerCommentsController,
    FetchAnswerCommentsController,

    UploadAttachmentController
    
  ],
  providers: [
    CreateQuestionUseCase,
    FetchRecentQuestionsUseCase,
    FetchQuestionAnswersUseCase,
    RegisterStudentUseCase,
    EditQuestionUseCase,
    AuthenticateStudentUseCase,
    GetQuestionBySlugUseCase,
    DeleteQuestionUseCase,
    AnswerQuestionUseCase,
    EditAnswerUseCase,
    DeleteAnswerUseCase,
    ChooseQuestionBestAnswerUseCase,

    CommentOnQuestionUseCase,
    DeleteQuestionCommentUseCase,
    FetchQuestionCommentsUseCase,

    CommentOnAnswerUseCase,
    DeleteAnswerCommentUseCase,
    FetchAnswerCommentsUseCase,
    UploadAndCreateAttachmentUseCase
  ]
})
export class HttpModule { }

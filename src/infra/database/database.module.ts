/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service';

import { PrismaAnswerRepository } from './prisma/repository/prisma-answers-repository';
import { PrismaAnswerCommentsRepository } from './prisma/repository/prisma-answer-comments-repository';
import { PrismaAnswerAttachmentsRepository } from './prisma/repository/prisma-answer-attachments-repository';
import { PrismaQuestionRepository } from './prisma/repository/prisma-question-repository';
import { PrismaQuestionCommentsRepository } from './prisma/repository/prisma-question-comments-repository';
import { PrismaQuestionAttachmentsRepository } from './prisma/repository/prisma-question-attachments-repository';
import { PrismaStudentRepository } from './prisma/repository/prisma-students-repository';

import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository';
import { StudentRepository } from '@/domain/forum/application/repositories/students-repositorys';
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository';
import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository';
import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository';
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository';
import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository';

@Module({
  providers: [
    PrismaService,
    // Aqui estamos dizendo para o use-case que usa o QuestionRepository passar a usar o PrismaQuestionRepository
    {
      provide: QuestionsRepository,
      useClass: PrismaQuestionRepository
    },
    {
      provide: StudentRepository,
      useClass: PrismaStudentRepository
    },
    {
      provide: AnswersRepository,
      useClass: PrismaAnswerRepository
    },
    {
      provide: AnswerCommentsRepository,
      useClass: PrismaAnswerCommentsRepository
    },
    {
      provide: AnswerAttachmentsRepository,
      useClass: PrismaAnswerAttachmentsRepository
    },
    {
      provide: QuestionCommentsRepository,
      useClass: PrismaQuestionCommentsRepository
    },
    {
      provide: QuestionAttachmentsRepository,
      useClass: PrismaQuestionAttachmentsRepository
    }
  ],
  exports: [
    PrismaService,
    AnswersRepository,
    AnswerCommentsRepository,
    AnswerAttachmentsRepository,
    QuestionsRepository,
    StudentRepository,
    QuestionCommentsRepository,
    QuestionAttachmentsRepository
  ]
})
export class DatabaseModule {}
/* eslint-disable prettier/prettier */
import { PaginationParams } from '@/core/repositories/pagination-params';
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { Question } from '@/domain/forum/enterprise/entities/question';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PrismaQuestionDetailsMapper } from '../mappers/prisma-questions-details-mapper';
import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository';
import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details';
import { PrismaQuestionMapper } from '../mappers/prisma-question-mapper';

@Injectable()
export class PrismaQuestionRepository implements QuestionsRepository {
  constructor(
    private prisma: PrismaService,
    private questionAttachmentRepository: QuestionAttachmentsRepository
  ) {}

  async findById(id: string): Promise<Question | null> {
    const question = await this.prisma.question.findUnique({
      where: {
        id
      }
    })

    if (!question) {
      return null
    }

    return PrismaQuestionMapper.toDomain(question)
  }

  async findBySlug(slug: string): Promise<Question | null> {
    const question = await this.prisma.question.findUnique({
      where: {
        slug
      }
    })

    if (!question) {
      return null
    }

    return PrismaQuestionMapper.toDomain(question)
  }

  async findDetailsBySlug(slug: string): Promise<QuestionDetails | null> {
    const question = await this.prisma.question.findUnique({
      where: {
        slug,
      },
      include: {
        author: true,
        attachments: true

      }
    })

    if (!question) {
      return null
    }

    return PrismaQuestionDetailsMapper.toDomain(question)
  }

  async findManyRecent({ page }: PaginationParams): Promise<Question[]> {
    const question = await this.prisma.question.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      take: 20,
      skip: (page - 1) * 20
    })

    return question.map(PrismaQuestionMapper.toDomain)
  }

  async save(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toPrisma(question)
    await Promise.all([

      await this.prisma.question.update({
        where: {
          id: data.id
        },
        data
      }),
  
      await this.questionAttachmentRepository.createMany(
        question.attachments.getItems()
      ),
  
      await this.questionAttachmentRepository.deleteMany(
        question.attachments.getRemovedItems()
      )
    ])
  }

  async create(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toPrisma(question)
    await this.prisma.question.create({
      data
    })
    await this.questionAttachmentRepository.createMany(
      question.attachments.getItems()
    )
  }

  async delete(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toPrisma(question)
    await this.prisma.question.delete({
      where: {
        id: data.id
      }
    })
  }
}
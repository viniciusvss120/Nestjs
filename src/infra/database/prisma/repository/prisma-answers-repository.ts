/* eslint-disable prettier/prettier */
import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { Answer } from '@/domain/forum/enterprise/entities/answer'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaAnswerMapper } from '../mappers/prisma-answer-mepper'
import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository'

@Injectable()
export class PrismaAnswerRepository implements AnswersRepository {
  constructor(
    private prisma: PrismaService,
    private answerAttachmentRepository: AnswerAttachmentsRepository
  ) {}

  async findById(id: string): Promise<Answer | null> {
    const answer = await this.prisma.answer.findUnique({
      where: {
        id
      }
    })

    if (!answer) {
      return null
    }

    return PrismaAnswerMapper.toDomain(answer)
  }

  async findManyByQuestionId(answerId: string, {page}: PaginationParams): Promise<Answer[]> {
    const answer = await this.prisma.answer.findMany({
      where: {
        
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 20,
      skip: (page - 1) * 20
    })

    return answer.map(PrismaAnswerMapper.toDomain)
  }

  async create(answer: Answer): Promise<void> {
    const data = PrismaAnswerMapper.toPrisma(answer)
    await this.prisma.answer.create({
      data
    })

    await this.answerAttachmentRepository.createMany(
      answer.attachments.getItems()
    )
  }

  async save(answer: Answer): Promise<void> {
    const data = PrismaAnswerMapper.toPrisma(answer)

    await Promise.all([
      this.prisma.answer.update({
        where: {
          id: data.id
        },
        data
      }),

      this.answerAttachmentRepository.createMany(
        answer.attachments.getItems()
      ),
  
      this.answerAttachmentRepository.deleteMany(
        answer.attachments.getRemovedItems()
      )
    ])
    
  }

  async delete(answer: Answer): Promise<void> {
    await this.prisma.answer.delete({
      where: {
        id: answer.id.toString()
      }
    })
  }
}

/* eslint-disable prettier/prettier */
import { PaginationParams } from '@/core/repositories/pagination-params'
import { Injectable } from '@nestjs/common'
import { PrismaAnswerCommentsMapper } from '../mappers/prisma-answer-comment-mapper'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'
import { PrismaService } from '../prisma.service'
import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository'

@Injectable()
export class PrismaAnswerCommentsRepository implements AnswerCommentsRepository {
  constructor(private prisma: PrismaService) {}
  async findById(id: string): Promise<AnswerComment | null> {
    const answerComments = await this.prisma.comment.findUnique({
      where: {
        id
      }
    })

    if (!answerComments) {
      return null
    }

    return PrismaAnswerCommentsMapper.toDomain(answerComments)
  }


  async findManyByAnswerId(answerId: string ,{page}: PaginationParams): Promise<AnswerComment[]> {
    const answer = await this.prisma.comment.findMany({
      where: {
        answerId
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 20,
      skip: (page - 1) * 20
    })

    return answer.map(PrismaAnswerCommentsMapper.toDomain)
  }

  async create(answerComment: AnswerComment): Promise<void> {
    const data = PrismaAnswerCommentsMapper.toPrisma(answerComment)
    await this.prisma.comment.create({
      data
    })
  }

  async delete(answerComment: AnswerComment): Promise<void> {
    await this.prisma.comment.delete({
      where: {
        id: answerComment.id.toString()
      }
    })
  }
}

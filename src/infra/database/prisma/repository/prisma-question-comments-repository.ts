/* eslint-disable prettier/prettier */
import { PaginationParams } from '@/core/repositories/pagination-params'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaQuestionCommentMapper } from '../mappers/prisma-question-comment-mapper'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository'
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author'
import { PrismaCommentWithAuthorMapper } from '../mappers/prisma-comment-with-author-mapper'

@Injectable()
export class PrismaQuestionCommentsRepository implements QuestionCommentsRepository {
  constructor(private prisma: PrismaService) {}
 
  async findById(id: string): Promise<QuestionComment | null> {
    const questionComments = await this.prisma.comment.findUnique({
      where: {
        id
      }
    })

    if (!questionComments) {
      return null
    }

    return PrismaQuestionCommentMapper.toDomain(questionComments)
  }

  async findManyByQuestionIdWithAuthor(questionId: string, {page}: PaginationParams): Promise<CommentWithAuthor[]> {
    const question = await this.prisma.comment.findMany({
      where: {
        questionId
      },
      include: {
        author: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 20,
      skip: (page - 1) * 20
    })

    return question.map(PrismaCommentWithAuthorMapper.toDomain)
  }

  async findManyByQuestionId(questionId: string ,{page}: PaginationParams): Promise<QuestionComment[]> {
    const question = await this.prisma.comment.findMany({
      where: {
        questionId
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 20,
      skip: (page - 1) * 20
    })

    return question.map(PrismaQuestionCommentMapper.toDomain)
  }

  async create(questionComment: QuestionComment): Promise<void> {
    const data = PrismaQuestionCommentMapper.toPrisma(questionComment)
    await this.prisma.comment.create({
      data
    })
  }

  async delete(questionComment: QuestionComment): Promise<void> {
    await this.prisma.comment.delete({
      where: {
        id: questionComment.id.toString()
      }
    })
  }

}

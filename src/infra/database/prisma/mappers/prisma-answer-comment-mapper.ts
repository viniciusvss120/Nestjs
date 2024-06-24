/* eslint-disable prettier/prettier */
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'
import {Comment as PrismaComments, Prisma} from '@prisma/client'

// Essa classe é responsável por converter a classe que vem do prisma  para uma classe igual da entidade de dominio.
export class PrismaAnswerCommentsMapper {
  static toDomain(raw: PrismaComments){

    if (!raw.answerId) {
      throw new Error('Invalid comment type.')
    }

    return AnswerComment.create({
      content: raw.content,
      answerId: new UniqueEntityID(raw.answerId),
      authorId: new UniqueEntityID(raw.authorId),
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt
    }, new UniqueEntityID(raw.id))
  }

  static toPrisma(answerComments: AnswerComment): Prisma.CommentUncheckedCreateInput {
    return {
      id: answerComments.id.toString(),
      authorId: answerComments.authorId.toString(),
      answerId: answerComments.answerId.toString(),
      content: answerComments.content,
      createdAt: answerComments.createdAt,
      updatedAt: answerComments.updatedAt
    }
  }
}

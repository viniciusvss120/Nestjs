/* eslint-disable prettier/prettier */
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment'
import {Attachment as PrismaAttachment} from '@prisma/client'

// Essa classe é responsável por converter a classe que vem do prisma  para uma classe igual da entidade de dominio.
export class PrismaQuestionAttachmentMapper {
  static toPrisma(questionattachment: QuestionAttachment): any {
    throw new Error('Method not implemented.')
  }
  static toDomain(raw: PrismaAttachment){

    if (!raw.questionId) {
      throw new Error('Invalid comment type.')
    }

    return QuestionAttachment.create({

      attachmentId: new UniqueEntityID(raw.id),
      questionId: new UniqueEntityID(raw.questionId)
    }, new UniqueEntityID(raw.id))
  }
}

/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment'
import {Prisma, Attachment as PrismaAttachment} from '@prisma/client'

// Essa classe é responsável por converter a classe que vem do prisma  para uma classe igual da entidade de dominio.
export class PrismaQuestionAttachmentMapper {
  // static toPrisma(questionAttachment: QuestionAttachment): any {
  //   throw new Error('Method not implemented.')
  // }

  static toDomain(raw: PrismaAttachment){

    if (!raw.questionId) {
      throw new Error('Invalid comment type.')
    }

    return QuestionAttachment.create({

      attachmentId: new UniqueEntityID(raw.id),
      questionId: new UniqueEntityID(raw.questionId)
    }, new UniqueEntityID(raw.id))
  }

  static toPrismaUpdateMany(
    attachments: QuestionAttachment[]
  ): Prisma.AttachmentUpdateManyArgs {

    const attachmentIds = attachments.map((attachment) => {
      return attachment.attachmentId.toString()
    })

    return {
      where: {
        id: {
          in: attachmentIds,
        },     
      },
      data: {
         questionId: attachments[0].questionId.toString(),
      },
    }
  }
}

/* eslint-disable prettier/prettier */

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Attachment } from '@/domain/forum/enterprise/entities/attachment'
import {Prisma, Attachment as PrismaAttachment} from '@prisma/client'

// Essa classe é responsável por converter a classe que vem do prisma  para uma classe igual da entidade de dominio.
export class PrismaAttachementMapper {
  static toDomain(raw: PrismaAttachment): Attachment {
    return Attachment.create({
      title: raw.title,
      url: raw.url,
    }, new UniqueEntityID(raw.id)) 
  }

  static toPrisma(attachement: Attachment): Prisma.AttachmentUncheckedCreateInput {
    return {
      id: attachement.id.toString(),
      title: attachement.title,
      url: attachement.url
    }
  }

  
}

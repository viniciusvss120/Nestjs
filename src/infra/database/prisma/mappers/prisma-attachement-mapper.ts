/* eslint-disable prettier/prettier */

import { Attachment } from '@/domain/forum/enterprise/entities/attachment'
import {Prisma} from '@prisma/client'

// Essa classe é responsável por converter a classe que vem do prisma  para uma classe igual da entidade de dominio.
export class PrismaAttachementMapper {

  static toPrisma(attachement: Attachment): Prisma.AttachmentUncheckedCreateInput {
    return {
      id: attachement.id.toString(),
      title: attachement.title,
      url: attachement.url
    }
  }
}

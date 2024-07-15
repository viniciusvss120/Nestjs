/* eslint-disable prettier/prettier */
import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { Attachment, AttachmentProps } from '@/domain/forum/enterprise/entities/attachment'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PrismaAttachementMapper } from '@/infra/database/prisma/mappers/prisma-attachement-mapper'

export function makeAttachement(
  override: Partial<AttachmentProps> = {},
  id?: UniqueEntityID,
) {
  const attachement = Attachment.create(
    {
      title: faker.lorem.slug(),
      url: faker.lorem.slug(),
      ...override
    },
    id,
  )

  return attachement
}

@Injectable()
export class AttachmentFactory {
  constructor(private prisma: PrismaService){}

  async makePrismaAttachement(data: Partial<AttachmentProps> = {}): Promise<Attachment> {
    const attachment = makeAttachement(data)

    await this.prisma.attachment.create({
      data: PrismaAttachementMapper.toPrisma(attachment)
    })

    return attachment
  }
}

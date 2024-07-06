/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment'
import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository'
import { PrismaAnswerAttachmentMapper } from '../mappers/prisma-answer-attachment-mapper'

@Injectable()
export class PrismaAnswerAttachmentsRepository implements AnswerAttachmentsRepository {
  constructor(private prisma: PrismaService) {}

  async findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]> {
    const answerAttachment = await this.prisma.attachment.findMany({
      where: {
        answerId
      }
    })

    return answerAttachment.map(PrismaAnswerAttachmentMapper.toDomain)
  }

  async createMany(attachment: AnswerAttachment[]): Promise<void> {
    if (attachment.length === 0) {
      return
    }
    const data = PrismaAnswerAttachmentMapper.toPrismaUpdateMany(attachment)
    await this.prisma.attachment.updateMany(data)
  }
  
  async deleteMany(attachment: AnswerAttachment[]): Promise<void> {
    if (attachment.length === 0) {
      return
    }

    const attachmentIds = attachment.map((attachment) => {
      return attachment.id.toString()
    })

    await this.prisma.attachment.deleteMany({
      where: {
        id: {
          in: attachmentIds
        }
      }
    })
  }

  async deleteManyByAnswerId(answerId: string): Promise<void> {
    await this.prisma.attachment.deleteMany({
      where: {
        answerId
      }
    })
  }
}

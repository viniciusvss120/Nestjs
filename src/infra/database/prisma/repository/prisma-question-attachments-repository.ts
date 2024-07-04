/* eslint-disable prettier/prettier */
import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository'
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaQuestionAttachmentMapper } from '../mappers/prisma-question-attachment-mapper'

@Injectable()
export class PrismaQuestionAttachmentsRepository implements QuestionAttachmentsRepository{
  constructor(private prisma: PrismaService) {}

  async findManyByQuestionId(questionId: string): Promise<QuestionAttachment[]> {
    const questionAttachment = await this.prisma.attachment.findMany({
      where: {
        questionId
      }
    })

    return questionAttachment.map(PrismaQuestionAttachmentMapper.toDomain)
  }

  async createMany(attachment: QuestionAttachment[]): Promise<void> {
    if (attachment.length === 0) {
      return
    }
    const data = PrismaQuestionAttachmentMapper.toPrismaUpdateMany(attachment)
    await this.prisma.attachment.updateMany(data)
  }
  
  async deleteMany(attachment: QuestionAttachment[]): Promise<void> {
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

  async deleteManyByQuestionId(questionId: string): Promise<void> {
    await this.prisma.attachment.deleteMany({
      where: {
        questionId
      }
    })
  }

}

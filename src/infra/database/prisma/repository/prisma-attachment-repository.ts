/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PrismaAttachementMapper } from '../mappers/prisma-attachement-mapper';
import { AttachmentRepository } from '@/domain/forum/application/repositories/attachment-repository';
import { Attachment } from '@/domain/forum/enterprise/entities/attachment';

@Injectable()
export class PrismaAttachmentRepository implements AttachmentRepository {
  constructor(private prisma: PrismaService) {}



  async create(attachement: Attachment): Promise<void> {
    const data = PrismaAttachementMapper.toPrisma(attachement)
    await this.prisma.attachment.create({
      data
    })
  }

}
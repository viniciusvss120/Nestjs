/* eslint-disable prettier/prettier */
import { AttachmentRepository } from '@/domain/forum/application/repositories/attachment-repository'

import { Attachment } from '@/domain/forum/enterprise/entities/attachment'

export class InMemoryAttachmentRepository implements AttachmentRepository {
  public items: Attachment[] = []

  constructor(
  ) {}

  async create(attachment: Attachment) {
    this.items.push(attachment)
  } 

  
}

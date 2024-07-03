/* eslint-disable prettier/prettier */
import { Attachment } from '../../enterprise/entities/attachment';

export abstract class AttachmentRepository {
  // abstract findByTitle(title: string): Promise<Attachment | null>
  abstract create(attachment: Attachment): Promise<void>
}

/* eslint-disable prettier/prettier */
import { InvalidAttachmentType } from '@/domain/forum/application/use-cases/errors/invalid-attachment-types';
import { UploadAndCreateAttachmentUseCase } from '@/domain/forum/application/use-cases/upload-and-create-attachment';
import { BadRequestException, Controller, FileTypeValidator, MaxFileSizeValidator, ParseFilePipe, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('/attachment')
export class UploadAttachmentController {
  constructor(
    private uploadAnsCreateAttachment: UploadAndCreateAttachmentUseCase
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file')) // Código copiado da documentação do nest.js
  async handle(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          // aqui definimos o tamanho do arquivo q vamos receber
          new MaxFileSizeValidator({ 
            maxSize: 1024 * 1024 * 2 // 2md
           }),

           // aqui definimos o formato do arquivo
          new FileTypeValidator({ 
            fileType: '.(png|jpg|jpeg|pdf)'
           }),
        ],
      }),
    ) file: Express.Multer.File
  ) {
    const result = await this.uploadAnsCreateAttachment.execute({
      fileName: file.originalname,
      fileType: file.mimetype,
      body: file.buffer
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case InvalidAttachmentType:
          throw new BadRequestException(error.message)
        default: 
        throw new BadRequestException(error.message)
      }
    }

    const {attachment} = result.value

    return {
      attachmentId: attachment.id.toString()
    }
  }

}

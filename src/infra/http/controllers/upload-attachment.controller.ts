/* eslint-disable prettier/prettier */
import { Controller, FileTypeValidator, MaxFileSizeValidator, ParseFilePipe, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('/attachment')
export class UploadAttachmentController {
  // constructor(
  //   private getQuestionBySlug: GetQuestionBySlugUseCase
  // ) {}

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
    console.log(file)
  }

}

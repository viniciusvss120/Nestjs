/* eslint-disable prettier/prettier */
import { PipeTransform, BadRequestException } from '@nestjs/common';
import { ZodError, ZodSchema } from 'zod'

// Aqui estamos validando os valores da requisão, um exemplo similar, exemplo.parse(valor)
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown) {
    try {
      return this.schema.parse(value)
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException({
          message: 'Validation failed',
          statusCode: 400,
          errors: error.format(),
        })
      }
      throw new BadRequestException('Validation failed');
    }
    return value
  }
}

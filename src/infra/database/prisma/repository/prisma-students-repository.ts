/* eslint-disable prettier/prettier */
import { StudentRepository } from '@/domain/forum/application/repositories/students-repositorys'
import { Student } from '@/domain/forum/enterprise/entities/student';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PrismaStudentMapper } from '../mappers/prisma-student-mapper';

@Injectable()
export class PrismaStudentRepository implements StudentRepository {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string): Promise<Student | null> {
    const student = await this.prisma.user.findUnique({
      where: {
        email
      }
    })

    if (!student) {
      return null
    }

    return PrismaStudentMapper.toDomain(student)
  }


  async create(student: Student): Promise<void> {
    const data = PrismaStudentMapper.toPrisma(student)
    await this.prisma.user.create({
      data
    })
  }

}
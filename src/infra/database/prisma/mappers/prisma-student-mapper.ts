/* eslint-disable prettier/prettier */
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Student } from '@/domain/forum/enterprise/entities/student'
import {User as PrismaStudent, Prisma} from '@prisma/client'

// Essa classe é responsável por converter a classe que vem do prisma  para uma classe igual da entidade de dominio.
export class PrismaStudentMapper {
  static toDomain(raw: PrismaStudent): Student{
    return Student.create({
      name: raw.name,
      email: raw.email,
      password: raw.password
    }, new UniqueEntityID(raw.id))
  }

  static toPrisma(student: Student): Prisma.UserUncheckedCreateInput {
    return {
      id: student.id.toString(),
      name: student.name,
      email: student.email,
      password: student.password
    }
  }
}

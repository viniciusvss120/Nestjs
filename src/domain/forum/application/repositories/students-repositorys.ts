/* eslint-disable prettier/prettier */
import { Student } from '../../enterprise/entities/student'

// O motivo de trocar de interface para class é que quando a aplicação for para produção, ela roda em JavaScrip, no JavaScript não existe interface, para resolver isso tracamos para class os repositórios dos use-cases.
export abstract class StudentRepository {
  abstract findByEmail(email: string): Promise<Student | null>
  abstract create(student: Student): Promise<void>
}

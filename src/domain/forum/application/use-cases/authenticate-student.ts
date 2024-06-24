/* eslint-disable prettier/prettier */
import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { StudentRepository } from '../repositories/students-repositorys'
import { HashComparer } from '../cryptography/hash-comparer'
import { Encrypter } from '../cryptography/encrypter'
import { WrongCredentialsError } from './errors/wrong-credentials-error'

interface AuthenticateStudentUseCaseRequest {
  email: string
  password: string
}

type AuthenticateStudentUseCaseResponse = Either<
  WrongCredentialsError,
  {
    acessToken: string
  }
>
@Injectable()
export class AuthenticateStudentUseCase {
  constructor(
    private studentRepository: StudentRepository,
    private hashCompare: HashComparer,
    private encrypter: Encrypter
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateStudentUseCaseRequest): Promise<AuthenticateStudentUseCaseResponse> {
    const studentWithSameEmail = await this.studentRepository.findByEmail(email)

    if (!studentWithSameEmail) {
      return left(new WrongCredentialsError())
    }

    const isPassword = await this.hashCompare.compare(password, studentWithSameEmail.password)

    if (!isPassword) {
      return left(new WrongCredentialsError())
    }
    
    const acessToken = await this.encrypter.encrypt({ sub: studentWithSameEmail.id.toString() })

    return right({
      acessToken
    })
  }
}

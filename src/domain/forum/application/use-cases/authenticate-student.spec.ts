/* eslint-disable prettier/prettier */
import { InMemoryStudentRepository } from 'test/repositories/in-memory-student-repository'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { AuthenticateStudentUseCase } from './authenticate-student'
import { FakeEncrypter } from 'test/cryptography/fake-encrypter'
import { makeStudent } from 'test/factories/make-student'

let inMemoryStudentRepository: InMemoryStudentRepository
let fakeHasher: FakeHasher
let fakeEncrypter: FakeEncrypter

let sut: AuthenticateStudentUseCase

describe('Register Student', () => {
  beforeEach(() => {
    inMemoryStudentRepository = new InMemoryStudentRepository()
    fakeHasher = new FakeHasher()
    fakeEncrypter = new FakeEncrypter()

    sut = new AuthenticateStudentUseCase(inMemoryStudentRepository, fakeHasher, fakeEncrypter)
  })

  it('should be able to authenticate a student', async () => {
    const student = makeStudent({
      email: 'vinicius@live.com',
      password: await fakeHasher.hash('123456')
    })

    inMemoryStudentRepository.items.push(student)

    const result = await sut.execute({
      email: 'vinicius@live.com',
      password: '123456'
    })
    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      acessToken: expect.any(String)
    })
  })
})

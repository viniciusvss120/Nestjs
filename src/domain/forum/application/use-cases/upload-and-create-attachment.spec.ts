/* eslint-disable prettier/prettier */
import { InMemoryAttachmentRepository } from 'test/repositories/in-memory-attachments-repository'
import { UploadAndCreateAttachmentUseCase } from './upload-and-create-attachment'
import { FakeUploader } from 'test/storage/fake-uploader'
import { InvalidAttachmentType } from './errors/invalid-attachment-types'

let inMemoryAttachmentRepository: InMemoryAttachmentRepository
let fakeUploader: FakeUploader
let sut: UploadAndCreateAttachmentUseCase

describe('Register Attachment', () => {
  beforeEach(() => {
    inMemoryAttachmentRepository = new InMemoryAttachmentRepository()
    fakeUploader = new FakeUploader()

    sut = new UploadAndCreateAttachmentUseCase(inMemoryAttachmentRepository, fakeUploader)
  })

  it('should be able to upload and create attachment', async () => {
  
    const result = await sut.execute({
      fileName: 'profile.png',
      fileType: 'image/png',
      body: Buffer.from('')
    })
    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      attachment: inMemoryAttachmentRepository.items[0]
    })
    expect(fakeUploader.uploads[0]).toEqual(expect
      .objectContaining({
        fileName: 'profile.png'
      })
    )
  })

  it('should not be able to upload an attachment  with invalid file type', async () => {
    const result = await sut.execute({
      fileName: 'profile.mp3',
      fileType: 'video/mpeg',
      body: Buffer.from('')
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidAttachmentType)
  })
})

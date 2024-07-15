/* eslint-disable prettier/prettier */
import { Comment as PrismaComment, User as PrismaUser} from '@prisma/client'
import { CommentWithAuthor } from "@/domain/forum/enterprise/entities/value-objects/comment-with-author";
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

// Essa classe é responsável por converter a classe que vem do prisma  para uma classe igual da entidade de dominio.
type PrismaCommentWithAuthor = PrismaComment & {
  author: PrismaUser
}

export class PrismaCommentWithAuthorMapper {
  static toDomain(raw: PrismaCommentWithAuthor){

   return CommentWithAuthor.create({
    commentId: new UniqueEntityID(raw.id),
    authorId: new UniqueEntityID(raw.authorId),
    author: raw.author.name,
    content: raw.content,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt
   })
  }
}

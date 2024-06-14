/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma/prisma.service';
import { CreateAccount } from './controllers/create-account.controller';
import { envSchema } from './env';
import { AuthModule } from './auth/auth.module';
import { AuthenticateController} from './controllers/authenticate.controller'
import { CreateQuestion } from './controllers/create-question.controller';
import { FetchRecentQuestion } from './controllers/fetch-recent-questions.controller';

@Module({
  imports: [ConfigModule.forRoot({
    validate: (env) => envSchema.parse(env),
    isGlobal: true
  }),
    AuthModule
  ],
  controllers: [
    CreateAccount,
    AuthenticateController,
    CreateQuestion,
    FetchRecentQuestion
  ],
  providers: [
    PrismaService
    
  ],
})
export class AppModule {}

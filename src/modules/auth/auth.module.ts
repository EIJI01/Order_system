import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { SendEmailModule } from '../send-email/send-email.module';

@Module({
  imports: [UserModule, SendEmailModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}

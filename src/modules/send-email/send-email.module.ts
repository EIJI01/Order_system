import { Module } from '@nestjs/common';
import { SendEmailService } from './send-email.service';
import { BullModule } from '@nestjs/bull';
import { EmailProcessor } from './send-email.processor';
import { SendEmailController } from './send-email.controller';

@Module({
  imports: [BullModule.registerQueue({ name: 'emailQueue' })],
  controllers: [SendEmailController],
  providers: [SendEmailService, EmailProcessor],
  exports: [SendEmailService],
})
export class SendEmailModule {}

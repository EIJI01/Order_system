import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';

@Processor('emailQueue')
export class EmailProcessor {
  private readonly logger = new Logger(EmailProcessor.name);
  @Process()
  handleSendEmailRegister(job: Job) {
    this.logger.log(`Send email to ${JSON.stringify(job.data)}`);
  }
}

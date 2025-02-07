import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import Bull, { Queue } from 'bull';
import { CreateSendEmailDto } from './dto/create-send-email.dto';

@Injectable()
export class SendEmailService {
  private readonly logger = new Logger(SendEmailService.name);
  constructor(@InjectQueue('emailQueue') private readonly emailQueue: Queue) {}

  async sendEmail(email: CreateSendEmailDto) {
    try {
      await this.emailQueue.add(email, {
        attempts: 3,
      });
      this.logger.log('Add email to queue successful.');
    } catch (error) {
      this.logger.error('Something went wrong to send email.');
    }
  }

  async getJobStatusQueue(jobId: string): Promise<{ jobId: string; state: Bull.JobStatus | 'stuck'; progress: any }> {
    const job = await this.emailQueue.getJob(jobId);
    if (!job) throw new HttpException(`Job id ${jobId} was not found.`, HttpStatus.NOT_FOUND);

    const state = await job.getState();
    const progress = job.progress();
    return { jobId, state, progress };
  }
}

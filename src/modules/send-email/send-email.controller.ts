import { Body, Controller, Get, HttpException, HttpStatus, Param, Post } from '@nestjs/common';
import { SendEmailService } from './send-email.service';
import { CreateSendEmailDto } from './dto/create-send-email.dto';
import { Response } from '../base.interface';
import { AllowAnonymous } from '../guards/auth.guard';
import { InjectQueue } from '@nestjs/bull';
import Bull, { Queue } from 'bull';

@AllowAnonymous()
@Controller('send-email')
export class SendEmailController {
  constructor(private readonly sendEmailService: SendEmailService) {}

  @Post()
  async sendEmail(@Body() request: CreateSendEmailDto): Promise<Response> {
    await this.sendEmailService.sendEmail(request);
    return { success: true };
  }

  @Get('status/:jobId')
  async getJobStatusQueue(@Param('jobId') jobId: string): Promise<Response<{ jobId: string; state: Bull.JobStatus | 'stuck'; progress: any }>> {
    try {
      const result = await this.sendEmailService.getJobStatusQueue(jobId);
      return { success: true, data: result };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(error.message, HttpStatus.CONFLICT);
    }
  }
}

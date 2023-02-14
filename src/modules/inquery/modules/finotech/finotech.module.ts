import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { RequestToken } from './request.token';
import { FinooService } from './services/finotech.service';

@Module({
  imports:[ScheduleModule.forRoot()],
  providers: [
    FinooService,
    RequestToken,
  ],
  exports: [FinooService],
})
export class FinotechModule {}
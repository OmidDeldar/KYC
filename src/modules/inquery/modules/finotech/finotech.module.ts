import { Module } from '@nestjs/common';
import { FinooService } from './services/finotech.service';

@Module({
  providers: [FinooService],
  exports: [FinooService],
})
export class FinotechModule {}
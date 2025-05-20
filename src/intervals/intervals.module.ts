import { Module } from '@nestjs/common';
import { IntervalsController } from './intervals.controller';
import { IntervalsService } from './intervals.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [IntervalsController],
  providers: [IntervalsService],
})
export class IntervalsModule {}

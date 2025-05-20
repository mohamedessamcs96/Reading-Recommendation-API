import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { IntervalsService } from './intervals.service';
import { CreateIntervalDto } from './dto/create-interval.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuardFactory } from '../auth/roles.guard';

@Controller('intervals')
export class IntervalsController {
  constructor(private readonly intervalsService: IntervalsService) {}

  // Both users and admins can create intervals
  @UseGuards(JwtAuthGuard, RolesGuardFactory(['user', 'admin']))
  @Post()
  create(@Body() dto: CreateIntervalDto) {
    return this.intervalsService.create(dto);
  }
}

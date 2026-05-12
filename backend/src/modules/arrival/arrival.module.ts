import { Module } from '@nestjs/common';
import { ArrivalController } from './arrival.controller';
import { ArrivalService } from './arrival.service';

@Module({
  controllers: [ArrivalController],
  providers: [ArrivalService]
})
export class ArrivalModule {}

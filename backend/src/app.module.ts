import { Module } from '@nestjs/common';
import { HealthModule } from './modules/health/health.module';
import { StationModule } from './modules/station/station.module';
import { ArrivalModule } from './modules/arrival/arrival.module';
import { CongestionModule } from './modules/congestion/congestion.module';
import { CollectorModule } from './modules/collector/collector.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { AlertModule } from './modules/alert/alert.module';

@Module({
  imports: [
    HealthModule,
    StationModule,
    ArrivalModule,
    CongestionModule,
    CollectorModule,
    DashboardModule,
    AlertModule,
  ],
})
export class AppModule {}
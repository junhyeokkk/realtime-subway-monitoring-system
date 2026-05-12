import { Test, TestingModule } from '@nestjs/testing';
import { ArrivalService } from './arrival.service';

describe('ArrivalService', () => {
  let service: ArrivalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArrivalService],
    }).compile();

    service = module.get<ArrivalService>(ArrivalService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

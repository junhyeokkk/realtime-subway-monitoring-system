import { Test, TestingModule } from '@nestjs/testing';
import { ArrivalController } from './arrival.controller';

describe('ArrivalController', () => {
  let controller: ArrivalController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArrivalController],
    }).compile();

    controller = module.get<ArrivalController>(ArrivalController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { LessonprogressController } from './lessonprogress.controller';
import { LessonprogressService } from './lessonprogress.service';

describe('LessonprogressController', () => {
  let controller: LessonprogressController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LessonprogressController],
      providers: [LessonprogressService],
    }).compile();

    controller = module.get<LessonprogressController>(LessonprogressController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

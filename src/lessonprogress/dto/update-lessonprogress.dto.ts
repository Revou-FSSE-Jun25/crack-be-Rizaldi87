import { PartialType } from '@nestjs/swagger';
import { CreateLessonprogressDto } from './create-lessonprogress.dto';

export class UpdateLessonprogressDto extends PartialType(CreateLessonprogressDto) {}

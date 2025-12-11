import { Module } from '@nestjs/common';
import { ConfirmQuestionSet } from './confirm.question-set';

@Module({
  providers: [ConfirmQuestionSet],
})
export class QuestionSetsModule {}

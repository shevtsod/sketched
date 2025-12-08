import { Test } from '@nestjs/testing';
import { ConfirmQuestionSet } from './confirm.question-set';

describe('ConfirmQuestionSet', () => {
  let questionSet: ConfirmQuestionSet;

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      providers: [ConfirmQuestionSet],
    }).compile();

    questionSet = app.get(ConfirmQuestionSet);
  });

  it('should be defined', () => {
    expect(questionSet).toBeDefined();
  });

  it('parses confirm', () => {
    expect(questionSet.parseConfirm(true)).toBe(true);
    expect(questionSet.parseConfirm(false)).toBe(false);
  });
});

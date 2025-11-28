import { Question, QuestionSet } from 'nest-commander';

@QuestionSet({ name: 'confirm-questions' })
export class ConfirmQuestionSet {
  @Question({
    name: 'confirm',
    message: 'Confirm?',
    type: 'confirm',
    default: false,
  })
  parseConfirm(val: boolean) {
    return val;
  }
}

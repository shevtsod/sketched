import { InputType, OmitType } from '@nestjs/graphql';
import { UpdateSessionInput } from './update-session.input';

@InputType()
export class CreateSessionInput extends OmitType(
  UpdateSessionInput,
  ['id'],
  InputType,
) {}

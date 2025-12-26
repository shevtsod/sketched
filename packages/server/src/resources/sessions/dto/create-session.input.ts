import { ArgsType, OmitType } from '@nestjs/graphql';
import { UpdateSessionInput } from './update-session.input';

@ArgsType()
export class CreateSessionInput extends OmitType(
  UpdateSessionInput,
  ['id'],
  ArgsType,
) {}

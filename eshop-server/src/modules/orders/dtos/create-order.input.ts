import { InputType, Field, ID } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class CreateOrderInput {
  @Field(() => ID)
  @IsString()
  userId: string;
}
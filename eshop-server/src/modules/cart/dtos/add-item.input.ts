import { InputType, Field, ID } from '@nestjs/graphql';
import { IsString, IsNumber, Min } from 'class-validator';

@InputType()
export class AddItemInput {
  @Field(() => ID)
  @IsString()
  product: string;

  @Field()
  @IsNumber()
  @Min(1)
  quantity: number;
}
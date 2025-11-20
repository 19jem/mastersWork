import { InputType, Field, Float, ID } from '@nestjs/graphql';
import { IsString, IsOptional, IsNumber, Min } from 'class-validator';

@InputType()
export class CreateProductInput {
  @Field()
  @IsString()
  name: string;

  @Field()
  @IsString()
  description: string;

  @Field(() => Float)
  @IsNumber()
  @Min(0)
  price: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  stock?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @Field(() => ID)
  @IsString()
  category: string; // тільки ID категорії
}

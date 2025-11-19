import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema({ timestamps: true })
@ObjectType()
export class Product {
  @Field(() => ID)
  _id: string;

  @Field()
  @Prop({ required: true })
  name: string;

  @Field()
  @Prop({ required: true })
  description: string;

  @Field()
  @Prop({ required: true })
  price: number;

  @Field()
  @Prop({ default: 0 })
  stock: number;

  @Field()
  @Prop()
  imageUrl: string;

  @Field(() => String)
  @Prop({ type: String, ref: 'Category', required: true })
  category: String;


  // Додати виробника

}

export type ProductDocument = HydratedDocument<Product>;
export const ProductSchema = SchemaFactory.createForClass(Product);

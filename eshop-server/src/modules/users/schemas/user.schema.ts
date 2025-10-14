import {Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';


@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, maxlength: 120 })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: false })
  password?: string;

  @Prop({ default: true })
  isActive: boolean;
}


export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ email: 1 });
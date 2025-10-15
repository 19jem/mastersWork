import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true })
  userId: string;

  @Prop({
    type: [
      {
        product: { type: String, ref: 'Product', required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
      },
    ],
  })
  items: {
    product: string;
    name: string;
    price: number;
    quantity: number;
  }[];

  @Prop({ required: true })
  total: number;

  @Prop({
    type: String,
    enum: ['pending', 'paid', 'shipped', 'completed'],
    default: 'pending',
  })
  status: string;
}

export type OrderDocument = HydratedDocument<Order>;
export const OrderSchema = SchemaFactory.createForClass(Order);

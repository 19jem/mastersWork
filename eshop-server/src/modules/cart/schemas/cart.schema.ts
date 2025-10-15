import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Product } from 'src/modules/products/schemas/product.schema';

@Schema({ timestamps: true })
export class Cart {
  @Prop({ required: true })
  userId: string;

  @Prop({
    type: [
      {
        product: { type: String, ref: 'Product', required: true },
        quantity: { type: Number, required: true, default: 1 },
      },
    ],
    default: [],
  })
  items: { product: string | Product; quantity: number }[];

  @Prop({ default: 0 })
  totalPrice: number;
}

export type CartDocument = HydratedDocument<Cart>
export const CartSchema = SchemaFactory.createForClass(Cart);

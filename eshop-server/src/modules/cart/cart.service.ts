import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cart, CartDocument } from './schemas/cart.schema';
import { AddItemDto } from './dtos/add-item.dto';
import { Product, ProductDocument } from '../products/schemas/product.schema';

interface CartItem {
  product: Types.ObjectId | ProductDocument;
  quantity: number;
}

// --- Найважливіша функція ---
function getProductId(
  p: Types.ObjectId | ProductDocument | string
): string {
  if (typeof p === 'string') return p;
  if (p instanceof Types.ObjectId) return p.toString();
  return p._id.toString();
}

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async getCart(userId: string): Promise<Cart> {
    let cart = await this.cartModel.findOne({ userId }).populate('items.product');
    if (!cart) {
      cart = await this.cartModel.create({ userId, items: [], totalPrice: 0 });
    }
    return cart;
  }

  async addItem(userId: string, dto: AddItemDto): Promise<Cart> {
    const product = await this.productModel.findById(dto.product);
    if (!product) throw new NotFoundException('Product not found');

    if (dto.quantity > product.stock) {
      throw new BadRequestException(
        `Немає такої кількості товару "${product.name}". Доступно ${product.stock}.`,
      );
    }

    let cart = await this.cartModel.findOne({ userId });
    if (!cart) {
      cart = await this.cartModel.create({ userId, items: [], totalPrice: 0 });
    }

    const existing = cart.items.find(
      i => getProductId(i.product) === dto.product
    );

    if (existing) {
      const newQty = existing.quantity + dto.quantity;
      if (newQty > product.stock) {
        throw new BadRequestException(
          `Не можна додати більше ніж ${product.stock} одиниць товару "${product.name}".`,
        );
      }
      existing.quantity = newQty;
    } else {
      // --- найважливіша зміна ---
      cart.items.push({
        product: new Types.ObjectId(dto.product),
        quantity: dto.quantity,
      });
    }

    cart.totalPrice = await this.calculateTotal(cart.items);
    await cart.save();
    return cart.populate('items.product');
  }

  async updateItem(userId: string, productId: string, quantity: number): Promise<Cart> {
    if (quantity < 1) {
      throw new BadRequestException('Кількість товару має бути хоча б 1.');
    }

    const product = await this.productModel.findById(productId);
    if (!product) throw new NotFoundException('Product not found');

    if (quantity > product.stock) {
      throw new BadRequestException(
        `Не можна замовити більше, ніж ${product.stock} одиниць товару "${product.name}".`,
      );
    }

    const cart = await this.cartModel.findOne({ userId });
    if (!cart) throw new NotFoundException('Cart not found');

    const item = cart.items.find(i => getProductId(i.product) === productId);
    if (!item) throw new NotFoundException('Item not found in cart');

    item.quantity = quantity;

    cart.totalPrice = await this.calculateTotal(cart.items);
    await cart.save();
    return cart.populate('items.product');
  }

  async removeItem(userId: string, productId: string): Promise<Cart> {
    const cart = await this.cartModel.findOne({ userId });
    if (!cart) throw new NotFoundException('Cart not found');

    cart.items = cart.items.filter(i => getProductId(i.product) !== productId);

    cart.totalPrice = await this.calculateTotal(cart.items);
    await cart.save();
    return cart.populate('items.product');
  }

  async clearCart(userId: string): Promise<void> {
    await this.cartModel.findOneAndUpdate(
      { userId },
      { items: [], totalPrice: 0 },
    );
  }

  private async calculateTotal(items: CartItem[]): Promise<number> {
    const ids = items.map(i => getProductId(i.product));
    const products = await this.productModel.find({ _id: { $in: ids } });

    return items.reduce((sum, i) => {
      const pid = getProductId(i.product);
      const prod = products.find(p => p._id.toString() === pid);
      return sum + (prod?.price || 0) * i.quantity;
    }, 0);
  }
}

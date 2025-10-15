import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from './schemas/order.schema';
import { Cart } from '../cart/schemas/cart.schema';
import { Product } from '../products/schemas/product.schema';
import { CreateOrderDto } from './dtos/create-order.dto';
import { CartService } from '../cart/cart.service';

// 🔹 універсальна утиліта для отримання id продукту
function getProductId(p: string | Product): string {
  return typeof p === 'string' ? p : p._id.toString();
}

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
    private readonly cartService: CartService,
  ) {}

  // 🔹 створення нового замовлення з кошика
  async create(dto: CreateOrderDto): Promise<Order> {
    const cart = await this.cartModel
      .findOne({ userId: dto.userId })
      .populate('items.product');

    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Кошик порожній');
    }

    // 🔹 перевіряємо наявність товарів і залишки
    for (const item of cart.items) {
      const productId = getProductId(item.product);
      const product = await this.productModel.findById(productId);

      if (!product) {
        throw new NotFoundException(`Товар не знайдено: ${productId}`);
      }

      if (product.stock < item.quantity) {
        throw new BadRequestException(
          `Не вистачає товару "${product.name}". У наявності ${product.stock}, потрібно ${item.quantity}.`,
        );
      }
    }

    // 🔹 створюємо замовлення
    const order = await this.orderModel.create({
      userId: dto.userId,
      items: cart.items.map((i) => {
        const p = typeof i.product === 'string' ? null : (i.product as Product);
        return {
          product: getProductId(i.product),
          name: p?.name || 'Невідомо',
          price: p?.price || 0,
          quantity: i.quantity,
        };
      }),
      total: cart.totalPrice,
      status: 'pending',
    });

    // 🔹 зменшуємо залишки товарів
    for (const item of cart.items) {
      const productId = getProductId(item.product);
      await this.productModel.findByIdAndUpdate(productId, {
        $inc: { stock: -item.quantity },
      });
    }

    // 🔹 очищуємо кошик користувача
    await this.cartService.clearCart(dto.userId);

    return order;
  }

  // 🔹 отримати всі замовлення користувача
  async findAll(userId: string): Promise<Order[]> {
    return this.orderModel.find({ userId }).sort({ createdAt: -1 }).lean();
  }

  // 🔹 одне замовлення з деталізацією
  async findOne(id: string): Promise<Order> {
    const order = await this.orderModel.findById(id).populate('items.product').lean();
    if (!order) throw new NotFoundException('Замовлення не знайдено');
    return order;
  }

  // 🔹 оновлення статусу (для адміністратора)
  async updateStatus(id: string, status: string): Promise<Order> {
    const updated = await this.orderModel.findByIdAndUpdate(id, { status }, { new: true });
    if (!updated) throw new NotFoundException('Замовлення не знайдено');
    return updated;
  }
}


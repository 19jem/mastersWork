import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { Cart, CartDocument } from '../cart/schemas/cart.schema';
import { Product, ProductDocument } from '../products/schemas/product.schema';
import { CreateOrderDto } from './dtos/create-order.dto';
import { CartService } from '../cart/cart.service';

// ================================
//   ЛОКАЛЬНА ФУНКЦІЯ getProductId
// ================================
function getProductId(
  p: string | Types.ObjectId | ProductDocument
): string {
  if (typeof p === 'string') return p;
  if (p instanceof Types.ObjectId) return p.toString();
  return p._id.toString();
}

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
    private readonly cartService: CartService,
  ) {}

  /** Створення замовлення з кошика */
  async create(dto: CreateOrderDto): Promise<Order> {
    const cart = await this.cartModel
      .findOne({ userId: dto.userId })
      .populate('items.product');

    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Кошик порожній');
    }

    /** Перевіряємо наявність товарів */
    for (const item of cart.items) {
      const pid = getProductId(item.product);
      const product = await this.productModel.findById(pid);

      if (!product) {
        throw new NotFoundException(`Товар не знайдено: ${pid}`);
      }

      if (product.stock < item.quantity) {
        throw new BadRequestException(
          `Не вистачає товару "${product.name}". Доступно ${product.stock}, потрібно ${item.quantity}.`
        );
      }
    }

    /** Підготовка items */
    const orderItems = cart.items.map((i) => {
      const pid = getProductId(i.product);

      return {
        product: new Types.ObjectId(pid),
        quantity: i.quantity,
      };
    });

    /** Створюємо замовлення */
    const order = await this.orderModel.create({
      userId: dto.userId,
      items: orderItems,
      totalPrice: cart.totalPrice,
      status: 'pending',
    });

    /** Оновлюємо stock */
    for (const item of cart.items) {
      const pid = getProductId(item.product);
      await this.productModel.findByIdAndUpdate(pid, {
        $inc: { stock: -item.quantity },
      });
    }

    /** Очищення кошика */
    await this.cartService.clearCart(dto.userId);

    return order.populate('items.product');
  }

  /** Усі замовлення користувача */
  async findAll(userId: string): Promise<Order[]> {
    return this.orderModel
      .find({ userId })
      .populate('items.product')
      .sort({ createdAt: -1 });
  }

  /** Одне замовлення */
  async findOne(id: string): Promise<Order> {
    const order = await this.orderModel
      .findById(id)
      .populate('items.product');

    if (!order) {
      throw new NotFoundException('Замовлення не знайдено');
    }

    return order;
  }

  /** Оновити статус */
  async updateStatus(id: string, status: string): Promise<Order> {
    const updated = await this.orderModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updated) {
      throw new NotFoundException('Замовлення не знайдено');
    }

    return updated;
  }
}

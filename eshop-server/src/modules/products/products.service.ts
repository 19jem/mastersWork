import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './schemas/product.schema';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(@InjectModel(Product.name) private productModel: Model<Product>) {}

  async create(dto: CreateProductDto): Promise<Product> {
    return this.productModel.create(dto);
  }

  async findAll(): Promise<Product[]> {
    return this.productModel.find().lean();
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).lean();
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async update(id: string, dto: UpdateProductDto): Promise<Product> {
    const updated = await this.productModel.findByIdAndUpdate(id, dto, { new: true }).lean();
    if (!updated) throw new NotFoundException('Product not found');
    return updated;
  }

  async remove(id: string): Promise<void> {
    const result = await this.productModel.findByIdAndDelete(id);
    if (!result) throw new NotFoundException('Product not found');
  }
}

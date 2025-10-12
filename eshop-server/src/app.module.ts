import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './modules/auth/auth.service';
import { ProductsService } from './modules/products/products.service';
import { CategoriesService } from './modules/categories/categories.service';
import { CartService } from './modules/cart/cart.service';
import { OrdersService } from './modules/orders/orders.service';
import { AdminService } from './modules/admin/admin.service';
import { AuthModule } from './modules/auth/auth.module';
import { AdminController } from './modules/admin/admin.controller';
import { AdminModule } from './modules/admin/admin.module';
import { CartModule } from './modules/cart/cart.module';
import { CategoriesController } from './modules/categories/categories.controller';
import { CategoriesModule } from './modules/categories/categories.module';
import { OrdersModule } from './modules/orders/orders.module';
import { ProductsController } from './modules/products/products.controller';
import { ProductsModule } from './modules/products/products.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), // читає .env
    UsersModule, AuthModule, AdminModule, CartModule, CategoriesModule, OrdersModule, ProductsModule,
    MongooseModule.forRoot(process.env.MONGODB_URI ?? 'mongodb://localhost:27017/master')],
  controllers: [AppController, AdminController, CategoriesController, ProductsController],
  providers: [AppService, AuthService, ProductsService, CategoriesService, CartService, OrdersService, AdminService, AuthModule],
})
export class AppModule {}

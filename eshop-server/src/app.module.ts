import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './modules/auth/auth.service';
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
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), // читає .env
    UsersModule, 
    AuthModule, 
    AdminModule, 
    CartModule, 
    CategoriesModule, 
    OrdersModule, 
    ProductsModule, 
    MongooseModule.forRoot(process.env.MONGODB_URI ?? 'mongodb://localhost:27017/master'),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'), 
      playground: true, 
      sortSchema: true,
    }),
  ],
  controllers: [
    AppController, 
    AdminController, 
    CategoriesController, 
    ProductsController
  ],
  providers: [
    AppService, 
    AuthService,   
    AdminService
  ],
})
export class AppModule {}

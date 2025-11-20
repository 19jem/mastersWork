// src/modules/products/products.resolver.ts
import { Resolver, Query, Mutation, Args, ResolveField, Parent } from "@nestjs/graphql";
import { ProductsService } from "./products.service";
import { ProductType } from "./types/product.type";
import { CreateProductDto } from "./dtos/create-product.dto";
import { UpdateProductDto } from "./dtos/update-product.dto";
import { CategoriesService } from "../categories/categories.service";
import { Product } from "./schemas/product.schema";
import { CategoryType } from "../categories/types/category.type";

@Resolver(() => ProductType)
export class ProductsResolver {
  constructor(
    private readonly productsService: ProductsService,
    private readonly categoriesService: CategoriesService,
  ) {}

  // ========================
  //         QUERIES
  // ========================
  @Query(() => [ProductType], { name: "products" })
  async getProducts() {
    return this.productsService.findAll();
  }

  @Query(() => ProductType, { name: "product" })
  async getProduct(@Args("id") id: string) {
    return this.productsService.findOne(id);
  }

  // ========================
  //       MUTATIONS
  // ========================
  @Mutation(() => ProductType)
  async createProduct(@Args("input") input: CreateProductDto) {
    return this.productsService.create(input);
  }

  @Mutation(() => ProductType)
  async updateProduct(
    @Args("id") id: string,
    @Args("input") input: UpdateProductDto,
  ) {
    return this.productsService.update(id, input);
  }

  @Mutation(() => Boolean)
  async deleteProduct(@Args("id") id: string) {
    await this.productsService.remove(id);
    return true;
  }

  // =========================================
  //        RESOLVE FIELD: category
  //  Повертаємо CategoryType, а не String
  // =========================================
  @ResolveField(() => CategoryType, { name: "category" })
  async resolveCategory(@Parent() product: Product & { category?: any }) {
    const cat = product.category;

    // 1️⃣ Якщо populate повернув об’єкт:
    if (cat && typeof cat === "object" && "_id" in cat) {
      return cat;
    }

    // 2️⃣ Якщо рядок або ObjectId
    const categoryId =
      typeof cat === "string"
        ? cat
        : typeof cat === "object" && cat?.toString
        ? cat.toString()
        : null;

    if (!categoryId) return null;

    // 3️⃣ Отримуємо категорію з БД
    return this.categoriesService.findOne(categoryId);
  }
}


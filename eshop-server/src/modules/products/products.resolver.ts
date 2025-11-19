import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { ProductsService } from "./products.service";
import { Product } from "./schemas/product.schema";
import { CreateProductDto } from "./dtos/create-product.dto";
import { UpdateProductDto } from "./dtos/update-product.dto";

@Resolver(() => Product)
export class ProductsResolver {
    constructor(private readonly productsService: ProductsService) {}

    @Query(() => [Product], {name: 'products'})
    async getProducts() {
        return this.productsService.findAll();
    }

    @Query(() => [Product], {name: 'product'})
    async getProduct(@Args('id') id: string) {
        return this.productsService.findOne(id);
    }

    @Mutation(() => Product)
    async createProduct(@Args('input') input: CreateProductDto) {
        return this.productsService.create(input);
    }

    @Mutation(() => Product)
    async updateProduct(
        @Args('id') id: string,
        @Args('input') input: UpdateProductDto
    ) {
        return this.productsService.update(id, input);
    }

    @Mutation(() => Boolean)
    async deleteProduct(@Args('id') id: string) {
        await this.productsService.remove(id);
        return true;
    }
}

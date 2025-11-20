import { Resolver, Query, Mutation, Args, ID, ResolveField, Parent } from '@nestjs/graphql';
import { CategoriesService } from './categories.service';
import { CategoryType } from './types/category.type';
import { CreateCategoryInput } from './dtos/create-category.input';
import { UpdateCategoryInput } from './dtos/update-category.input'; 
import { Category } from './schemas/category.schema';

@Resolver(() => CategoryType)
export class CategoriesResolver {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Query(() => [CategoryType], { name: 'categories', description: 'Отримати всі категорії' })
  async getCategories() {
    return this.categoriesService.findAll();
  }

  @Query(() => [CategoryType], { name: 'mainCategories', description: 'Отримати головні категорії (без parent)' })
  async getMainCategories() {
    return this.categoriesService.findMain();
  }

  @Query(() => [CategoryType], { name: 'childCategories', description: 'Отримати дочірні категорії' })
  async getChildCategories(@Args('parentId', { type: () => ID }) parentId: string) {
    return this.categoriesService.findChildren(parentId);
  }

  @Query(() => CategoryType, { name: 'category', description: 'Отримати категорію за ID' })
  async getCategory(@Args('id', { type: () => ID }) id: string) {
    return this.categoriesService.findOne(id);
  }

  @Mutation(() => CategoryType, { description: 'Створити нову категорію' })
  async createCategory(@Args('input') input: CreateCategoryInput) {
    return this.categoriesService.create(input);
  }

  @Mutation(() => CategoryType, { description: 'Оновити категорію' })
  async updateCategory(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateCategoryInput,
  ) {
    return this.categoriesService.update(id, input);
  }

  @Mutation(() => Boolean, { description: 'Видалити категорію' })
  async deleteCategory(@Args('id', { type: () => ID }) id: string) {
    await this.categoriesService.remove(id);
    return true;
  }

  // Опціонально: отримати батьківську категорію
  @ResolveField(() => CategoryType, { nullable: true, name: 'parentCategory' })
  async resolveParent(@Parent() category: Category) {
    if (!category.parent) return null;
    return this.categoriesService.findOne(category.parent);
  }

  // Опціонально: отримати дочірні категорії
  @ResolveField(() => [CategoryType], { name: 'children' })
  async resolveChildren(@Parent() category: Category & { _id?: any }) {
    const categoryId = category._id?.toString() || category.parent?.toString();
    if (!categoryId) return [];
    return this.categoriesService.findChildren(categoryId);
  }
}
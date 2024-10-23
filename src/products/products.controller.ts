import { Controller, Get, Post, Body, Patch, Param, Delete, Query, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get('/search')
async findByName(@Query('name') name: string) {
  if (!name) {
    throw new BadRequestException('Name must be provided');
  }

  try {
    return await this.productsService.findByName(name);
  } catch (error) {
    console.error('Error in findByName:', error); 
    throw new InternalServerErrorException('An error occurred while fetching the product.'); 
  }
}

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }

  @Get('/filter/price')
  filterByPrice(@Query('minPrice') minPrice: string, @Query('maxPrice') maxPrice: string){
    return this.productsService.filterByPrice(+minPrice, +maxPrice)
  }

  @Get('/stock/count')
  countTotalStock() {
    return this.productsService.countTotalStock()
  }

 @Patch('/discount/:id')
 applyDiscount(@Param('id') id: string, @Query('discount') discount: string){
  return this.productsService.applyDiscount(+id, +discount)
 }
}

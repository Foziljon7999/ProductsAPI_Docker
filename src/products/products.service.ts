import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { Between } from 'typeorm';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>
  ) {}

 async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create(createProductDto)
    return this.productRepository.save(product);
  }

 async findAll(): Promise<Product[]> {
    return this.productRepository.find();
  }

async findByName(name: string): Promise<Product> {
    console.log('Received name:', name);
    
    if (!name) {
      throw new BadRequestException('Name must be provided');
    }
  
    try {
      const product = await this.productRepository.findOne({ where: { name } });
      console.log('Found product:', product);
      
      if (!product) {
        throw new NotFoundException('Product not found');
      }
      
      return product;
    } catch (error) {
      console.error('Error in findByName service:', error);
      throw new InternalServerErrorException('An error occurred while fetching the product.');
    }
  }
  
 async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id}})
    if(!product) {
      throw new NotFoundException(`Product with id ${id} not found`)
    }
    Object.assign(product, updateProductDto)
    return this.productRepository.save(product);
  }

 async remove(id: number): Promise<void> {
  const result = await this.productRepository.delete(id)
  if(result.affected === 0) {
    throw new NotFoundException(`Product with id ${id} not found`)
  }
  }

async filterByPrice(minPrice: number, maxPrice: number): Promise<Product[]>{
  return this.productRepository.find({
    where: {
      price: Between( minPrice, maxPrice ),
    }
  })
}

async countTotalStock(): Promise<string> {
  const product = await this.productRepository.find()
  const totalStock = product.reduce((total, product) => total + product.quantity, 0);
  return  `Mahsulotning umumiy soni: ${totalStock} ta`
}

async applyDiscount(id: number, discount: number): Promise<{product: Product, message: string}>{
  const product = await this.productRepository.findOne({ where: { id }})
  if(!product) {
    throw new NotFoundException(`Product with id ${id} not found`)
  }
  product.discount = discount
  await this.productRepository.save(product)
  return { message: 'Chegirma muvaffaqiyatli qo\'llandi.', product}
}
}

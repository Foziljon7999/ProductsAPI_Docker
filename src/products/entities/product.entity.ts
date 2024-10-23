import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('product')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('decimal')
  price: number;

  @Column('int')
  quantity: number;

  @Column({ default: 0})
  discount: number
}

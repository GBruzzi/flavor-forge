import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany
} from 'typeorm';

import { Recipe } from '../../recipe/entities/recipe.entity';

@Entity('users') 
export class User {
  @PrimaryGeneratedColumn() // Gera um número autoincrementado automaticamente
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ unique: true, length: 255 }) 
  email: string;

  @Column()
  password: string;

  @CreateDateColumn({ name: 'created_at' }) 
  createdAt: Date;

  @OneToMany(() => Recipe, (recipe) => recipe.user)
  recipes: Recipe[];
}
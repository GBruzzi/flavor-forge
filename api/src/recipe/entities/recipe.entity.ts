import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity('recipes')
export class Recipe {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.recipes, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  ingredients: string; 

  @Column({ type: 'text' })
  instructions: string;

  @Column({ type: 'int', name: 'prep_time' })
  prepTime: number;

  @Column({
    type: 'enum',
    enum: ['Fácil', 'Médio', 'Difícil'],
  })
  difficulty: 'Fácil' | 'Médio' | 'Difícil';

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' }) // soft delete
  deletedAt: Date | null;
}

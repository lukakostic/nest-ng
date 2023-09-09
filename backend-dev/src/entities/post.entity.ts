import {User} from './user.entity'
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity()
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn()
  public userId!: User;
  
  
  @Column({ length: 100 })
  title: string;
  
  @Column()
  text: string;

  @Column("text", { array: true })
  images: string[];
}

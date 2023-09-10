import {User} from './user.entity'
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Column, Unique, BaseEntity } from 'typeorm';

@Entity()
export class PostM extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn()
  public user!: User;
  
  @Column({type: 'integer'})
  timestamp: number;
  
  
  @Column({ length: 100 })
  title: string;
  
  @Column()
  text: string;

  @Column("text", { array: true })
  images: string[];
  
}

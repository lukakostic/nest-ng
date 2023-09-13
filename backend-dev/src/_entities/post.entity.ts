import {User} from './user.entity'
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Column, Unique, BaseEntity } from 'typeorm';

@Entity()
export class PostM extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, user => user.posts, { nullable: false })
  //@JoinColumn()
  public user!: User;
  
  @Column({type: 'bigint'})
  timestamp: number;
  
  
  @Column({ length: 100 })
  title: string;
  
  @Column()
  text: string;

  @Column("text", { array: true })
  images: string[];
  
}

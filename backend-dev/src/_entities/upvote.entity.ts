import {User} from './user.entity'
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Column, Unique, BaseEntity } from 'typeorm';

@Entity()
export class Upvote  extends BaseEntity{
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn()
  public user!: User;

  @Column()
  replyToId: string; //uuid
  @Column()
  replyType: string; // 'comment' or 'post'

  @Column()
  public positive: boolean;
}

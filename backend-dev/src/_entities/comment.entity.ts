import {User} from './user.entity'
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Column, Unique, BaseEntity } from 'typeorm';

@Entity()
export class CommentM  extends BaseEntity{
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn()
  public user!: User;

  @Column({type: 'integer'})
  timestamp: number;

  @Column()
  replyToId: string; //uuid
  @Column()
  replyType: string; // 'comment' or 'post'

  @Column()
  text: string;
}

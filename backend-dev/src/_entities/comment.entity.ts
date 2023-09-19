import {User} from './user.entity'
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Column, Unique, BaseEntity } from 'typeorm';

@Entity()
export class CommentM  extends BaseEntity{
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, u=>u.comments, { nullable: false, onDelete: 'CASCADE', cascade: true  })
  public user!: User;

  @Column({type: 'bigint'})
  timestamp: number;

  @Column()
  replyToId: string; //uuid
  @Column()
  replyType: string; // 'comment' or 'post'

  @Column()
  text: string;
}

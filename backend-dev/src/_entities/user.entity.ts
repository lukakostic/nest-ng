import { Entity, PrimaryGeneratedColumn, Column, Unique, BaseEntity, OneToMany } from 'typeorm';
import { Following } from './following.entity';
import { PostM } from './post.entity';
import { CommentM } from './comment.entity';
@Entity()
@Unique(['username', 'email']) // Ensure username and email are unique
export class User  extends BaseEntity{
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({type: 'bigint'})
  timestamp: number; //joined

  @Column({ length: 50 })
  username: string;

  @Column({ length: 100 })
  email: string;

  @Column()
  password: string;

  @Column()
  description: string;
  
  @OneToMany(() => Following, (fol) => fol.from)
  following: Following[];
  
  @OneToMany(() => Following, (fol) => fol.to)
  followers: Following[];

  @OneToMany(() => PostM, (post) => post.user)
  posts: PostM[];

  @OneToMany(() => CommentM, (cpost) => cpost.user)
  comments: CommentM[];
  
}

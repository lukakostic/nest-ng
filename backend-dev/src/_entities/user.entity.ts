import { Entity, PrimaryGeneratedColumn, Column, Unique, BaseEntity, OneToMany } from 'typeorm';
import { Following } from './following.entity';
import { PostM } from './post.entity';
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
  
  @OneToMany(() => Following, (fol) => fol.from, { onDelete: 'CASCADE', cascade: true })
  following: Following[];
  
  @OneToMany(() => Following, (fol) => fol.to, { onDelete: 'CASCADE', cascade: true })
  followers: Following[];

  @OneToMany(() => PostM, (post) => post.user, { onDelete: 'CASCADE', cascade: true })
  posts: PostM[];
  
}

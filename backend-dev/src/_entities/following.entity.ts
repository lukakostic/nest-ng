import {User} from './user.entity'
import { Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, Column, Unique, BaseEntity } from 'typeorm';

@Entity()
export class Following extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, (user)=>user.following, { nullable: false,  onDelete: 'CASCADE', cascade: true  })
  //@JoinColumn()
  public from!: User;
  
  @ManyToOne(() => User, (user)=>user.followers, { nullable: false, onDelete: 'CASCADE', cascade: true  })
  //@JoinColumn()
  public to!: User;
  
  @Column({type: 'bigint'})
  timestamp: number;
  
}

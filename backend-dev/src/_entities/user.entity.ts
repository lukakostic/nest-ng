import { Entity, PrimaryGeneratedColumn, Column, Unique, BaseEntity } from 'typeorm';

@Entity()
@Unique(['username', 'email']) // Ensure username and email are unique
export class User  extends BaseEntity{
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({type: 'integer'})
  timestamp: number; //joined

  @Column({ length: 50 })
  username: string;

  @Column({ length: 100 })
  email: string;

  @Column({ length: 50 })
  password: string;
}

import { IsNotEmpty } from 'class-validator';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UsersEntity } from './Users.entity';

@Entity({ name: 'wallets' })
export class WalletsEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @IsNotEmpty()
  @CreateDateColumn()
  public created_at: Date;

  @IsNotEmpty()
  @UpdateDateColumn()
  public updated_at: Date;

  @Column({
    type: 'decimal',
    nullable: false,
  })
  balance: number;

  @Column({
    type: 'decimal',
    nullable: false,
  })
  previous_balance: number;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  reference: string;

  @Column({
    type: 'varchar',
    nullable: true,
    length: 10,
  })
  wallet_id: string;

  @JoinColumn({ name: 'user_id' })
  @OneToOne(() => UsersEntity, (user) => user.wallet, {
    eager: false,
  })
  user: UsersEntity;
}

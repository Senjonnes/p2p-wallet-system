import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import { UsersEntity } from './Users.entity';
import { TransactionStatus } from 'src/enum/TransactionStatus.enum';

@Entity({ name: 'transactions' })
export class TransactionsEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @IsNotEmpty()
  @CreateDateColumn()
  public created_at: Date;

  @IsNotEmpty()
  @UpdateDateColumn()
  public updated_at: Date;

  @JoinColumn({ name: 'user_id' })
  @ManyToOne(() => UsersEntity, (user) => user.transactions, {
    eager: false,
  })
  user: UsersEntity;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  payment_ref: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  payment_gateway: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  payment_order_id: string;

  @Column({
    type: 'enum',
    enum: TransactionStatus,
    nullable: false,
  })
  transaction_status: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  payment_mode: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  account_to_credit: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  account_to_debit: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  transaction_date: Date;

  @Column({
    type: 'decimal',
    nullable: false,
  })
  amount: number;
}

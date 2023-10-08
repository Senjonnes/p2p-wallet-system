import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { IsNotEmpty } from 'class-validator';
import * as Handlers from '../constants/handlers';
import { WalletsEntity } from './Wallets.entity';
import { AccessLogEntity } from './AccessLogs.entity';
import { TransactionsEntity } from './Transactions.entity';

@Entity({ name: 'users' })
export class UsersEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @IsNotEmpty()
  @CreateDateColumn()
  public created_at: Date;

  @IsNotEmpty()
  @UpdateDateColumn()
  public updated_at: Date;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ type: 'varchar', nullable: false })
  first_name: string;

  @Column({ type: 'varchar', nullable: false })
  last_name: string;

  @Column({ type: 'boolean', nullable: false })
  is_terms_condition_checked: boolean;

  @Column({ type: 'date', nullable: false })
  dob: Date;

  @Column({ type: 'varchar', nullable: false })
  phone_number: string;

  @Column({ type: 'varchar', nullable: false })
  address: string;

  @Column({ type: 'varchar', nullable: false })
  password: string;

  @Column({ type: 'timestamp', nullable: true, default: () => 'null' })
  last_login_timestamp: Date;

  @Column({ type: 'timestamp', nullable: true, default: () => 'null' })
  last_password_change: Date;

  @Column({ type: 'timestamp', nullable: true, default: () => 'null' })
  last_failed_login: Date;

  @Column({ default: 0 })
  failed_login_attempts: number;

  @Column({ default: false })
  locked_out: boolean;

  @Column({ default: false })
  is_verified: boolean;

  @Column({ nullable: true })
  verification_token: string;

  @Column({ default: true })
  is_active: boolean;

  @Column()
  salt: string;

  @Column({ type: 'varchar', nullable: true })
  verification_code: string;

  @Column({ type: 'bigint', nullable: true })
  verification_time: number;

  @Column({ type: 'varchar', nullable: true })
  pin: string;

  @Column({ default: false })
  has_pin: boolean;

  @OneToMany(() => AccessLogEntity, (access_log) => access_log.user, {
    eager: false,
  })
  access_logs: AccessLogEntity[];

  @OneToOne(() => WalletsEntity, (wallet) => wallet.user, {
    eager: false,
  })
  wallet: WalletsEntity;

  @OneToMany(() => TransactionsEntity, (transactions) => transactions.user, {
    eager: false,
  })
  transactions: TransactionsEntity[];

  @BeforeInsert()
  public normalizeEmail(): void {
    this.email = this.email.toLowerCase();
  }

  @BeforeInsert()
  public normalizeNames(): void {
    this.first_name = Handlers.titleCase(this.first_name);
    this.last_name = Handlers.titleCase(this.last_name);
  }

  async fullName(): Promise<string> {
    const name = `${Handlers.titleCase(this.first_name)} ${Handlers.titleCase(
      this.last_name,
    )}`;
    return name;
  }

  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
  }
}

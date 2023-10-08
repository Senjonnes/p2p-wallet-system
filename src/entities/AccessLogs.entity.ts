import { IsNotEmpty } from 'class-validator';
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
import { UsersEntity } from './Users.entity';

@Entity({ name: 'access_logs' })
export class AccessLogEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @IsNotEmpty()
  @CreateDateColumn()
  public created_at: Date;

  @IsNotEmpty()
  @UpdateDateColumn()
  public updated_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  login_timestamp: Date;

  @JoinColumn()
  @ManyToOne(() => UsersEntity, (user) => user.access_logs, {
    eager: false,
  })
  user: UsersEntity;

  @Column()
  is_successful_login: boolean;
}

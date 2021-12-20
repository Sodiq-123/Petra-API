import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsEmail, IsNotEmpty } from 'class-validator';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @Column({ name: 'firstname', type: 'varchar', length: 20 })
  firstname: string;

  @Column({ name: 'lastname', type: 'varchar', length: 50 })
  lastname: string;

  @Column({ name: 'email', unique: true, type: 'varchar', length: 50 })
  @IsEmail({}, { message: 'Must be a valid mail' })
  @IsNotEmpty({ message: 'Your Email is required' })
  email: string;

  @Column({ name: 'password' })
  password: string;

  @Column({ name: 'customer_reference', type: 'varchar' })
  customer_reference: string;

  @Column({ name: 'wallets', type: 'jsonb', nullable: false, default: [] })
  wallets: IWallet[];

  toJSON() {
    return {
      id: this.id,
      firstname: this.firstname,
      lastname: this.lastname,
      email: this.email,
      customer_reference: this.customer_reference,
      wallets: this.wallets,
    };
  }
}

export interface IWallet {
  walletType: WalletType;
  address: string;
  balance: number;
}

export type WalletType =
  | 'BTC'
  | 'ETH'
  | 'LTC'
  | 'BSC'
  | 'TRON'
  | 'BNB'
  | 'ETH_NGNT'
  | 'BCH'
  | 'XRP'
  | 'XLM'
  | 'ETH_BUSD'
  | 'ETH_USDC'
  | 'ETH_USDT';

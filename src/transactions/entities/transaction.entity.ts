import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Transaction extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'transactionId' })
  transactionId: string;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @Column({ name: 'amount' })
  amount: number;

  @Column({ name: 'fee' })
  fee: number;

  @Column({ name: 'slug' })
  slug: string;

  @Column({ name: 'amount_to_send' })
  amount_to_send: number;

  @Column({ name: 'deposit_address' })
  deposit_address: string;

  @Column({ name: 'currency_to_send' })
  currency_to_send: string;

  @Column({ name: 'reference', unique: true })
  reference: string;

  @Column({ name: 'status', enum: ['pending', 'success', 'failed'] })
  status: string;

  @Column({ name: 'type', enum: ['sent', 'received', 'fund'] })
  type: string;

  @Column({ name: 'email' })
  email: string;

  @Column({ name: 'customer_reference' })
  customer_reference: string;

  // user Id
  @Column({ name: 'user_id' })
  userId: number;

  toJSON() {
    return {
      transactionId: this.transactionId,
      amount: this.amount,
      fee: this.fee,
      slug: this.slug,
      amount_to_send: this.amount_to_send,
      deposit_address: this.deposit_address,
      currency_to_send: this.currency_to_send,
      reference: this.reference,
      status: this.status,
      email: this.email,
      customer_reference: this.customer_reference,
    };
  }
}

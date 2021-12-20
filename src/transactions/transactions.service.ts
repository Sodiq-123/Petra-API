import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, WalletType } from 'src/users/entities/user.entity';
import { Billing } from 'src/utils/petra.utils';
import { Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionModel: Repository<Transaction>,
    @InjectRepository(User)
    private readonly userModel: Repository<User>,
    private readonly billing: Billing,
  ) {}

  async initiateTransaction(
    userId: number,
    amount: number,
    type: WalletType,
  ): Promise<{ data: Transaction; message: string; status: boolean }> {
    const user = await this.userModel.findOne(userId);
    type = type.toUpperCase() as WalletType;
    if (!user) {
      throw new NotFoundException({
        status: false,
        error: 'User not found',
      });
    }
    const walletExists = user.wallets.find(
      (wallet) => wallet.walletType === type,
    );
    if (!walletExists) {
      throw new BadRequestException({
        status: false,
        error:
          'You do not have an address for this wallet, generate your wallet address first',
      });
    }
    const { error, data: initializeTransactionResult } =
      await this.billing.initializeTransaction(user.email, amount, type);
    if (error) {
      throw new BadRequestException({
        status: false,
        error: error.message,
      });
    }
    const transaction = this.transactionModel.create({
      userId,
      amount: initializeTransactionResult.data.amount,
      reference: initializeTransactionResult.data.reference,
      status: initializeTransactionResult.data.status,
      amount_to_send: initializeTransactionResult.data.amount,
      currency_to_send: initializeTransactionResult.data.currency_to_send,
      fee: initializeTransactionResult.data.fee,
      customer_reference:
        initializeTransactionResult.data.customer.customer_reference,
      email: user.email,
      deposit_address: initializeTransactionResult.data.deposit_address,
      type: 'fund',
      slug: initializeTransactionResult.data.slug,
      transactionId: initializeTransactionResult.data.id,
    });

    await this.transactionModel.save(transaction);
    return {
      data: transaction,
      status: true,
      message: 'Transaction initiated successfully',
    };
  }

  async verifyTransaction(
    reference: string,
    userId: number,
  ): Promise<{ data: Transaction; message: string; status: boolean }> {
    const user = await this.userModel.findOne(userId);
    if (!user) {
      throw new NotFoundException({
        status: false,
        error: 'User not found',
      });
    }
    const transaction = await this.transactionModel.findOne({
      where: { reference, userId: user.id },
    });
    if (!transaction) {
      throw new NotFoundException({
        status: false,
        error: 'Transaction not found',
      });
    }
    const { error, data: verifyTransactionResult } =
      await this.billing.verifyTransaction(reference);
    if (error) {
      throw new BadRequestException({
        status: false,
        error: error.message,
      });
    }
    transaction.status = verifyTransactionResult.data.status;
    transaction.amount = verifyTransactionResult.data.amount;
    transaction.fee = verifyTransactionResult.data.fee;
    await this.transactionModel.save(transaction);
    return {
      data: transaction,
      status: true,
      message: 'Transaction verified successfully',
    };
  }
}

import { WalletType } from '../../users/entities/user.entity';

export class CreateTransactionDto {
  email: string;
  amount: number;
  type: WalletType;
}

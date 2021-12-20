import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User, WalletType } from './entities/user.entity';
import { Billing } from '../utils/petra.utils';
import { BadRequestException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userModel: Repository<User>,
    private readonly billing: Billing,
  ) {}
  async generateWallet(walletType: WalletType, userId: number): Promise<User> {
    const user = await this.userModel.findOne(userId);
    if (!user) {
      throw new NotFoundException({
        status: false,
        error: 'User not found',
      });
    }
    walletType = walletType.toUpperCase() as WalletType;
    const generateWalletResult = await this.billing.generateWalletAddress(
      walletType,
    );
    if (generateWalletResult.error) {
      throw new BadRequestException({
        status: false,
        error: generateWalletResult.error.message,
      });
    }
    if (!generateWalletResult.data || !generateWalletResult.data.status) {
      throw new BadRequestException({
        status: false,
        error: 'Something went wrong',
      });
    }
    const walletAddress = generateWalletResult.data.data.address;
    const walletExists = user.wallets.find(
      (wallet) => wallet.walletType === walletType,
    );
    if (walletExists) {
      user.wallets = user.wallets.map((wallet) => {
        if (wallet.walletType === walletType) {
          wallet.address = walletAddress;
          wallet.walletType = walletType;
        }
        return wallet;
      });
    } else {
      user.wallets.push({
        walletType,
        address: walletAddress,
        balance: 0,
      });
    }
    return this.userModel.save(user);
  }

  findAll(): Promise<User[]> {
    return this.userModel.find();
  }

  findOne(id: number): Promise<User> {
    return this.userModel.findOne(id);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userModel.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.userModel.update(id, updateUserDto);
    return this.userModel.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.userModel.remove(user);
  }
}

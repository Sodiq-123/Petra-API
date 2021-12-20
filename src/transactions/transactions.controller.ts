import {
  Controller,
  Post,
  Body,
  Param,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { JwtAuthGuard } from '../auth/guards/user.guard';
import { AuthDecorator } from 'src/auth/decorators/user.decorator';
import { WalletType } from 'src/users/entities/user.entity';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('initiate')
  async create(
    @AuthDecorator() user: any,
    @Body() body: { amount: number; type: WalletType },
  ) {
    return await this.transactionsService.initiateTransaction(
      user.id,
      body.amount,
      body.type,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/verify')
  @HttpCode(200)
  async verifyTransaction(
    @AuthDecorator() user: any,
    @Param('id') reference: string,
  ) {
    return await this.transactionsService.verifyTransaction(reference, user.id);
  }

  // @Get()
  // findAll() {
  //   return this.transactionsService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.transactionsService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateTransactionDto: UpdateTransactionDto) {
  //   return this.transactionsService.update(+id, updateTransactionDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.transactionsService.remove(+id);
  // }
}

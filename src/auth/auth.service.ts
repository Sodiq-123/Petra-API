import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnprocessableEntityException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { SignUpDto, LoginDto } from './dto/create-auth.dto';
import { Billing } from '../utils/petra.utils';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userModel: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly billing: Billing,
  ) {}

  async signUp(
    signUpDto: SignUpDto,
  ): Promise<{ data: any; status: boolean; message: string }> {
    const userExist = await this.userModel.findOne({ email: signUpDto.email });
    if (userExist) {
      throw new UnprocessableEntityException({
        status: false,
        error: 'Email is in use',
      });
    }
    const petraUser = await this.billing.createCustomer({
      email: signUpDto.email,
      first_name: signUpDto.firstname,
      last_name: signUpDto.lastname,
    });

    if (!petraUser) {
      throw new InternalServerErrorException('Something went wrong');
    }

    const newUser = this.userModel.create({
      email: signUpDto.email,
      firstname: signUpDto.firstname,
      lastname: signUpDto.lastname,
      password: await this.hashPassword(signUpDto.password),
      customer_reference: petraUser.data.data.customer_reference,
    });
    await this.userModel.save(newUser);
    return {
      data: newUser.toJSON(),
      message: 'User created succesbj sfully',
      status: true,
    };
  }

  async login(loginDto: LoginDto) {
    // check user exist
    const user = await this.userModel.findOne({ email: loginDto.email });
    if (!user) {
      throw new UnprocessableEntityException({
        status: false,
        error: 'Invalid email or password',
      });
    }
    const checkPassword = await this.checkPasswordMatch(
      loginDto.password,
      user.password,
    );

    if (!checkPassword) {
      throw new UnprocessableEntityException({
        status: false,
        error: 'Invalid email or password',
      });
    }

    try {
      const token = await this.jwtService.signAsync(user.toJSON());
      return {
        status: true,
        message: 'User login successfully',
        data: {
          user: user.toJSON(),
          token,
        },
      };
    } catch (error) {
      throw new InternalServerErrorException({
        status: false,
        error: error.message,
      });
    }
  }

  async checkPasswordMatch(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  async hashPassword(plainPassword: string): Promise<string> {
    return bcrypt.hash(plainPassword, 10);
  }
}

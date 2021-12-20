import { Injectable } from '@nestjs/common';
import {
  getRequest,
  IResponse,
  postRequest,
  putRequest,
} from './request.utils';

@Injectable()
export class Billing {
  private readonly paymentGatewayBaseUrl: string;
  private readonly authToken: string;
  private readonly headers: IPetraHeaders;
  private readonly acceptedCoins: string[];
  constructor() {
    this.paymentGatewayBaseUrl = 'https://petra-dev-api.herokuapp.com';
    this.authToken = 'sk_test_H7w7MvJyI7gHFBeCEvpktRcj7LRnyV84';
    this.headers = {
      Authorization: `Bearer ${this.authToken}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    this.acceptedCoins = [
      'BTC',
      'ETH',
      'LTC',
      'BSC',
      'TRON',
      'BNB',
      'ETH_NGNT',
      'BCH',
      'XRP',
      'XLM',
      'ETH_BUSD',
      'ETH_USDC',
      'ETH_USDT',
    ];
  }

  // Customers
  async createCustomer(
    data: CreateCustomer,
  ): Promise<IResponse<CreateCustomerResponse>> {
    const createCustomerResult = await postRequest<CreateCustomerResponse>(
      `${this.paymentGatewayBaseUrl}/customer`,
      data,
      this.headers,
    );
    if (
      createCustomerResult.error ||
      !createCustomerResult.data ||
      !createCustomerResult.data.status
    ) {
      const error = createCustomerResult.error
        ? createCustomerResult.error
        : new Error(createCustomerResult.data.message);
      return { error };
    }
    return createCustomerResult;
  }

  async listCustomers(page = 1, perPage = 50): Promise<IResponse<IPetraUsers>> {
    const fetchCustomersResult = await getRequest<IPetraUsers>(
      `${this.paymentGatewayBaseUrl}/customer?page=${page}&perPage=${perPage}`,
      this.headers,
    );
    if (fetchCustomersResult.error) {
      return { error: fetchCustomersResult.error };
    }
    if (!fetchCustomersResult.data.status) {
      return { error: new Error(fetchCustomersResult.data.message) };
    }
    return {
      data: fetchCustomersResult.data,
    };
  }

  async fetchCustomer(
    email?: string,
    custRef?: string,
  ): Promise<IResponse<CreateCustomerResponse>> {
    let url = '';
    if (!email && !custRef) {
      return {
        error: new Error('Email or Customer Reference needs to be passed'),
      };
    }
    if (email) {
      url = `/customer/${encodeURIComponent(email)}`;
    }
    if (custRef) {
      url = `/customer/${custRef}`;
    }
    const fetchCustomerResult = await getRequest<CreateCustomerResponse>(
      `${this.paymentGatewayBaseUrl}${url}`,
      this.headers,
    );
    if (fetchCustomerResult.error) {
      return { error: fetchCustomerResult.error };
    }
    if (!fetchCustomerResult.data.status) {
      return {
        error: new Error(fetchCustomerResult.data.message),
      };
    }
    return {
      data: fetchCustomerResult.data,
    };
  }

  async updateCustomer(
    reference: string,
    first_name: string,
    last_name: string,
  ): Promise<IResponse<CreateCustomerResponse>> {
    const updateCustomerResult = await putRequest<CreateCustomerResponse>(
      `${this.paymentGatewayBaseUrl}/customer/${reference}`,
      {
        first_name,
        last_name,
      },
      this.headers,
    );
    if (updateCustomerResult.error) {
      return { error: updateCustomerResult.error };
    }
    if (!updateCustomerResult.data.status) {
      return {
        error: new Error(updateCustomerResult.data.message),
      };
    }
    return {
      data: updateCustomerResult.data,
    };
  }
  // Wallet
  async generateWalletAddress(
    walletType: string,
  ): Promise<IResponse<GenerateAddressResponse>> {
    walletType = walletType.toUpperCase();
    if (!this.acceptedCoins.includes(walletType)) {
      return {
        error: new Error(`${walletType} is not supported`),
      };
    }
    const generateAddressResult = await postRequest<GenerateAddressResponse>(
      `${this.paymentGatewayBaseUrl}/address`,
      { type: walletType },
      this.headers,
    );
    if (generateAddressResult.error) {
      return { error: generateAddressResult.error };
    }
    if (!generateAddressResult.data.status) {
      return {
        error: new Error(generateAddressResult.data.message),
      };
    }
    return {
      data: generateAddressResult.data,
    };
  }

  async getWalletAddress(
    custRef: string,
  ): Promise<IResponse<GenerateAddressResponse>> {
    const getAddressResult = await getRequest<GenerateAddressResponse>(
      `${this.paymentGatewayBaseUrl}/address/${custRef}`,
      this.headers,
    );
    if (getAddressResult.error) {
      return { error: getAddressResult.error };
    }
    if (!getAddressResult.data.status) {
      return {
        error: new Error(getAddressResult.data.message),
      };
    }
    return {
      data: getAddressResult.data,
    };
  }

  async initializeTransaction(
    email: string,
    amount: number,
    walletType: string,
  ): Promise<IResponse<IPetraTransaction>> {
    walletType = walletType.toUpperCase();
    if (!this.acceptedCoins.includes(walletType)) {
      return {
        error: new Error(`${walletType} is not supported`),
      };
    }
    const initializeTransactionResult = await postRequest<IPetraTransaction>(
      `${this.paymentGatewayBaseUrl}/transaction/initialize`,
      {
        type: walletType,
        email,
        amount,
      },
      this.headers,
    );
    if (initializeTransactionResult.error) {
      return { error: initializeTransactionResult.error };
    }
    if (!initializeTransactionResult.data.status) {
      return {
        error: new Error(initializeTransactionResult.data.message),
      };
    }
    return {
      data: {
        status: initializeTransactionResult.data.status,
        message: initializeTransactionResult.data.message,
        data: {
          id: initializeTransactionResult.data.data.id,
          amount: initializeTransactionResult.data.data.amount,
          fee: initializeTransactionResult.data.data.fee,
          slug: initializeTransactionResult.data.data.slug,
          amount_to_send: initializeTransactionResult.data.data.amount_to_send,
          deposit_address:
            initializeTransactionResult.data.data.deposit_address,
          currency_to_send:
            initializeTransactionResult.data.data.currency_to_send,
          reference: initializeTransactionResult.data.data.reference,
          status: initializeTransactionResult.data.data.status,
          customer: {
            email: initializeTransactionResult.data.data.customer.email,
            customer_reference:
              initializeTransactionResult.data.data.customer.customer_reference,
          },
        },
      },
    };
  }

  async verifyTransaction(
    reference: string,
  ): Promise<IResponse<IPetraTransaction>> {
    const verifyTransactionResult = await getRequest<IPetraTransaction>(
      `${this.paymentGatewayBaseUrl}/transaction/verify/${reference}`,
      this.headers,
    );
    if (verifyTransactionResult.error) {
      return { error: verifyTransactionResult.error };
    }
    if (!verifyTransactionResult.data.status) {
      return {
        error: new Error(verifyTransactionResult.data.message),
      };
    }
    return {
      data: verifyTransactionResult.data,
    };
  }
}

interface IPetraHeaders {
  Authorization: string;
  Accept: string;
  'Content-Type': string;
}

interface CreateCustomer {
  email: string;
  first_name: string;
  last_name: string;
}
interface IPetraUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  integration: string;
  domain: string;
  customer_reference: string;
  createdAt: Date;
  updatedAt: Date;
}

interface CreateCustomerResponse {
  status: boolean;
  message: string;
  data: IPetraUser;
}

interface IPetraUsers {
  status: boolean;
  message: string;
  data: IPetraUser[];
}

interface GenerateAddressResponse {
  status: boolean;
  message: string;
  data: {
    id: string;
    address: string;
    integration: string;
    domain: string;
    currency_symbol: string;
    reference: string;
    memo: string;
    destination_tag: null;
    createdAt: Date;
    updatedAt: Date;
  };
}

interface IPetraTransaction {
  status: boolean;
  message: string;
  data: {
    id: string;
    amount: number;
    fee: number;
    slug: string;
    amount_to_send: number;
    deposit_address: string;
    currency_to_send: string;
    reference: string;
    status: string;
    customer: {
      email: string;
      customer_reference: string;
    };
  };
}

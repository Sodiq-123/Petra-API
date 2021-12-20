import axios from 'axios';

export async function getRequest<T>(
  url: string,
  headers?: any,
): Promise<IResponse<T>> {
  try {
    const response = await axios.get<T>(url, { headers });
    return {
      data: response.data,
    };
  } catch (error) {
    return {
      error: new Error(error.message),
    };
  }
}

export async function postRequest<T>(
  url: string,
  data: any,
  headers?: any,
): Promise<IResponse<T>> {
  try {
    const response = await axios.post(url, data, { headers });
    if (response.status < 400) {
      return {
        data: response.data,
      };
    }
    return {
      error: new Error(response.data.message),
    };
  } catch (error) {
    return {
      error: new Error(error.message),
    };
  }
}

export async function putRequest<T>(
  url: string,
  data: any,
  headers?: any,
): Promise<IResponse<T>> {
  try {
    const response = await axios.put(url, data, headers);
    if (response.status < 400) {
      return {
        data: response.data,
      };
    }
    return {
      error: new Error(response.data.message),
    };
  } catch (error) {
    return {
      error: new Error(error.message),
    };
  }
}

export type IResponse<T> =
  | {
      data?: T;
      error: Error;
    }
  | {
      data: T;
      error?: Error;
    };

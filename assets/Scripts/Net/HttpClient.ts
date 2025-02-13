// HttpClient.ts

import { LogManager } from '../Core/LogManager';
import { Constants } from '../Global/Constants';
import { CreateUserResponse, LoginDataResponse, UserData } from './NetApi';

class HttpClient {
  private static instance: HttpClient;

  private constructor() {}

  public static getInstance(): HttpClient {
    if (!HttpClient.instance) {
      HttpClient.instance = new HttpClient();
    }
    return HttpClient.instance;
  }

  // 统一封装的 fetch 请求方法
  private async request<T>(url: string, options: RequestInit): Promise<T | null> {
    try {
      const response = await fetch(Constants.BASE_URL + url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });
      if (!response.ok) {
        const errorText = await response.text();
        LogManager.error(`Error: ${response.status}, ${errorText}`);
        throw new Error(`Network response was not ok: ${response.status}`);
      }
      const rspData = await response.json();
      if (rspData.statusCode !== 200) {
        throw new Error(`${rspData.message}`);
      }
      return rspData as T;
    } catch (error) {
      LogManager.error('Fetch error:', error);
      throw error;
    }
  }
  // 创建用户
  async createUser(userName: string): Promise<CreateUserResponse | null> {
    return this.request<CreateUserResponse>('/users', {
      method: 'POST',
      body: JSON.stringify({ name: userName }),
    });
  }
  // 获取所有用户
  public async getUsers(): Promise<any | null> {
    return this.request<any>('/users', {
      method: 'GET',
    });
  }
  // 获取单个用户
  public async getUser(userName: string): Promise<LoginDataResponse | null> {
    return this.request<LoginDataResponse>(`/login?name=${userName}`, {
      method: 'GET',
    });
  }
  // 更新用户数据
  async updateUser(id: string, updateData: Partial<UserData>): Promise<any | null> {
    return this.request<any>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  }
  // 删除用户
  async deleteUser(id: string): Promise<boolean> {
    const result = await this.request<null>(`/users/${id}`, {
      method: 'DELETE',
    });
    return result !== null;
  }
}

export default HttpClient;

// HttpClient.ts

import { BASE_URL } from "../Global/StaticData";
import { UserData } from "./NetApi";

class HttpClient {
  private static instance: HttpClient;

  private constructor() {}

  public static getInstance(): HttpClient {
    if (!HttpClient.instance) {
      HttpClient.instance = new HttpClient();
    }
    return HttpClient.instance;
  }

  async createUser(userData: UserData): Promise<any> {
    try {
      const response = await fetch(BASE_URL + "/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      return data; // 返回创建的用户数据
    } catch (error) {
      console.error("Fetch error:", error);
      return null;
    }
  }

  // 获取所有用户
  public async getUsers(): Promise<any> {
    try {
      const response = await fetch(BASE_URL + "/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      return data; // 返回 JSON 数据
    } catch (error) {
      console.error("Fetch error:", error);
      return null;
    }
  }

  // 获取单个用户
  public async getUser(id: number): Promise<any> {
    try {
      const response = await fetch(BASE_URL + `/users/${id.toString()}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text(); // 获取详细的错误信息
        console.error(`Error: ${response.status}, ${errorText}`);
        throw new Error(`Network response was not ok: ${response.status}`);
      }

      const data = await response.json();
      return data; // 返回 JSON 数据
    } catch (error) {
      console.error("Fetch error:", error);
      return null;
    }
  }

  // 更新用户数据
  async updateUser(id: string, updateData:Partial<UserData>): Promise<any> {
    try {
      const response = await fetch(BASE_URL + `/users/${id.toString()}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      return data; // 返回更新后的用户数据
    } catch (error) {
      console.error("Fetch error:", error);
      return null;
    }
  }

  // 删除用户
  async deleteUser(id: string): Promise<boolean> {
    try {
      const response = await fetch(BASE_URL + `/users/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      return true; // 返回成功标志
    } catch (error) {
      console.error("Fetch error:", error);
      return false; // 失败标志
    }
  }
}

export default HttpClient;

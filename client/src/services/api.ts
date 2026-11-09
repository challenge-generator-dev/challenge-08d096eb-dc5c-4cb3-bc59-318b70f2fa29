import axios, { AxiosError, AxiosRequestConfig } from 'axios';

const API_BASE_URL = 'http://localhost:3000';

interface Order {
  id: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: unknown;
}

interface CreateOrderDto {
  status: string;
  customerId?: string;
  items?: Array<{ productId: string; quantity: number }>;
}

interface UpdateOrderDto {
  status?: string;
  customerId?: string;
  items?: Array<{ productId: string; quantity: number }>;
}

interface ApiError {
  message: string;
  code?: string;
  details?: unknown;
}

class ApiService {
  private client = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  constructor() {
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiError>) => {
        const message = error.response?.data?.message 
          ?? error.message 
          ?? 'An unexpected error occurred';
        const apiError = new Error(message) as Error & { code?: string; details?: unknown };
        apiError.code = error.response?.data?.code;
        apiError.details = error.response?.data?.details;
        return Promise.reject(apiError);
      }
    );
  }

  async createOrder(data: CreateOrderDto): Promise<Order> {
    const config: AxiosRequestConfig<CreateOrderDto> = {
      method: 'POST',
      url: '/orders',
      data,
    };
    const response = await this.client.request<Order>(config);
    return response.data;
  }

  async getOrders(): Promise<Order[]> {
    const response = await this.client.get<Order[]>('/orders');
    return response.data;
  }

  async getOrder(id: string): Promise<Order> {
    const response = await this.client.get<Order>(`/orders/${id}`);
    return response.data;
  }

  async updateOrder(id: string, data: UpdateOrderDto): Promise<Order> {
    const config: AxiosRequestConfig<UpdateOrderDto> = {
      method: 'PUT',
      url: `/orders/${id}`,
      data,
    };
    const response = await this.client.request<Order>(config);
    return response.data;
  }

  async deleteOrder(id: string): Promise<void> {
    await this.client.delete(`/orders/${id}`);
  }
}

export const apiService = new ApiService();
export type { Order, CreateOrderDto, UpdateOrderDto };
export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  total: number;
  status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateOrderDto {
  customerName: string;
  customerEmail: string;
  total: number;
  status?: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
}

export interface UpdateOrderDto {
  customerName?: string;
  customerEmail?: string;
  total?: number;
  status?: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}
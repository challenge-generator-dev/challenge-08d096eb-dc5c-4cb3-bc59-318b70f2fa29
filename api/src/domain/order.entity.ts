import { v4 as uuidv4 } from 'uuid';

export enum OrderStatus {
    PENDING = 'PENDING',
    PROCESSING = 'PROCESSING',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED'
}

export class Order {
    id: string;
    customerId: string;
    items: OrderItem[];
    status: OrderStatus;
    createdAt: Date;
    updatedAt: Date;
    totalAmount: number;

    constructor(
        customerId: string,
        items: OrderItem[],
        status: OrderStatus = OrderStatus.PENDING,
        id?: string,
        createdAt?: Date,
        updatedAt?: Date,
        totalAmount?: number
    ) {
        this.id = id || uuidv4();
        this.customerId = customerId;
        this.items = items;
        this.status = status;
        this.createdAt = createdAt || new Date();
        this.updatedAt = updatedAt || new Date();
        this.totalAmount = totalAmount || this.calculateTotalAmount();
    }

    private calculateTotalAmount(): number {
        return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    updateStatus(newStatus: OrderStatus): void {
        this.status = newStatus;
        this.updatedAt = new Date();
    }
}

export interface OrderItem {
    productId: string;
    quantity: number;
    price: number;
    description?: string;
}
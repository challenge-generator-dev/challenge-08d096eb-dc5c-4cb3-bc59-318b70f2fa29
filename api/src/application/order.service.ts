import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { OrderRepository } from '../domain/ports/order.repository';
import { Order, OrderStatus } from '../domain/order.entity';
import { CreateOrderDto } from '../infrastructure/dto/create-order.dto';
import { UpdateOrderDto } from '../infrastructure/dto/update-order.dto';
import { OrderItem } from '../domain/order.entity';

@Injectable()
export class OrderService {
  constructor(
    @Inject(OrderRepository)
    private readonly orderRepository: OrderRepository,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    this.validateCreateOrderDto(createOrderDto);

    const existingOrder = await this.orderRepository.findById(createOrderDto.id);
    if (existingOrder) {
      throw new BadRequestException(
        `Order with id '${createOrderDto.id}' already exists`,
      );
    }

    const now = new Date();
    const order = new Order(
      createOrderDto.id,
      createOrderDto.customerId,
      createOrderDto.items.map(item => this.mapToOrderItem(item)),
      OrderStatus.PENDING,
      now,
      now,
    );

    await this.orderRepository.save(order);
    return order;
  }

  async getOrder(id: string): Promise<Order> {
    if (!id || id.trim().length === 0) {
      throw new BadRequestException('Order id is required');
    }

    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new NotFoundException(`Order with id '${id}' not found`);
    }

    return order;
  }

  async updateOrder(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    if (!id || id.trim().length === 0) {
      throw new BadRequestException('Order id is required');
    }

    const existingOrder = await this.orderRepository.findById(id);
    if (!existingOrder) {
      throw new NotFoundException(`Order with id '${id}' not found`);
    }

    if (updateOrderDto.status) {
      this.validateStatusTransition(existingOrder.status, updateOrderDto.status);
      existingOrder.updateStatus(updateOrderDto.status);
    }

    if (updateOrderDto.items && updateOrderDto.items.length > 0) {
      const updatedItems = updateOrderDto.items.map(item => this.mapToOrderItem(item));
      existingOrder['items'] = updatedItems;
    }

    existingOrder['updatedAt'] = new Date();

    await this.orderRepository.update(existingOrder);
    return existingOrder;
  }

  async deleteOrder(id: string): Promise<void> {
    if (!id || id.trim().length === 0) {
      throw new BadRequestException('Order id is required');
    }

    const existingOrder = await this.orderRepository.findById(id);
    if (!existingOrder) {
      throw new NotFoundException(`Order with id '${id}' not found`);
    }

    await this.orderRepository.delete(id);
  }

  private validateCreateOrderDto(dto: CreateOrderDto): void {
    if (!dto.id || dto.id.trim().length === 0) {
      throw new BadRequestException('Order id is required');
    }

    if (!dto.customerId || dto.customerId.trim().length === 0) {
      throw new BadRequestException('Customer id is required');
    }

    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException('At least one item is required');
    }

    for (const item of dto.items) {
      if (!item.productId || item.productId.trim().length === 0) {
        throw new BadRequestException('Product id is required for all items');
      }
      if (!item.quantity || item.quantity <= 0) {
        throw new BadRequestException('Item quantity must be greater than zero');
      }
      if (!item.unitPrice || item.unitPrice <= 0) {
        throw new BadRequestException('Item unit price must be greater than zero');
      }
    }
  }

  private validateStatusTransition(currentStatus: OrderStatus, newStatus: OrderStatus): void {
    const validTransitions: Record<OrderStatus, OrderStatus[]> = {
      [OrderStatus.PENDING]: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
      [OrderStatus.CONFIRMED]: [OrderStatus.PROCESSING, OrderStatus.CANCELLED],
      [OrderStatus.PROCESSING]: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
      [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED],
      [OrderStatus.DELIVERED]: [],
      [OrderStatus.CANCELLED]: [],
    };

    const allowedTransitions = validTransitions[currentStatus];
    if (!allowedTransitions.includes(newStatus)) {
      throw new BadRequestException(
        `Invalid status transition from ${currentStatus} to ${newStatus}`,
      );
    }
  }

  private mapToOrderItem(item: { productId: string; quantity: number; unitPrice: number }): OrderItem {
    return {
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
    };
  }
}
import { Order } from '../order.entity';
import { UpdateOrderDto } from '../../infrastructure/dto/update-order.dto';

export interface OrderRepository {
  findById(id: string): Promise<Order | null>;
  findAll(): Promise<Order[]>;
  save(order: Order): Promise<Order>;
  update(id: string, updateData: UpdateOrderDto): Promise<Order | null>;
  delete(id: string): Promise<void>;
  existsById(id: string): Promise<boolean>;
}
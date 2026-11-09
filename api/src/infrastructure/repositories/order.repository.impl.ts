import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { DynamoDBClient, GetItemCommand, PutItemCommand, DeleteItemCommand, UpdateItemCommand } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { Order, OrderStatus } from '../../domain/order.entity';
import { OrderItem } from '../../domain/order.entity';
import { UpdateOrderDto } from '../dto/update-order.dto';

const ORDER_TABLE_NAME = process.env.ORDER_TABLE_NAME || 'orders';

export interface OrderRepository {
  findById(id: string): Promise<Order | null>;
  findAll(): Promise<Order[]>;
  save(order: Order): Promise<Order>;
  update(id: string, updateData: UpdateOrderDto): Promise<Order | null>;
  delete(id: string): Promise<void>;
  existsById(id: string): Promise<boolean>;
}

@Injectable()
export class OrderRepositoryImpl implements OrderRepository, OnModuleInit {
  private readonly logger = new Logger(OrderRepositoryImpl.name);
  private docClient: DynamoDBDocumentClient;
  private client: DynamoDBClient;

  constructor() {
    this.client = new DynamoDBClient({
      region: process.env.AWS_REGION || 'us-east-1',
      endpoint: process.env.DYNAMODB_ENDPOINT,
      credentials: process.env.AWS_ACCESS_KEY_ID ? {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      } : undefined,
    });
    this.docClient = DynamoDBDocumentClient.from(this.client, {
      marshallOptions: {
        removeUndefinedValues: true,
        convertClassInstanceToMap: true,
      },
    });
  }

  async onModuleInit(): Promise<void> {
    this.logger.log(`Inicializando repositorio de órdenes con tabla: ${ORDER_TABLE_NAME}`);
    await this.verifyTableExists();
  }

  private async verifyTableExists(): Promise<void> {
    try {
      await this.client.send(new GetItemCommand({
        TableName: ORDER_TABLE_NAME,
        Key: { id: { S: '_health_check' } },
      }));
      this.logger.log('Conexión con DynamoDB verificada correctamente');
    } catch (error) {
      this.logger.warn(`No se pudo verificar la tabla ${ORDER_TABLE_NAME}. Asegúrese de que DynamoDB Local esté ejecutándose o las credenciales sean correctas.`);
    }
  }

  private mapToOrder(item: Record<string, any>): Order {
    const order = new Order(
      item.id.S,
      item.customerId.S,
      item.status.S as OrderStatus,
      this.mapToOrderItems(item.items.L || []),
    );
    
    if (item.createdAt?.S) {
      (order as any).createdAt = new Date(item.createdAt.S);
    }
    if (item.updatedAt?.S) {
      (order as any).updatedAt = new Date(item.updatedAt.S);
    }
    if (item.notes?.S) {
      (order as any).notes = item.notes.S;
    }
    if (item.shippingAddress?.S) {
      (order as any).shippingAddress = item.shippingAddress.S;
    }
    if (item.totalAmount?.N) {
      (order as any).totalAmount = parseFloat(item.totalAmount.N);
    }
    
    return order;
  }

  private mapToOrderItems(items: any[]): OrderItem[] {
    return items.map(item => ({
      productId: item.M?.productId?.S,
      productName: item.M?.productName?.S,
      quantity: item.M?.quantity?.N ? parseInt(item.M.quantity.N, 10) : 0,
      unitPrice: item.M?.unitPrice?.N ? parseFloat(item.M.unitPrice.N) : 0,
    }));
  }

  private mapToDynamoDBItem(order: Order): Record<string, any> {
    const item: Record<string, any> = {
      id: { S: order.id },
      customerId: { S: order.customerId },
      status: { S: order.status },
      items: { L: order.items.map(i => ({
        M: {
          productId: { S: i.productId },
          productName: { S: i.productName },
          quantity: { N: i.quantity.toString() },
          unitPrice: { N: i.unitPrice.toString() },
        },
      }))},
      createdAt: { S: (order as any).createdAt?.toISOString() || new Date().toISOString() },
      updatedAt: { S: new Date().toISOString() },
      totalAmount: { N: order.calculateTotalAmount().toString() },
    };

    if ((order as any).notes) {
      item.notes = { S: (order as any).notes };
    }
    if ((order as any).shippingAddress) {
      item.shippingAddress = { S: (order as any).shippingAddress };
    }

    return item;
  }

  async findById(id: string): Promise<Order | null> {
    try {
      const result = await this.docClient.send(new GetItemCommand({
        TableName: ORDER_TABLE_NAME,
        Key: { id: { S: id } },
      }));

      if (!result.Item) {
        return null;
      }

      return this.mapToOrder(result.Item);
    } catch (error) {
      this.logger.error(`Error al buscar orden ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findAll(): Promise<Order[]> {
    try {
      const result = await this.docClient.send(new ScanCommand({
        TableName: ORDER_TABLE_NAME,
        FilterExpression: 'attribute_not_exists(#status) OR #status <> :deleted',
        ExpressionAttributeNames: { '#status': 'status' },
        ExpressionAttributeValues: { ':deleted': { S: 'DELETED' } },
      }));

      return (result.Items || []).map(item => this.mapToOrder(item));
    } catch (error) {
      this.logger.error(`Error al buscar todas las órdenes: ${error.message}`, error.stack);
      throw error;
    }
  }

  async save(order: Order): Promise<Order> {
    try {
      const item = this.mapToDynamoDBItem(order);
      
      await this.docClient.send(new PutItemCommand({
        TableName: ORDER_TABLE_NAME,
        Item: item,
        ConditionExpression: 'attribute_not_exists(id)',
      }));

      this.logger.log(`Orden ${order.id} guardada correctamente en DynamoDB`);
      return order;
    } catch (error) {
      if (error.name === 'ConditionalCheckFailedException') {
        this.logger.warn(`Orden con ID ${order.id} ya existe`);
        throw new Error(`Orden con ID ${order.id} ya existe`);
      }
      this.logger.error(`Error al guardar orden ${order.id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async update(id: string, updateData: UpdateOrderDto): Promise<Order | null> {
    try {
      const existingOrder = await this.findById(id);
      if (!existingOrder) {
        return null;
      }

      const updateExpressions: string[] = [];
      const expressionAttributeValues: Record<string, any> = {};
      const expressionAttributeNames: Record<string, string> = {};

      if (updateData.status !== undefined) {
        updateExpressions.push('#status = :status');
        expressionAttributeValues[':status'] = { S: updateData.status };
        expressionAttributeNames['#status'] = 'status';
      }

      if (updateData.items !== undefined) {
        updateExpressions.push('#items = :items');
        expressionAttributeValues[':items'] = { L: updateData.items.map(item => ({
          M: {
            productId: { S: item.productId || '' },
            productName: { S: item.productName || '' },
            quantity: { N: (item.quantity || 0).toString() },
            unitPrice: { N: (item.unitPrice || 0).toString() },
          },
        }))};
        expressionAttributeNames['#items'] = 'items';
      }

      if (updateData.notes !== undefined) {
        updateExpressions.push('#notes = :notes');
        expressionAttributeValues[':notes'] = { S: updateData.notes };
        expressionAttributeNames['#notes'] = 'notes';
      }

      if (updateData.shippingAddress !== undefined) {
        updateExpressions.push('#shippingAddress = :shippingAddress');
        expressionAttributeValues[':shippingAddress'] = { S: updateData.shippingAddress };
        expressionAttributeNames['#shippingAddress'] = 'shippingAddress';
      }

      updateExpressions.push('#updatedAt = :updatedAt');
      expressionAttributeValues[':updatedAt'] = { S: new Date().toISOString() };
      expressionAttributeNames['#updatedAt'] = 'updatedAt';

      if (updateData.status !== undefined || updateData.items !== undefined) {
        updateExpressions.push('#totalAmount = :totalAmount');
        let newTotal = existingOrder.calculateTotalAmount();
        if (updateData.items) {
          newTotal = updateData.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
        }
        expressionAttributeValues[':totalAmount'] = { N: newTotal.toString() };
        expressionAttributeNames['#totalAmount'] = 'totalAmount';
      }

      await this.docClient.send(new UpdateItemCommand({
        TableName: ORDER_TABLE_NAME,
        Key: { id: { S: id } },
        UpdateExpression: `SET ${updateExpressions.join(', ')}`,
        ExpressionAttributeValues: expressionAttributeValues,
        ExpressionAttributeNames: expressionAttributeNames,
        ReturnValues: 'ALL_NEW',
      }));

      this.logger.log(`Orden ${id} actualizada correctamente en DynamoDB`);
      return this.findById(id);
    } catch (error) {
      this.logger.error(`Error al actualizar orden ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.docClient.send(new DeleteItemCommand({
        TableName: ORDER_TABLE_NAME,
        Key: { id: { S: id } },
      }));

      this.logger.log(`Orden ${id} eliminada correctamente de DynamoDB`);
    } catch (error) {
      this.logger.error(`Error al eliminar orden ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async existsById(id: string): Promise<boolean> {
    const order = await this.findById(id);
    return order !== null;
  }
}
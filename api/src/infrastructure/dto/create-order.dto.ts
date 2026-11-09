import { IsString, IsEnum, IsArray, IsOptional, IsNumber, IsUUID, ValidateNested, Min, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum OrderItemStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export class CreateOrderItemDto {
  @ApiProperty({ description: 'Identificador único del item', example: 'item-001' })
  @IsString()
  @IsNotEmpty()
  itemId: string;

  @ApiProperty({ description: 'Nombre del producto', example: 'Laptop Pro 15' })
  @IsString()
  @IsNotEmpty()
  productName: string;

  @ApiProperty({ description: 'Cantidad del producto', example: 2 })
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({ description: 'Precio unitario del producto', example: 1299.99 })
  @IsNumber()
  @Min(0)
  unitPrice: number;

  @ApiPropertyOptional({ description: 'Estado del item', enum: OrderItemStatus, default: OrderItemStatus.PENDING })
  @IsOptional()
  @IsEnum(OrderItemStatus)
  status?: OrderItemStatus;
}

export class CreateOrderDto {
  @ApiProperty({ description: 'Identificador único de la orden (UUID)', example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' })
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ description: 'Identificador del cliente', example: 'customer-001' })
  @IsString()
  @IsNotEmpty()
  customerId: string;

  @ApiProperty({ description: 'Nombre del cliente', example: 'Juan Pérez' })
  @IsString()
  @IsNotEmpty()
  customerName: string;

  @ApiProperty({ description: 'Email del cliente', example: 'juan.perez@example.com' })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  customerEmail?: string;

  @ApiProperty({ description: 'Dirección de envío', example: 'Av. Principal 123, Ciudad, País' })
  @IsString()
  @IsNotEmpty()
  shippingAddress: string;

  @ApiProperty({ description: 'Estado de la orden', enum: OrderItemStatus, default: OrderItemStatus.PENDING })
  @IsOptional()
  @IsEnum(OrderItemStatus)
  status?: OrderItemStatus;

  @ApiProperty({ description: 'Lista de items de la orden', type: [CreateOrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];

  @ApiPropertyOptional({ description: 'Notas adicionales de la orden', example: 'Por favor entregar en horario laboral' })
  @IsOptional()
  @IsString()
  notes?: string;
}
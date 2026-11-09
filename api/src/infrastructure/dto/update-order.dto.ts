import { IsString, IsEnum, IsOptional, IsNumber, Min, IsArray, ValidateNested, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { OrderStatus } from '../../domain/order.entity';

export class UpdateOrderItemDto {
  @ApiPropertyOptional({ description: 'Identificador del producto' })
  @IsOptional()
  @IsString()
  productId?: string;

  @ApiPropertyOptional({ description: 'Nombre del producto' })
  @IsOptional()
  @IsString()
  productName?: string;

  @ApiPropertyOptional({ description: 'Cantidad del producto', minimum: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  quantity?: number;

  @ApiPropertyOptional({ description: 'Precio unitario del producto', minimum: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  unitPrice?: number;
}

export class UpdateOrderDto {
  @ApiPropertyOptional({ 
    description: 'Estado de la orden', 
    enum: OrderStatus,
    examples: ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED']
  })
  @IsOptional()
  @IsEnum(OrderStatus, { message: 'El estado debe ser uno de: PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED' })
  status?: OrderStatus;

  @ApiPropertyOptional({ 
    description: 'Lista de items de la orden',
    type: [UpdateOrderItemDto]
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateOrderItemDto)
  items?: UpdateOrderItemDto[];

  @ApiPropertyOptional({ description: 'Notas adicionales de la orden' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ description: 'Dirección de envío' })
  @IsOptional()
  @IsString()
  shippingAddress?: string;
}
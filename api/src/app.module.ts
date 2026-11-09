import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { OrderController } from './infrastructure/controllers/order.controller';
import { OrderService } from './application/order.service';
import { OrderRepositoryImpl } from './infrastructure/repositories/order.repository.impl';
import { dynamoDbConfig } from './infrastructure/config/dynamodb.config';
import { GlobalExceptionFilter } from './infrastructure/exceptions/global-exception.filter';
import { OrderRepository } from './domain/ports/order.repository';
import { CreateOrderDto } from './infrastructure/dto/create-order.dto';
import { UpdateOrderDto } from './infrastructure/dto/update-order.dto';

@Module({
  imports: [
    CreateOrderDto,
    UpdateOrderDto,
  ],
  controllers: [OrderController],
  providers: [
    OrderService,
    {
      provide: OrderRepository,
      useClass: OrderRepositoryImpl,
    },
    dynamoDbConfig,
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
  exports: [OrderService, OrderRepository],
})
export class AppModule {}
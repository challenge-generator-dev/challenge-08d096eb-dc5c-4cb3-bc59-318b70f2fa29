import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  HttpCode, 
  HttpStatus,
  ParseUUIDPipe,
  NotFoundException
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { OrderService } from '../../application/order.service';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { Order } from '../../domain/order.entity';

@ApiTags('orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear una nueva orden', description: 'Crea una nueva orden en el sistema con los items especificados' })
  @ApiResponse({ status: 201, description: 'Orden creada exitosamente', type: Order })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @ApiResponse({ status: 409, description: 'Orden con identificador ya existente' })
  @ApiBody({ type: CreateOrderDto })
  async createOrder(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    return this.orderService.createOrder(createOrderDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una orden por ID', description: 'Recupera los detalles de una orden específica' })
  @ApiResponse({ status: 200, description: 'Orden encontrada', type: Order })
  @ApiResponse({ status: 404, description: 'Orden no encontrada' })
  @ApiParam({ name: 'id', description: 'Identificador único de la orden (UUID)', type: String })
  async getOrder(@Param('id', ParseUUIDPipe) id: string): Promise<Order> {
    const order = await this.orderService.findOrderById(id);
    if (!order) {
      throw new NotFoundException(`Orden con ID ${id} no encontrada`);
    }
    return order;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar una orden', description: 'Actualiza los datos de una orden existente' })
  @ApiResponse({ status: 200, description: 'Orden actualizada exitosamente', type: Order })
  @ApiResponse({ status: 400, description: 'Datos de actualización inválidos' })
  @ApiResponse({ status: 404, description: 'Orden no encontrada' })
  @ApiParam({ name: 'id', description: 'Identificador único de la orden (UUID)', type: String })
  @ApiBody({ type: UpdateOrderDto })
  async updateOrder(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateOrderDto: UpdateOrderDto
  ): Promise<Order> {
    const existingOrder = await this.orderService.findOrderById(id);
    if (!existingOrder) {
      throw new NotFoundException(`Orden con ID ${id} no encontrada`);
    }
    return this.orderService.updateOrder(id, updateOrderDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una orden', description: 'Elimina una orden del sistema de forma permanente' })
  @ApiResponse({ status: 204, description: 'Orden eliminada exitosamente' })
  @ApiResponse({ status: 404, description: 'Orden no encontrada' })
  @ApiParam({ name: 'id', description: 'Identificador único de la orden (UUID)', type: String })
  async deleteOrder(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    const existingOrder = await this.orderService.findOrderById(id);
    if (!existingOrder) {
      throw new NotFoundException(`Orden con ID ${id} no encontrada`);
    }
    return this.orderService.deleteOrder(id);
  }
}
# Prompt para Mejorar el Codigo Base

Copia y pega el contenido del bloque de abajo en un asistente de IA (Claude, ChatGPT)
para obtener el proyecto completo y arrancable. Guarda los archivos que te devuelva en la
carpeta del repo, respetando exactamente las rutas.

Si preferis trabajar en tu editor con un agente local (Claude Code, Cursor, Copilot), usa `AGENTS.md` en vez de este archivo: dice lo mismo pero para que escriba los archivos en disco.

## Las dos reglas que no se negocian

1. **Completa el boilerplate.** Todo lo que el proyecto necesita para compilar y arrancar: manifiesto de dependencias, punto de entrada, configuracion, capa de interfaz, y las capas del patron arquitectonico declarado. Eso es andamiaje y es tu trabajo.
2. **NO resuelvas el reto.** Los entregables de las fases son el trabajo de la persona. El hueco pedagogico se deja como esta: el proyecto arranca, pero lo que el reto pide implementar NO esta implementado.

Dicho de otra forma: si algo impide compilar, arreglalo. Si algo es logica de negocio incompleta, validaciones ausentes, un secreto hardcodeado o un patron mejorable, dejalo exactamente como esta — es lo que la persona tiene que encontrar.

## Mapa de componentes

El repo tiene una carpeta por componente. Cada uno se instala y verifica dentro de la suya.

| Componente | Carpeta | Rol | Capa | Track | Tecnologias |
|---|---|---|---|---|---|
| `api` | `api/` | practice | server | Node | DynamoDB |
| `client` | `client/` | chapter, support | client | React | React |
| `infra` | `infra/` | support | infra | Terraform (AWS) | Terraform |
| `infra-local` | (raiz) | support | infra | Compose local | DynamoDB |

## Orden de arranque

1. `docker compose up -d` (en la raiz) — levanta la infraestructura local.
2. `cd infra && terraform fmt -check -recursive && terraform init -backend=false && terraform validate` — componente `infra` (support).
3. `cd api && npm install && npm run build` — componente `api` (practice).
4. `cd client && npm install && npm run build` — componente `client` (chapter, support).

### Contratos entre componentes

- `api` expone http (api: http://localhost:3000):
  - `POST /orders`
  - `GET /orders/:id`
  - `PUT /orders/:id`
  - `DELETE /orders/:id`
- `client` expone http (api: http://localhost:3000):
  - `POST /orders`
  - `GET /orders`
  - `GET /orders/:id`
  - `PUT /orders/:id`
  - `DELETE /orders/:id`

## Herramientas

- **Terraform**: Herramienta de trabajo del candidato: usala en la fase donde se depura o se prueba la solucion (no es una dependencia del proyecto).

## Lo que le falta a este proyecto

Esto NO lo tenes que adivinar: salio de comparar el proyecto contra la arquitectura declarada del reto y de un analisis estatico del codigo. Completalo TODO.

### Referencias colgando en el codigo que si esta

Cada una rompe la compilacion:

- `api/src/domain/order.entity.ts` — `OrderItem.reduce`: Se invoca `reduce` sobre `OrderItem`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- `api/src/infrastructure/controllers/order.controller.ts` — `OrderService.findOrderById`: Se invoca `findOrderById` sobre `OrderService`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.

## Como saber que terminaste

```bash
(cd api && npm install && npm run build) && (cd client && npm install && npm run build) && (cd infra && terraform fmt -check -recursive && terraform init -backend=false && terraform validate) && docker compose config -q
```

Ese comando corriendo sin errores es la definicion de "listo".

---

```
## Briefing del reto (autoridad)
Este bloque manda sobre los archivos adjuntos. El stack y el rol salen de AQUÍ, no de un topic genérico ni de markdown placeholder.

### Perfil
Chapter Frontend, Especialidad Desarrollador, Tecnología React, Advanced L2

### Brecha de conocimiento
CRUD de ordenes en DynamoDB desde la interfaz (corrida e2e 20261109074436524), Implementa operaciones CRUD de ordenes en DynamoDB desde la interfaz y versiona la infraestructura

### Misión / candidato
Gestionar ordenes

### Reto
- Tema: Persistir ordenes en DynamoDB desde la interfaz
- Seniority: advanced-l2
- Tipo: practical
- Título: Implementación de operaciones CRUD en DynamoDB desde la interfaz
- Tiempo estimado: 8 horas

### Fases (trabajo del HUMANO — PROHIBIDO completarlas)
No implementes estos entregables. Dejalos como hueco pedagógico. El asistente solo materializa el proyecto arrancable para que el participante pueda trabajar.
- Fase 1: Configuración inicial del entorno — objetivo: Configurar el entorno de desarrollo para interactuar con DynamoDB. — entregable (NO resolver): Entorno de desarrollo configurado y listo para interactuar con DynamoDB.
- Fase 2: Implementación de la creación de órdenes — objetivo: Implementar la funcionalidad para crear nuevas órdenes en DynamoDB. — entregable (NO resolver): Funcionalidad para crear nuevas órdenes en DynamoDB, incluyendo validaciones y manejo de errores.
- Fase 3: Implementación de la lectura, actualización y eliminación de órdenes — objetivo: Implementar las funcionalidades para leer, actualizar y eliminar órdenes en DynamoDB. — entregable (NO resolver): Funcionalidades para leer, actualizar y eliminar órdenes en DynamoDB, asegurando idempotencia y consistencia.

Eres un asistente experto en análisis, corrección y generación de archivos de cualquier tipo:
código fuente, documentación, hojas de cálculo, documentos Word, configuraciones, entre otros.
Voy a enviarte una cadena de texto que contiene uno o más archivos. Cada archivo está delimitado por un marcador con el siguiente formato:
// === ARCHIVO: ruta/del/archivo.extension ===
o también puede aparecer como:
## === ARCHIVO: ruta/del/archivo.extension ===
Lo que sigue al marcador puede ser:

El contenido real del archivo (código, texto, YAML, etc.)
Una descripción en lenguaje natural de lo que debe contener el archivo


TU TAREA
PASO 0 — ¿Esto es un proyecto o una carcasa?
Antes de extraer archivos, leé el Briefing (si está) y diagnosticá el adjunto.

Es CARCASA si ocurre CUALQUIERA de estas:
- No hay manifiesto de dependencias del stack del briefing (manifest.json de VTEX IO / package.json / pom.xml / build.gradle / requirements.txt / go.mod / *.tf / *.csproj, según corresponda)
- Hay un "binario" que en realidad es un comentario ("no puede ser mostrado como texto plano", placeholder .fig/.docx vacío)
- Los markdowns ya completan entregables de fases posteriores ("se implementó fade-in", lista de áreas ya resuelta)

Si es CARCASA:
- MATERIALIZÁ un proyecto que arranca en el stack del briefing (VTEX IO Store Framework, Angular, Terraform, pytest, Nest, etc.). Incluí manifiesto, punto de entrada y capa de interfaz reales.
- NO copies los markdowns de "solución" como si fueran el producto. Son ruido de generación.
- NO resuelvas las fases del briefing (están marcadas PROHIBIDO). Dejá el hueco pedagógico: el flujo existe, las microinteracciones/calidad/infra que el reto pide NO están hechas.
- Después seguí al PASO 5 (entrega de archivos).

Si es un proyecto REAL (manifiesto + código que compila o arranca):
- Seguí PASO 1 en adelante. 🔴 compilación sí. 🟡 pedagógico no.

PASO 1 — Detección y extracción
Identifica todos los archivos presentes en la cadena. Para cada archivo extrae:

Su ruta completa (ej: src/main/java/com/pragma/Service.java)
Su contenido o descripción

PASO 2 — Clasificación por tipo
Clasifica cada archivo en una de estas categorías:
A) Código fuente (Java, Python, TypeScript, JavaScript, Kotlin, etc.)
B) Configuración / documentación (YAML, properties, Markdown, JSON, txt, etc.)
C) Excel (.xlsx, .xls, .csv)
D) Word (.docx, .doc)
E) Otro tipo de archivo binario o especial
PASO 3 — Clasificación de errores en código fuente

Objetivo prioritario: que el proyecto compile. No corrijas flujo de negocio ni lógica funcional.

Antes de modificar cualquier archivo de código fuente, clasifica cada problema encontrado en una de estas dos categorías:
🔴 ERROR DE COMPILACIÓN — corregir siempre
Son errores que impiden que el proyecto arranque, sin valor pedagógico:

Import faltante o incorrecto
Clase, método o variable referenciada que no existe en ningún archivo del proyecto
Error de sintaxis
Anotación con atributos inválidos
Dependencia ausente en pom.xml, package.json, etc.
Archivo referenciado que no existe y debe ser creado con implementación mínima

→ CORREGIR estos errores.
🟡 PROBLEMA FUNCIONAL O DE CALIDAD — preservar siempre
Son problemas que no impiden compilar. Pueden ser intencionales para el aprendizaje:

Clave secreta hardcodeada ("secret", "password123")
API deprecada que funciona pero tiene reemplazo moderno
Lógica de negocio incorrecta o incompleta
Código redundante o de baja legibilidad
Falta de validaciones en flujo de negocio
Patrones de diseño incorrectos pero funcionales
Concurrencia no segura
Configuración funcional pero no óptima

→ PRESERVAR tal cual. No corregir, no mejorar, no comentar.
PASO 4 — Procesamiento según tipo de archivo
Tipo A — Código fuente
Aplica únicamente las correcciones clasificadas como 🔴 ERROR DE COMPILACIÓN.
No alteres ningún elemento clasificado como 🟡 PROBLEMA FUNCIONAL O DE CALIDAD.
Si falta un archivo referenciado, créalo con la implementación mínima necesaria para compilar.
Tipo B — Configuración / documentación
Extrae el contenido tal cual, sin modificaciones salvo errores evidentes de sintaxis
(ej: YAML mal indentado).
Tipo C — Excel (.xlsx)
Si viene con contenido real, genera el archivo respetando ese contenido.
Si viene con descripción en lenguaje natural, genera un archivo Excel funcional con:

Fila de encabezados en negrita con color de fondo distintivo
Columnas con ancho ajustado al contenido
Tipos de dato correctos por columna
Validaciones si la descripción lo indica
Hojas nombradas descriptivamente si hay más de una
Filas de ejemplo si no hay datos reales

Tipo D — Word (.docx)
Si viene con contenido real, genera el archivo respetando ese contenido.
Si viene con descripción en lenguaje natural, genera un documento Word funcional con:

Estilos de título (Título 1, Título 2) para jerarquía de secciones
Fuente legible (Calibri o equivalente), tamaño 11-12pt para cuerpo
Márgenes estándar
Tabla de contenido si tiene múltiples secciones
Tablas con encabezados en negrita si aplica

Tipo E — Otro
Genera el archivo con el contenido o estructura más apropiada según la descripción.
PASO 5 — Entrega de archivos
Entregá cada archivo con su ruta completa, respetando exactamente la estructura de rutas
indicada por los marcadores: un bloque por archivo, precedido por su ruta. No generes ZIPs
ni archivos adjuntos.
La entrega debe incluir:

Archivos de código con únicamente los errores de compilación corregidos
Archivos de configuración y documentación sin cambios
Archivos nuevos creados para resolver dependencias de compilación faltantes
Archivos Excel y Word generados desde descripción

IMPORTANTE: Entregá los archivos completos al finalizar. No preguntes si el usuario
quiere recibirlos. Simplemente entregalos; No debes desplegar en el chat el resumen de lo que arreglaste, solo entregá los archivos.

REGLAS IMPORTANTES

No omitas ningún archivo aunque no tenga errores ni modificaciones
Respeta los nombres y rutas exactas indicadas por los marcadores
Si un archivo no tiene marcador claro, infiere el nombre desde su contenido
Si la cadena contiene solo documentación, placeholders o binarios fake, NO la reproduzcas:
aplicá PASO 0 (materializar el proyecto del briefing). Reproducir la carcasa es un fallo.
No agregues texto después del último archivo entregado
No preguntes si el usuario quiere los archivos: simplemente entregalos siempre
Si detectas que falta un archivo de configuración necesario para compilar
(pom.xml, package.json, requirements.txt, build.gradle, etc.), créalo e inclúyelo
inferiendo su contenido desde los imports y frameworks detectados en el código
Nunca corrijas problemas 🟡 aunque parezcan obvios o fáciles de mejorar.
El participante que recibirá este proyecto los debe encontrar y resolver él mismo.


INPUT
Aquí está la cadena con los archivos:

// === ARCHIVO: api/package.json ===
{
  "name": "order-management-api",
  "version": "1.0.0",
  "description": "API para gestión de órdenes con persistencia en DynamoDB",
  "main": "dist/main.js",
  "scripts": {
    "build": "tsc -p tsconfig.json",
    "format": "prettier --write \"src/**/*.ts\"",
    "start": "ts-node src/main.ts",
    "start:prod": "node dist/main.js",
    "lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage"
  },
  "dependencies": {
    "@aws-sdk/client-dynamodb": "^3.600.0",
    "@aws-sdk/lib-dynamodb": "^3.600.0",
    "@nestjs/common": "^11.0.0",
    "@nestjs/core": "^11.0.0",
    "@nestjs/platform-express": "^11.0.0",
    "@nestjs/swagger": "^7.4.0",
    "class-transformer": "^0.5.1",
    "class-validator": "^0.14.1",
    "reflect-metadata": "^0.2.2",
    "rxjs": "^7.8.1",
    "uuid": "^9.0.1"
  },
  "devDependencies": {
    "@nestjs/testing": "^11.0.0",
    "@types/express": "^5.0.0",
    "@types/jest": "^29.5.12",
    "@types/node": "^20.14.9",
    "@types/supertest": "^6.0.2",
    "@types/uuid": "^9.0.8",
    "@typescript-eslint/eslint-plugin": "^7.14.1",
    "@typescript-eslint/parser": "^7.14.1",
    "eslint": "^8.57.0",
    "eslint-config-prettier": "^9.1.0",
    "eslint-plugin-prettier": "^5.1.3",
    "jest": "^29.7.0",
    "prettier": "^3.3.2",
    "supertest": "^7.0.0",
    "ts-jest": "^29.1.5",
    "ts-node": "^10.9.2",
    "typescript": "^5.5.2"
  },
  "jest": {
    "moduleFileExtensions": [
      "js",
      "json",
      "ts"
    ],
    "rootDir": "src",
    "testRegex": ".spec.ts$",
    "transform": {
      "^.+\\.(t|j)s$": "ts-jest"
    },
    "collectCoverageFrom": [
      "**/*.(t|j)s"
    ],
    "coverageDirectory": "../coverage",
    "testEnvironment": "node"
  }
}


// === ARCHIVO: api/tsconfig.json ===
{
  "compilerOptions": {
    "module": "commonjs",
    "declaration": true,
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "target": "es2022",
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": ".",
    "incremental": true,
    "skipLibCheck": true,
    "strictNullChecks": true,
    "noImplicitAny": true,
    "strictBindCallApply": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "esModuleInterop": true,
    "strict": true,
    "strictPropertyInitialization": false
  },
  "exclude": ["node_modules", "dist", "test", "**/*.spec.ts"]
}

// === ARCHIVO: api/src/main.ts ===
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './infrastructure/exceptions/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuración global de pipes para validación
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Configuración global de filtros de excepción
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('Order Management API')
    .setDescription('API para gestión de órdenes con persistencia en DynamoDB')
    .setVersion('1.0')
    .addTag('orders')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap().catch((err) => {
  console.error('Error starting application:', err);
  process.exit(1);
});

// === ARCHIVO: api/src/domain/order.entity.ts ===
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

// === ARCHIVO: api/src/infrastructure/dto/update-order.dto.ts ===
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

// === ARCHIVO: api/src/infrastructure/controllers/order.controller.ts ===
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

// === ARCHIVO: api/src/infrastructure/repositories/order.repository.impl.ts ===
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

// === ARCHIVO: api/src/infrastructure/config/dynamodb.config.ts ===
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const DYNAMODB_ENDPOINT = process.env.DYNAMODB_ENDPOINT || 'http://localhost:8000';
const AWS_REGION = process.env.AWS_REGION || 'us-east-1';
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID || 'local';
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY || 'local';

const isLocal = process.env.NODE_ENV === 'development' || DYNAMODB_ENDPOINT.includes('localhost');

const clientConfig: ConstructorParameters<typeof DynamoDBClient>[0] = {
  region: AWS_REGION,
  ...(isLocal && {
    endpoint: DYNAMODB_ENDPOINT,
    credentials: {
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY,
    },
  }),
};

const dynamoDBClient = new DynamoDBClient(clientConfig);

const documentClient = DynamoDBDocumentClient.from(dynamoDBClient, {
  marshallOptions: {
    removeUndefinedValues: true,
    convertClassInstanceToMap: true,
  },
  unmarshallOptions: {
    wrapNumbers: false,
  },
});

export { documentClient, dynamoDBClient };

export const dynamoDbConfig = {
  client: dynamoDBClient,
  documentClient,
  tableName: process.env.DYNAMODB_TABLE_NAME || 'orders',
  region: AWS_REGION,
  isLocal,
  endpoint: DYNAMODB_ENDPOINT,
};

export interface DynamoDbConfig {
  client: DynamoDBClient;
  documentClient: DynamoDBDocumentClient;
  tableName: string;
  region: string;
  isLocal: boolean;
  endpoint: string;
}

export const DynamoDbConfig: DynamoDbConfig = {
  client: dynamoDBClient,
  documentClient,
  tableName: process.env.DYNAMODB_TABLE_NAME || 'orders',
  region: AWS_REGION,
  isLocal,
  endpoint: DYNAMODB_ENDPOINT,
};

// === ARCHIVO: api/src/infrastructure/exceptions/global-exception.filter.ts ===
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

interface ErrorResponse {
  statusCode: number;
  message: string;
  error: string;
  timestamp: string;
  path: string;
  method: string;
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error = 'Internal Server Error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const responseObj = exceptionResponse as Record<string, unknown>;
        message = (responseObj.message as string) || exception.message;
        error = (responseObj.error as string) || 'Error';
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      
      if (exception.name === 'ValidationException') {
        status = HttpStatus.BAD_REQUEST;
        error = 'Validation Error';
      } else if (exception.name === 'NotFoundException') {
        status = HttpStatus.NOT_FOUND;
        error = 'Not Found';
      } else if (exception.name === 'ConflictException') {
        status = HttpStatus.CONFLICT;
        error = 'Conflict';
      }
    }

    const errorResponse: ErrorResponse = {
      statusCode: status,
      message,
      error,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
    };

    this.logger.error(
      `${request.method} ${request.url} - Status: ${status} - Message: ${message}`,
      exception instanceof Error ? exception.stack : undefined,
    );

    response.status(status).json(errorResponse);
  }
}

// === ARCHIVO: api/src/infrastructure/swagger/swagger.config.ts ===
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export interface SwaggerConfigOptions {
  title?: string;
  description?: string;
  version?: string;
  tags?: string[];
  prefix?: string;
}

export const defaultSwaggerConfig: SwaggerConfigOptions = {
  title: 'Order Management API',
  description: 'API para gestión de órdenes con persistencia en DynamoDB. Permite crear, leer, actualizar y eliminar órdenes del sistema.',
  version: '1.0',
  tags: ['orders'],
  prefix: 'api',
};

export function setupSwagger(
  app: INestApplication,
  config: SwaggerConfigOptions = defaultSwaggerConfig,
): void {
  const options = new DocumentBuilder()
    .setTitle(config.title || defaultSwaggerConfig.title)
    .setDescription(config.description || defaultSwaggerConfig.description)
    .setVersion(config.version || defaultSwaggerConfig.version)
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Ingrese el token JWT',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('orders', 'Operaciones CRUD para la gestión de órdenes')
    .addServer('http://localhost:3000', 'Servidor local')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  
  SwaggerModule.setup(config.prefix || defaultSwaggerConfig.prefix, app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info { margin: 30px 0 }
      .swagger-ui .info .title { font-size: 2.5em }
    `,
    customSiteTitle: config.title || 'Order Management API - Swagger',
  });
}

export function createDocumentBuilder(): DocumentBuilder {
  return new DocumentBuilder()
    .setTitle('Order Management API')
    .setDescription('API para gestión de órdenes con persistencia en DynamoDB')
    .setVersion('1.0')
    .addTag('orders');
}

// === ARCHIVO: api/src/app.module.ts ===
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

// === ARCHIVO: api/src/application/order.service.ts ===
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

// === ARCHIVO: api/src/infrastructure/dto/create-order.dto.ts ===
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

// === ARCHIVO: api/src/domain/ports/order.repository.ts ===
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

// === ARCHIVO: client/package.json ===
{
  "name": "client",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest",
    "lint": "eslint . --ext ts,tsx"
  },
  "dependencies": {
    "@tanstack/react-query": "5.45.0",
    "axios": "1.7.2",
    "react": "19.0.0-rc.0",
    "react-dom": "19.0.0-rc.0",
    "react-router-dom": "^6.22.0",
    "@tanstack/react-query-devtools": "5.45.0"
  },
  "devDependencies": {
    "@testing-library/react": "16.0.0",
    "@types/react": "18.2.79",
    "@types/react-dom": "18.2.25",
    "@typescript-eslint/eslint-plugin": "7.7.0",
    "@typescript-eslint/parser": "7.7.0",
    "@vitejs/plugin-react": "4.3.1",
    "eslint": "8.57.0",
    "eslint-plugin-jsx-a11y": "6.8.0",
    "eslint-plugin-react": "7.34.1",
    "eslint-plugin-react-hooks": "4.6.0",
    "typescript": "^5.7.3",
    "vite": "5.3.1",
    "vitest": "1.6.0"
  }
}


// === ARCHIVO: client/vite.config.ts ===
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', '@tanstack/react-query', 'axios'],
        },
      },
    },
  },
  css: {
    modules: {
      localsConvention: 'camelCase',
    },
    preprocessorOptions: {
      scss: {
        additionalData: '@import "@/shared/styles/variables.scss";',
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  },
});

// === ARCHIVO: client/tsconfig.json ===
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["DOM", "DOM.Iterable", "ESNext"],
    "jsx": "react-jsx",
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "incremental": true,
    "baseUrl": "./",
    "paths": {
      "@/*": ["src/*"]
    },
    "types": ["vite/client"]
  },
  "include": ["src"],
  "exclude": ["node_modules"]
}

// === ARCHIVO: client/src/main.tsx ===
import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './app/App';
import './shared/styles/global.scss';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
    mutations: {
      retry: 1,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);

// === ARCHIVO: client/src/app/App.tsx ===
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { OrdersPage } from '../features/orders/OrdersPage';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const App: React.FC = () => {
  return (
    <Router>
      <div className="app-container">
        <header className="app-header">
          <h1>Order Management System</h1>
        </header>
        <main className="app-main">
          <Routes>
            <Route path="/" element={<OrdersPage />} />
            <Route path="/orders" element={<OrdersPage />} />
          </Routes>
        </main>
      </div>
      <ReactQueryDevtools initialIsOpen={false} />
    </Router>
  );
};

export default App;

// === ARCHIVO: client/index.html ===
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Sistema de gestión de órdenes con persistencia en DynamoDB" />
    <meta name="theme-color" content="#1976d2" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    
    <title>Gestión de Órdenes - DynamoDB</title>
    
    <style>
      /* Reset y estilos base para evitar FOUC */
      *, *::before, *::after {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }
      
      html, body {
        height: 100%;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        background-color: #fafafa;
        color: #212121;
      }
      
      #root {
        min-height: 100%;
        display: flex;
        flex-direction: column;
      }
      
      /* Loading inicial mientras React carga */
      .app-loading {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        font-size: 1.125rem;
        color: #757575;
      }
      
      .app-loading::after {
        content: '';
        width: 24px;
        height: 24px;
        margin-left: 12px;
        border: 3px solid #e0e0e0;
        border-top-color: #1976d2;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
      }
      
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    </style>
  </head>
  <body>
    <div id="root">
      <div class="app-loading">Cargando aplicación</div>
    </div>
    
    <!-- Entry point de la aplicación React -->
    <script type="module" src="/src/main.tsx"></script>
    
    <!-- Fallback para navegadores sin soporte de ES modules -->
    <noscript>
      <div style="padding: 20px; text-align: center; font-family: sans-serif;">
        <h1>JavaScript requerido</h1>
        <p>Esta aplicación requiere JavaScript para funcionar. Por favor, habilite JavaScript en su navegador.</p>
      </div>
    </noscript>
  </body>
</html>

// === ARCHIVO: client/src/features/orders/OrdersPage.tsx ===
import { useState } from 'react';
import { OrderForm } from './components/OrderForm';
import { OrderList } from './components/OrderList';
import { useOrders } from './hooks/useOrders';
import { Order } from '../../services/api';
import './OrdersPage.scss';

export function OrdersPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const {
    orders,
    isLoading,
    error,
    createOrder,
    updateOrder,
    deleteOrder,
    refetch
  } = useOrders();

  const handleCreateOrder = async (data: Partial<Order>) => {
    try {
      await createOrder(data);
      setIsFormOpen(false);
      refetch();
    } catch (err) {
      console.error('Error creating order:', err);
    }
  };

  const handleUpdateOrder = async (id: string, data: Partial<Order>) => {
    try {
      await updateOrder({ id, ...data });
      setEditingOrder(null);
      refetch();
    } catch (err) {
      console.error('Error updating order:', err);
    }
  };

  const handleDeleteOrder = async (id: string) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta orden?')) {
      return;
    }
    try {
      await deleteOrder(id);
      refetch();
    } catch (err) {
      console.error('Error deleting order:', err);
    }
  };

  const handleEdit = (order: Order) => {
    setEditingOrder(order);
  };

  const handleCancelEdit = () => {
    setEditingOrder(null);
    setIsFormOpen(false);
  };

  return (
    <div className="orders-page">
      <header className="orders-page__header">
        <h1 className="orders-page__title">Gestión de Órdenes</h1>
        <button
          className="orders-page__create-btn"
          onClick={() => setIsFormOpen(true)}
          aria-label="Crear nueva orden"
        >
          + Nueva Orden
        </button>
      </header>

      {isFormOpen && (
        <OrderForm
          onSubmit={handleCreateOrder}
          onCancel={handleCancelEdit}
          isLoading={isLoading}
        />
      )}

      {editingOrder && (
        <OrderForm
          order={editingOrder}
          onSubmit={(data) => handleUpdateOrder(editingOrder.id, data)}
          onCancel={handleCancelEdit}
          isLoading={isLoading}
        />
      )}

      {error && (
        <div className="orders-page__error" role="alert">
          <p>Error al cargar las órdenes: {error.message}</p>
        </div>
      )}

      <OrderList
        orders={orders}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDeleteOrder}
      />
    </div>
  );
}

// === ARCHIVO: client/src/features/orders/components/OrderForm.tsx ===
import { useState, useEffect } from 'react';
import { Order } from '../../types';
import './OrderForm.scss';

interface OrderFormProps {
  order?: Order;
  onSubmit: (data: Partial<Order>) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

const STATUS_OPTIONS: OrderStatus[] = [
  'PENDING',
  'CONFIRMED',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED'
];

export function OrderForm({ order, onSubmit, onCancel, isLoading }: OrderFormProps) {
  const [formData, setFormData] = useState({
    customerName: order?.customerName || '',
    customerEmail: order?.customerEmail || '',
    total: order?.total?.toString() || '',
    status: order?.status || 'PENDING' as OrderStatus
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (order) {
      setFormData({
        customerName: order.customerName || '',
        customerEmail: order.customerEmail || '',
        total: order.total?.toString() || '',
        status: order.status || 'PENDING'
      });
    }
  }, [order]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = 'El nombre del cliente es obligatorio';
    } else if (formData.customerName.trim().length < 2) {
      newErrors.customerName = 'El nombre debe tener al menos 2 caracteres';
    }

    if (!formData.customerEmail.trim()) {
      newErrors.customerEmail = 'El email del cliente es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) {
      newErrors.customerEmail = 'El email debe tener un formato válido';
    }

    const totalValue = parseFloat(formData.total);
    if (!formData.total || isNaN(totalValue)) {
      newErrors.total = 'El total es obligatorio';
    } else if (totalValue < 0) {
      newErrors.total = 'El total no puede ser negativo';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        customerName: formData.customerName.trim(),
        customerEmail: formData.customerEmail.trim(),
        total: parseFloat(formData.total),
        status: formData.status
      });
    } catch (err) {
      console.error('Error submitting form:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="order-form-overlay">
      <form className="order-form" onSubmit={handleSubmit} noValidate>
        <h2 className="order-form__title">
          {order ? 'Editar Orden' : 'Crear Nueva Orden'}
        </h2>

        <div className="order-form__field">
          <label htmlFor="customerName" className="order-form__label">
            Nombre del Cliente
          </label>
          <input
            id="customerName"
            name="customerName"
            type="text"
            value={formData.customerName}
            onChange={handleChange}
            className={`order-form__input ${errors.customerName ? 'order-form__input--error' : ''}`}
            disabled={isSubmitting}
            aria-invalid={!!errors.customerName}
            aria-describedby={errors.customerName ? 'customerName-error' : undefined}
          />
          {errors.customerName && (
            <span id="customerName-error" className="order-form__error" role="alert">
              {errors.customerName}
            </span>
          )}
        </div>

        <div className="order-form__field">
          <label htmlFor="customerEmail" className="order-form__label">
            Email del Cliente
          </label>
          <input
            id="customerEmail"
            name="customerEmail"
            type="email"
            value={formData.customerEmail}
            onChange={handleChange}
            className={`order-form__input ${errors.customerEmail ? 'order-form__input--error' : ''}`}
            disabled={isSubmitting}
            aria-invalid={!!errors.customerEmail}
            aria-describedby={errors.customerEmail ? 'customerEmail-error' : undefined}
          />
          {errors.customerEmail && (
            <span id="customerEmail-error" className="order-form__error" role="alert">
              {errors.customerEmail}
            </span>
          )}
        </div>

        <div className="order-form__field">
          <label htmlFor="total" className="order-form__label">
            Total
          </label>
          <input
            id="total"
            name="total"
            type="number"
            step="0.01"
            min="0"
            value={formData.total}
            onChange={handleChange}
            className={`order-form__input ${errors.total ? 'order-form__input--error' : ''}`}
            disabled={isSubmitting}
            aria-invalid={!!errors.total}
            aria-describedby={errors.total ? 'total-error' : undefined}
          />
          {errors.total && (
            <span id="total-error" className="order-form__error" role="alert">
              {errors.total}
            </span>
          )}
        </div>

        <div className="order-form__field">
          <label htmlFor="status" className="order-form__label">
            Estado
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="order-form__select"
            disabled={isSubmitting}
          >
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div className="order-form__actions">
          <button
            type="button"
            className="order-form__btn order-form__btn--cancel"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="order-form__btn order-form__btn--submit"
            disabled={isSubmitting || isLoading}
          >
            {isSubmitting ? 'Guardando...' : order ? 'Actualizar' : 'Crear'}
          </button>
        </div>
      </form>
    </div>
  );
}

// === ARCHIVO: client/src/features/orders/components/OrderList.tsx ===
import { Order } from '../../types';
import './OrderList.scss';

interface OrderListProps {
  orders: Order[];
  isLoading: boolean;
  onEdit: (order: Order) => void;
  onDelete: (id: string) => void;
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pendiente',
  CONFIRMED: 'Confirmado',
  SHIPPED: 'Enviado',
  DELIVERED: 'Entregado',
  CANCELLED: 'Cancelado'
};

const STATUS_CLASSES: Record<string, string> = {
  PENDING: 'status--pending',
  CONFIRMED: 'status--confirmed',
  SHIPPED: 'status--shipped',
  DELIVERED: 'status--delivered',
  CANCELLED: 'status--cancelled'
};

const STATUS_ICONS: Record<string, string> = {
  PENDING: '⏳',
  CONFIRMED: '✓',
  SHIPPED: '📦',
  DELIVERED: '✅',
  CANCELLED: '❌'
};

const STATUS_PRIORITY: Record<string, number> = {
  PENDING: 1,
  CONFIRMED: 2,
  SHIPPED: 3,
  DELIVERED: 4,
  CANCELLED: 5
};

type SortField = 'id' | 'customerName' | 'customerEmail' | 'total' | 'status' | 'createdAt' | 'updatedAt';
type SortDirection = 'asc' | 'desc';

interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

export function OrderList({ orders, isLoading, onEdit, onDelete }: OrderListProps) {
  const [sortConfig, setSortConfig] = React.useState<SortConfig>({
    field: 'createdAt',
    direction: 'desc'
  });
  const [filterStatus, setFilterStatus] = React.useState<string>('ALL');
  const [searchTerm, setSearchTerm] = React.useState<string>('');

  const filteredOrders = React.useMemo(() => {
    let result = [...orders];
    
    if (filterStatus !== 'ALL') {
      result = result.filter(order => order.status === filterStatus);
    }
    
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        order =>
          order.customerName.toLowerCase().includes(term) ||
          order.customerEmail.toLowerCase().includes(term) ||
          order.id.toLowerCase().includes(term)
      );
    }
    
    return result;
  }, [orders, filterStatus, searchTerm]);

  const sortedOrders = React.useMemo(() => {
    const sorted = [...filteredOrders];
    sorted.sort((a, b) => {
      let aVal: string | number = '';
      let bVal: string | number = '';
      
      switch (sortConfig.field) {
        case 'id':
        case 'customerName':
        case 'customerEmail':
          aVal = String(a[sortConfig.field] || '').toLowerCase();
          bVal = String(b[sortConfig.field] || '').toLowerCase();
          break;
        case 'total':
          aVal = a.total || 0;
          bVal = b.total || 0;
          break;
        case 'status':
          aVal = STATUS_PRIORITY[a.status] || 0;
          bVal = STATUS_PRIORITY[b.status] || 0;
          break;
        case 'createdAt':
        case 'updatedAt':
          aVal = a[sortConfig.field] ? new Date(a[sortConfig.field]!).getTime() : 0;
          bVal = b[sortConfig.field] ? new Date(b[sortConfig.field]!).getTime() : 0;
          break;
      }
      
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredOrders, sortConfig]);

  const handleSort = (field: SortField) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getSortIndicator = (field: SortField): string => {
    if (sortConfig.field !== field) return '';
    return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
  };

  if (isLoading) {
    return (
      <div className="order-list__loading">
        <div className="order-list__spinner" aria-label="Cargando órdenes">
          <div className="order-list__spinner-circle"></div>
        </div>
        <p>Cargando órdenes...</p>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="order-list__empty">
        <div className="order-list__empty-icon" aria-hidden="true">
          📋
        </div>
        <h3 className="order-list__empty-title">No hay órdenes</h3>
        <p className="order-list__empty-text">
          Crea tu primera orden usando el botón "Nueva Orden"
        </p>
      </div>
    );
  }

  const formatDate = (dateString?: string): string => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const formatCurrency = (amount?: number): string => {
    if (amount === undefined || amount === null) return '-';
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const handleDeleteClick = (id: string) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar la orden ${id}?`)) {
      onDelete(id);
    }
  };

  return (
    <div className="order-list">
      <div className="order-list__controls">
        <div className="order-list__search">
          <input
            type="text"
            placeholder="Buscar por cliente, email o ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="order-list__search-input"
            aria-label="Buscar órdenes"
          />
        </div>
        <div className="order-list__filter">
          <label htmlFor="status-filter" className="order-list__filter-label">
            Filtrar por estado:
          </label>
          <select
            id="status-filter"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="order-list__filter-select"
          >
            <option value="ALL">Todos</option>
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {STATUS_LABELS[status]}
              </option>
            ))}
          </select>
        </div>
        <div className="order-list__summary">
          <span className="order-list__summary-count">
            {sortedOrders.length} de {orders.length} órdenes
          </span>
        </div>
      </div>

      <table className="order-list__table" role="grid" aria-label="Lista de órdenes">
        <thead className="order-list__thead">
          <tr>
            <th 
              scope="col" 
              className="order-list__th order-list__th--sortable"
              onClick={() => handleSort('id')}
              aria-sort={sortConfig.field === 'id' ? (sortConfig.direction === 'asc' ? 'ascending' : 'descending') : 'none'}
            >
              ID{getSortIndicator('id')}
            </th>
            <th 
              scope="col" 
              className="order-list__th order-list__th--sortable"
              onClick={() => handleSort('customerName')}
              aria-sort={sortConfig.field === 'customerName' ? (sortConfig.direction === 'asc' ? 'ascending' : 'descending') : 'none'}
            >
              Cliente{getSortIndicator('customerName')}
            </th>
            <th 
              scope="col" 
              className="order-list__th order-list__th--sortable"
              onClick={() => handleSort('customerEmail')}
              aria-sort={sortConfig.field === 'customerEmail' ? (sortConfig.direction === 'asc' ? 'ascending' : 'descending') : 'none'}
            >
              Email{getSortIndicator('customerEmail')}
            </th>
            <th 
              scope="col" 
              className="order-list__th order-list__th--sortable"
              onClick={() => handleSort('total')}
              aria-sort={sortConfig.field === 'total' ? (sortConfig.direction === 'asc' ? 'ascending' : 'descending') : 'none'}
            >
              Total{getSortIndicator('total')}
            </th>
            <th 
              scope="col" 
              className="order-list__th order-list__th--sortable"
              onClick={() => handleSort('status')}
              aria-sort={sortConfig.field === 'status' ? (sortConfig.direction === 'asc' ? 'ascending' : 'descending') : 'none'}
            >
              Estado{getSortIndicator('status')}
            </th>
            <th 
              scope="col" 
              className="order-list__th order-list__th--sortable"
              onClick={() => handleSort('createdAt')}
              aria-sort={sortConfig.field === 'createdAt' ? (sortConfig.direction === 'asc' ? 'ascending' : 'descending') : 'none'}
            >
              Fecha Creación{getSortIndicator('createdAt')}
            </th>
            <th 
              scope="col" 
              className="order-list__th order-list__th--sortable"
              onClick={() => handleSort('updatedAt')}
              aria-sort={sortConfig.field === 'updatedAt' ? (sortConfig.direction === 'asc' ? 'ascending' : 'descending') : 'none'}
            >
              Fecha Actualización{getSortIndicator('updatedAt')}
            </th>
            <th scope="col" className="order-list__th">Acciones</th>
          </tr>
        </thead>
        <tbody className="order-list__tbody">
          {sortedOrders.map((order) => (
            <tr key={order.id} className="order-list__tr">
              <td className="order-list__td order-list__td--id">
                <code className="order-list__code">{order.id}</code>
              </td>
              <td className="order-list__td">{order.customerName}</td>
              <td className="order-list__td">{order.customerEmail}</td>
              <td className="order-list__td order-list__td--number">
                {formatCurrency(order.total)}
              </td>
              <td className="order-list__td">
                <span
                  className={`order-list__status ${STATUS_CLASSES[order.status] || 'status--default'}`}
                >
                  <span className="order-list__status-icon" aria-hidden="true">
                    {STATUS_ICONS[order.status] || '●'}
                  </span>
                  {STATUS_LABELS[order.status] || order.status}
                </span>
              </td>
              <td className="order-list__td order-list__td--date">
                {formatDate(order.createdAt)}
              </td>
              <td className="order-list__td order-list__td--date">
                {formatDate(order.updatedAt)}
              </td>
              <td className="order-list__td order-list__td--actions">
                <div className="order-list__actions">
                  <button
                    className="order-list__btn order-list__btn--edit"
                    onClick={() => onEdit(order)}
                    aria-label={`Editar orden ${order.id}`}
                    title="Editar"
                  >
                    ✏️
                  </button>
                  <button
                    className="order-list__btn order-list__btn--delete"
                    onClick={() => handleDeleteClick(order.id)}
                    aria-label={`Eliminar orden ${order.id}`}
                    title="Eliminar"
                  >
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const STATUS_OPTIONS: OrderStatus[] = [
  'PENDING',
  'CONFIRMED',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED'
];

type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

import * as React from 'react';

// === ARCHIVO: client/src/services/api.ts ===
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

// === ARCHIVO: client/src/features/orders/hooks/useOrders.ts ===
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiService, type Order, type CreateOrderDto, type UpdateOrderDto } from '../../../services/api';

const ORDERS_QUERY_KEY = ['orders'];
const ORDER_QUERY_KEY = (id: string) => ['orders', id];

interface UseOrdersOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

interface UseOrderOptions {
  enabled?: boolean;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useOrders(options: UseOrdersOptions = {}) {
  const { onSuccess, onError } = options;
  const queryClient = useQueryClient();

  const ordersQuery = useQuery({
    queryKey: ORDERS_QUERY_KEY,
    queryFn: () => apiService.getOrders(),
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateOrderDto) => apiService.createOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY });
      onSuccess?.();
    },
    onError: (error: Error) => {
      onError?.(error);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateOrderDto }) => 
      apiService.updateOrder(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY });
      onSuccess?.();
    },
    onError: (error: Error) => {
      onError?.(error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiService.deleteOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY });
      onSuccess?.();
    },
    onError: (error: Error) => {
      onError?.(error);
    },
  });

  return {
    orders: ordersQuery.data ?? [],
    isLoading: ordersQuery.isLoading,
    isError: ordersQuery.isError,
    error: ordersQuery.error,
    isFetching: ordersQuery.isFetching,
    refetch: ordersQuery.refetch,
    createOrder: createMutation.mutate,
    createOrderAsync: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    createError: createMutation.error,
    updateOrder: updateMutation.mutate,
    updateOrderAsync: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error,
    deleteOrder: deleteMutation.mutate,
    deleteOrderAsync: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    deleteError: deleteMutation.error,
  };
}

export function useOrder(id: string, options: UseOrderOptions = {}) {
  const { enabled = true, onSuccess, onError } = options;
  const queryClient = useQueryClient();

  const orderQuery = useQuery({
    queryKey: ORDER_QUERY_KEY(id),
    queryFn: () => apiService.getOrder(id),
    enabled: enabled && !!id,
    staleTime: 30000,
  });

  const updateMutation = useMutation({
    mutationFn: (data: UpdateOrderDto) => apiService.updateOrder(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORDER_QUERY_KEY(id) });
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY });
      onSuccess?.();
    },
    onError: (error: Error) => {
      onError?.(error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => apiService.deleteOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY });
      onSuccess?.();
    },
    onError: (error: Error) => {
      onError?.(error);
    },
  });

  return {
    order: orderQuery.data,
    isLoading: orderQuery.isLoading,
    isError: orderQuery.isError,
    error: orderQuery.error,
    isFetching: orderQuery.isFetching,
    refetch: orderQuery.refetch,
    updateOrder: updateMutation.mutate,
    updateOrderAsync: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error,
    deleteOrder: deleteMutation.mutate,
    deleteOrderAsync: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    deleteError: deleteMutation.error,
  };
}

// === ARCHIVO: client/src/shared/components/ErrorMessage.tsx ===
import React from 'react';

interface ErrorMessageProps {
  message: string;
  type?: 'error' | 'warning' | 'info';
  onDismiss?: () => void;
  className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  type = 'error',
  onDismiss,
  className = ''
}) => {
  const typeStyles = {
    error: {
      backgroundColor: '#fef2f2',
      borderColor: '#ef4444',
      color: '#b91c1c',
      icon: '⚠️'
    },
    warning: {
      backgroundColor: '#fffbeb',
      borderColor: '#f59e0b',
      color: '#b45309',
      icon: '⚡'
    },
    info: {
      backgroundColor: '#eff6ff',
      borderColor: '#3b82f6',
      color: '#1d4ed8',
      icon: 'ℹ️'
    }
  };

  const styles = typeStyles[type];

  const containerStyle: React.CSSProperties = {
    padding: '12px 16px',
    borderRadius: '8px',
    border: `1px solid ${styles.borderColor}`,
    backgroundColor: styles.backgroundColor,
    color: styles.color,
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '14px',
    lineHeight: '1.5',
    marginBottom: '16px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
  };

  const iconStyle: React.CSSProperties = {
    fontSize: '18px',
    flexShrink: 0
  };

  const messageStyle: React.CSSProperties = {
    flex: 1,
    fontWeight: 500
  };

  const dismissButtonStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
    color: styles.color,
    opacity: 0.7,
    transition: 'opacity 0.2s ease',
    fontSize: '16px',
    lineHeight: 1
  };

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`error-message ${className}`}
      style={containerStyle}
    >
      <span style={iconStyle} aria-hidden="true">{styles.icon}</span>
      <span style={messageStyle}>{message}</span>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          style={dismissButtonStyle}
          aria-label="Cerrar mensaje"
          onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;

// === ARCHIVO: client/src/shared/components/LoadingSpinner.tsx ===
import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  backgroundColor?: string;
  label?: string;
  fullScreen?: boolean;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  color = '#3b82f6',
  backgroundColor = '#f3f4f6',
  label = 'Cargando...',
  fullScreen = false,
  className = ''
}) => {
  const sizeConfig = {
    small: { spinner: 24, border: 3, fontSize: '12px' },
    medium: { spinner: 40, border: 4, fontSize: '14px' },
    large: { spinner: 56, border: 5, fontSize: '16px' }
  };

  const config = sizeConfig[size];

  const containerStyle: React.CSSProperties = fullScreen
    ? {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        zIndex: 9999,
        gap: '16px'
      }
    : {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '24px',
        gap: '16px'
      };

  const spinnerStyle: React.CSSProperties = {
    width: `${config.spinner}px`,
    height: `${config.spinner}px`,
    border: `${config.border}px solid ${backgroundColor}`,
    borderTop: `${config.border}px solid ${color}`,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
  };

  const labelStyle: React.CSSProperties = {
    color: '#6b7280',
    fontSize: config.fontSize,
    fontWeight: 500,
    letterSpacing: '0.5px'
  };

  const keyframes = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;

  return (
    <>
      <style>{keyframes}</style>
      <div
        role="status"
        aria-live="polite"
        aria-busy="true"
        className={`loading-spinner ${className}`}
        style={containerStyle}
      >
        <div style={spinnerStyle} aria-hidden="true" />
        <span style={labelStyle}>{label}</span>
        <span className="sr-only">Cargando contenido, por favor espere</span>
      </div>
    </>
  );
};

export default LoadingSpinner;

// === ARCHIVO: client/src/shared/styles/global.scss ===
/* Estilos pendientes: archivo creado automaticamente porque otro modulo lo importa. */


// === ARCHIVO: client/src/features/orders/OrdersPage.scss ===
/* Estilos pendientes: archivo creado automaticamente porque otro modulo lo importa. */


// === ARCHIVO: client/src/features/orders/components/OrderForm.scss ===
/* Estilos pendientes: archivo creado automaticamente porque otro modulo lo importa. */


// === ARCHIVO: client/src/features/orders/components/OrderList.scss ===
/* Estilos pendientes: archivo creado automaticamente porque otro modulo lo importa. */


// === ARCHIVO: client/src/setupTests.ts ===
// Setup de tests generado automaticamente (referenciado por la config del runner).
// Agrega aca matchers globales o mocks compartidos.
export {};


// === ARCHIVO: client/src/features/types.ts ===
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

// === ARCHIVO: infra/providers.tf ===
# Configuración de providers para Terraform
# Este archivo define los providers necesarios para interactuar con AWS
# y asegura que se utilicen las versiones especificadas para evitar breaking changes.

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "5.50.0"
    }
  }
  required_version = ">= 1.0.0"
}

# Configuración del provider AWS
# Se utilizan variables para permitir la configuración dinámica según el entorno.
provider "aws" {
  region = var.aws_region
  # Las credenciales se configuran mediante AWS CLI o variables de entorno
  # para evitar hardcodear valores sensibles.
}

# Variables globales para la configuración del provider
# Estas variables se definen en variables.tf y se utilizan aquí para parametrizar
# la configuración del provider.
variable "aws_region" {
  description = "Región de AWS donde se desplegarán los recursos"
  type        = string
  default     = "us-east-1"
}

// === ARCHIVO: infra/variables.tf ===
# Definición de variables de entrada para Terraform
# Estas variables permiten parametrizar la configuración de la infraestructura
# y adaptarla a diferentes entornos (dev, staging, prod).

# Variables globales
variable "aws_region" {
  description = "Región de AWS donde se desplegarán los recursos"
  type        = string
  default     = "us-east-1"
}

# Variables para DynamoDB
variable "dynamodb_table_name" {
  description = "Nombre de la tabla DynamoDB para las órdenes"
  type        = string
  default     = "orders-table"
}

variable "dynamodb_billing_mode" {
  description = "Modo de facturación para la tabla DynamoDB (PROVISIONED o PAY_PER_REQUEST)"
  type        = string
  default     = "PAY_PER_REQUEST"
}

variable "dynamodb_read_capacity" {
  description = "Capacidad de lectura provisionada para la tabla DynamoDB"
  type        = number
  default     = 5
}

variable "dynamodb_write_capacity" {
  description = "Capacidad de escritura provisionada para la tabla DynamoDB"
  type        = number
  default     = 5
}

variable "dynamodb_hash_key" {
  description = "Clave hash (partition key) para la tabla DynamoDB"
  type        = string
  default     = "order_id"
}

variable "dynamodb_attributes" {
  description = "Lista de atributos para la tabla DynamoDB"
  type = list(object({
    name = string
    type = string
  }))
  default = [
    {
      name = "order_id"
      type = "S"
    },
    {
      name = "status"
      type = "S"
    },
    {
      name = "created_at"
      type = "S"
    },
    {
      name = "updated_at"
      type = "S"
    }
  ]
}

# Variables para entornos
variable "environment" {
  description = "Entorno donde se desplegará la infraestructura (dev, staging, prod)"
  type        = string
  default     = "dev"
}

// === ARCHIVO: infra/modules/dynamodb/variables.tf ===
# Variables específicas para el módulo DynamoDB
# Estas variables permiten configurar la tabla DynamoDB de manera flexible
# y reutilizable en diferentes entornos.

variable "table_name" {
  description = "Nombre de la tabla DynamoDB"
  type        = string
}

variable "billing_mode" {
  description = "Modo de facturación para la tabla DynamoDB (PROVISIONED o PAY_PER_REQUEST)"
  type        = string
  default     = "PAY_PER_REQUEST"
}

variable "read_capacity" {
  description = "Capacidad de lectura provisionada para la tabla DynamoDB"
  type        = number
  default     = 5
}

variable "write_capacity" {
  description = "Capacidad de escritura provisionada para la tabla DynamoDB"
  type        = number
  default     = 5
}

variable "hash_key" {
  description = "Clave hash (partition key) para la tabla DynamoDB"
  type        = string
}

variable "attributes" {
  description = "Lista de atributos para la tabla DynamoDB"
  type = list(object({
    name = string
    type = string
  }))
}

variable "environment" {
  description = "Entorno donde se desplegará la tabla DynamoDB (dev, staging, prod)"
  type        = string
  default     = "dev"
}

variable "tags" {
  description = "Tags para la tabla DynamoDB"
  type        = map(string)
  default = {
    Terraform   = "true"
    Environment = "dev"
  }
}

// === ARCHIVO: infra/versions.tf ===
terraform {
  required_version = ">= 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "5.50.0"
    }
  }
}

# Configuración del proveedor de AWS para todas las regiones
# El proveedor se configura en el archivo providers.tf del raíz del proyecto
# Esta configuración define las restricciones de versión que Terraform aceptará
# Al usar version = "5.50.0" aseguramos compatibilidad con los recursos de DynamoDB
# que utilizaremos en este módulo. Los cambios menores dentro de la versión
# mayor no deben afectar la funcionalidad siempre que respetemos la API estable.
# La versión de Terraform >= 1.0 garantiza acceso a todas las features modernas
# incluyendo el formato de estado mejorado y las capacidades de validación.

// === ARCHIVO: infra/README.md ===
# Módulo de Infraestructura DynamoDB

Este módulo define la infraestructura necesaria para persistir órdenes en DynamoDB.

## Recursos Definidos

- **Tabla DynamoDB**: Almacena las órdenes del sistema con los siguientes atributos:
  - `orderId` (PK): Identificador único de la orden
  - `status`: Estado de la orden (PENDING, COMPLETED, CANCELLED)
  - `createdAt`: Fecha de creación de la orden
  - `updatedAt`: Fecha de última modificación
  - `customerId`: Identificador del cliente
  - `totalAmount`: Monto total de la orden

## Estructura del Módulo

```
infra/
├── versions.tf       # Configuración de versiones de Terraform y providers
├── main.tf           # Definición de recursos principales
├── variables.tf      # Variables de entrada del módulo
├── outputs.tf        # Salidas del módulo para consumo externo
└── README.md         # Este archivo
```

## Uso del Módulo

Para utilizar este módulo desde la raíz del proyecto:

```hcl
module "dynamodb" {
  source = "./infra"

  environment = "dev"
  table_name  = "orders"
}
```

## Validación Local

Para validar la configuración de Terraform:

```bash
# Inicializar Terraform
terraform init

# Validar sintaxis y configuración
terraform validate

# Planificar cambios (ver qué recursos se crearán)
terraform plan
```

## Requisitos

- Terraform >= 1.0
- Proveedor AWS hashicorp/aws 5.50.0
- Credenciales de AWS configuradas (variables de entorno, profile o IAM role)

## Notas

- La tabla usa PAY_PER_REQUEST para el modo de facturación
- El encryption está habilitado por defecto con AWS owned key
- La eliminación automática está deshabilitada para proteger datos
- El throughput inicial es 5 reads y 5 writes (mínimo para tablas underlay)

// === ARCHIVO: infra/main.tf ===
# Definición de recursos de infraestructura para DynamoDB
# Este archivo contiene la configuración de la tabla de órdenes
# que será utilizada por la aplicación para persistir datos

resource "aws_dynamodb_table" "orders" {
  name           = var.table_name
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "orderId"
  range_key      = "customerId"

  attribute {
    name = "orderId"
    type = "S"
  }

  attribute {
    name = "customerId"
    type = "S"
  }

  attribute {
    name = "status"
    type = "S"
  }

  attribute {
    name = "createdAt"
    type = "S"
  }

  global_secondary_index {
    name            = "status-created-index"
    hash_key        = "status"
    range_key       = "createdAt"
    projection_type = "ALL"
    read_capacity   = 5
    write_capacity  = 5
  }

  local_secondary_index {
    name            = "customer-orders-index"
    range_key       = "createdAt"
    projection_type = "ALL"
  }

  tags = {
    Environment = var.environment
    Project     = "orders-api"
    ManagedBy   = "terraform"
  }

  point_in_time_recovery {
    enabled = var.enable_pit_recovery
  }

  ttl {
    attribute_name = "expirationTime"
    enabled        = var.enable_ttl
  }
}

resource "aws_iam_role" "dynamodb_access" {
  name = "${var.environment}-dynamodb-access-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      }
    ]
  })

  tags = var.common_tags
}

resource "aws_iam_policy" "dynamodb_read_write" {
  name        = "${var.environment}-dynamodb-read-write-policy"
  description = "Política de lectura y escritura para la tabla de órdenes"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "dynamodb:PutItem",
          "dynamodb:GetItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem",
          "dynamodb:Query",
          "dynamodb:Scan"
        ]
        Resource = [
          aws_dynamodb_table.orders.arn,
          "${aws_dynamodb_table.orders.arn}/index/*"
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "dynamodb:DescribeTable",
          "dynamodb:GetItem",
          "dynamodb:Scan"
        ]
        Resource = aws_dynamodb_table.orders.arn
      }
    ]
  })

  tags = var.common_tags
}

resource "aws_iam_role_policy_attachment" "dynamodb_access_attach" {
  role       = aws_iam_role.dynamodb_access.name
  policy_arn = aws_iam_policy.dynamodb_read_write.arn
}

resource "aws_ssm_parameter" "dynamodb_table_name" {
  name  = "/${var.environment}/dynamodb/table-name"
  type  = "String"
  value = aws_dynamodb_table.orders.name

  tags = var.common_tags
}

resource "aws_ssm_parameter" "dynamodb_endpoint" {
  name  = "/${var.environment}/dynamodb/endpoint"
  type  = "String"
  value = "https://dynamodb.${var.region}.amazonaws.com"

  tags = var.common_tags
}

resource "aws_kms_key" "dynamodb_encryption" {
  description             = "Clave KMS para cifrado de la tabla de órdenes"
  deletion_window_in_days = 10
  enable_key_rotation     = true

  tags = merge(
    var.common_tags,
    {
      Name = "${var.environment}-dynamodb-kms-key"
    }
  )
}

resource "aws_kms_alias" "dynamodb_encryption_alias" {
  name          = "alias/${var.environment}-orders-key"
  target_key_id = aws_kms_key.dynamodb_encryption.key_id
}

resource "aws_cloudwatch_log_group" "dynamodb_audit" {
  name              = "/aws/dynamodb/${var.environment}/orders-audit"
  retention_in_days = var.log_retention_days
  kms_key_id        = aws_kms_key.dynamodb_encryption.arn

  tags = var.common_tags
}

// === ARCHIVO: infra/outputs.tf ===
output "dynamodb_table_name" {
  description = "Nombre de la tabla de órdenes en DynamoDB"
  value       = module.dynamodb.table_name
}

output "dynamodb_table_arn" {
  description = "ARN de la tabla de órdenes en DynamoDB"
  value       = module.dynamodb.table_arn
}

output "dynamodb_table_id" {
  description = "ID único de la tabla de órdenes en DynamoDB"
  value       = module.dynamodb.table_id
}

output "dynamodb_endpoint" {
  description = "Endpoint de la tabla de órdenes en DynamoDB"
  value       = "https://dynamodb.${var.region}.amazonaws.com"
}

output "dynamodb_region" {
  description = "Región donde está desplegada la tabla de órdenes"
  value       = var.region
}

output "environment" {
  description = "Entorno de despliegue"
  value       = var.environment
}

output "table_status" {
  description = "Estado actual de la tabla de DynamoDB"
  value       = module.dynamodb.table_item_count
}

// === ARCHIVO: infra/environments/dev/terraform.tfvars ===
region             = "us-east-1"
environment        = "dev"

# Configuración de la tabla de DynamoDB para órdenes
dynamodb_table_name = "orders-dev"

# Modo de facturación bajo demanda para desarrollo (ahorro de costos)
billing_mode        = "PAY_PER_REQUEST"

# Capacidad Provisionada (solo usado si billing_mode = PROVISIONED)
read_capacity  = 5
write_capacity = 5

# Habilitar eliminación de tabla al destruir (cuidado en producción)
delete_table_on_destroy = true

# Configuración de Point-in-Time Recovery
enable_point_in_time_recovery = true

# TTL para auto-limpieza de datos (en días)
ttl_days = 30

# Tags específicos del entorno
tags = {
  Environment = "dev"
  ManagedBy   = "terraform"
  Project     = "orders-api"
  CostCenter  = "engineering"
  DataClassification = "internal"
}

# Configuración de replicación (solo para producción)
enable_replication = false

# Configuración de streams para captura de cambios
enable_dynamodb_streams = true
stream_view_type = "NEW_AND_OLD_IMAGES"

# Límites de capacidad máxima (protección contra costos excesivos)
max_read_capacity  = 20
max_write_capacity = 20

// === ARCHIVO: infra/modules/dynamodb/main.tf ===
terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.50"
    }
  }
}

resource "aws_dynamodb_table" "orders" {
  name           = var.table_name
  billing_mode   = var.billing_mode
  hash_key       = var.partition_key_name
  range_key      = var.sort_key_name
  table_class    = var.table_class

  attribute {
    name = var.partition_key_name
    type = "S"
  }

  dynamic "attribute" {
    for_each = var.sort_key_name != "" ? [1] : []
    content {
      name = var.sort_key_name
      type = "S"
    }
  }

  attribute {
    name = "status"
    type = "S"
  }

  attribute {
    name = "customerId"
    type = "S"
  }

  global_secondary_index {
    name            = "status-createdAt-index"
    hash_key        = "status"
    range_key       = "createdAt"
    projection_type = "ALL"
    read_capacity   = var.gsi_read_capacity
    write_capacity  = var.gsi_write_capacity
  }

  global_secondary_index {
    name            = "customerId-index"
    hash_key        = "customerId"
    projection_type = "ALL"
    read_capacity   = var.gsi_read_capacity
    write_capacity  = var.gsi_write_capacity
  }

  ttl {
    attribute_name = "ttl"
    enabled        = var.ttl_enabled
  }

  point_in_time_recovery {
    enabled = var.point_in_time_recovery_enabled
  }

  server_side_encryption {
    enabled     = var.server_side_encryption_enabled
    kms_key_arn = var.kms_key_arn
  }

  tags = merge(
    var.tags,
    {
      "Name"        = var.table_name
      "Environment" = var.environment
      "Component"   = "orders"
    }
  )

  lifecycle {
    prevent_destroy = var.prevent_destroy
    ignore_changes = [tags]
  }
}

resource "aws_iam_policy" "dynamodb_read_policy" {
  name        = "${var.table_name}-read-policy"
  description = "Política de lectura para la tabla de órdenes en DynamoDB"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowReadAccess"
        Effect = "Allow"
        Action = [
          "dynamodb:GetItem",
          "dynamodb:Query",
          "dynamodb:Scan",
          "dynamodb:DescribeTable"
        ]
        Resource = [
          aws_dynamodb_table.orders.arn,
          "${aws_dynamodb_table.orders.arn}/index/*"
        ]
      }
    ]
  })

  tags = var.tags
}

resource "aws_iam_policy" "dynamodb_write_policy" {
  name        = "${var.table_name}-write-policy"
  description = "Política de escritura para la tabla de órdenes en DynamoDB"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowWriteAccess"
        Effect = "Allow"
        Action = [
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem",
          "dynamodb:DescribeTable"
        ]
        Resource = [
          aws_dynamodb_table.orders.arn,
          "${aws_dynamodb_table.orders.arn}/index/*"
        ]
      },
      {
        Sid    = "AllowTTLManagement"
        Effect = "Allow"
        Action = [
          "dynamodb:UpdateTimeToLive",
          "dynamodb:DescribeTimeToLive"
        ]
        Resource = aws_dynamodb_table.orders.arn
      }
    ]
  })

  tags = var.tags
}

resource "aws_iam_policy" "dynamodb_full_access_policy" {
  name        = "${var.table_name}-full-access-policy"
  description = "Política de acceso completo para la tabla de órdenes en DynamoDB"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowFullAccess"
        Effect = "Allow"
        Action = [
          "dynamodb:*"
        ]
        Resource = [
          aws_dynamodb_table.orders.arn,
          "${aws_dynamodb_table.orders.arn}/index/*"
        ]
      }
    ]
  })

  tags = var.tags
}

resource "aws_cloudwatch_log_group" "dynamodb_logs" {
  name              = "/aws/dynamodb/${var.table_name}"
  retention_in_days = var.log_retention_days
  kms_key_id        = var.cloudwatch_kms_key_arn
  tags              = var.tags
}

resource "aws_dynamodb_table" "orders_backup" {
  count = var.enable_backup_table ? 1 : 0

  name           = "${var.table_name}-backup"
  billing_mode   = var.billing_mode
  hash_key       = var.partition_key_name
  range_key      = var.sort_key_name
  table_class    = var.table_class

  attribute {
    name = var.partition_key_name
    type = "S"
  }

  attribute {
    name = var.sort_key_name
    type = "S"
  }

  ttl {
    attribute_name = "ttl"
    enabled        = true
  }

  server_side_encryption {
    enabled     = true
    kms_key_arn = var.kms_key_arn
  }

  tags = merge(
    var.tags,
    {
      "Name"        = "${var.table_name}-backup"
      "Environment" = var.environment
      "Component"   = "orders-backup"
      "Backup"      = "true"
    }
  )
}

// === ARCHIVO: infra/modules/dynamodb/outputs.tf ===
output "table_name" {
  description = "Nombre de la tabla de órdenes en DynamoDB"
  value       = aws_dynamodb_table.orders.name
}

output "table_arn" {
  description = "ARN completo de la tabla de órdenes"
  value       = aws_dynamodb_table.orders.arn
}

output "table_id" {
  description = "Identificador único de la tabla de órdenes"
  value       = aws_dynamodb_table.orders.id
}

output "table_status" {
  description = "Estado actual de la tabla (ACTIVE, CREATING, DELETING, UPDATING)"
  value       = aws_dynamodb_table.orders.status
}

output "table_size_bytes" {
  description = "Tamaño actual de la tabla en bytes"
  value       = aws_dynamodb_table.orders.table_size_bytes
}

output "item_count" {
  description = "Cantidad de elementos actualmente almacenados en la tabla"
  value       = aws_dynamodb_table.orders.item_count
}

output "partition_key_name" {
  description = "Nombre de la clave de partición"
  value       = var.partition_key_name
}

output "partition_key_type" {
  description = "Tipo de la clave de partición"
  value       = "S"
}

output "sort_key_name" {
  description = "Nombre de la clave de ordenación"
  value       = var.sort_key_name
}

output "sort_key_type" {
  description = "Tipo de la clave de ordenación"
  value       = "S"
}

output "gsi_status_createdAt_index_name" {
  description = "Nombre del índice global secundario para status y createdAt"
  value       = "status-createdAt-index"
}

output "gsi_customerId_index_name" {
  description = "Nombre del índice global secundario para customerId"
  value       = "customerId-index"
}

output "read_policy_arn" {
  description = "ARN de la política IAM de lectura para la tabla"
  value       = aws_iam_policy.dynamodb_read_policy.arn
}

output "write_policy_arn" {
  description = "ARN de la política IAM de escritura para la tabla"
  value       = aws_iam_policy.dynamodb_write_policy.arn
}

output "full_access_policy_arn" {
  description = "ARN de la política IAM de acceso completo para la tabla"
  value       = aws_iam_policy.dynamodb_full_access_policy.arn
}

output "log_group_name" {
  description = "Nombre del grupo de logs de CloudWatch para la tabla"
  value       = aws_cloudwatch_log_group.dynamodb_logs.name
}

output "backup_table_name" {
  description = "Nombre de la tabla de backup si está habilitada"
  value       = var.enable_backup_table ? aws_dynamodb_table.orders_backup[0].name : null
}

output "backup_table_arn" {
  description = "ARN de la tabla de backup si está habilitada"
  value       = var.enable_backup_table ? aws_dynamodb_table.orders_backup[0].arn : null
}

output "table_endpoint" {
  description = "Endpoint de la tabla de DynamoDB"
  value       = aws_dynamodb_table.orders.endpoint
}

output "billing_mode" {
  description = "Modo de facturación de la tabla (PROVISIONED o PAY_PER_REQUEST)"
  value       = aws_dynamodb_table.orders.billing_mode
}

output "table_class" {
  description = "Clase de almacenamiento de la tabla (STANDARD o STANDARD_INFREQUENT_ACCESS)"
  value       = aws_dynamodb_table.orders.table_class
}

output "stream_arn" {
  description = "ARN del stream de DynamoDB Streams si está habilitado"
  value       = aws_dynamodb_table.orders.stream_arn
}

output "replica_regions" {
  description = "Regiones configuradas para replicación de la tabla"
  value       = aws_dynamodb_table.orders.replica
}

// === ARCHIVO: docker-compose.yml ===
# Infraestructura local del reto. SOLO desarrollo: credenciales de ejemplo (local-dev-only), puertos en loopback.
# Levantar: docker compose up -d --wait
name: infra-local
services:
  dynamodb-local:
    image: "amazon/dynamodb-local:2.5.2"
    command: ["-jar","DynamoDBLocal.jar","-sharedDb","-inMemory"]
    ports:
      - "127.0.0.1:8000:8000"
    healthcheck:
      test: ["CMD-SHELL","bash -c ':> /dev/tcp/127.0.0.1/8000' || exit 1"]
      interval: 10s
      timeout: 5s
      retries: 10
      start_period: 5s


// === ARCHIVO: infra-local/README.md ===
# Infraestructura local

Servicios de soporte para el reto, definidos en `docker-compose.yml` (raiz del repo).

```bash
docker compose up -d --wait
```

| Servicio | Imagen | Puertos (host) |
|---|---|---|
| DynamoDB Local | `amazon/dynamodb-local:2.5.2` | 8000 |

Credenciales: solo de desarrollo local (`local-dev-only`, `local`). No son secretos ni deben reutilizarse.
Los scripts de `infra-local/` (tablas, topics) se ejecutan con el compose en estado healthy.


// === ARCHIVO: infra-local/dynamodb/create-tables.sh ===
#!/usr/bin/env bash
# Crea las tablas en DynamoDB Local (idempotente). Credenciales dummy: DynamoDB Local no valida firmas.
set -euo pipefail

export AWS_ACCESS_KEY_ID=local
export AWS_SECRET_ACCESS_KEY=local
export AWS_REGION=us-east-1
ENDPOINT="${DYNAMODB_ENDPOINT:-http://localhost:8000}"

create_table() {
  local name="$1" pk="$2" sk="${3:-}"
  if aws dynamodb describe-table --table-name "$name" --endpoint-url "$ENDPOINT" >/dev/null 2>&1; then
    echo "Tabla $name ya existe"
    return
  fi
  local attrs="AttributeName=$pk,AttributeType=S"
  local keys="AttributeName=$pk,KeyType=HASH"
  if [ -n "$sk" ]; then
    attrs="$attrs AttributeName=$sk,AttributeType=S"
    keys="$keys AttributeName=$sk,KeyType=RANGE"
  fi
  # shellcheck disable=SC2086
  aws dynamodb create-table --table-name "$name" --attribute-definitions $attrs --key-schema $keys \
    --billing-mode PAY_PER_REQUEST --endpoint-url "$ENDPOINT" >/dev/null
  echo "Tabla $name creada"
}

create_table "app-items" "id"

```

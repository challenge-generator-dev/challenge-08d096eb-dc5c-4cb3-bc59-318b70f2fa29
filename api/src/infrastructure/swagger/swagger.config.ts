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
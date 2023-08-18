import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';

export function useSwagger(
  app: INestApplication,
  title: string,
  version: string,
): OpenAPIObject {
  const config = new DocumentBuilder()
    .setTitle(title)
    .setVersion(version)
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  return document;
}

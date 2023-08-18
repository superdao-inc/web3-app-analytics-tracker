import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

enum LogLevel {
  Fatal = 'fatal',
  Error = 'error',
  Warn = 'warn',
  Info = 'info',
  Debug = 'debug',
  Trace = 'trace',
}

export class Env {
  @IsNumber()
  @IsNotEmpty()
  PORT: number;

  @IsEnum(Environment)
  @IsNotEmpty()
  NODE_ENV: string;

  @IsString()
  @IsNotEmpty()
  ENV_NAME: string;

  @IsString()
  @IsEnum(LogLevel)
  LOG_LEVEL = 'info';

  @IsString()
  @IsNotEmpty()
  KAFKA_HOST: string;

  @IsNumber()
  @IsNotEmpty()
  KAFKA_PORT: number;

  @IsString()
  @IsNotEmpty()
  KAFKA_GROUP_ID: string;

  @IsString()
  KAFKA_USER: string;

  @IsString()
  KAFKA_PASSWORD: string;
}

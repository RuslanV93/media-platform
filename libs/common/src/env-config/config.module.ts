import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { Schema } from 'joi';
import { existsSync } from 'fs';
import { AppConfigService } from '@common/env-config/config.service';

export interface AppConfigOptions {
  appName: string;
  additionalEnvPaths?: string[];
  validationSchema?: Schema;
  loadGlobalEnv?: boolean;
}

@Module({})
export class SharedConfigModule {
  static forRoot(options: AppConfigOptions): DynamicModule {
    const envPaths = this.buildEnvPaths(options);

    return {
      module: SharedConfigModule,
      imports: [
        ConfigModule.forRoot({
          envFilePath: envPaths,
          isGlobal: true,
          expandVariables: true,
          validationSchema: options.validationSchema,
          validationOptions: {
            allowUnknown: true,
            abortEarly: true,
          },
        }),
      ],
      providers: [
        {
          provide: AppConfigService,
          useFactory: (configService: ConfigService) => {
            return new AppConfigService(configService);
          },
          inject: [ConfigService],
        },
        {
          provide: 'APP_NAME',
          useValue: options.appName,
        },
      ],
      exports: [ConfigModule, AppConfigService, 'APP_NAME'],
    };
  }

  private static buildEnvPaths(options: AppConfigOptions): string[] {
    const { appName, additionalEnvPaths = [], loadGlobalEnv = true } = options;
    const nodeEnv = process.env.NODE_ENV || 'development';
    const paths: string[] = [];

    // 1. Дополнительные пути (если указаны)
    paths.push(...additionalEnvPaths);

    // 2. Основные файлы из папки env в корне (твоя структура)
    const envDir = join(process.cwd(), 'env');
    paths.push(
      join(envDir, `.env.${nodeEnv}.local`),
      join(envDir, '.env.local'),
      join(envDir, `.env.${nodeEnv}`),
      join(envDir, '.env'),
    );

    // 3. Локальные файлы приложения (для гибкости)
    const appEnvDir = join(process.cwd(), 'apps', appName, 'env');
    paths.push(
      join(appEnvDir, `.env.${nodeEnv}.local`),
      join(appEnvDir, '.env.local'),
      join(appEnvDir, `.env.${nodeEnv}`),
      join(appEnvDir, '.env'),
    );

    // 4. Общие файлы из корня проекта (если включено)
    if (loadGlobalEnv) {
      const rootEnvDir = process.cwd();
      paths.push(
        join(rootEnvDir, `.env.${nodeEnv}.local`),
        join(rootEnvDir, '.env.local'),
        join(rootEnvDir, `.env.${nodeEnv}`),
        join(rootEnvDir, '.env'),
      );
    }

    // Фильтруем только существующие файлы
    const existingPaths = paths.filter((path) => existsSync(path));

    console.log(`📁 [${appName}] Loading env files:`, existingPaths);

    return existingPaths;
  }
}

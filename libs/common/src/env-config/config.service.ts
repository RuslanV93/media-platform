import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService extends NestConfigService {
  constructor(configService: NestConfigService) {
    super(configService['internalConfig']);
  }

  // Геттеры для общих настроек
  get port(): number {
    const port = this.get<number>('PORT');
    if (!port) {
      throw new Error('Port is required');
    }
    return port;
  }

  get nodeEnv(): string {
    const nodeEnv = this.get<string>('NODE_ENV', 'development');
    if (!nodeEnv) {
      throw new Error('NodeEnv from env is required');
    }
    return nodeEnv;
  }

  get isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }

  get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  // База данных
  get usersDatabaseUrl(): string {
    const url = this.get<string>('USER_SERVICE_DATABASE_URL');
    if (!url) {
      throw new Error('usersDatabaseUrl is required');
    }
    return url;
  }

  // Сервисы URLs
  get userServiceUrl(): string {
    const userServiceUrl = this.get<string>('USER_SERVICE_URL');
    if (!userServiceUrl) {
      throw new Error('userServiceUrl is required');
    }
    return userServiceUrl;
  }
  get contentServiceUrl(): string {
    const contentServiceUrl = this.get<string>('CONTENT_SERVICE_URL');
    if (!contentServiceUrl) {
      throw new Error('contentServiceUrl is required');
    }
    return contentServiceUrl;
  }

  get proxyTimeout(): number {
    const proxyTimeout = this.get<number>('HTTP_MODULE_TIMEOUT');
    if (!proxyTimeout) {
      throw new Error('proxyTimeout is required');
    }
    return proxyTimeout;
  }

  get proxyMaxRedirects(): number {
    const redirects = this.get<number>('HTTP_REDIRECT');
    if (!redirects) {
      throw new Error('redirects is required');
    }
    return redirects;
  }

  getByPrefix(prefix: string): Record<string, any> {
    const allEnvVars = process.env;
    const result: Record<string, any> = {};

    Object.keys(allEnvVars).forEach((key) => {
      if (key.startsWith(prefix)) {
        const newKey = key.replace(prefix, '').toLowerCase();
        result[newKey] = allEnvVars[key];
      }
    });

    return result;
  }
}

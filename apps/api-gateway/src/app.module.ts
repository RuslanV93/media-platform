import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SharedConfigModule } from '@common/env-config/config.module';
import { apiGatewaySchema } from '@common/env-config/shcemas';
import { HttpModule } from '@nestjs/axios';
import { AppConfigService } from '@common/env-config/config.service';

@Module({
  imports: [
    SharedConfigModule.forRoot({
      appName: 'api-gateway',
      validationSchema: apiGatewaySchema,
    }),
    HttpModule.registerAsync({
      imports: [
        SharedConfigModule.forRoot({
          appName: 'api-gateway',
          validationSchema: apiGatewaySchema,
        }),
      ],
      useFactory: (configService: AppConfigService) => ({
        timeout: configService.proxyTimeout,
        maxRedirects: configService.proxyMaxRedirects,
      }),
      inject: [AppConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

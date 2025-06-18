import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { AppConfigService } from '@common/env-config/config.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private configService: AppConfigService,
  ) {}

  @Get()
  getHello(): string {
    console.log(this.configService.nodeEnv);
    return this.appService.getHello();
  }
}

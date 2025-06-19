import { Controller } from '@nestjs/common';
import { ProxyService } from '../application/proxy.service';

@Controller()
export class ProxyController {
  constructor(private readonly proxyService: ProxyService) {}
}

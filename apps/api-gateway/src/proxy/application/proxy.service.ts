import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AppConfigService } from '@common/env-config/config.service';
import {
  ServicesType,
  ServiceUrlsInterface,
} from '../types/proxy-service.types';
import { catchError, map, Observable } from 'rxjs';
import { AxiosResponse } from 'axios';

@Injectable()
export class ProxyService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: AppConfigService,
  ) {}

  private readonly serviceUrls: ServiceUrlsInterface = {
    users: this.configService.userServiceUrl,
    content: this.configService.contentServiceUrl,
  };
  private getServiceUrl(service: ServicesType) {
    const url: string = this.serviceUrls[service];

    if (!url) {
      throw new HttpException(
        `Service ${service} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    return url;
  }
  proxyGet(service: ServicesType, path: string, headers: any): Observable<any> {
    const serviceUrl = this.getServiceUrl(service);
    const url = `${serviceUrl}${path}`;

    return this.httpService.get(url, { headers }).pipe(
      map((response: AxiosResponse): any => response.data),
      catchError((error) => {
        throw new HttpException(
          error.response?.data || 'Service unavailable',
          error.response?.status || HttpStatus.SERVICE_UNAVAILABLE,
        );
      }),
    );
  }
}

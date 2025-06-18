import { Module } from '@nestjs/common';

export * from './common.module';
export * from './common.service';

export * from './env-config/shcemas';

@Module({})
export class SharedModule {}

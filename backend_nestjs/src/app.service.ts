import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getAppInfo(): object {
    return {
      name: 'MediCRM Backend API',
      version: '1.0.0',
      description: 'MediCRM管理后台系统后端服务',
      timestamp: new Date().toISOString(),
    };
  }

  healthCheck(): object {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
    };
  }
}
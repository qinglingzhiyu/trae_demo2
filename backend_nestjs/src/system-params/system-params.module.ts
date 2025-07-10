import { Module } from '@nestjs/common';
import { SystemParamsController } from './system-params.controller';
import { SystemParamsService } from './system-params.service';

@Module({
  controllers: [SystemParamsController],
  providers: [SystemParamsService],
  exports: [SystemParamsService],
})
export class SystemParamsModule {}
import { Module } from '@nestjs/common';
import { PermissionsModule } from '../permissions/permissions.module';
import { SystemParamsModule } from '../system-params/system-params.module';
import { DictionariesModule } from '../dictionaries/dictionaries.module';
import { AuditLogsModule } from '../audit-logs/audit-logs.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { BackupModule } from '../backup/backup.module';

@Module({
  imports: [
    PermissionsModule,
    SystemParamsModule,
    DictionariesModule,
    AuditLogsModule,
    NotificationsModule,
    BackupModule,
  ],
  exports: [
    PermissionsModule,
    SystemParamsModule,
    DictionariesModule,
    AuditLogsModule,
    NotificationsModule,
    BackupModule,
  ],
})
export class SystemModule {}
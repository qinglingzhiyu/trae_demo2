import { Module } from '@nestjs/common';
import { PermissionsModule } from '../permissions/permissions.module';
import { SystemParamsModule } from '../system-params/system-params.module';
import { DictionariesModule } from '../dictionaries/dictionaries.module';
import { AuditLogsModule } from '../audit-logs/audit-logs.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { BackupModule } from '../backup/backup.module';
import { AccountsModule } from '../accounts/accounts.module';

@Module({
  imports: [
    PermissionsModule,
    SystemParamsModule,
    DictionariesModule,
    AuditLogsModule,
    NotificationsModule,
    BackupModule,
    AccountsModule,
  ],
  exports: [
    PermissionsModule,
    SystemParamsModule,
    DictionariesModule,
    AuditLogsModule,
    NotificationsModule,
    BackupModule,
    AccountsModule,
  ],
})
export class SystemModule {}
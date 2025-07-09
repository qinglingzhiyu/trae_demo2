import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '../../common/constants/enums';

export class PatientEntity {
  @ApiProperty({ description: '就诊人ID', example: 1 })
  id: number;

  @ApiProperty({ description: '用户ID', example: 1 })
  userId: number;

  @ApiProperty({ description: '就诊人姓名', example: '李四' })
  name: string;

  @ApiProperty({ description: '性别', enum: Gender, example: Gender.MALE })
  gender: Gender;

  @ApiProperty({ description: '出生日期', example: '1990-01-01T00:00:00.000Z' })
  birthday: Date;

  @ApiProperty({ description: '手机号码', example: '13800138001' })
  phone: string | null;

  @ApiProperty({ description: '身份证号', example: '110101199001011235' })
  idCard: string | null;

  @ApiProperty({ description: '医保信息', example: '城镇职工医保' })
  medicalInsurance: string | null;

  @ApiProperty({ description: '与用户关系', example: '本人' })
  relationship: string | null;

  @ApiProperty({ description: '紧急联系人电话', example: '13800138002' })
  emergencyContact: string | null;

  @ApiProperty({ description: '过敏史', example: '青霉素过敏' })
  allergies: string | null;

  @ApiProperty({ description: '病史', example: '高血压病史' })
  medicalHistory: string | null;

  @ApiProperty({ description: '创建时间', example: '2023-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ description: '更新时间', example: '2023-01-01T00:00:00.000Z' })
  updatedAt: Date;

  constructor(partial: Partial<PatientEntity>) {
    Object.assign(this, partial);
  }
}
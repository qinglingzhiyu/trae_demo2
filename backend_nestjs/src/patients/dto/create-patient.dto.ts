import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional, IsDateString, Length, Matches } from 'class-validator';
import { Gender } from '../../common/constants/enums';

export class CreatePatientDto {
  @ApiProperty({ description: '就诊人姓名', example: '李四' })
  @IsString()
  @Length(2, 50, { message: '姓名长度必须在2-50个字符之间' })
  name: string;

  @ApiProperty({ description: '性别', enum: Gender, example: Gender.MALE })
  @IsEnum(Gender, { message: '请选择正确的性别' })
  gender: Gender;

  @ApiProperty({ description: '出生日期', example: '1990-01-01' })
  @IsDateString({}, { message: '请输入正确的日期格式' })
  birthday: string;

  @ApiProperty({ description: '手机号码', example: '13800138001', required: false })
  @IsOptional()
  @IsString()
  @Matches(/^1[3-9]\d{9}$/, { message: '请输入正确的手机号码' })
  phone?: string;

  @ApiProperty({ description: '身份证号', example: '110101199001011235', required: false })
  @IsOptional()
  @IsString()
  @Matches(/^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/, {
    message: '请输入正确的身份证号码'
  })
  idCard?: string;

  @ApiProperty({ description: '医保信息', example: '城镇职工医保', required: false })
  @IsOptional()
  @IsString()
  @Length(1, 50, { message: '医保信息长度不能超过50个字符' })
  medicalInsurance?: string;

  @ApiProperty({ description: '与用户关系', example: '本人', required: false })
  @IsOptional()
  @IsString()
  @Length(1, 20, { message: '关系描述长度不能超过20个字符' })
  relationship?: string;

  @ApiProperty({ description: '紧急联系人电话', example: '13800138002', required: false })
  @IsOptional()
  @IsString()
  @Matches(/^1[3-9]\d{9}$/, { message: '请输入正确的紧急联系人电话' })
  emergencyContact?: string;

  @ApiProperty({ description: '过敏史', example: '青霉素过敏', required: false })
  @IsOptional()
  @IsString()
  allergies?: string;

  @ApiProperty({ description: '病史', example: '高血压病史', required: false })
  @IsOptional()
  @IsString()
  medicalHistory?: string;
}
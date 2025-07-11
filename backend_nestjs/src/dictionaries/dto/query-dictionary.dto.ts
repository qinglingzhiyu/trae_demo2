import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryDictionaryDto {
  @ApiProperty({ description: '页码', example: 1, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiProperty({ description: '每页数量', example: 10, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiProperty({ description: '搜索关键词', example: '性别', required: false })
  @IsOptional()
  @IsString()
  search?: string;
}

export class QueryDictionaryItemDto {
  @ApiProperty({ description: '页码', example: 1, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiProperty({ description: '每页数量', example: 10, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiProperty({ description: '搜索关键词', example: '男', required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ description: '字典类型ID', example: 1, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  typeId?: number;
}
import { PartialType } from '@nestjs/swagger';
import { CreateDictionaryDto, CreateDictionaryItemDto } from './create-dictionary.dto';

export class UpdateDictionaryDto extends PartialType(CreateDictionaryDto) {}

export class UpdateDictionaryItemDto extends PartialType(CreateDictionaryItemDto) {}
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { DocumentType } from '../enums/document-type.enum';

export class CreateDocumentDto {
  @ApiProperty({ example: 'Contrat de prestation 2024', description: 'Titre du document' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiPropertyOptional({ example: 'Contrat signé avec le client Dupont', description: 'Description optionnelle' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ enum: DocumentType, example: DocumentType.CONTRACT, description: 'Type du document' })
  @IsEnum(DocumentType, {
    message: `type must be one of: ${Object.values(DocumentType).join(', ')}`,
  })
  @IsNotEmpty()
  type!: DocumentType;

  @ApiProperty({ example: 'alice@cabinet.fr', description: 'Propriétaire du document' })
  @IsString()
  @IsNotEmpty()
  owner!: string;

  @ApiPropertyOptional({ example: '/uploads/contrat-2024.pdf', description: 'Chemin vers le fichier' })
  @IsString()
  @IsOptional()
  filePath?: string;

  @ApiPropertyOptional({ example: 204800, description: 'Taille du fichier en octets' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  fileSize?: number;
}

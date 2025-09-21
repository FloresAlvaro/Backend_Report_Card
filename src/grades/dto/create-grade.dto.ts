import { ApiProperty } from '@nestjs/swagger';

export class CreateGradeDto {
  @ApiProperty({
    description: 'The grade level',
    example: '1A',
  })
  level: string;

  @ApiProperty({
    description: 'Description of the grade',
    example: 'primero de secundaria a',
  })
  description: string;

  @ApiProperty({
    description: 'The status of the grade (active/inactive)',
    example: true,
    default: true,
    required: false,
  })
  status?: boolean;
}

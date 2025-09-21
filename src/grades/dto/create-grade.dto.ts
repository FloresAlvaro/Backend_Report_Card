import { ApiProperty } from '@nestjs/swagger';

export class CreateGradeDto {
  @ApiProperty({
    description: 'The grade value',
    example: '1A',
  })
  level: string;
  @ApiProperty({
    description: 'The status of the grade (active/inactive)',
    example: true,
    default: true,
    required: false,
  })
  status?: boolean;
}

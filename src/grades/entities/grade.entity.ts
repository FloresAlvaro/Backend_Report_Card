import { ApiProperty } from '@nestjs/swagger';

export class Grade {
  @ApiProperty({
    description: 'Unique identifier for the grade',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'The grade value',
    example: '1A',
  })
  level: string;

  @ApiProperty({
    description: 'Status of the grade (active/inactive)',
    example: true,
  })
  status: boolean;

  constructor(partial: Partial<Grade> = {}) {
    Object.assign(this, partial);
    if (this.status === undefined) {
      this.status = true; // Default to active
    }
  }
}

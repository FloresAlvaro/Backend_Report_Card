import { ApiProperty } from '@nestjs/swagger';
export class Subject {
  @ApiProperty({
    description: 'Unique identifier for the subject',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Name of the subject',
    example: 'Mathematics',
  })
  subjectName: string;

  @ApiProperty({
    description: 'Status of the subject',
    example: true,
  })
  status: boolean;

  constructor(partial: Partial<Subject> = {}) {
    Object.assign(this, partial);
    if (this.status === undefined) {
      this.status = true; // Default to active
    }
  }
}

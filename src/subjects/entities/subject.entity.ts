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

  @ApiProperty({
    description: 'ID of the teacher assigned to this subject',
    example: 1,
    required: false,
  })
  teacherId?: number;

  @ApiProperty({
    description: 'Description of the subject content',
    example: 'Advanced mathematics including algebra and geometry',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'Number of hours per week for this subject',
    example: 4,
    required: false,
  })
  hoursPerWeek?: number;

  constructor(partial: Partial<Subject> = {}) {
    Object.assign(this, partial);
    if (this.status === undefined) {
      this.status = true; // Default to active
    }
  }
}

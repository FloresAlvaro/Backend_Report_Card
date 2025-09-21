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

  @ApiProperty({
    description: 'ID of the teacher assigned to this grade',
    example: 1,
    required: false,
  })
  teacherId?: number;

  @ApiProperty({
    description: 'List of student IDs enrolled in this grade',
    example: [1, 2, 3, 4, 5],
    type: [Number],
    required: false,
  })
  studentIds?: number[];

  @ApiProperty({
    description: 'Maximum number of students allowed in this grade',
    example: 30,
    required: false,
  })
  maxStudents?: number;

  constructor(partial: Partial<Grade> = {}) {
    Object.assign(this, partial);
    if (this.status === undefined) {
      this.status = true; // Default to active
    }
    // Initialize arrays if not provided
    if (!this.studentIds) {
      this.studentIds = [];
    }
  }
}

import { ApiProperty } from '@nestjs/swagger';
import { User } from './user.entity';

export class Teacher extends User {
  @ApiProperty({
    description: 'Academic degree or qualification of the teacher',
    example: 'Master in Mathematics',
  })
  degree: string;

  @ApiProperty({
    description: 'Department or area of specialization',
    example: 'Mathematics Department',
  })
  department: string;

  @ApiProperty({
    description: 'Years of teaching experience',
    example: 5,
  })
  yearsOfExperience: number;

  @ApiProperty({
    description: 'Professional license or certification number',
    example: 'TEACH-2023-001',
    required: false,
  })
  licenseNumber?: string;

  @ApiProperty({
    description: 'Phone number for professional contact',
    example: '+1234567890',
  })
  phoneNumber: string;

  @ApiProperty({
    description: 'List of subject IDs that this teacher is qualified to teach',
    example: [1, 2, 3],
    type: [Number],
  })
  subjectIds: number[];

  @ApiProperty({
    description: 'List of grade IDs that this teacher is assigned to',
    example: [1, 2],
    type: [Number],
  })
  gradeIds: number[];

  constructor(partial: Partial<Teacher> = {}) {
    super(partial);
    Object.assign(this, partial);

    // Initialize arrays if not provided
    if (!this.subjectIds) {
      this.subjectIds = [];
    }
    if (!this.gradeIds) {
      this.gradeIds = [];
    }
  }
}

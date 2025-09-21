import { ApiProperty } from '@nestjs/swagger';
import { User } from './user.entity';

export class Student extends User {
  @ApiProperty({
    description: 'Student enrollment number',
    example: '2025-001',
  })
  enrollmentNumber: string;

  @ApiProperty({
    description: 'Date of birth of the student',
    example: '2010-05-15',
  })
  dateOfBirth: Date;

  @ApiProperty({
    description: 'Guardian or parent full name',
    example: 'Maria Gonzalez',
  })
  guardianName: string;

  @ApiProperty({
    description: 'Guardian contact phone number',
    example: '+1234567890',
  })
  guardianPhone: string;

  @ApiProperty({
    description: 'Guardian email address',
    example: 'maria.gonzalez@example.com',
  })
  guardianEmail: string;

  @ApiProperty({
    description: 'Student home address',
    example: '123 Main Street, City, State',
  })
  address: string;

  @ApiProperty({
    description: 'ID of the grade/course the student belongs to',
    example: 1,
  })
  gradeId: number;

  @ApiProperty({
    description: 'List of subject IDs that this student is enrolled in',
    example: [1, 2, 3, 4, 5, 6, 7],
    type: [Number],
  })
  subjectIds: number[];

  @ApiProperty({
    description: 'Academic year when the student enrolled',
    example: 2025,
  })
  enrollmentYear: number;

  constructor(partial: Partial<Student> = {}) {
    super(partial);
    Object.assign(this, partial);

    // Initialize arrays if not provided
    if (!this.subjectIds) {
      this.subjectIds = [];
    }

    // Set default enrollment year to current year
    if (!this.enrollmentYear) {
      this.enrollmentYear = new Date().getFullYear();
    }
  }
}

import { ApiProperty } from '@nestjs/swagger';

export class Student {
  @ApiProperty({
    description: 'Unique identifier for the student',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Full name of the student',
    example: 'Maria Garcia',
  })
  name: string;

  @ApiProperty({
    description: 'Email address of the student',
    example: 'maria.garcia@student.edu',
  })
  email: string;

  @ApiProperty({
    description: 'Password for student login',
    example: 'securePassword123',
  })
  password: string;

  @ApiProperty({
    description: 'Role ID - should be student role',
    example: 3,
  })
  roleId: number;

  @ApiProperty({
    description: 'Account status',
    example: true,
  })
  status: boolean;

  @ApiProperty({
    description: 'Account creation date',
    example: '2024-01-15T10:30:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update date',
    example: '2024-01-15T10:30:00Z',
  })
  updatedAt: Date;

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
    Object.assign(this, partial);

    // Set default values for base User properties
    if (!this.status) {
      this.status = true;
    }

    if (!this.createdAt) {
      this.createdAt = new Date();
    }

    if (!this.updatedAt) {
      this.updatedAt = new Date();
    }

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

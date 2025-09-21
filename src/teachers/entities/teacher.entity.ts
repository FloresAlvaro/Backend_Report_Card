import { ApiProperty } from '@nestjs/swagger';

export class Teacher {
  @ApiProperty({
    description: 'Unique identifier for the teacher',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Full name of the teacher',
    example: 'John Doe',
  })
  name: string;

  @ApiProperty({
    description: 'Email address of the teacher',
    example: 'john.doe@school.edu',
  })
  email: string;

  @ApiProperty({
    description: 'Password for teacher login',
    example: 'securePassword123',
  })
  password: string;

  @ApiProperty({
    description: 'Role ID - should be teacher role',
    example: 2,
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
    description: 'Academic degree of the teacher',
    example: 'Master in Mathematics Education',
  })
  degree: string;

  @ApiProperty({
    description: 'Department or area of expertise',
    example: 'Mathematics Department',
  })
  department: string;

  @ApiProperty({
    description: 'Years of teaching experience',
    example: 8,
  })
  yearsOfExperience: number;

  @ApiProperty({
    description: 'Professional license number',
    example: 'TEACH-2023-001',
  })
  licenseNumber: string;

  @ApiProperty({
    description: 'Contact phone number',
    example: '+1234567890',
  })
  phoneNumber: string;

  @ApiProperty({
    description: 'List of subject IDs that this teacher can teach',
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

    if (!this.gradeIds) {
      this.gradeIds = [];
    }
  }
}

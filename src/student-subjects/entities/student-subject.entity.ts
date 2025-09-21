import { ApiProperty } from '@nestjs/swagger';

export class StudentSubject {
  @ApiProperty({
    description: 'Unique identifier for the student-subject relationship',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'ID of the student',
    example: 1,
  })
  studentId: number;

  @ApiProperty({
    description: 'ID of the subject',
    example: 1,
  })
  subjectId: number;

  @ApiProperty({
    description: 'Date when the student enrolled in the subject',
    example: '2025-09-01T20:52:00.000Z',
  })
  enrollmentDate: Date;

  @ApiProperty({
    description: 'Status of the enrollment (active/inactive)',
    example: true,
  })
  status: boolean;

  @ApiProperty({
    description: 'Academic year for this enrollment',
    example: 2025,
  })
  academicYear: number;

  @ApiProperty({
    description: 'Academic semester (1 or 2)',
    example: 1,
  })
  semester: number;

  @ApiProperty({
    description: 'Final grade for this subject (if completed)',
    example: 85.5,
    required: false,
  })
  finalGrade?: number;

  @ApiProperty({
    description: 'Date when the subject was completed',
    example: '2025-12-15T20:52:00.000Z',
    required: false,
  })
  completionDate?: Date;

  constructor(partial: Partial<StudentSubject> = {}) {
    Object.assign(this, partial);

    if (!this.enrollmentDate) {
      this.enrollmentDate = new Date();
    }

    if (this.status === undefined) {
      this.status = true; // Default to active
    }

    if (!this.academicYear) {
      this.academicYear = new Date().getFullYear();
    }

    if (!this.semester) {
      this.semester = 1; // Default to first semester
    }
  }
}

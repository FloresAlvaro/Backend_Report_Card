import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsEmail,
  IsArray,
  IsOptional,
  MinLength,
  IsInt,
  Min,
  IsDateString,
} from 'class-validator';

export class CreateStudentDto {
  @ApiProperty({
    description: 'Full name of the student',
    example: 'Maria Garcia',
  })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({
    description: 'Email address of the student',
    example: 'maria.garcia@student.edu',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Password for the student account',
    example: 'securePassword123',
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'Role ID for student (should be student role ID)',
    example: 3,
  })
  @IsNumber()
  @IsInt()
  roleId: number;

  @ApiProperty({
    description: 'Student enrollment number',
    example: '2025-001',
  })
  @IsString()
  enrollmentNumber: string;

  @ApiProperty({
    description: 'Date of birth of the student',
    example: '2010-05-15',
  })
  @IsDateString()
  dateOfBirth: string;

  @ApiProperty({
    description: 'Guardian or parent full name',
    example: 'Maria Gonzalez',
  })
  @IsString()
  guardianName: string;

  @ApiProperty({
    description: 'Guardian contact phone number',
    example: '+1234567890',
  })
  @IsString()
  guardianPhone: string;

  @ApiProperty({
    description: 'Guardian email address',
    example: 'maria.gonzalez@example.com',
  })
  @IsEmail()
  guardianEmail: string;

  @ApiProperty({
    description: 'Student home address',
    example: '123 Main Street, City, State',
  })
  @IsString()
  address: string;

  @ApiProperty({
    description: 'ID of the grade/course the student belongs to',
    example: 1,
  })
  @IsNumber()
  @IsInt()
  gradeId: number;

  @ApiProperty({
    description: 'List of subject IDs that this student is enrolled in',
    example: [1, 2, 3, 4, 5, 6, 7],
    type: [Number],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  subjectIds?: number[];

  @ApiProperty({
    description: 'Academic year when the student enrolled',
    example: 2025,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @IsInt()
  @Min(2020)
  enrollmentYear?: number;
}

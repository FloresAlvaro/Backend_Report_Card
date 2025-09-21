import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsArray,
  IsOptional,
  IsPositive,
  MinLength,
  MaxLength,
  IsDateString,
} from 'class-validator';

export class CreateStudentDto {
  @ApiProperty({
    description: 'Full name of the student',
    example: 'Maria Garcia',
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @ApiProperty({
    description: 'Email address of the student',
    example: 'maria.garcia@student.edu',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Password for student login',
    example: 'securePassword123',
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'Role ID - should be student role',
    example: 3,
  })
  @IsNumber()
  @IsPositive()
  roleId: number;

  @ApiProperty({
    description: 'Student enrollment number',
    example: '2025-001',
  })
  @IsString()
  @IsNotEmpty()
  enrollmentNumber: string;

  @ApiProperty({
    description: 'Date of birth of the student',
    example: '2010-05-15',
  })
  @IsDateString()
  @IsNotEmpty()
  dateOfBirth: Date;

  @ApiProperty({
    description: 'Guardian or parent full name',
    example: 'Maria Gonzalez',
  })
  @IsString()
  @IsNotEmpty()
  guardianName: string;

  @ApiProperty({
    description: 'Guardian contact phone number',
    example: '+1234567890',
  })
  @IsString()
  @IsNotEmpty()
  guardianPhone: string;

  @ApiProperty({
    description: 'Guardian email address',
    example: 'maria.gonzalez@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  guardianEmail: string;

  @ApiProperty({
    description: 'Student home address',
    example: '123 Main Street, City, State',
  })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    description: 'ID of the grade/course the student belongs to',
    example: 1,
  })
  @IsNumber()
  @IsPositive()
  gradeId: number;

  @ApiProperty({
    description: 'List of subject IDs that this student is enrolled in',
    example: [1, 2, 3, 4, 5, 6, 7],
    type: [Number],
    required: false,
  })
  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  subjectIds?: number[];

  @ApiProperty({
    description: 'Academic year when the student enrolled',
    example: 2025,
    required: false,
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  enrollmentYear?: number;
}

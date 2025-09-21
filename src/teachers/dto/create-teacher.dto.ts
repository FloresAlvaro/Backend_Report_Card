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
} from 'class-validator';

export class CreateTeacherDto {
  @ApiProperty({
    description: 'Full name of the teacher',
    example: 'John Doe',
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @ApiProperty({
    description: 'Email address of the teacher',
    example: 'john.doe@school.edu',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Password for teacher login',
    example: 'securePassword123',
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'Role ID - should be teacher role',
    example: 2,
  })
  @IsNumber()
  @IsPositive()
  roleId: number;

  @ApiProperty({
    description: 'Academic degree of the teacher',
    example: 'Master in Mathematics Education',
  })
  @IsString()
  @IsNotEmpty()
  degree: string;

  @ApiProperty({
    description: 'Department or area of expertise',
    example: 'Mathematics Department',
  })
  @IsString()
  @IsNotEmpty()
  department: string;

  @ApiProperty({
    description: 'Years of teaching experience',
    example: 8,
    minimum: 0,
  })
  @IsNumber()
  @IsPositive()
  yearsOfExperience: number;

  @ApiProperty({
    description: 'Professional license number',
    example: 'TEACH-2023-001',
  })
  @IsString()
  @IsNotEmpty()
  licenseNumber: string;

  @ApiProperty({
    description: 'Contact phone number',
    example: '+1234567890',
  })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({
    description: 'List of subject IDs that this teacher can teach',
    example: [1, 2, 3],
    type: [Number],
    required: false,
  })
  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  subjectIds?: number[];

  @ApiProperty({
    description: 'List of grade IDs that this teacher is assigned to',
    example: [1, 2],
    type: [Number],
    required: false,
  })
  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  gradeIds?: number[];
}

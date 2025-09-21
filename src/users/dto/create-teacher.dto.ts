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
} from 'class-validator';

export class CreateTeacherDto {
  @ApiProperty({
    description: 'Full name of the teacher',
    example: 'Dr. John Smith',
  })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({
    description: 'Email address of the teacher',
    example: 'john.smith@school.edu',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Password for the teacher account',
    example: 'securePassword123',
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'Role ID for teacher (should be teacher role ID)',
    example: 2,
  })
  @IsNumber()
  @IsInt()
  roleId: number;

  @ApiProperty({
    description: 'Academic degree or qualification of the teacher',
    example: 'Master in Mathematics',
  })
  @IsString()
  degree: string;

  @ApiProperty({
    description: 'Department or area of specialization',
    example: 'Mathematics Department',
  })
  @IsString()
  department: string;

  @ApiProperty({
    description: 'Years of teaching experience',
    example: 5,
  })
  @IsNumber()
  @IsInt()
  @Min(0)
  yearsOfExperience: number;

  @ApiProperty({
    description: 'Professional license or certification number',
    example: 'TEACH-2023-001',
    required: false,
  })
  @IsOptional()
  @IsString()
  licenseNumber?: string;

  @ApiProperty({
    description: 'Phone number for professional contact',
    example: '+1234567890',
  })
  @IsString()
  phoneNumber: string;

  @ApiProperty({
    description: 'List of subject IDs that this teacher is qualified to teach',
    example: [1, 2, 3],
    type: [Number],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  subjectIds?: number[];

  @ApiProperty({
    description: 'List of grade IDs that this teacher is assigned to',
    example: [1, 2],
    type: [Number],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  gradeIds?: number[];
}

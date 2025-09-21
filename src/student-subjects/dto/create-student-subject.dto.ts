import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsInt, IsOptional, Min, Max } from 'class-validator';

export class CreateStudentSubjectDto {
  @ApiProperty({
    description: 'ID of the student',
    example: 1,
  })
  @IsNumber()
  @IsInt()
  studentId: number;

  @ApiProperty({
    description: 'ID of the subject',
    example: 1,
  })
  @IsNumber()
  @IsInt()
  subjectId: number;

  @ApiProperty({
    description: 'Academic year for this enrollment',
    example: 2025,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @IsInt()
  @Min(2020)
  academicYear?: number;

  @ApiProperty({
    description: 'Academic semester (1 or 2)',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @IsInt()
  @Min(1)
  @Max(2)
  semester?: number;

  @ApiProperty({
    description: 'Final grade for this subject (if completed)',
    example: 85.5,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  finalGrade?: number;
}

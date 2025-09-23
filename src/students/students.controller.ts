import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  HttpStatus,
  HttpCode,
  Put,
  Query,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Student } from './entities/student.entity';

@ApiTags('Students')
@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new student',
    description: 'Creates a new student with specific student properties',
  })
  @ApiBody({ type: CreateStudentDto })
  @ApiResponse({
    status: 201,
    description: 'Student created successfully',
    type: Student,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid role ID or validation errors',
  })
  @ApiResponse({
    status: 409,
    description:
      'Conflict - Student with this email or enrollment number already exists',
  })
  async create(@Body() createStudentDto: CreateStudentDto): Promise<Student> {
    return this.studentsService.create(createStudentDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all active students',
    description:
      'Returns a list of all active students with student-specific properties',
  })
  @ApiResponse({
    status: 200,
    description: 'List of active students retrieved successfully',
    type: [Student],
  })
  findAll(): Student[] {
    return this.studentsService.findAll();
  }

  @Get('by-grade/:gradeId')
  @ApiOperation({
    summary: 'Get students by grade',
    description: 'Returns students filtered by grade ID',
  })
  @ApiParam({
    name: 'gradeId',
    description: 'Grade ID',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Students in the grade retrieved successfully',
    type: [Student],
  })
  findByGrade(@Param('gradeId', ParseIntPipe) gradeId: number): Student[] {
    return this.studentsService.findByGrade(gradeId);
  }

  @Get('by-subject/:subjectId')
  @ApiOperation({
    summary: 'Get students by subject',
    description: 'Returns students enrolled in a specific subject',
  })
  @ApiParam({
    name: 'subjectId',
    description: 'Subject ID',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Students enrolled in the subject retrieved successfully',
    type: [Student],
  })
  findBySubject(
    @Param('subjectId', ParseIntPipe) subjectId: number,
  ): Student[] {
    return this.studentsService.findBySubject(subjectId);
  }

  @Get('by-enrollment-year')
  @ApiOperation({
    summary: 'Get students by enrollment year',
    description: 'Returns students filtered by enrollment year',
  })
  @ApiQuery({
    name: 'year',
    description: 'Enrollment year',
    example: 2025,
  })
  @ApiResponse({
    status: 200,
    description: 'Students from the enrollment year retrieved successfully',
    type: [Student],
  })
  findByEnrollmentYear(@Query('year', ParseIntPipe) year: number): Student[] {
    return this.studentsService.findByEnrollmentYear(year);
  }

  @Get('by-enrollment/:enrollmentNumber')
  @ApiOperation({
    summary: 'Get student by enrollment number',
    description: 'Returns a student by their enrollment number',
  })
  @ApiParam({
    name: 'enrollmentNumber',
    description: 'Student enrollment number',
    example: '2025-001',
  })
  @ApiResponse({
    status: 200,
    description: 'Student retrieved successfully',
    type: Student,
  })
  @ApiResponse({
    status: 404,
    description: 'Student not found',
  })
  findByEnrollmentNumber(
    @Param('enrollmentNumber') enrollmentNumber: string,
  ): Student {
    const student =
      this.studentsService.findByEnrollmentNumber(enrollmentNumber);
    if (!student) {
      throw new NotFoundException(
        `Student with enrollment number ${enrollmentNumber} not found`,
      );
    }
    return student;
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get student by ID',
    description: 'Returns a single student by ID with all student properties',
  })
  @ApiParam({
    name: 'id',
    description: 'Student ID',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Student retrieved successfully',
    type: Student,
  })
  @ApiResponse({
    status: 404,
    description: 'Student not found',
  })
  findOne(@Param('id', ParseIntPipe) id: number): Student {
    return this.studentsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update student',
    description: 'Updates an existing student with student-specific properties',
  })
  @ApiParam({
    name: 'id',
    description: 'Student ID',
    type: 'number',
    example: 1,
  })
  @ApiBody({ type: UpdateStudentDto })
  @ApiResponse({
    status: 200,
    description: 'Student updated successfully',
    type: Student,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid role ID or validation errors',
  })
  @ApiResponse({
    status: 404,
    description: 'Student not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - Email or enrollment number already exists',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStudentDto: UpdateStudentDto,
  ): Promise<Student> {
    return this.studentsService.update(id, updateStudentDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete student',
    description: 'Soft deletes a student (marks as inactive)',
  })
  @ApiParam({
    name: 'id',
    description: 'Student ID',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Student deleted successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Student with ID 1 has been removed',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Student not found',
  })
  remove(@Param('id', ParseIntPipe) id: number): { message: string } {
    return this.studentsService.remove(id);
  }
}

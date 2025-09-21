import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { StudentSubjectsService } from './student-subjects.service';
import { CreateStudentSubjectDto } from './dto/create-student-subject.dto';
import { UpdateStudentSubjectDto } from './dto/update-student-subject.dto';
import { StudentSubject } from './entities/student-subject.entity';

@ApiTags('Student-Subjects')
@Controller('student-subjects')
export class StudentSubjectsController {
  constructor(
    private readonly studentSubjectsService: StudentSubjectsService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Enroll student in subject',
    description: 'Creates a new enrollment for a student in a specific subject',
  })
  @ApiBody({ type: CreateStudentSubjectDto })
  @ApiResponse({
    status: 201,
    description: 'Student enrolled in subject successfully',
    type: StudentSubject,
  })
  @ApiResponse({
    status: 409,
    description:
      'Conflict - Student already enrolled in this subject for the academic period',
  })
  create(
    @Body() createStudentSubjectDto: CreateStudentSubjectDto,
  ): StudentSubject {
    return this.studentSubjectsService.create(createStudentSubjectDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all active enrollments',
    description: 'Returns a list of all active student-subject enrollments',
  })
  @ApiResponse({
    status: 200,
    description: 'List of active enrollments retrieved successfully',
    type: [StudentSubject],
  })
  findAll(): StudentSubject[] {
    return this.studentSubjectsService.findAll();
  }

  @Get('student/:studentId')
  @ApiOperation({
    summary: 'Get enrollments by student',
    description: 'Returns all active enrollments for a specific student',
  })
  @ApiParam({
    name: 'studentId',
    description: 'Student ID',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Student enrollments retrieved successfully',
    type: [StudentSubject],
  })
  @ApiResponse({
    status: 404,
    description: 'No enrollments found for this student',
  })
  findByStudent(
    @Param('studentId', ParseIntPipe) studentId: number,
  ): StudentSubject[] {
    return this.studentSubjectsService.findByStudent(studentId);
  }

  @Get('subject/:subjectId')
  @ApiOperation({
    summary: 'Get enrollments by subject',
    description: 'Returns all active enrollments for a specific subject',
  })
  @ApiParam({
    name: 'subjectId',
    description: 'Subject ID',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Subject enrollments retrieved successfully',
    type: [StudentSubject],
  })
  @ApiResponse({
    status: 404,
    description: 'No enrollments found for this subject',
  })
  findBySubject(
    @Param('subjectId', ParseIntPipe) subjectId: number,
  ): StudentSubject[] {
    return this.studentSubjectsService.findBySubject(subjectId);
  }

  @Get('academic-period')
  @ApiOperation({
    summary: 'Get enrollments by academic period',
    description:
      'Returns all active enrollments for a specific academic year and semester',
  })
  @ApiQuery({
    name: 'year',
    description: 'Academic year',
    type: 'number',
    example: 2025,
  })
  @ApiQuery({
    name: 'semester',
    description: 'Semester (1 or 2)',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Academic period enrollments retrieved successfully',
    type: [StudentSubject],
  })
  findByAcademicPeriod(
    @Query('year', ParseIntPipe) year: number,
    @Query('semester', ParseIntPipe) semester: number,
  ): StudentSubject[] {
    return this.studentSubjectsService.findByAcademicPeriod(year, semester);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get enrollment by ID',
    description: 'Returns a specific student-subject enrollment by ID',
  })
  @ApiParam({
    name: 'id',
    description: 'Enrollment ID',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Enrollment retrieved successfully',
    type: StudentSubject,
  })
  @ApiResponse({
    status: 404,
    description: 'Enrollment not found',
  })
  findOne(@Param('id', ParseIntPipe) id: number): StudentSubject {
    return this.studentSubjectsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update enrollment',
    description: 'Updates an existing student-subject enrollment',
  })
  @ApiParam({
    name: 'id',
    description: 'Enrollment ID',
    type: 'number',
    example: 1,
  })
  @ApiBody({ type: UpdateStudentSubjectDto })
  @ApiResponse({
    status: 200,
    description: 'Enrollment updated successfully',
    type: StudentSubject,
  })
  @ApiResponse({
    status: 404,
    description: 'Enrollment not found',
  })
  @ApiResponse({
    status: 409,
    description:
      'Conflict - Student already enrolled in this subject for the academic period',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStudentSubjectDto: UpdateStudentSubjectDto,
  ): StudentSubject {
    return this.studentSubjectsService.update(id, updateStudentSubjectDto);
  }

  @Patch(':id/complete')
  @ApiOperation({
    summary: 'Complete subject with final grade',
    description: 'Marks a subject as completed with a final grade',
  })
  @ApiParam({
    name: 'id',
    description: 'Enrollment ID',
    type: 'number',
    example: 1,
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        finalGrade: {
          type: 'number',
          minimum: 0,
          maximum: 100,
          example: 85.5,
          description: 'Final grade for the subject',
        },
      },
      required: ['finalGrade'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Subject completed successfully',
    type: StudentSubject,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid grade value',
  })
  @ApiResponse({
    status: 404,
    description: 'Enrollment not found',
  })
  completeSubject(
    @Param('id', ParseIntPipe) id: number,
    @Body('finalGrade', ParseIntPipe) finalGrade: number,
  ): StudentSubject {
    return this.studentSubjectsService.completeSubject(id, finalGrade);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Deactivate enrollment',
    description:
      'Soft deletes a student-subject enrollment (marks as inactive)',
  })
  @ApiParam({
    name: 'id',
    description: 'Enrollment ID',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Enrollment deactivated successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Student-Subject enrollment with ID 1 has been deactivated',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Enrollment not found',
  })
  remove(@Param('id', ParseIntPipe) id: number): { message: string } {
    return this.studentSubjectsService.remove(id);
  }
}

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
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { TeachersService } from './teachers.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { Teacher } from './entities/teacher.entity';

@ApiTags('Teachers')
@Controller('teachers')
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new teacher',
    description: 'Creates a new teacher with specific teacher properties',
  })
  @ApiBody({ type: CreateTeacherDto })
  @ApiResponse({
    status: 201,
    description: 'Teacher created successfully',
    type: Teacher,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid role ID or validation errors',
  })
  @ApiResponse({
    status: 409,
    description:
      'Conflict - Teacher with this email or license number already exists',
  })
  async create(@Body() createTeacherDto: CreateTeacherDto): Promise<Teacher> {
    return this.teachersService.create(createTeacherDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all active teachers',
    description:
      'Returns a list of all active teachers with teacher-specific properties',
  })
  @ApiResponse({
    status: 200,
    description: 'List of active teachers retrieved successfully',
    type: [Teacher],
  })
  findAll(): Teacher[] {
    return this.teachersService.findAll();
  }

  @Get('by-department')
  @ApiOperation({
    summary: 'Get teachers by department',
    description: 'Returns teachers filtered by department',
  })
  @ApiQuery({
    name: 'department',
    description: 'Department name to filter by',
    example: 'Mathematics Department',
  })
  @ApiResponse({
    status: 200,
    description: 'Teachers filtered by department retrieved successfully',
    type: [Teacher],
  })
  findByDepartment(@Query('department') department: string): Teacher[] {
    return this.teachersService.findByDepartment(department);
  }

  @Get('by-subject/:subjectId')
  @ApiOperation({
    summary: 'Get teachers by subject',
    description: 'Returns teachers who can teach a specific subject',
  })
  @ApiParam({
    name: 'subjectId',
    description: 'Subject ID',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Teachers who teach the subject retrieved successfully',
    type: [Teacher],
  })
  findBySubject(
    @Param('subjectId', ParseIntPipe) subjectId: number,
  ): Teacher[] {
    return this.teachersService.findBySubject(subjectId);
  }

  @Get('by-grade/:gradeId')
  @ApiOperation({
    summary: 'Get teachers by grade',
    description: 'Returns teachers assigned to a specific grade',
  })
  @ApiParam({
    name: 'gradeId',
    description: 'Grade ID',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Teachers assigned to the grade retrieved successfully',
    type: [Teacher],
  })
  findByGrade(@Param('gradeId', ParseIntPipe) gradeId: number): Teacher[] {
    return this.teachersService.findByGrade(gradeId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get teacher by ID',
    description: 'Returns a single teacher by ID with all teacher properties',
  })
  @ApiParam({
    name: 'id',
    description: 'Teacher ID',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Teacher retrieved successfully',
    type: Teacher,
  })
  @ApiResponse({
    status: 404,
    description: 'Teacher not found',
  })
  findOne(@Param('id', ParseIntPipe) id: number): Teacher {
    return this.teachersService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update teacher',
    description: 'Updates an existing teacher with teacher-specific properties',
  })
  @ApiParam({
    name: 'id',
    description: 'Teacher ID',
    type: 'number',
    example: 1,
  })
  @ApiBody({ type: UpdateTeacherDto })
  @ApiResponse({
    status: 200,
    description: 'Teacher updated successfully',
    type: Teacher,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid role ID or validation errors',
  })
  @ApiResponse({
    status: 404,
    description: 'Teacher not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - Email or license number already exists',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTeacherDto: UpdateTeacherDto,
  ): Promise<Teacher> {
    return this.teachersService.update(id, updateTeacherDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete teacher',
    description: 'Soft deletes a teacher (marks as inactive)',
  })
  @ApiParam({
    name: 'id',
    description: 'Teacher ID',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Teacher deleted successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Teacher with ID 1 has been removed',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Teacher not found',
  })
  remove(@Param('id', ParseIntPipe) id: number): { message: string } {
    return this.teachersService.remove(id);
  }
}

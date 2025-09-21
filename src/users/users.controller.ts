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
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { UserWithRoleDto } from './dto/user-with-role.dto';
import { User } from './entities/user.entity';
import { Teacher } from './entities/teacher.entity';
import { Student } from './entities/student.entity';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new user',
    description:
      'Creates a new user with the specified role. Each user can only have one role.',
  })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: User,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid role ID or validation errors',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - User with this email already exists',
  })
  create(@Body() createUserDto: CreateUserDto): User {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all active users',
    description: 'Returns a list of all active users (passwords excluded)',
  })
  @ApiResponse({
    status: 200,
    description: 'List of active users retrieved successfully',
    type: [User],
  })
  findAll(): User[] {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get user by ID',
    description: 'Returns a single user by ID (password excluded)',
  })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'User retrieved successfully',
    type: User,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  findOne(@Param('id', ParseIntPipe) id: number): User {
    return this.usersService.findOne(id);
  }

  @Get(':id/with-role')
  @ApiOperation({
    summary: 'Get user with role details',
    description: 'Returns a user with their role information included',
  })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'User with role retrieved successfully',
    type: UserWithRoleDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  findUserWithRole(@Param('id', ParseIntPipe) id: number): UserWithRoleDto {
    return this.usersService.findUserWithRole(id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update user',
    description:
      'Updates an existing user. Can change the role (only one role per user allowed)',
  })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    type: 'number',
    example: 1,
  })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    type: User,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid role ID or validation errors',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - Email already exists',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): User {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete user',
    description: 'Soft deletes a user (marks as inactive)',
  })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'User deleted successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'User with ID 1 has been removed',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  remove(@Param('id', ParseIntPipe) id: number): { message: string } {
    return this.usersService.remove(id);
  }

  // Teacher-specific endpoints
  @Post('teachers')
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
    description: 'Conflict - Teacher with this email already exists',
  })
  createTeacher(@Body() createTeacherDto: CreateTeacherDto): Teacher {
    return this.usersService.createTeacher(createTeacherDto);
  }

  @Get('teachers')
  @ApiOperation({
    summary: 'Get all active teachers',
    description: 'Returns a list of all active teachers with teacher-specific properties',
  })
  @ApiResponse({
    status: 200,
    description: 'List of active teachers retrieved successfully',
    type: [Teacher],
  })
  findAllTeachers(): Teacher[] {
    return this.usersService.findAllTeachers();
  }

  @Get('teachers/:id')
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
  findTeacher(@Param('id', ParseIntPipe) id: number): Teacher {
    return this.usersService.findTeacher(id);
  }

  @Put('teachers/:id')
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
    description: 'Conflict - Email already exists',
  })
  updateTeacher(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTeacherDto: UpdateTeacherDto,
  ): Teacher {
    return this.usersService.updateTeacher(id, updateTeacherDto);
  }

  // Student-specific endpoints
  @Post('students')
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
    description: 'Conflict - Student with this email or enrollment number already exists',
  })
  createStudent(@Body() createStudentDto: CreateStudentDto): Student {
    return this.usersService.createStudent(createStudentDto);
  }

  @Get('students')
  @ApiOperation({
    summary: 'Get all active students',
    description: 'Returns a list of all active students with student-specific properties',
  })
  @ApiResponse({
    status: 200,
    description: 'List of active students retrieved successfully',
    type: [Student],
  })
  findAllStudents(): Student[] {
    return this.usersService.findAllStudents();
  }

  @Get('students/:id')
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
  findStudent(@Param('id', ParseIntPipe) id: number): Student {
    return this.usersService.findStudent(id);
  }

  @Put('students/:id')
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
  updateStudent(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStudentDto: UpdateStudentDto,
  ): Student {
    return this.usersService.updateStudent(id, updateStudentDto);
  }
}

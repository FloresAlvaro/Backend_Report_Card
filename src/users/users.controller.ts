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
import { UserWithRoleDto } from './dto/user-with-role.dto';
import { User } from './entities/user.entity';

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
}

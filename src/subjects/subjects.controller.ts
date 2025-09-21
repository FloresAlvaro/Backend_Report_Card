import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  ParseBoolPipe,
  Put,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { SubjectsService } from './subjects.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { Subject } from './entities/subject.entity';

@ApiTags('Subjects')
@Controller('subjects')
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new subject',
    description: 'Creates a new subject with the provided information',
  })
  @ApiResponse({
    status: 201,
    description: 'Subject created successfully',
    type: Subject,
  })
  @ApiResponse({
    status: 409,
    description: 'Subject with this name already exists',
  })
  createSubject(@Body() createSubjectDto: CreateSubjectDto): Subject {
    return this.subjectsService.createSubject(createSubjectDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all active subjects',
    description: 'Retrieves all subjects with active status',
  })
  @ApiResponse({
    status: 200,
    description: 'List of active subjects retrieved successfully',
    type: [Subject],
  })
  findAll(): Subject[] {
    return this.subjectsService.findAllSubjects();
  }

  @Get('by-status')
  @ApiOperation({
    summary: 'Get subjects filtered by status',
    description:
      'Retrieves subjects filtered by status. If no status is provided, returns all subjects',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    type: Boolean,
    description: 'Filter by status: true for active, false for inactive',
    example: true,
  })
  @ApiResponse({
    status: 200,
    description: 'List of subjects filtered by status retrieved successfully',
    type: [Subject],
  })
  findAllSubjectsByStatus(
    @Query('status', new ParseBoolPipe({ optional: true })) status?: boolean,
  ): Subject[] {
    return this.subjectsService.findAllSubjectsByStatus(status);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a subject by ID',
    description: 'Retrieves a specific active subject by its ID',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'Subject ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Subject retrieved successfully',
    type: Subject,
  })
  @ApiResponse({
    status: 404,
    description: 'Subject not found',
  })
  findOneSubject(@Param('id', ParseIntPipe) id: number): Subject {
    return this.subjectsService.findOneSubject(id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update a subject',
    description: 'Updates an existing subject with the provided information',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'Subject ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Subject updated successfully',
    type: Subject,
  })
  @ApiResponse({
    status: 404,
    description: 'Subject not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Subject with this name already exists',
  })
  updateSubject(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSubjectDto: UpdateSubjectDto,
  ): Subject {
    return this.subjectsService.updateSubject(id, updateSubjectDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a subject',
    description: 'Soft deletes a subject by setting its status to inactive',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'Subject ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Subject deleted successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Subject with ID 1 has been removed',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Subject not found',
  })
  deleteSubject(@Param('id', ParseIntPipe) id: number): { message: string } {
    return this.subjectsService.deleteSubject(id);
  }
}

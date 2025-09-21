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
import { GradesService } from './grades.service';
import { CreateGradeDto } from './dto/create-grade.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';
import { Grade } from './entities/grade.entity';

@ApiTags('Grades')
@Controller('grades')
export class GradesController {
  constructor(private readonly gradesService: GradesService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new grade',
    description: 'Creates a new grade with the provided information',
  })
  @ApiResponse({
    status: 201,
    description: 'Grade created successfully',
    type: Grade,
  })
  @ApiResponse({
    status: 409,
    description: 'Grade with this level already exists',
  })
  createGrade(@Body() createGradeDto: CreateGradeDto): Grade {
    return this.gradesService.createGrade(createGradeDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all active grades',
    description: 'Retrieves all grades with active status',
  })
  @ApiResponse({
    status: 200,
    description: 'List of active grades retrieved successfully',
    type: [Grade],
  })
  findAll(): Grade[] {
    return this.gradesService.findAllGrades();
  }

  @Get('by-status')
  @ApiOperation({
    summary: 'Get grades filtered by status',
    description:
      'Retrieves grades filtered by status. If no status is provided, returns all grades',
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
    description: 'List of grades filtered by status retrieved successfully',
    type: [Grade],
  })
  findAllGradesByStatus(
    @Query('status', new ParseBoolPipe({ optional: true })) status?: boolean,
  ): Grade[] {
    return this.gradesService.findAllGradesByStatus(status);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a grade by ID',
    description: 'Retrieves a specific active grade by its ID',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'Grade ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Grade retrieved successfully',
    type: Grade,
  })
  @ApiResponse({
    status: 404,
    description: 'Grade not found',
  })
  findOneGrade(@Param('id', ParseIntPipe) id: number): Grade {
    return this.gradesService.findOneGrade(id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update a grade',
    description: 'Updates an existing grade with the provided information',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'Grade ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Grade updated successfully',
    type: Grade,
  })
  @ApiResponse({
    status: 404,
    description: 'Grade not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Grade with this level already exists',
  })
  updateGrade(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateGradeDto: UpdateGradeDto,
  ): Grade {
    return this.gradesService.updateGrade(id, updateGradeDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a grade',
    description: 'Soft deletes a grade by setting its status to inactive',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'Grade ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Grade deleted successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Grade with ID 1 has been removed',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Grade not found',
  })
  deleteGrade(@Param('id', ParseIntPipe) id: number): { message: string } {
    return this.gradesService.deleteGrade(id);
  }
}

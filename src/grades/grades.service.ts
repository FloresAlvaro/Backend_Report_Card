import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateGradeDto } from './dto/create-grade.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';
import { Grade } from './entities/grade.entity';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class GradesService {
  constructor(private prisma: PrismaService) {}

  async createGrade(createGradeDto: CreateGradeDto): Promise<Grade> {
    // Verify that the level is not already in use
    const existingGrade = await this.prisma.grade.findFirst({
      where: {
        gradeLevel: createGradeDto.level,
        gradeStatus: true,
      },
    });

    if (existingGrade) {
      throw new ConflictException(
        `Grade with level '${createGradeDto.level}' already exists`,
      );
    }

    const grade = await this.prisma.grade.create({
      data: {
        gradeLevel: createGradeDto.level,
        gradeDescription: createGradeDto.description,
        gradeStatus: createGradeDto.status ?? true,
      },
    });

    return new Grade({
      id: grade.gradeId,
      level: grade.gradeLevel,
      description: grade.gradeDescription,
      status: grade.gradeStatus,
    });
  }

  async findAllGrades(): Promise<Grade[]> {
    const grades = await this.prisma.grade.findMany({
      where: {
        gradeStatus: true,
      },
    });

    return grades.map(
      (grade) =>
        new Grade({
          id: grade.gradeId,
          level: grade.gradeLevel,
          description: grade.gradeDescription,
          status: grade.gradeStatus,
        }),
    );
  }

  async findAllGradesByStatus(status?: boolean): Promise<Grade[]> {
    const whereCondition = status !== undefined ? { gradeStatus: status } : {};

    const grades = await this.prisma.grade.findMany({
      where: whereCondition,
    });

    return grades.map(
      (grade) =>
        new Grade({
          id: grade.gradeId,
          level: grade.gradeLevel,
          description: grade.gradeDescription,
          status: grade.gradeStatus,
        }),
    );
  }

  async findOneGrade(id: number): Promise<Grade> {
    const grade = await this.prisma.grade.findFirst({
      where: {
        gradeId: id,
        gradeStatus: true,
      },
    });

    if (!grade) {
      throw new NotFoundException(`Grade with ID ${id} not found`);
    }

    return new Grade({
      id: grade.gradeId,
      level: grade.gradeLevel,
      description: grade.gradeDescription,
      status: grade.gradeStatus,
    });
  }

  async updateGrade(
    id: number,
    updateGradeDto: UpdateGradeDto,
  ): Promise<Grade> {
    // First check if grade exists
    const existingGrade = await this.prisma.grade.findFirst({
      where: {
        gradeId: id,
        gradeStatus: true,
      },
    });

    if (!existingGrade) {
      throw new NotFoundException(`Grade with ID ${id} not found`);
    }

    // Verify duplicate level if updating level
    if (updateGradeDto.level) {
      const duplicateGrade = await this.prisma.grade.findFirst({
        where: {
          gradeLevel: updateGradeDto.level,
          gradeStatus: true,
          NOT: {
            gradeId: id,
          },
        },
      });

      if (duplicateGrade) {
        throw new ConflictException(
          `Grade with level '${updateGradeDto.level}' already exists`,
        );
      }
    }

    const updateData: Prisma.GradeUpdateInput = {};
    if (updateGradeDto.level !== undefined) {
      updateData.gradeLevel = updateGradeDto.level;
    }
    if (updateGradeDto.description !== undefined) {
      updateData.gradeDescription = updateGradeDto.description;
    }
    if (updateGradeDto.status !== undefined) {
      updateData.gradeStatus = updateGradeDto.status;
    }

    const updatedGrade = await this.prisma.grade.update({
      where: {
        gradeId: id,
      },
      data: updateData,
    });

    return new Grade({
      id: updatedGrade.gradeId,
      level: updatedGrade.gradeLevel,
      description: updatedGrade.gradeDescription,
      status: updatedGrade.gradeStatus,
    });
  }

  async deleteGrade(id: number): Promise<{ message: string }> {
    // Check if grade exists
    const existingGrade = await this.prisma.grade.findFirst({
      where: {
        gradeId: id,
        gradeStatus: true,
      },
    });

    if (!existingGrade) {
      throw new NotFoundException(`Grade with ID ${id} not found`);
    }

    // Soft delete - just mark as inactive
    await this.prisma.grade.update({
      where: {
        gradeId: id,
      },
      data: {
        gradeStatus: false,
      },
    });

    return { message: `Grade with ID ${id} has been removed` };
  }
}

import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateGradeDto } from './dto/create-grade.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';
import { Grade } from './entities/grade.entity';

@Injectable()
export class GradesService {
  private grades: Grade[] = [];
  private nextId = 1;

  createGrade(createGradeDto: CreateGradeDto): Grade {
    // Verify that the level is not already in use
    const existingGrade = this.grades.find(
      (grade) => grade.level === createGradeDto.level && grade.status,
    );
    if (existingGrade) {
      throw new ConflictException(
        `Grade with level '${createGradeDto.level}' already exists`,
      );
    }

    const grade = new Grade({
      id: this.nextId++,
      ...createGradeDto,
    });

    this.grades.push(grade);
    return grade;
  }

  findAllGrades(): Grade[] {
    return this.grades.filter((grade) => grade.status);
  }

  findAllGradesByStatus(status?: boolean): Grade[] {
    if (status === undefined) {
      return this.grades; // Todos los grades (activos e inactivos)
    }
    return this.grades.filter((grade) => grade.status === status);
  }

  findOneGrade(id: number): Grade {
    const grade = this.grades.find((grade) => grade.id === id && grade.status);
    if (!grade) {
      throw new NotFoundException(`Grade with ID ${id} not found`);
    }
    return grade;
  }

  updateGrade(id: number, updateGradeDto: UpdateGradeDto): Grade {
    const gradeIndex = this.grades.findIndex(
      (grade) => grade.id === id && grade.status,
    );
    if (gradeIndex === -1) {
      throw new NotFoundException(`Grade with ID ${id} not found`);
    }

    // Verify duplicate level if updating level
    if (updateGradeDto.level) {
      const existingGrade = this.grades.find(
        (grade) =>
          grade.level === updateGradeDto.level &&
          grade.status &&
          grade.id !== id,
      );
      if (existingGrade) {
        throw new ConflictException(
          `Grade with level '${updateGradeDto.level}' already exists`,
        );
      }
    }

    this.grades[gradeIndex] = {
      ...this.grades[gradeIndex],
      ...updateGradeDto,
    };

    return this.grades[gradeIndex];
  }

  deleteGrade(id: number): { message: string } {
    const gradeIndex = this.grades.findIndex(
      (grade) => grade.id === id && grade.status,
    );
    if (gradeIndex === -1) {
      throw new NotFoundException(`Grade with ID ${id} not found`);
    }

    // Soft delete - just mark as inactive
    this.grades[gradeIndex].status = false;

    return { message: `Grade with ID ${id} has been removed` };
  }
}

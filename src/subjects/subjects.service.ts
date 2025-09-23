import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { Subject } from './entities/subject.entity';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class SubjectsService {
  constructor(private prisma: PrismaService) {}

  async createSubject(createSubjectDto: CreateSubjectDto): Promise<Subject> {
    // Verify that the subjectName is not already in use
    const existingSubject = await this.prisma.subject.findFirst({
      where: {
        subjectName: {
          equals: createSubjectDto.subjectName,
          mode: 'insensitive',
        },
        subjectStatus: true,
      },
    });

    if (existingSubject) {
      throw new ConflictException(
        `Subject with name '${createSubjectDto.subjectName}' already exists`,
      );
    }

    const subject = await this.prisma.subject.create({
      data: {
        subjectName: createSubjectDto.subjectName,
        subjectDescription: createSubjectDto.subjectDescription,
        subjectStatus: createSubjectDto.status ?? true,
      },
    });

    return new Subject({
      id: subject.subjectID,
      subjectName: subject.subjectName,
      subjectDescription: subject.subjectDescription,
      status: subject.subjectStatus,
    });
  }

  async findAllSubjects(): Promise<Subject[]> {
    const subjects = await this.prisma.subject.findMany({
      where: {
        subjectStatus: true,
      },
    });

    return subjects.map(
      (subject) =>
        new Subject({
          id: subject.subjectID,
          subjectName: subject.subjectName,
          subjectDescription: subject.subjectDescription,
          status: subject.subjectStatus,
        }),
    );
  }

  async findAllSubjectsByStatus(status?: boolean): Promise<Subject[]> {
    const whereCondition =
      status !== undefined ? { subjectStatus: status } : {};

    const subjects = await this.prisma.subject.findMany({
      where: whereCondition,
    });

    return subjects.map(
      (subject) =>
        new Subject({
          id: subject.subjectID,
          subjectName: subject.subjectName,
          subjectDescription: subject.subjectDescription,
          status: subject.subjectStatus,
        }),
    );
  }

  async findOneSubject(id: number): Promise<Subject> {
    const subject = await this.prisma.subject.findFirst({
      where: {
        subjectID: id,
        subjectStatus: true,
      },
    });

    if (!subject) {
      throw new NotFoundException(`Subject with ID ${id} not found`);
    }

    return new Subject({
      id: subject.subjectID,
      subjectName: subject.subjectName,
      subjectDescription: subject.subjectDescription,
      status: subject.subjectStatus,
    });
  }

  async updateSubject(
    id: number,
    updateSubjectDto: UpdateSubjectDto,
  ): Promise<Subject> {
    // First check if subject exists
    const existingSubject = await this.prisma.subject.findFirst({
      where: {
        subjectID: id,
        subjectStatus: true,
      },
    });

    if (!existingSubject) {
      throw new NotFoundException(`Subject with ID ${id} not found`);
    }

    // Verify duplicate subjectName if updating subjectName
    if (updateSubjectDto.subjectName) {
      const duplicateSubject = await this.prisma.subject.findFirst({
        where: {
          subjectName: {
            equals: updateSubjectDto.subjectName,
            mode: 'insensitive',
          },
          subjectStatus: true,
          NOT: {
            subjectID: id,
          },
        },
      });

      if (duplicateSubject) {
        throw new ConflictException(
          `Subject with name '${updateSubjectDto.subjectName}' already exists`,
        );
      }
    }

    const updateData: Prisma.SubjectUpdateInput = {};
    if (updateSubjectDto.subjectName !== undefined) {
      updateData.subjectName = updateSubjectDto.subjectName;
    }
    if (updateSubjectDto.subjectDescription !== undefined) {
      updateData.subjectDescription = updateSubjectDto.subjectDescription;
    }
    if (updateSubjectDto.status !== undefined) {
      updateData.subjectStatus = updateSubjectDto.status;
    }

    const updatedSubject = await this.prisma.subject.update({
      where: {
        subjectID: id,
      },
      data: updateData,
    });

    return new Subject({
      id: updatedSubject.subjectID,
      subjectName: updatedSubject.subjectName,
      subjectDescription: updatedSubject.subjectDescription,
      status: updatedSubject.subjectStatus,
    });
  }

  async deleteSubject(id: number): Promise<{ message: string }> {
    // Check if subject exists
    const existingSubject = await this.prisma.subject.findFirst({
      where: {
        subjectID: id,
        subjectStatus: true,
      },
    });

    if (!existingSubject) {
      throw new NotFoundException(`Subject with ID ${id} not found`);
    }

    // Soft delete - just mark as inactive
    await this.prisma.subject.update({
      where: {
        subjectID: id,
      },
      data: {
        subjectStatus: false,
      },
    });

    return { message: `Subject with ID ${id} has been removed` };
  }
}

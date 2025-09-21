import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { Subject } from './entities/subject.entity';

@Injectable()
export class SubjectsService {
  private subjects: Subject[] = [];
  private nextId = 1;

  createSubject(createSubjectDto: CreateSubjectDto): Subject {
    // Verify that the subjectName is not already in use
    const existingSubject = this.subjects.find(
      (subject) =>
        subject.subjectName.toLowerCase() ===
          createSubjectDto.subjectName.toLowerCase() && subject.status,
    );
    if (existingSubject) {
      throw new ConflictException(
        `Subject with name '${createSubjectDto.subjectName}' already exists`,
      );
    }

    const subject = new Subject({
      id: this.nextId++,
      ...createSubjectDto,
    });

    this.subjects.push(subject);
    return subject;
  }

  findAllSubjects(): Subject[] {
    return this.subjects.filter((subject) => subject.status);
  }

  findAllSubjectsByStatus(status?: boolean): Subject[] {
    if (status === undefined) {
      return this.subjects; // Todos los subjects (activos e inactivos)
    }
    return this.subjects.filter((subject) => subject.status === status);
  }

  findOneSubject(id: number): Subject {
    const subject = this.subjects.find(
      (subject) => subject.id === id && subject.status,
    );
    if (!subject) {
      throw new NotFoundException(`Subject with ID ${id} not found`);
    }
    return subject;
  }

  updateSubject(id: number, updateSubjectDto: UpdateSubjectDto): Subject {
    const subjectIndex = this.subjects.findIndex(
      (subject) => subject.id === id && subject.status,
    );
    if (subjectIndex === -1) {
      throw new NotFoundException(`Subject with ID ${id} not found`);
    }

    // Verify duplicate subjectName if updating subjectName
    if (updateSubjectDto.subjectName) {
      const existingSubject = this.subjects.find(
        (subject) =>
          subject.subjectName.toLowerCase() ===
            updateSubjectDto.subjectName!.toLowerCase() &&
          subject.status &&
          subject.id !== id,
      );
      if (existingSubject) {
        throw new ConflictException(
          `Subject with name '${updateSubjectDto.subjectName}' already exists`,
        );
      }
    }

    this.subjects[subjectIndex] = {
      ...this.subjects[subjectIndex],
      ...updateSubjectDto,
    };

    return this.subjects[subjectIndex];
  }

  deleteSubject(id: number): { message: string } {
    const subjectIndex = this.subjects.findIndex(
      (subject) => subject.id === id && subject.status,
    );
    if (subjectIndex === -1) {
      throw new NotFoundException(`Subject with ID ${id} not found`);
    }

    // Soft delete - just mark as inactive
    this.subjects[subjectIndex].status = false;

    return { message: `Subject with ID ${id} has been removed` };
  }
}

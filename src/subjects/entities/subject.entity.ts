import { ApiProperty } from '@nestjs/swagger';
export class Subject {
  @ApiProperty({
    description: 'Unique identifier for the subject',
    example: 1,
  })
  subjectID: number;

  @ApiProperty({
    description: 'Name of the subject',
    example: 'Mathematics',
  })
  subjectName: string;

  @ApiProperty({
    description: 'Description of the subject content',
    example: 'Advanced mathematics including algebra and geometry',
  })
  subjectDescription: string;

  @ApiProperty({
    description: 'Status of the subject',
    example: true,
  })
  subjectStatus: boolean;

  constructor(partial: Partial<Subject> = {}) {
    Object.assign(this, partial);
    if (this.subjectStatus === undefined) {
      this.subjectStatus = true; // Default to active
    }
  }

  // Helper methods for backward compatibility with existing code
  get id(): number {
    return this.subjectID;
  }

  get status(): boolean {
    return this.subjectStatus;
  }

  get description(): string {
    return this.subjectDescription;
  }
}

import { ApiProperty } from '@nestjs/swagger';

export class Grade {
  @ApiProperty({
    description: 'Unique identifier for the grade',
    example: 1,
  })
  gradeId: number;

  @ApiProperty({
    description: 'The grade level',
    example: '1A',
  })
  gradeLevel: string;

  @ApiProperty({
    description: 'Description of the grade',
    example: 'primero de secundaria a',
  })
  gradeDescription: string;

  @ApiProperty({
    description: 'Status of the grade (active/inactive)',
    example: true,
  })
  gradeStatus: boolean;

  constructor(partial: Partial<Grade> = {}) {
    Object.assign(this, partial);
    if (this.gradeStatus === undefined) {
      this.gradeStatus = true; // Default to active
    }
  }

  // Helper methods for backward compatibility with existing code
  get id(): number {
    return this.gradeId;
  }

  get level(): string {
    return this.gradeLevel;
  }

  get description(): string {
    return this.gradeDescription;
  }

  get status(): boolean {
    return this.gradeStatus;
  }
}

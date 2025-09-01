export class Role {
  id: number;
  name: string;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<Role> = {}) {
    Object.assign(this, partial);
    if (!this.createdAt) {
      this.createdAt = new Date();
    }
    if (!this.updatedAt) {
      this.updatedAt = new Date();
    }
    if (this.status === undefined) {
      this.status = true; // Default to active
    }
  }
}

import { STATUS } from './Utils';

export class PaginationDTO {
  search: string;
  skip?: number;
  take?: number;
  status?: STATUS;

  constructor() {
    this.search = '';
    (this.take = 3), (this.skip = 0), (this.status = STATUS.Pending);
  }
}

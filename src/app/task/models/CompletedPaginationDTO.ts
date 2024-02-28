// import { STATUS } from './Utils';

import { STATUS } from './Utils';

export class CompletedPaginationDTO {
  search: string;
  skip?: number;
  take?: number;
  status?: STATUS;

  constructor() {
    this.search = '';
    this.take = 10;
    this.skip = 0;
    this.status = STATUS.Completed;
  }
}

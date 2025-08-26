export class Paginador {
  constructor(page = 1, limit = 10, sort = "") {
    this.page = page;
    this.limit = limit;
    this.sort = sort;
  }
}

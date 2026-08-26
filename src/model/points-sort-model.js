import { SortType } from '../utils/const.js';
import dayjs from 'dayjs';

export class PointsSortModel {
  #defaultSortPoints = null;
  #timeSortPoints = null;
  #priceSortPoints = null;

  constructor(points) {
    this.#defaultSortPoints = points;
  }

  sortPoints(sortType) {
    switch (sortType) {

      case SortType.DEFAULT:
        return this.#defaultSortPoints;

      case SortType.TIME:
        return this.#sortByTime;

      case SortType.PRICE:
        return this.#sortByPrice;
    }
  }

  resetPonts(newPoints) {
    this.#defaultSortPoints = newPoints;
    this.#timeSortPoints = null;
    this.#priceSortPoints = null;
  }

  #sortTimeUpHandle(a, b) {
    return dayjs(b.point.dateTo).diff(b.point.dateFrom, 'm') - dayjs(a.point.dateTo).diff(a.point.dateFrom, 'm');
  }

  #sortPriceUpHandle(a, b) {
    return b.point.basePrice - a.point.basePrice;
  }

  get #sortByTime() {
    if (!this.#timeSortPoints) {
      this.#timeSortPoints = [...this.#defaultSortPoints]
        .sort(this.#sortTimeUpHandle);
    }
    return this.#timeSortPoints;
  }

  get #sortByPrice() {
    if (!this.#priceSortPoints) {
      this.#priceSortPoints = [...this.#defaultSortPoints]
        .sort(this.#sortPriceUpHandle);
    }
    return this.#priceSortPoints;
  }

}

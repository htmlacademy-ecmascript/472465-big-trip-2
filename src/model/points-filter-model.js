import { FilterType } from '../utils/const.js';
import dayjs from 'dayjs';

export class PointsFilterModel {
  #deafultPoints = null;
  #futurePoints = null;
  #presentPoints = null;
  #pastPoints = null;
  constructor(points) {
    this.#deafultPoints = points;
  }

  filterPoints(filterType) {
    switch (filterType) {
      case FilterType.EVERETHING:
        return this.#deafultPoints;

      case FilterType.FUTURE:
        return this.#filterfuture;

      case FilterType.PRESENT:
        return this.#filterPresent;

      case FilterType.PAST:
        return this.#filterPast;
    }
  }

  resetDefaultPonts(newPoints) {
    this.#deafultPoints = newPoints;
    this.#futurePoints = null;
    this.#presentPoints = null;
    this.#pastPoints = null;
  }

  #filterFutureHandle(el) {
    return dayjs(el.point.dateFrom).diff(dayjs(), 'd') > 0;
  }

  #filterPastHandle(el) {
    return dayjs(el.point.dateTo).diff(dayjs(), 'd') < 0;
  }

  #filterPresentHandle(el) {
    const startTime = dayjs(el.point.dateFrom).diff(dayjs(), 'd');
    const endTime = dayjs(el.point.dateTo).diff(dayjs(), 'd');
    return startTime <= 0 && endTime >= 0;
  }

  get #filterfuture() {
    if (!this.#futurePoints) {
      this.#futurePoints = this.#deafultPoints.filter(this.#filterFutureHandle);
    }
    return this.#futurePoints;
  }

  get #filterPresent() {
    if (!this.#presentPoints) {
      this.#presentPoints = this.#deafultPoints.filter(this.#filterPresentHandle);
    }
    return this.#presentPoints;
  }



  get #filterPast() {
    if (!this.#pastPoints) {
      this.#pastPoints = this.#deafultPoints.filter(this.#filterPastHandle);
    }
    return this.#pastPoints;
  }
}


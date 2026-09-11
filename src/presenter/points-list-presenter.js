import { SortType } from '../utils/const.js';
import { FilterType } from '../utils/const.js';
import PointPresenter from './point-presenter.js';


export default class PointsListPresenter {
  #listComponent = null;
  #pointsData = null;
  #pointGenerator = null;
  #citiesData = null;
  #allPointPresenters = new Map();
  #openedPoint = null;
  #pointsModel = null;
  #currentSortType = null;
  #currentFilterType = null;
  #sortModel = null;


  constructor(listComponent, pointsData, citiesData, pointsModel) {
    this.#listComponent = listComponent;
    this.#pointsData = pointsData;
    this.#citiesData = citiesData;
    this.#pointsModel = pointsModel;
    this.#currentSortType = SortType.DEFAULT;
    this.#currentFilterType = FilterType.EVERETHING;
  }

  init(points = this.#pointsData) {

    for (const pointData of points) {
      const pointPresenter = new PointPresenter({
        point: pointData,
        cities: this.#citiesData,
        pointsContaner: this.#listComponent,
        onOpen: this.#onOpenPoint.bind(this),
        onClose: this.#onClosePoint.bind(this),
        pointsModel: this.#pointsModel,
      });
      pointPresenter.init();
      this.#allPointPresenters.set(pointData.point.id, pointPresenter);
    }
  }

  #removePointViews(el) {
    el.removePoint();
  }

  onFilterClick(filterType) {
    if (filterType === this.#currentFilterType) {
      return;
    }
    const filtredPoints = this.#pointsModel.getFilteredPoints(filterType);
    this.#pointsModel.resetSortPoints(filtredPoints);
    const sortedPoints = this.#pointsModel.getSortedPoints(this.#currentSortType);
    this.#removePoints();
    this.#currentFilterType = filterType;
    this.init(sortedPoints);
  }

  onSortClick(sortType) {
    if (sortType === this.#currentSortType) {
      return;
    }
    const sortedPoints = this.#pointsModel.getSortedPoints(sortType);
    this.#removePoints();
    this.#currentSortType = sortType;
    this.init(sortedPoints);
  }

  #removePoints() {
    this.#allPointPresenters.forEach(this.#removePointViews);
    this.#allPointPresenters = new Map();
  }

  #onOpenPoint(id) {
    if (!this.#openedPoint) {
      this.#openedPoint = id;
    } else {
      this.#allPointPresenters.get(this.#openedPoint).closePoint();
      this.#openedPoint = id;
    }
    document.addEventListener('keydown', this.#onEscDownHandler);
  }

  #onClosePoint() {
    document.removeEventListener('keydown', this.#onEscDownHandler);
    this.#openedPoint = null;
  }

  #onEscDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      if (this.#openedPoint) {
        this.#allPointPresenters.get(this.#openedPoint).closePoint();
      }
    }
  };

  #getAllPoints() {
    return this.#allPointPresenters;
  }

}

class User {
  constructor(name, age) {
    this._name = name;
    this._age = age;
    this.observers = {};
  }

  subscribe(type, observer) {
    if (!this.observers[type]) {
      this.observers[type] = [];
    }
    this.observers[type].push(observer);
  }

  unscribe(type, usedObserver) {
    if (!this.observers[type]) {
      return;
    }
    this.observers[type] = this.observers[type].filter((observer) => usedObserver !== observer);
  }


  notify(type) {
    this.observers[type].forEach((observer) => observer.update(this));
  }

  get name() {
    return this._name;
  }

  set name(name) {
    this._name = name;
    this.notify('name');
  }

  get age() {
    return this._age;
  }

  set age(age) {
    this._age = age;
    this.notify('age');
  }
}



var nameObsever = {
  update: function (obj) {
    console.log(`в объекта user, свойство name сменилось на ${obj.name}`);
  }
}

var ageObsever = {
  update: function (obj) {
    console.log(`в объекта user, свойство age сменилось на ${obj.age}`);
  }
}

var user = new User('Анатолий', 43);

user.subscribe('name',nameObsever);
user.subscribe('age',ageObsever);

// user.name = 'Tolya';
// user.name = 'Tontik';
// user.age = 18;
// user.age = 43;
// user.age = 25;
// user.name = 'Anatoly';

// user.unscribe('name',nameObsever);



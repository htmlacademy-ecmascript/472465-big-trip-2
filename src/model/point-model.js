import { allPoints } from '../mock/point-mock.js';
import { allOffers } from '../mock/offer-mock.js';
import { cities } from '../mock/destination-info.js';
import { destinations } from '../mock/destination-mock.js';
import { PointsSortModel } from './points-sort-model.js';
import { PointsFilterModel } from './points-filter-model.js';

export default class PointsModel {
  #allPoints = null;
  #possibleOffers = null;
  #allOfferTypes = null;
  #allCities = null;
  #destinations = null;
  #fullDataList = null;
  #pointIdDictionary = null;
  #sortModel = null;
  #filterModel = null;
  constructor() {
    this.#filterModel = new PointsFilterModel(this.fullDataList);
    this.#sortModel = new PointsSortModel(this.fullDataList);
  }

  get points() {
    if (!this.#allPoints) {
      this.#allPoints = allPoints;
    }
    return this.#allPoints;
  }

  get cities() {
    if (!this.#allCities) {
      this.#allCities = cities;
    }
    return this.#allCities;
  }

  get possibleOffers() {
    if (!this.#possibleOffers) {
      this.#possibleOffers = allOffers;
    }
    return this.#possibleOffers;
  }

  get allOfferTypes() {
    if (!this.#allOfferTypes) {
      this.#allOfferTypes = allOffers.map(function getType(el) { return el.type });
    }
    return this.#allOfferTypes;
  }

  get destinations() {
    if (!this.#destinations) {
      this.#destinations = destinations;
    }
    return this.#destinations;
  }

  get fullDataList() {
    if (!this.#fullDataList) {
      this.#datalistInit();
    }
    return this.#fullDataList;
  }

  resetSortPoints(newPoints) {
    this.#sortModel.resetPonts(newPoints);
  }

  getFilteredPoints(filterType) {
    return this.#filterModel.filterPoints(filterType);
  }

  getSortedPoints(sortType) {
    return this.#sortModel.sortPoints(sortType);
  }

  setPointIdDictionary() {
    this.#pointIdDictionary = {};
    for (const item of this.#fullDataList) {
      this.#pointIdDictionary[item.point.id] = item;
    }
  }

  updateFavorite = (pointId) => {
    const updatedPoint = this.#pointIdDictionary[pointId];
    updatedPoint.point.isFavorite = !updatedPoint.point.isFavorite;
    return updatedPoint;
  };

  #datalistInit() {
    let ownOffersMap;
    let pointItem;

    function getOffersCombine(id) {
      return ownOffersMap[id];
    }

    function getDestinationById(el) {
      return el.id === pointItem.destination;
    }

    function getOffersByType(el) {
      return el.type === pointItem.type;
    }

    this.#fullDataList = [];
    /* определение принадлежности предложений, пунктов назначений к точкам */
    for (const p of this.points) {
      pointItem = p;

      const allOffersByType = this.possibleOffers.filter(getOffersByType)[0].offers; /* определение типа всех возможных предложений точки*/
      ownOffersMap = allOffersByType.reduce((acc, el) => {
        acc[el.id] = el;
        return acc;
      }, {}); /*создание словаря, чтобы исключить циклы для поиска опций*/


      const destination = this.destinations.find(getDestinationById); /* определение принадлежности пункта назхначения к точке*/
      const pointOffers = p.offers.map(getOffersCombine); /* добавление всех предложений относящихся к данной точке*/

      this.#fullDataList.push(
        {
          point: p, /*сама точка*/
          offers: pointOffers, /*все выбранные предложения в точке*/
          destination: destination, /*город назнаяения точки*/
          possibleOffers: allOffersByType, /*все возможные предложения по типу*/
          offersTypes: this.allOfferTypes, /*список типов предложений*/
        }
      ); /* добавить  укомплектованную точку  в масиив*/
    }
    /* определение принадлежности предложений, пунктов назначений к точкам */
    this.setPointIdDictionary(); /*собрать справочник по  id точки*/
  }
}

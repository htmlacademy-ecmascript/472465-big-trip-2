import { remove, render, replace } from '../framework/render.js';
import EditPointView from '../view/edit-point-view.js';
import PointView from '../view/point-view.js';

export default class PointPresenter {
  #pointsContaner = null;
  #onClosePoint = null;
  constructor({ point, cities, pointsContaner, onOpen, onClose, pointsModel }) {
    this.pointsModel = pointsModel;
    this.point = point;
    this.cities = cities;
    this.onOpenPoint = onOpen;
    this.#onClosePoint = onClose;
    this.#pointsContaner = pointsContaner;
    this.pointId = point.point.id;
  }

  createPoint(point) {
    this.point = point;
    this.pointView = new PointView(
      this.point,
      this.#openPoint.bind(this),
      this.#onFavorite.bind(this),
    );
    this.editPointView = new EditPointView(
      this.point,
      this.cities,
      this.#closePoint.bind(this),
      this.#saveEditPoint.bind(this),
      this.#onDestination.bind(this),
      this.#onEventType.bind(this),
      this.#onDateChange.bind(this),
    );
  }

  #updatePointsViews() {
    this.editPointView.updateElement({
      offers: this.point.offers,
      basePrice: this.point.point.basePrice,
      dateFrom: this.point.point.dateFrom,
      dateTo: this.point.point.dateTo,
      pointType: this.point.point.type,
      possibleOffers: this.point.possibleOffers,
      destination: this.point.destination,
    });
  }

  removePoint() {
    remove(this.pointView);
    remove(this.editPointView);
  }

  init() {
    this.createPoint(this.point);
    render(this.pointView, this.#pointsContaner.element);
  }

  #openPoint() {
    this.onOpenPoint(this.pointId);
    replace(this.editPointView, this.pointView);
  }

  #closePoint() {
    this.#onClosePoint();
    this.#updatePointsViews();
    replace(this.pointView, this.editPointView);
  }

  #saveEditPoint() {
    console.log('its save');
  }

  #onFavorite(favoriteState) {
    this.pointsModel.updateFavorite(this.pointId, favoriteState);
    this.pointView.updateElement({ isFavorite: favoriteState });
  }

  #onDestination(cityName) {
    const newDestination = this.pointsModel.destinationsByName[cityName];
    this.editPointView.updateElement({
      destination: newDestination,
      offers: [],
    });
  }

  #onEventType(newType) {
    const newOffersByType = this.pointsModel.offersByType(newType);
    this.editPointView.updateElement({
      pointType: newType,
      offers: [],
      possibleOffers: newOffersByType,
    });
  }

  #onDateChange(dateChanges) {
    this.editPointView.updateElement(dateChanges);
  }

}

import { remove, render, replace } from '../framework/render.js';
import EditPointView from '../view/edit-point-view.js';
import PointView from '../view/point-view.js';

export default class PointPresenter {
  #pointsContaner = null;
  constructor({ point, cities, pointsContaner, onOpen, onClose, pointsModel }) {
    this.pointsModel = pointsModel;
    this.point = point;
    this.cities = cities;
    this.onOpenPoint = onOpen;
    this.onClosePoint = onClose;
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
      this.closePoint.bind(this),
      this.#saveEditPoint.bind(this),
    );
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

  closePoint() {
    this.onClosePoint();
    replace(this.pointView, this.editPointView);
  }

  #saveEditPoint() {
    console.log('its save');
  }

  #onFavorite() {
    const updatedPoint = this.pointsModel.updateFavorite(this.pointId);
    const oldPointView = this.pointView;
    this.createPoint(updatedPoint);
    replace(this.pointView, oldPointView);
  }

}

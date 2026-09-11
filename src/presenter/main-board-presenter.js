import { render } from '../framework/render.js';
import FilterView from '../view/filter-view.js';
import ListView from '../view/list-view.js';
import SortView from '../view/sort-view.js';
import PointsModel from '../model/point-model.js';
import EmptyListView from '../view/empty-list-veiw.js';
import PointsListPresenter from './points-list-presenter.js';
import { EMPTY_MASSAGE } from '../utils/const.js';
import S from '../view/test.js';



export default class BoardPresenter {
  listComponent = new ListView();
  filterComponent = null;
  pointsModel = new PointsModel();
  #emptyMessage = null;

  constructor({ container, filterContainer }) {
    this.container = container;
    this.filterContainer = filterContainer;
    this.possibleOffers = [...this.pointsModel.possibleOffers];
    this.pointsData = this.pointsModel.fullDataList;
    this.citiesData = this.pointsModel.cities;
    this.pointsList = new PointsListPresenter(
      this.listComponent,
      this.pointsData,
      this.citiesData,
      this.pointsModel,
    );
    this.sortComponent = new SortView(this.pointsList.onSortClick.bind(this.pointsList));
    this.filterComponent = new FilterView(this.pointsList.onFilterClick.bind(this.pointsList));
  }

  init() {
    this.#renderFilter();
    render(this.sortComponent, this.container);
    render(this.listComponent, this.container);
    this.#renderPoints();
  }

  #renderFilter() {
    render(this.filterComponent, this.filterContainer);
  }

  #renderPoints() {
    if (this.pointsData.length === 0) {
      render(new EmptyListView(EMPTY_MASSAGE.Everthing), this.listComponent.element);
      return;
    }
    this.pointsList.init();
  }
}


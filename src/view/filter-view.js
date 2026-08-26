import AbstractView from '../framework/view/abstract-view.js';
import { FilterType } from '../utils/const.js';

function createFilterTemplateItem(filter) {
  return `
  <div class='trip-filters__filter'>
  <input id='filter-${filter.toLowerCase()}' class='trip-filters__filter-input  visually-hidden' type='radio' name='trip-filter' value='${filter.toLowerCase()}'>
  <label class='trip-filters__filter-label' for='filter-${filter.toLowerCase()}'>${filter}</label>
  </div>
  `
}

function createFilterTemplate() {
  const filterTypes = Object.values(FilterType);
  return `<form class="trip-filters" action="#" method="get">
              ${filterTypes.map(createFilterTemplateItem).join('')}
              <button class='visually-hidden' type='submit'>Accept filter</button>
         </form>`;
}

export default class FilterView extends AbstractView {
  #onFilterClick = null;
  constructor(onFilterClick) {
    super();
    this.#onFilterClick = onFilterClick;
    this.element.addEventListener('click', this.#filterCklickHandler.bind(this));
  }

  get template() {
    return createFilterTemplate();
  }

  #filterCklickHandler(evt) {
    evt.preventDefault();
    if (evt.target.tagName === 'LABEL') {
      const regExpFilter = /^\w+-(\w*)/gi;
      const filterType = regExpFilter.exec(evt.target.htmlFor)[1];
      this.#onFilterClick(filterType);
    }

  }
}

import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { getPointDate } from '../utils/utils.js';

function createPointTemplate(point, destination, offers, isFavorite) {
  function getOffersItem(offer) {
    return `
          <li class="event__offer">
            <span class="event__offer-title">Order ${point.type}</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">${offer.price}</span>
          </li>
    `;
  }

  const startDate = getPointDate(point.dateFrom);
  const endDate = getPointDate(point.dateTo);
  const diffDate = startDate(point.dateTo);
  return `
        <li class="trip-events__item">
          <div class="event">
            <time class="event__date" datetime="2019-03-18">${startDate('sd')}</time>
            <div class="event__type">
              <img class="event__type-icon" width="42" height="42" src="img/icons/${point.type.toLowerCase()}.png"
                alt="Event type icon">
            </div>
            <h3 class="event__title">${point.type} ${destination.name}</h3>
            <div class="event__schedule">
              <p class="event__time">
                <time class="event__start-time" datetime="${startDate('cd')}">${startDate('hd')}</time>
                &mdash;
                <time class="event__end-time" datetime="2019-03-18T11:00">${endDate('hd')}</time>
              </p>
              <p class="event__duration">${diffDate}M</p>
            </div>
            <p class="event__price">
              &euro;&nbsp;<span class="event__price-value">${point.basePrice}</span>
            </p>
            <h4 class="visually-hidden">Offers:</h4>
            <ul class="event__selected-offers">
              ${offers.map(getOffersItem).join('')}
            </ul>
            <button class="event__favorite-btn event__favorite-btn${isFavorite ? '--active' : ''}" type="button">
              <span class="visually-hidden">Add to favorite</span>
              <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
                <path
                  d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z" />
              </svg>
            </button>
            <button class="event__rollup-btn" type="button">
              <span class="visually-hidden">Open event</span>
            </button>
          </div>
        </li>
  `;
}

export default class PointView extends AbstractStatefulView {
  #onRollupClick = null;
  #onFavorite = null;
  #favoriteButton = null;
  constructor({ point, destination, offers }, onRollUpClick, onFavoriteClick) {
    super();
    this.#onFavorite = onFavoriteClick;
    this.point = point;
    this._state = { isFavorite: this.point.isFavorite };
    this.destination = destination;
    this.offers = offers;
    this.#onRollupClick = onRollUpClick;
    this._restoreHandlers();
  }

  _restoreHandlers() {
    this.#favoriteButton = this.element.querySelector('.event__favorite-btn');
    this.#favoriteButton.addEventListener('click', this.#onFavoriteClickHandler.bind(this));
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#onRollupClickHandler.bind(this));
  }

  get template() {
    return createPointTemplate(this.point, this.destination, this.offers, this._state.isFavorite);
  }

  #onRollupClickHandler(evt) {
    evt.preventDefault();
    this.#onRollupClick();
  }

  #onFavoriteClickHandler(evt) {
    evt.preventDefault();
    this.#onFavorite(!this._state.isFavorite);
  }
}

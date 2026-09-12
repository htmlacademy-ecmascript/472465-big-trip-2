import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { getPointDate } from '../utils/utils.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/themes/material_blue.css';

function createEditPointForm({ cities, offersTypes, state }) {
  const startDate = getPointDate(state.dateFrom);
  const endDate = getPointDate(state.dateTo);

  function createOfferButtonTemplate({ option, price, id },) {
    return `
           <div class="event__offer-selector">
             <input class="event__offer-checkbox  visually-hidden" id="${id}" type="checkbox" name="event-offer-luggage"
               ${state.offers.some(function isHasId(el) { return el.id === id; }) ? 'checked' : ''}>
             <label class="event__offer-label" for="${id}">
               <span class="event__offer-title">${option}</span>
               +€&nbsp;
               <span class="event__offer-price">${price}</span>
             </label>
           </div>
  `;
  }

  function createEventLisItem(offerType) {
    return `
     <div class="event__type-item">
        <input id="${offerType}" class="event__type-input  visually-hidden" type="radio" name="event-type"
          value="${offerType}" ${state.pointType === offerType ? 'checked' : ''}>
        <label class="event__type-label  event__type-label--${offerType.toLowerCase()}" for="${offerType}">${offerType}</label>
      </div>
    `;
  }

  function getCityOption(c) {
    return `<option value="${c}">${c}</option>`;
  }

  function createCitiesList(cityList) {
    return `
            <div class="event__field-group  event__field-group--destination">
               <label class="event__label  event__type-output" for="id="${state.destination.id}">
                 ${state.pointType}
               </label>
               <input class="event__input  event__input--destination" id="${state.destination.id}" type="text"
                 name="event-destination" value="${state.destination.name}" list="destination-list-1">
               <datalist id="destination-list-1">
                 ${cityList.map(getCityOption).join('')}
               </datalist>
             </div>
 `;

  }

  function createEventList(offerTypes) {
    return `
            <div class="event__type-list">
               <fieldset class="event__type-group">
                 <legend class="visually-hidden">Event type</legend>
                 ${offerTypes.map(createEventLisItem).join('')}
               </fieldset>
             </div>
           </div>
    `;
  }

  function getDestinationImages(picPath) {
    return `<img class="event__photo" src="${picPath.src}" alt="${picPath.description}">`
  }

  return `
         <form class="event event--edit" action="#" method="post">
           <header class="event__header">
             <div class="event__type-wrapper">
               <label class="event__type  event__type-btn" for="event-type-toggle-1">
                 <span class="visually-hidden">Choose event type</span>
                 <img class="event__type-icon" width="17" height="17" src="img/icons/${state.pointType.toLowerCase()}.png"
                   alt="Event type icon">
               </label>
               <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
             ${createEventList(offersTypes)}
             ${createCitiesList(cities)}
             <div class="event__field-group  event__field-group--time">
               <label class="visually-hidden" for="event-start-time-1">From</label>
               <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time"
                 value="${startDate('fd')}">
               —
               <label class="visually-hidden" for="event-end-time-1">To</label>
               <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time"
                 value="${endDate('fd')}">
             </div>

             <div class="event__field-group  event__field-group--price">
               <label class="event__label" for="event-price-1">
                 <span class="visually-hidden">Price</span>
                 €
               </label>
               <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price"
                 value="${state.basePrice}">
             </div>

             <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
             <button class="event__reset-btn" type="reset">Delete</button>
             <button class="event__rollup-btn" type="button">
               <span class="visually-hidden">Open event</span>
             </button>
           </header>
           <section class="event__details">
             <section class="event__section  event__section--offers">
               <h3 class="event__section-title  event__section-title--offers">Offers</h3>
               <div class="event__available-offers">
                 ${state.possibleOffers.map(createOfferButtonTemplate).join('')}
               </div>
             </section>

             <section class="event__section  event__section--destination">
               <h3 class="event__section-title  event__section-title--destination">Destination</h3>
               <p class="event__destination-description">${state.destination.description}</p>
               <div class="event__photos-container">
                 <div class="event__photos-tape">
                   ${state.destination.pictures.map(getDestinationImages).join('')}
                 </div>
               </div>
             </section>
           </section>
         </form>
  `;
}

export default class EditPointView extends AbstractStatefulView {
  #onRollupClick = null;
  #onSubmit = null;
  #submitButton = null;
  #onDestination = null;
  #onEventType = null;
  #onDateChange = null;
  #calenders = null;
  constructor(
    { point, destination, offers, possibleOffers, offersTypes },
    cities,
    onRollUpClick,
    onSubmit,
    onDestination,
    onEventType,
    onDateChange,
  ) {
    super();
    this.#onRollupClick = onRollUpClick;
    this.#onSubmit = onSubmit;
    this.#onDestination = onDestination;
    this.#onEventType = onEventType;
    this.#onDateChange = onDateChange;
    this.point = point;
    this.allCities = cities;
    this.offersTypes = offersTypes;
    this._state = {
      offers: offers,
      basePrice: point.basePrice,
      dateFrom: point.dateFrom,
      dateTo: point.dateTo,
      pointType: point.type,
      possibleOffers: possibleOffers,
      destination: destination,
    };
    this._restoreHandlers();
  }

  _restoreHandlers() {
    this.#submitButton = this.element.querySelector('.event__save-btn');
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#onRollUpClickHandler.bind(this));
    this.#submitButton.addEventListener('click', this.#onSubmitHandler.bind(this));
    this.element.querySelector('.event__available-offers').addEventListener('click', this.#onOffersClick.bind(this));
    this.element.querySelector('.event__input--price').addEventListener('change', this.#onPriceChange.bind(this));
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#onDestinationChange.bind(this));
    this.element.querySelector('.event__type-group').addEventListener('click', this.#onEventTypeClick.bind(this));
    this.element.querySelector('.event__type-group').addEventListener('click', this.#onEventTypeClick.bind(this));
    this.#setDatePicker();
  }

  get template() {
    return createEditPointForm({
      state: this._state,
      cities: this.allCities,
      offersTypes: this.offersTypes,
    });
  }

  #setDatePicker() {
    [this.startTimeField, this.endTimeField] = this.element.querySelectorAll('.event__input--time');
    const config = {
      enableTime: true,
      dateFormat: 'd/m/Y H:i',
      onChange: this.#onDateChangeHandler.bind(this)
    };
    const startDateCalendar = flatpickr(this.startTimeField, { ...config, maxDate: this._state.dateTo });
    const endDateCalendar = flatpickr(this.endTimeField, { ...config, minDate: this._state.dateFrom });
    this.#calenders = [startDateCalendar, endDateCalendar];
  }

  #destrtoyPicker() {
    this.#calenders.forEach((calendar) => { calendar.destroy() })
    this.calendar = null;
  }

  #onRollUpClickHandler(evt) {
    evt.preventDefault();
    this.#onRollupClick();
  }

  #onSubmitHandler(evt) {
    evt.preventDefault();
    this.#onSubmit();
    this.#submitButton.disabled = true;
  }

  #onOffersClick(evt) {
    if (evt.target.id && evt.target.tagName === 'INPUT') {
      this.#updateOffers(evt);
    }
  }

  #updateOffers(evt) {
    const offerId = evt.target.id;
    const compareOffers = this._state.offers.filter(({ id }) => id !== offerId);
    this._state.offers = compareOffers.length === this._state.offers.length
      ? [...this._state.offers, ...this._state.possibleOffers.filter(({ id }) => id === offerId)]
      : compareOffers;
  }

  #updatePrice(evt) {
    this._state = { ...this._state, basePrice: evt.target.value };
  }

  #onPriceChange(evt) {
    this.#updatePrice(evt);
  }

  #onDestinationChange(evt) {
    if (evt.target.name === 'event-destination' && evt.target.value) {
      this.#onDestination(evt.target.value);
    }
  }

  #onEventTypeClick(evt) {
    const newEventType = evt.target.value;
    if (evt.target.classList.contains('event__type-input') && newEventType !== this._state.pointType) {
      this.#onEventType(newEventType);
    }
  }

  #onDateChangeHandler(sd, dstr, inst) {
    switch (inst.input.name) {
      case 'event-start-time':
        this.#destrtoyPicker();
        this.#onDateChange({ dateFrom: new Date(sd[0]).toJSON() });
        break;
      case 'event-end-time':
        this.#destrtoyPicker();
        this.#onDateChange({ dateTo: new Date(sd[0]).toJSON() })
        break;
    }
  }
}

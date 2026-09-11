import { getRandomNum, getRandomFromArray, getId } from '../utils/utils.js';
import { cities, cityDescriptions, imageDescriptions } from './destination-info.js';

const PREFIX = 'DEST';
const DESTCOUNT = cities.length;
const IMAGEPATH = 'https://loremflickr.com/248/152?random=';
let cityNum = 0;
class DestinationData {
  constructor() {
    this.cities = cities;
    this.descriptions = cityDescriptions;
    this.imageDescriptions = imageDescriptions;
  }

  getRandomImage() {
    return `${IMAGEPATH}${getRandomNum()}`;
  }

  getId() {
    return getId(PREFIX);
  }

  getCityInfo() {
    return {
      src: this.getRandomImage(),
      description: getRandomFromArray(imageDescriptions),
    };
  }

  getCityInfoArray() {
    return Array.
      from({ length: this.getRandomNum() }, this.getCityInfo.bind(this));
  }

  getRandomNum() {
    return getRandomNum(1, 5);
  }

  getDestination() {
    if (cityNum > DESTCOUNT) {
      cityNum = 0;
    }
    cityNum++;
    return {
      name: this.cities[cityNum],
      id: this.getId(),
      description: this.descriptions[cityNum],
      pictures: this.getCityInfoArray()
    };
  }
}

export const destinations = (function getDestinations() {
  const destCombain = new DestinationData();
  return Array.
    from({ length: DESTCOUNT }, destCombain.getDestination.bind(destCombain));
}());


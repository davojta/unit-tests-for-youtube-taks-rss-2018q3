import carouselTemplate from './carousel.html';
import './carousel.css';
import itemTemplate from './carousel-item/carousel-item.html';
import './carousel-item/carousel-item.css';

class Carousel {
  static draw() {
    const carouselHTML = document.createElement('section');
    carouselHTML.className = 'carousel-container';
    carouselHTML.innerHTML = carouselTemplate;
    document.body.appendChild(carouselHTML);
  }

  static getScrollerParams() { // returns [vidsPerPage, scrollerWidth]
    const vidsPerPage = Math.floor(document.body.offsetWidth / 340);
    const scrollerWidth = vidsPerPage * 340;
    return [vidsPerPage, scrollerWidth];
  }

  static fill(items) { // here I need to fill some templates without any libs
    items.forEach((element) => {
      const item = document.createElement('div');
      let templateBuffer = itemTemplate;
      item.className = 'carousel-scroller__item-container';
      // working with strings is faster, than that stuff with multiple innerHTML (reloads DOM etc)
      templateBuffer = templateBuffer.replace('#', element.pic);
      templateBuffer = templateBuffer.replace('url_placeholder', element.url);
      templateBuffer = templateBuffer.replace('title_placeholder', element.title);
      templateBuffer = templateBuffer.replace('author_placeholder', element.author);
      templateBuffer = templateBuffer.replace('description_placeholder', element.description);
      templateBuffer = templateBuffer.replace('date-views_date_placeholder', element.date);
      templateBuffer = templateBuffer.replace('date-views_views_placeholder', element.views);

      item.innerHTML = templateBuffer;

      document.querySelector('.carousel-scroller').appendChild(item);
    });
  }

  static empty() {
    const scroller = document.querySelector('.carousel-scroller');
    while (scroller.firstChild) { // again, this thing is faster than .innerHTML = '';
      scroller.removeChild(scroller.firstChild);
    }
  }
}

export default Carousel;

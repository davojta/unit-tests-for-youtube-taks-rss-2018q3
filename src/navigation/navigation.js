import navigationTemplate from './navigation.template';
import './navigation.css';

class Navigation {
  static draw() {
    const navigationHTML = document.createElement('section');
    navigationHTML.className = 'navigation';
    navigationHTML.innerHTML = navigationTemplate;
    document.body.appendChild(navigationHTML);
  }

  static redraw(pages, currentPage) {
    const percentage = currentPage / pages * 100;
    document.querySelector('.navigation__number').textContent = `${currentPage}`;
    document.querySelector('.navigation__bar').setAttribute('style', `width: ${percentage}%`);
  }
}

export default Navigation;

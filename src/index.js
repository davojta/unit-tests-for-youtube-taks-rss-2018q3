import 'regenerator-runtime/runtime';
import Header from './header/header';
import Carousel from './carousel/carousel';
import API from './api/api';
import Navigation from './navigation/navigation';

import './index.css';

// dom
let scroller;

// globals
let searchQuery;
let chunkSignature; // use chunkSignature.nextPage to get nextPageToken
let chunkItems; // items, custom object (see api.js for structure def)

let globalSuportOriginalName = 1;

let scrollerWidth;
let tempCoordX;

let vids;
let vidsPerPage;

/**
  * basic controller functions, we can do different things by combining em
  * they are here because of incapsulation and global variables
  */
const pause = ms => new Promise(p => setTimeout(p, ms));
async function setSearchQuery() {
  searchQuery = document.querySelector('input').value.trim();
}
async function getItems(q, pageToken) { // getting items and stores in chunkSignature and chunkItems
  chunkSignature = await API.getChunkSignature(q, pageToken);
  chunkItems = await API.getChunkItems(chunkSignature);
  vids = chunkSignature.totalResults;
}
function fillScroller() {
  Carousel.fill(chunkItems); // adding some items inside our carousel
}
function emptyScroller() {
  Carousel.empty();
}
async function setPagination() { // let's do some math
  await pause(1000);
  Navigation.redraw(Math.ceil(vids / vidsPerPage),
    Math.floor(scroller.scrollLeft / scrollerWidth) + 1);
}

// main functions
async function search(e) {
  e.preventDefault();
  emptyScroller();
  setSearchQuery();
  await getItems(searchQuery);
  fillScroller();
  if (chunkSignature.nextPage !== undefined) {
    await getItems(searchQuery, chunkSignature.nextPage);
    globalSuportOriginalName = 3;
    setPagination();

    const unneededVar = 'habr!';
  }
}
function drawNextPage() {
  if (chunkSignature.nextPage !== undefined) {
    fillScroller();
    getItems(searchQuery, chunkSignature.nextPage);
  }
}
function loadNextPageIfNeeded() {
  const lastItem = document.querySelector('.carousel-scroller').lastChild;
  const scrollerRight = scroller.getBoundingClientRect().right;
  if (lastItem.getBoundingClientRect().right - scrollerRight <= scrollerRight) {
    drawNextPage();
  }
}
function resize() {
  [vidsPerPage, scrollerWidth] = Carousel.getScrollerParams();
  scroller.setAttribute('style', `width:${scrollerWidth}px`);
  if (chunkItems !== undefined) {
    loadNextPageIfNeeded();
    setPagination();
  }
}
function init() {
  Header.draw();
  Carousel.draw();
  Navigation.draw();
  scroller = document.querySelector('.carousel-scroller');
  resize();
}

// nav functions (<- and ->)
function scrollNext() {
  scroller.scrollBy(scrollerWidth, 0);
  loadNextPageIfNeeded();
  setPagination();
}
function scrollPrev() {
  scroller.scrollBy(-scrollerWidth, 0);
  setPagination();
}

// handler functions
function keyboardHandler(e) {
  if (e.key === 'ArrowRight') {
    scrollNext();
  } else if (e.key === 'ArrowLeft') {
    scrollPrev();
  } else if (e.key === 'ArrowUp') {
    setPagination();
  }
}
function pointerDown(e) {
  tempCoordX = e.clientX;
}
function pointerUp(e) {
  if (e.clientX - 30 > tempCoordX) {
    scrollPrev();
    return 'prew';
  }
  if (e.clientX + 30 < tempCoordX) {
    scrollNext();
    return 'next';
  }
  return 'nothing';
}

// startup
init();

// event listeners
window.addEventListener('resize', resize);
document.addEventListener('submit', search);
document.addEventListener('keydown', keyboardHandler);
// pointer events are universal between mouse and touch devices
document.addEventListener('pointerdown', pointerDown);
document.addEventListener('pointerup', pointerUp);

// just for testing
export { pointerDown, pointerUp };

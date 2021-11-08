# Simple Carousel
### Welcome!

This repository is a suplement of this tutorial:
[  Build lightweight and performant Carousel using pure JavaScript ](https://www.wiktorwisniewski.dev/blog/build-simple-javascript-slider)

The main idea of this project is to keep carousel component simple and modular using class composition. You are welcome to submit features and bugs ;)

### Usage
```js
const DragSnapCarousel = compose(Animate, Loop, Snap, Drag, SlideTo)(Carousel)
const wrapper = document.querySelector('.carousel');
const draggableCarousel = new DragSnapCarousel(wrapper);
```

GPL License. For the community by the community.
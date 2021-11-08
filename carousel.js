class Carousel {

  constructor(containerReference, options) {
    this.container = containerReference;

    this.state = {
      isMouse: false,
      currentPosition: 0,
      offset: 0,
      size: {
        width: 0,
        slidePercentageWidth: 0
      }
    };

    const defaults = {}

    this.sliderOptions = { ...defaults, ...options }
    
    this.#countSlides();
    this.#setCarouselSizes();
  }

  #countSlides() {
    const slides = this.container.querySelectorAll('.carousel__slide');
    this.state.slidesCount = slides.length;
  }

  #getMaxWidth() {
    const { slidesCount } = this.state;
    const { slidePercentageWidth } = this.#measureCarousel();
    return slidesCount * slidePercentageWidth;
  }

  #getOffsetHighestPoint() {
    const { slidesCount } = this.state;
    const { slidePercentageWidth } = this.#measureCarousel();
    return (slidesCount - 1) * slidePercentageWidth;
  }

  #measureContainerElement() {
    const { width: containerWidth } = this.container.getBoundingClientRect();
    return containerWidth;
  }

  #measureSlide() {
    const { width: slideWidth } = this.container.firstElementChild.getBoundingClientRect();
    return slideWidth;
  }

  #measureCarousel() {
    const containerWidth = this.#measureContainerElement();
    const slideWidth = this.#measureSlide();
    const slidePercentageWidth = parseInt(((slideWidth / containerWidth) * 100).toFixed(0), 10);
    
    return { containerWidth, slidePercentageWidth }
  }

  #setCarouselSizes() {
    const { containerWidth, slidePercentageWidth } = this.#measureCarousel();
    const maxWidth = this.#getMaxWidth();
    const offsetMax = this.#getOffsetHighestPoint();
    this.state.size = {
      maxWidth,
      offsetMax,
      width: containerWidth,
      slidePercentageWidth
    }
  }

  resize() {
    this.#setCarouselSizes();
  }
}
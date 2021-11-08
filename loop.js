const Loop = Carousel => class extends Carousel {
  constructor(containerReference, options) {
    super(containerReference, options);
    this.slideCount = Infinity;
  }

  #animateSmoothly(offset) {
    this.container.style.transition = 'transform ease-in-out .2s';
    this.container.style.transform = `translateX(${offset}%)`;
  }

  #animateRough(inputOffset) {
    const { offset } = this.state;
    const moveToOffset = typeof inputOffset !== 'undefined' ? inputOffset : offset;
    this.container.style.transition = '';
    this.container.style.transform = `translateX(${moveToOffset}%)`;
  }

  #calcCurrentGapSize(offset) {
    const { size: { slidePercentageWidth, maxWidth } } = this.state;

    const GAP_ON_END = 100 - slidePercentageWidth;
    const CAROUSEL_END_POINT = invert(-(maxWidth) + slidePercentageWidth + GAP_ON_END);
    const invertedOffset = invert(offset);
    const carouselHasGap = invertedOffset >= CAROUSEL_END_POINT;

    if (carouselHasGap) {
      return invertedOffset - CAROUSEL_END_POINT;
    } else {
      return 0;
    }
  }

  #detectIfCarouselIsOnEnds(offset) {
    const CAROUSEL_START = 0;
    const CAROUSEL_END = this.#getCarouselEnd();
    return (offset > CAROUSEL_START || offset <= -CAROUSEL_END - 1);
  }

  #fillGap(offset) {
    const isOnEnd = this.#detectIfCarouselIsOnEnds(offset);
    if (isOnEnd) {
      const gapSize = this.#calcCurrentGapSize(offset);
      const slideAmount = this.#getHowManySlidesFills(gapSize);
      this.#translateSlides(slideAmount);
    } else {
      this.#resetTranslation()
    }
  } 

  #getHowManySlidesFills(gap) {
    const { slidePercentageWidth } = this.state.size;
    return Math.ceil(gap / slidePercentageWidth);
  }

  #getCarouselEnd() {
    const { state: { slidesCount, size: { slidePercentageWidth } } } = this;
    const GAP_ON_END = 100 - slidePercentageWidth;
    const END_OFFSET = (slidesCount - 1) * slidePercentageWidth;
    return (END_OFFSET - GAP_ON_END);
  }

  #overWriteOffset(offset) {
    const { 
      size: { 
        slidePercentageWidth, 
        offsetMax,
        maxWidth
      } 
    }  = this.state;
    
    const rangeWithoutGap = invert(offsetMax - (100 - slidePercentageWidth));
    const rangeWithGap = invert(maxWidth);
    const range = this.slideCount === Infinity ? rangeWithGap : rangeWithoutGap ;
    if (offset > 0) {
      return this.#processOffsetAboveZero(offset);
    } else if (offset < range ) {
      return this.#processOffsetBelowMax(offset);
    } else {
      return offset;
    }
  }

  #processOffsetAboveZero(offset) {
    const { maxWidth } = this.state.size;
    return invert(maxWidth - ((offset / (maxWidth)) % 1) * (maxWidth));
  }

  #processOffsetBelowMax(offset) {
    const { maxWidth } = this.state.size;
    return invert(((invert(offset) / maxWidth) % 1) * maxWidth);
  }

  #resetTranslation() {
    const { container } = this;

    const carouselSlides = container.children;
    const slidesToReset = Array.from(carouselSlides);
    for(let i = 0; i < slidesToReset.length; i++ ) {
      slidesToReset[i].style.transform = `initial`
    }
  }

  #runLoopAnimation(offset) {
    this.#fillGap(offset);
    this.#animateRough(offset);
  }

  #handleSlideToAnimation(offset) {
    const { container } = this;
    this.#fillGap(offset);
    this.#animateSmoothly(offset);
  }

  #translateSlides(amountOfSlidesToMove) {
    const { container, state: { slidesCount } } = this;

    const PERCENT = 100;

    const carouselSlides = container.children;
    const slidesToMove = Array.from(carouselSlides);
    const carouselWidth = slidesCount * PERCENT;

    for(let i = 0; i < slidesToMove.length; i++ ) {
      if (i < amountOfSlidesToMove) {
        slidesToMove[i].style.transform = `translateX(${carouselWidth}%)`
      } else {
        slidesToMove[i].style.transform = `initial`
      }
    }
  }

  animationHook(offset) {
    this.#fillGap(offset);
  }

  handleAnimation(inputOffset) {
    const { offset } = this.state;
    const moveToOffset = typeof inputOffset !== 'undefined' ? inputOffset : offset;
    
    const newOffset = this.#overWriteOffset(moveToOffset);    
    
    const snapModuleLoaded = this.handleSnapAnimation;
    const slideToModuleLoaded = this.slideTo;
    this.state.raf = requestAnimationFrame(() => {
      if (typeof inputOffset !== 'undefined' && snapModuleLoaded) {
        this.handleSnapAnimation(newOffset);
      } else if (typeof inputOffset !== 'undefined' && slideToModuleLoaded) {
        this.#handleSlideToAnimation(newOffset)
      } else {
        this.#runLoopAnimation(newOffset);
      }
      this.state.offset = newOffset;
    })
    return newOffset;
  }
}
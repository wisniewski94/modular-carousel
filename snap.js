const Snap = Carousel => class extends Carousel {
  
  #getOffsetMade(dataSource) {
    const {
      isMouse,
      pointerPosition,
      size: {
        width: containerWidth
      }
    } = this.state;
    
    const currentPoint = readPoint(dataSource, isMouse);
    const offsetMade = delta(pointerPosition, currentPoint);
    return toPercent(offsetMade, containerWidth);
  }

  #detectInMarginOffset(offsetMade, marginSize) {
    return Math.abs(offsetMade) <= marginSize;
  }

  #finishSnap(offset) {
    this.removeInteractionEvents();
    this.state.isDragging = false;
    this.state.currentPosition = offset;
    this.state.isMouse = false;
    requestAnimationFrame(() => cancelAnimationFrame(this.state.raf));
  }

  #getOffsetInSlides(offset) {
    const { slidePercentageWidth } = this.state.size;
    const slideSize = offset / slidePercentageWidth;
    return slideSize < 0 ? Math.ceil(slideSize) : Math.floor(slideSize);
  }

  #getSlideToValue(slideBy, inMargin) {
    const { slidePercentageWidth } = this.state.size;
    const backwardMovement = isNegative(slideBy);
    const MOVE_OFFSET = 1;

    const snapForward = () => this.state.currentPosition + (slideBy - MOVE_OFFSET) * slidePercentageWidth;
    const snapBackward = () => this.state.currentPosition + (slideBy + MOVE_OFFSET) * slidePercentageWidth;
    const stay = () => this.state.currentPosition
    
    if (inMargin) {
      return stay();
    } else if (backwardMovement) {
      return snapForward();
    } else {
      return snapBackward();
    }
  }

  #getSnapOffset(event) {
    const { slideCount } = this;

    const offsetMade = this.#getOffsetMade(event);
    const isInMargin = this.#detectInMarginOffset(offsetMade, 10);
    const slideBy = this.#getOffsetInSlides(offsetMade);
    const calculatedOffset = this.#getSlideToValue(slideBy, isInMargin);
    const limitedOffset = this.#validateSlideToValue(calculatedOffset);
    const offset = slideCount === Infinity ? calculatedOffset : limitedOffset;
    return offset;
  }

  #stopAnimation(finalOffset) {
    cancelAnimationFrame(this.state.snapRaf);
    this.state.offset = finalOffset;
  }

  #validateSlideToValue(inputOffset) {
    const {
      size: {
        slidePercentageWidth,
        maxWidth,
      }
    } = this.state;
    
    const CAROUSEL_START_POINT = 0;
    const GAP_ON_END = 100 - slidePercentageWidth;
    const CAROUSEL_END_POINT = -(maxWidth) + slidePercentageWidth + GAP_ON_END;

    if (inputOffset > CAROUSEL_START_POINT) {
      return 0;
    } else if (inputOffset < CAROUSEL_END_POINT) {
      return CAROUSEL_END_POINT;
    } else {
      return inputOffset;
    }
  }

  animationHook(animationFrame) {
    console.log(animationFrame, 'asd')
  }

  handleSnapAnimation(offset) {
    console.log('snapsnap')
    const DURATION = 1000;
    const animationInput = this.state.offset;
    const animationTarget = offset;

    let animationFrame = null;

    let stop = false;
    let start = null

    const calculateFrame = (easingPoint) => animationInput + (animationTarget - animationInput) * easingPoint;

    const draw = () => {
      const now = Date.now();
      const point = (now - start) / DURATION;
      const easingPoint = easeInOutCubic(point);
      console.log('draw')
      if (stop) {
        this.#stopAnimation(animationFrame);
        return;
      }

      animationFrame = calculateFrame(easingPoint);

      if (now - start >= DURATION) {
        stop = true;
        const roundedEndFrame = Math.round(animationFrame);
        animationFrame = roundedEndFrame;
      };
      console.log('hook')
      this.animationHook(animationFrame);
      this.container.style.transform = `translateX(${animationFrame}%)`;
      this.state.snapRaf = requestAnimationFrame(draw)
    }

    const startAnimation = () => {
      start = Date.now();
      draw(start)
    }

    startAnimation();
  }

  handleUp = (event) => {
    this.snap(event);
  }

  snap(event) {
    const offset = this.#getSnapOffset(event);
    const offsetSet = this.handleAnimation(offset);
    this.#finishSnap(offsetSet);
  }
}
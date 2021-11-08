const SlideTo = Carousel => class extends Carousel {
  #animateSmoothly(offset) {
    this.container.style.transition = 'transform ease-in-out .2s';
    this.container.style.transform = `translateX(${offset}%)`;
  }
  
  #endAnimation() {
    requestAnimationFrame(() => cancelAnimationFrame(this.state.raf));
  }

  #limitSlideTo({target, max}) {
    let slideTo = 0;
    if (target > max) {
      slideTo = max;
    } else if (target < 1) {
      slideTo = 1;
    } else {
      slideTo = target;
    }
    return slideTo;
  }

  #parseSlideTo(targetSlide) {
    const { 
      slideCount,
      state: { 
        size: { 
          slidePercentageWidth
        }
      } 
    } = this;

    const limitedAnimateTo = this.#limitSlideTo({target: targetSlide, max: slideCount});
    const ARRAY_OFFSET = 1;

    return (limitedAnimateTo - ARRAY_OFFSET) * invert(slidePercentageWidth);
  }

  handleAnimation(offset) {
    this.state.raf = requestAnimationFrame(() => {
      this.#animateSmoothly(offset);
    })
    
    return offset;
  }
  
  slideForward() {
    const { offset, size: { slidePercentageWidth } } = this.state;
    const forwardPosition = offset +-slidePercentageWidth;
    this.handleAnimation(forwardPosition);
    this.state.currentPosition = forwardPosition;
    this.#endAnimation();
  }

  slideTo(targetSlide) {
    const validatedTarget = this.#parseSlideTo(targetSlide);

    this.handleAnimation(validatedTarget);
    this.state.currentPosition = validatedTarget;

    this.#endAnimation();
  }
}
const Drag = Carousel => class extends Carousel {

  constructor(containerReference, options) {
    super(containerReference, options);
    this.#attachActivationEvents();
  }

  #animateRough() {
    const { offset } = this.state;
    this.container.style.transition = '';
    this.container.style.transform = `translateX(${offset}%)`;
  }

  #animateSmoothly(offset) {
    this.container.style.transition = 'transform ease-in-out .8s';
    this.container.style.transform = `translateX(${offset}%)`;
  }

  #attachActivationEvents() {
    const { container } = this;
    if (container) {
      container.addEventListener('contextmenu', this.handleUp);
      container.addEventListener('mousedown', this.#handleDown);
      container.addEventListener('touchcancel', this.handleUp);
      container.addEventListener('touchstart', this.#handleDown, { passive: true });
    }
  }

  #attachInteractionEvents() {
    const node = !this.state.isMouse ? this.container : document;
    if (node) {
      node.addEventListener('mousemove', this.#handleMove);
      node.addEventListener('mouseup', this.handleUp);
      node.addEventListener('touchend', this.handleUp);
      node.addEventListener('touchmove', this.#handleMove, { passive: true });
    }
  }

  #calculateDragOffset(event) {
    const { 
      currentPosition, 
      isMouse, 
      pointerPosition, 
      size: { 
        width: containerWidth
      } 
    } = this.state;

    const currentPoint = readPoint(event, isMouse);
    const pointerOffsetMade = delta(pointerPosition, currentPoint);
    const pointerOffsetInPercents = toPercent(pointerOffsetMade, containerWidth);
    const carouselOffset = currentPosition + pointerOffsetInPercents;

    this.state.offset = carouselOffset;
  }

  #drag() {
    this.removeInteractionEvents();
    this.#stopDrag();
  }

  #handleDown = (event) => {
    const { type } = event;
    this.state.isMouse = type === 'mousedown';
    this.#attachInteractionEvents();
    this.#startDrag();
    this.#setCurrentDragPosition(event);
  }

  #handleDrag = (event) => {
    this.#calculateDragOffset(event);
    this.handleAnimation();
  }

  #handleMove = (event) => {
    const { isDragging } = this.state;
    if (isDragging) this.#handleDrag(event);
  }

  removeInteractionEvents() {
    const node = !this.state.isMouse ? this.container : document;
    if (node) {
      node.removeEventListener('mousemove', this.#handleMove);
      node.removeEventListener('mouseup', this.handleUp);
      node.removeEventListener('touchend', this.handleUp);
      node.removeEventListener('touchmove', this.#handleMove, { passive: true });
    }
  }

  #setCurrentDragPosition(event) {
    const { isMouse } = this.state;
    this.state.pointerPosition = readPoint(event, isMouse);
  }

  #startDrag() {
    this.state.isDragging = true;
  }

  #stopDrag() {
    const { offset } = this.state;
    this.state.isMouse = false;
    this.state.isDragging = false;
    this.state.currentPosition = offset;
  }

  handleAnimation(inputOffset) {
    this.state.raf = requestAnimationFrame(() => {
      if (typeof inputOffset !== 'undefined') {
        this.#animateSmoothly(inputOffset);
      } else {
        this.#animateRough();
      }
    })
    
    return typeof inputOffset !== 'undefined' ? inputOffset : this.state.offset;
  }

  handleUp = (event) => {
    this.#drag();
  }
}
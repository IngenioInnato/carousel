class Carousel{
  constructor(html, nSlideItem = [1, 2, 3, 4, 5], breakPoint = [0, 576, 768, 992, 1200]){
    this._html = html;
    this._breakPoint = breakPoint;
    this._viewportItem = nSlideItem;
    this._slide = this._html.querySelector('.carousel__slide');
    this._indicator = this._html.querySelector('.carousel__indicator');
    this._control = this._slide.querySelectorAll('.carousel__control');
    this._prev = this._slide.querySelector('.control__prev');
    this._next = this._slide.querySelector('.control__next');
    this._slideItem = this._slide.querySelectorAll('.carousel__item');
    this._nSlideItem = this._slideItem.length; 
    this._indicatorItem = 0;
    this._indicatorContainer = 0;

    // Variables que son definidas por funciones
    this._width = this.width();
    this._itemPerSlide = this.itemPerSlide();
    this._itemPercent = this.itemPercent();
    this._nIndicatorDot = this.nIndicatorDot();
    // UI FUNCTION
    this.startCarousel();
  }

  /* Funciones que definen variables */
  width(){ // Tamaño de pantalla
    this._width = window.innerWidth;
    return this._width;
  }
  
  itemPerSlide(){ // N Items en UN slide
    var nItem = 0;
    this._width = this.width();
    this._breakPoint.forEach((el, i) => {
      if( this._width > el ) nItem = this._viewportItem[i];
    });
    return nItem;
  }
  
  itemPercent(){ // Proporcion en Items en Slide
    var percent = 0;
    this._itemPerSlide = this.itemPerSlide();
    if((this._itemPerSlide != 0) && (this._itemPerSlide > 0)) percent = 100 / this._itemPerSlide;
    return percent;
  }
  
  nIndicatorDot(){ // Indica el número de indicadores que habrá
    this._itemPerSlide = this.itemPerSlide();
    var nDot = Math.ceil(this._nSlideItem / this._itemPerSlide); // Redondea a número de carousels y resta dos de los controls next y prev
    return nDot;
  }

  selectIndicatorItem(){ // actualiza inidicador cuando este se eliminó y se vuelve a crear
    this._indicator = this._html.querySelector('.carousel__indicator');
    this._indicatorItem = this._indicator.querySelectorAll('.indicator__item');
    return true;
  }

  selectIndicatorContainer(){ // actualiza inidicador cuando este se eliminó y se vuelve a crear
    this._indicator = this._html.querySelector('.carousel__indicator');
    this._indicatorContainer = this._indicator.querySelector('.indicator__container');
    return true;
  }

  selectIndicatorHtml(){// actualiza inidicador cuando este se eliminó y se vuelve a crear
    this.selectIndicatorItem();
    this.selectIndicatorContainer();
    return true;
  }
  /* =============================== */
  
  removeActive(el){ //remueve la clase active
    if(el.classList.contains('active')) el.classList.remove('active');
    return true;
  }
  
  remplaceTransformText(text){ // Remover todos los caracteres innecesarios en el códifo
    text = text.replace(/[^0-9\.]+/g, ""); // Remueve las letras
    text = text.replace('00', ''); // Remueve dos 0 en la cadena
    (text === '') ? text = 0 : text = parseInt(text);// condicion que determina si estamos en la posicion 0 u otra
    return text;
  }
  /* UI functions */
  setItemSize(){ // Asigna tamaño de items del slide
    this._itemPercent = this.itemPercent();
    this._slideItem.forEach(el => {
      el.style.flex = `0 0 ${this._itemPercent}%`;
    });
    return true;
  }

  createIndicator(){ // Crear control carousels
    this._nIndicatorDot = this.nIndicatorDot(); 
    var ul = document.createElement('ul');
    ul.classList.add(`indicator__container`);
    for(var i = 1; i <= this._nIndicatorDot; i++){
      const li = document.createElement('li');
      li.classList.add('indicator__item',`indicator__item-${i}`);
      // li.setAttribute('onclick',`indicatorMove(this)`);
      li.setAttribute('data-slide-number', i)
      li.innerHTML = i; 
      if(i === 1) li.classList.add('active');
      ul.appendChild(li);
    }
    this._indicator.appendChild(ul);
    this.selectIndicatorHtml();
    return true;
  }
  
  slideTranslate(transform){ // Realiza movimiento a trasladar
    this._slideItem.forEach(item => item.style.transform = transform);
    return true;
  }

  resetIndicator() { // Reinicia indicador cuando este cambia de tamaño
    this._indicator = this._html.querySelector('.carousel__indicator');
    this.selectIndicatorHtml();
    this._indicatorItem.forEach(el => (el.classList.contains('active')) ? this.removeActive(el): '');
    this._indicatorItem[0].classList.add('active'); // colocar primer idicador activo
    this._control[0].dataset.slideNumber = 0; // actualiza slides
    this._control[1].dataset.slideNumber = 2; // actualiza slides
    this._slideItem.forEach(elm => elm.style.transform = 'translateX(0)');
    return true;
  }

  updateControl(){ // actualiza controls cuando indicador es seleccionad0
    this._itemPerSlide = this.itemPerSlide();
    var text = this._slideItem[0].style.transform;
    text = this.remplaceTransformText(text);
    text = (text / this._itemPerSlide) + 1; // ubicación de item control actualmente
    this._control[0].dataset.slideNumber = text - 1;
    this._control[1].dataset.slideNumber = text + 1;
    return true;
  }

  updateIndicator(){ // actualiza controls cuando indicador es seleccionado
    this._control = this._slide.querySelectorAll('.carousel__control'); // update controls
    var before = this._control[0].dataset.slideNumber;
    this._indicatorItem.forEach(el => this.removeActive(el));
    this._indicatorItem[before].classList.add('active');
    return true;
  }

  moveSlide(el){ // Por parametro se pasa elemento con dataset, mueve el slide
    this._itemPerSlide = this.itemPerSlide(); // actualizar
    var nItem = parseInt(el.dataset.slideNumber);
    this._indicatorItem.forEach(el => {
      this.removeActive(el);
    });
    var moveSlide = -((nItem - 1) * this._itemPerSlide * 100); // valor a trasladar
    moveSlide = `translateX(${moveSlide}%)`;
    this.slideTranslate(moveSlide);
    return true;
  }

  
  indicatorMove(indicatorItem){ // mover slide con indicador
    this. moveSlide(indicatorItem);
    indicatorItem.classList.add('active');
    this.updateControl();
    return true;
  }

  indicatorListener(){ // Selecciona items
    this.selectIndicatorHtml();
    this._indicatorItem.forEach(el => el.addEventListener('click', () => this.indicatorMove(el)));
    return true;
  }

  controlListener(){  // Escucha controles
    this._nIndicatorDot = this.nIndicatorDot();
    this._control.forEach(el => el.addEventListener('click', () => {
      if(el.dataset.slideNumber == '0')// Ir al último slide
        el.dataset.slideNumber = this._nIndicatorDot;
      else if (el.dataset.slideNumber == this._nIndicatorDot + 1) // ir al primer slide
        el.dataset.slideNumber = 1;
      this.indicatorMove(el);
      this.updateIndicator();
    }));
    return true;
  }

  windowListener(){ // Escucha cambio de pantalla
    window.addEventListener('resize', () => {
      if(this._itemPerSlide != this.itemPerSlide()){ 
        this.setItemSize(); 
        this._itemPerSlide = this.itemPerSlide();
        this._indicator.innerHTML = '';
        this.createIndicator();
        this.resetIndicator();
        this.activeListener();
        this.updateControl();
      } 
    });
  }

  activeListener(){ // Inicia todos los escuchadores
    this.indicatorListener();
    this.controlListener();
    this.windowListener();
  }

  startCarousel(){ // inicia carrusel
    this.setItemSize();
    this.createIndicator();
    this._indicator = this._html.querySelector('.carousel__indicator');
    this.selectIndicatorHtml();
    this.activeListener();
  }
  /* ============ */
}
var y = document.querySelector('.carousel');
var x = new Carousel(y);
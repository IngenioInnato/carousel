class Carousel{
  constructor(html, bControl = true, bIndicator = true , nSlideItem = [1, 2, 3, 4, 5], breakPoint = [0, 576, 768, 992, 1200], bNIndicator = true){
    this._html = html;
    this._bControl = bControl; // Boolean Control
    this._bIndicator = bIndicator;
    this._bNIndicator = bNIndicator;
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
    this._nSlide = this.nSlide();
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
  
  nSlide(){ // Indica el número de indicadores que habrá
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
  
  removeActive(){ //remueve la clase active
    this.selectIndicatorItem();
    // De todos los indicator item, si posee la clase activa, remueve esta la clase
    this._indicatorItem.forEach(el => (el.classList.contains('active')) ? el.classList.remove('active'): '');
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
    this._nSlide = this.nSlide(); 
    var ul = document.createElement('ul');
    ul.classList.add(`indicator__container`);
    for(var i = 1; i <= this._nSlide; i++){
      const li = document.createElement('li');
      li.classList.add('indicator__item',`indicator__item-${i}`);
      // li.setAttribute('onclick',`indicatorMove(this)`);
      li.setAttribute('data-slide-number', i)
      if(this._bNIndicator) li.innerHTML = i; 
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
    this.removeActive();
    this._indicatorItem[0].classList.add('active'); // colocar primer idicador activo
    this._control[0].dataset.slideNumber = 0; // actualiza slides
    this._control[1].dataset.slideNumber = 2; // actualiza slides
    this._slideItem.forEach(elm => elm.style.transform = 'translateX(0)');
    return true;
  }

  resetControl(){
    this._control[0].dataset.slideNumber = 0;
    this._control[1].dataset.slideNumber = 2;
    if(!this._bIndicator) this._slideItem.forEach(elm => elm.style.transform = 'translateX(0)');
    return true;
  }
  actualLocation(){
    this._itemPerSlide = this.itemPerSlide();
    var local = this._slideItem[0].style.transform;
    local = this.remplaceTransformText(local);
    local = (local / this._itemPerSlide) + 1; // ubicación de item control actualmente
    return local;
  }

  updateControl(){ // actualiza controls cuando indicador es seleccionad0
    var actual = this.actualLocation();
    this._control[0].dataset.slideNumber = actual - 1;
    this._control[1].dataset.slideNumber = actual + 1;
    return true;
  }

  updateIndicator(){ // actualiza controls cuando indicador es seleccionado
    var actual = this.actualLocation();
    this.removeActive();
    this._indicatorItem[actual - 1].classList.add('active');
    return true;
  }

  moveSlide(el){ // Por parametro se pasa elemento con dataset, mueve el slide
    this._itemPerSlide = this.itemPerSlide(); // actualizar
    var nItem = parseInt(el.dataset.slideNumber);
    if(this._bIndicator) this.removeActive(); // Si indicador esta siendo usado remueve clase activo
    
    var moveSlide = -((nItem - 1) * this._itemPerSlide * 100); // valor a trasladar
    moveSlide = `translateX(${moveSlide}%)`;
    this.slideTranslate(moveSlide);
    return true;
  }

  
  indicatorMove(indicatorItem){ // mover slide con indicador
    this.moveSlide(indicatorItem);
    indicatorItem.classList.add('active');
    if(this._bControl) this.updateControl();
    return true;
  }

  controlBorderCase(){
    this._itemPerSlide = this.itemPerSlide();
    this._nSlide = this.nSlide();
    var caseOne = this._control[0].dataset.slideNumber == 0;
    var caseTwo = this._control[1].dataset.slideNumber == (this._nSlide + 1);
    if(caseOne){
      var transform = -((this._nSlide - 1)* this._itemPerSlide * 100);
      var transform = `translateX(${transform}%)`
      console.log(transform)
      this.slideTranslate(transform);
      this._control[0].dataset.slideNumber = this._nSlide - 1;
      this._control[1].dataset.slideNumber = this._nSlide + 1;
    }
    else if(caseTwo){
      var transform = 'translateX(0%)';
      this.slideTranslate(transform);
      this._control[0].dataset.slideNumber = 0;
      this._control[1].dataset.slideNumber = 2;
    }
    return true;  
  }

  controlMove(controlItem, isNext = true){
    this._nSlide = this.nSlide();

    var dataCero = (controlItem.dataset.slideNumber == '0'); // condiciones
    var dataMax = (controlItem.dataset.slideNumber == (this._nSlide + 1));
    
    if(dataCero || dataMax){
      this.controlBorderCase();
    } else {
      this.moveSlide(controlItem);
      if(isNext){
        this._control.forEach(el => {el.dataset.slideNumber =  parseInt(el.dataset.slideNumber) + 1});
      } else{ 
        this._control.forEach(el => el.dataset.slideNumber =  parseInt(el.dataset.slideNumber) - 1);
      }
    }

    if(this._bIndicator) this.updateIndicator();
  }

  indicatorListener(){ // Selecciona items
    this.selectIndicatorHtml();
    this._indicatorItem.forEach((el, i) => el.addEventListener('click', () => this.indicatorMove(el)));
    return true;
  }

  controlListener(){  // Escucha controles
    this._itemPerSlide = this.itemPerSlide();
    this._nSlide = this.nSlide(); 
    this._control[0].addEventListener('click', () => this.controlMove(this._control[0], false));
    this._control[1].addEventListener('click', () => this.controlMove(this._control[1], true));
    return true;
  }
  
  activeListener(){ // Inicia todos los escuchadores
    if(this._bIndicator) this.indicatorListener();
    if(this._bControl) this.controlListener();
  }

  windowListener(){ // Escucha cambio de pantalla
    window.addEventListener('resize', () => { 
      if(this._itemPerSlide != this.itemPerSlide()){ 
        this.setItemSize(); 
        this._itemPerSlide = this.itemPerSlide();

        if(this._bIndicator) {
          this._indicator.innerHTML = '';
          this.createIndicator();
          this.resetIndicator();
        } else if(this._bControl) this.resetControl();

        if(this._bIndicator) this.indicatorListener();
      } 
    });
  }

  startCarousel(){ // inicia carrusel
    if((this._bControl && this._bIndicator) || (!this._bControl && !this._bIndicator)){
      this.setItemSize(); this.createIndicator();
      this._indicator = this._html.querySelector('.carousel__indicator');
      this.selectIndicatorHtml(); this.activeListener();
    } else if(this._bControl === false){
      this.setItemSize(); this.createIndicator(); this.selectIndicatorHtml();
      this.activeListener(); this._control.forEach(el => /*{el.style.display = 'none';*/ el.remove()/*}*/);
      this.indicatorListener();
    } else if(this._bIndicator === false){
      this.setItemSize(); this._indicator.style.display = 'none';
      this.controlListener();
    }
    this.windowListener();
  }
  /* ============ */
}

var carouselHTML = document.querySelector('.carousel');
var boolControl = true; // opcional
var boolIndicator = true;  // opcional
var numSlideItem = [1, 2, 3, 4, 5]; // opcional
var breakPoint = [0, 576, 768, 992, 1200]; // opcional
var boolNumIndicator = false; // opcional

var carousel = new Carousel(carouselHTML, boolControl, boolIndicator, numSlideItem, breakPoint, boolNumIndicator);


// 
import Geolocation from "./Geolocation";

export default class TimeLine {
  constructor(container) {
    this.container = container;
    this.form = null;
    this.lineList = null;
    this.input = null;

    this.geolocation = new Geolocation(this.container);
    this.position = null;

    this.init();
  }

  init() {
    this.renderTimeLine();

    this.form = this.container.querySelector('.line_form');
    this.form.addEventListener('click', this.onClick);

    this.input = this.container.querySelector('.form_text');
    this.input.addEventListener('keydown', this.onKeyDown);

    this.lineList = this.container.querySelector('.line_list');
  }

  onClick = (e) => {
    e.preventDefault();
    console.log(e.target);

  }

  onKeyDown = async (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();

      const text = this.input.value.trim();
      if (!text) return;

      try {
        // Получаем координаты (автоматически или вручную)
        const position = await this.geolocation.get();
        this.renderItem(text, position);
        this.input.value = '';
      } catch (error) {
        console.error("Не удалось получить координаты:", error.message);
        // Дополнительная обработка ошибки (например, показать уведомление)
      }
    } 

  }

  renderTimeLine() {
    const html = `
      <div class="line_list"></div>
      <form action="" class="line_form">
        <input type="text" class="form_text">
        <div class="btn_container">
          <button class="form_audio btn">🎤</button>
          <button class="form_video btn">📹</button>
        </div>
        
      </form>
    `;
    this.container.insertAdjacentHTML('beforeend', html);
  }

  async renderItem(text, position) {
    const date = this.getDate();

    const item = `
      <div class="line_item">
        <div class="line_content">
          <p class="line_text">${text}</p>
          <div class="line_geolocation">
          [${position.latitude}, ${position.longitude}] 👁️
          </div>
        </div>
        <div class="line_time">${date}</div>
      </div>
    `;

    this.lineList.insertAdjacentHTML('afterbegin', item);
  }

  renderModal() {
    console.log('введите позицию вручную');
  }

  getDate() {
    const now = new Date();
   
    const day = now.getDate().toString().padStart(2, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0'); 
    const year = now.getFullYear().toString().slice(-2); 
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    
    return `${day}.${month}.${year} ${hours}:${minutes}`;
  }
}
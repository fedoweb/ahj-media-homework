export default class Geolocation {
  constructor(container) {
    this.container = container;
    this.form = null;
    this.input = null;
    this.position = null;
    this.resolvePosition = null;
    this.rejectPosition = null; 
  }

  async get() {
    try {
      return await this.getPosition();
    } catch (error) {
      console.error("Ошибка автоматической геолокации:", error.message);
      return await this.getCustomPosition();
    }
  }

  getPosition() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Геолокация не поддерживается браузером"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          this.position = {
            latitude: latitude.toFixed(5),
            longitude: longitude.toFixed(5),
          };

          resolve(this.position);
        },

        (error) => {
          reject(error);
        },

        {
          enableHighAccuracy: true, 
          timeout: 10000,           
          maximumAge: 0             
        }
      );
    });
  }

  getCustomPosition() {
    return new Promise((resolve, reject) => {
      this.resolvePosition = resolve;
      this.rejectPosition = reject;
      
      this.openModal();
    });
  }

  openModal() {
    this.container.insertAdjacentHTML('beforeend', this.renderModal());
    this.form = this.container.querySelector('.custom_geolocation');
    this.input = this.form.querySelector('.custom_geolocation_content');
    const cancel = this.form.querySelector('.cancel_btn');
    

    this.input.addEventListener('input', this.onInput);
    this.form.addEventListener('submit', this.onSubmit);
    cancel.addEventListener('click', this.onClick);
  }

  onInput = (e) => {
    e.target.setCustomValidity('');
  }

  onClick = (e) => {
    e.preventDefault();
    this.form.remove();

    this.rejectPosition(new Error("Пользователь отменил ввод координат"));

    const input = this.container.querySelector('.form_text');
    input.value = '';
  }

  onSubmit = (e) => {
    e.preventDefault();
    this.input.setCustomValidity('');

    if (!this.input.value) {
      this.input.reportValidity();
      return;
    }

    try {
      this.position = this.parseCoordinates(this.input.value);
      this.form.remove();
      this.resolvePosition(this.position);
      
    } catch (error) {
      this.input.setCustomValidity(error.message);
      this.input.reportValidity();
    }
  }

  renderModal() {
    return `
      <form action="" class="custom_geolocation line_item">
        <p class="custom_geolocation_text">Что-то пошло не так...</p>
        <p class="custom_geolocation_text">К сожалению, нам не удалось определить
          ваше местоположение, пожалуйста, дайте разрешение на использование
          геолокации, либо введите координаты вручную.</p>
        <p class="custom_geolocation_text">Широта и долгота через запятую</p>
        <input type="text" class="custom_geolocation_content" placeholder="Например, 51.12345, -0.12345" required>

        <div class="custom_geolocation_btn">
          <button class="cancel_btn geolocation_btn">Отмена</button>
          <button class="submit_btn geolocation_btn" type="submit">ОК</button>
        </div>   
      </form>
    `;
  }

  parseCoordinates(value) {
    const clearValue = value.replace(/[\[\]]/g, '').replace(/−/g, '-');
    const parts = clearValue.split(',').map(part => part.trim());

    if (parts.length !== 2) {
      throw new Error('Неверный формат координат. Ожидается: "широта, долгота"');
    }

    const numberRegex = /^-?\d+(?:\.\d+)?$/;

    if (!numberRegex.test(parts[0])) {
      throw new Error('Неверный формат широты. Пример: 51.50851');
    }
    
    if (!numberRegex.test(parts[1])) {
      throw new Error('Неверный формат долготы. Пример: -0.12572');
    }

    const latitude = parseFloat(parts[0]);
    const longitude = parseFloat(parts[1]);

    if (isNaN(latitude) || isNaN(longitude)) {
      throw new Error('Координаты должны быть числами');
    }

    return {
      latitude: latitude.toFixed(5),
      longitude: longitude.toFixed(5)
    };
  }

  reset() {
    this.promise = null;
    this.position = null;
  }
}
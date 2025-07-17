import Geolocation from "./Geolocation.js";
import Media from "./Media.js";

export default class TimeLine {
  constructor(container) {
    this.container = container;
    this.form = null;
    this.lineList = null;
    this.input = null;
    this.btnContainer = null;

    this.geolocation = new Geolocation(this.container);
    this.media = new Media();

    this.init();
  }

  init() {
    this.renderTimeLine();

    this.form = this.container.querySelector('.line_form');
    this.form.addEventListener('click', this.onClick);

    this.input = this.container.querySelector('.form_text');
    this.input.addEventListener('keydown', this.onKeyDown);

    this.btnContainer = this.container.querySelector('.btn_container');
    this.lineList = this.container.querySelector('.line_list');
  }

  onClick = async (e) => {
    e.preventDefault();

    if (e.target.classList.contains('form_audio')) {
      await this.media.startRecording(this.btnContainer, 'audio');
      return;
    }

    if (e.target.classList.contains('form_video')) {
      await this.media.startRecording(this.btnContainer, 'video');
      return;
    }

    if (e.target.classList.contains('form_ok')) {
      await this.handleMediaSave();
      return;
    }

    if (e.target.classList.contains('form_cancel')) {
      this.media.stopRecording(false);
      this.renderDefaultButtons();
    }
  }

  onKeyDown = async (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();

      const text = this.input.value.trim();
      if (!text) return;

      try {
        const position = await this.geolocation.get();
        this.renderItem(text, position);
        this.input.value = '';

      } catch (error) {
        console.error("Не удалось получить координаты:", error.message);
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

  async handleMediaSave() {
    try {
      await this.media.stopRecording(true);
      const mediaData = this.media.getRecordedMedia();

      const position = await this.geolocation.get();

      if (mediaData.type === 'audio') this.renderAudioItem(mediaData, position);
      if (mediaData.type === 'video') this.renderVideoItem(mediaData, position);
     
    } catch (error) {
      console.error("Ошибка добавления медиа:", error);

    } finally {
      this.renderDefaultButtons();
    }
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

  async renderAudioItem(audioData, position) {
    const date = this.getDate();
    
    const item = `
      <div class="line_item">
        <div class="line_content">
          <audio controls class="audio-player">
            <source src="${audioData.url}" type="audio/webm">
            Ваш браузер не поддерживает аудио элементы.
          </audio>
          <div class="audio-duration">${this.formatDuration(audioData.duration)}</div>
          <div class="line_geolocation">
            [${position.latitude}, ${position.longitude}] 👁️
          </div>
        </div>
        <div class="line_time">${date}</div>
      </div>
    `;

    this.lineList.insertAdjacentHTML('afterbegin', item);
  }

  async renderVideoItem(videoData, position) {
    const date = this.getDate();
    
    const item = `
      <div class="line_item">
        <div class="line_content">
          <video controls class="video-player" poster="" style="max-width: 100%;">
            <source src="${videoData.url}" type="video/webm">
            Ваш браузер не поддерживает видео элементы.
          </video>
          <div class="media-duration">${this.formatDuration(videoData.duration)}</div>
          <div class="line_geolocation">
            [${position.latitude}, ${position.longitude}] 👁️
          </div>
        </div>
        <div class="line_time">${date}</div>
      </div>
    `;

    this.lineList.insertAdjacentHTML('afterbegin', item);
  }

  formatDuration(seconds) {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
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

  renderDefaultButtons() {
    this.btnContainer.innerHTML = `
      <button class="form_audio btn">🎤</button>
      <button class="form_video btn">📹</button>
    `;
  }
}
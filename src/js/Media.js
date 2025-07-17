export default class Media {
  constructor() {
    this.storage = [];
    this.mediaRecorder = null;
    this.mediaStream = null;
    this.recordedChunks = [];
    this.recordingTimer = null;
    this.recordedSeconds = 0;
    this.container = null;
    this.currentType = null; 
    this.videoPreview = null; 
  }

  async startRecording(container, type) {
    try {
      if (!window.MediaRecorder) {
        throw Error ('Браузер не поддерживает запись медиа')
      }

      this.container = container;
      this.currentType = type;
      this.recordedChunks = [];
      this.recordedSeconds = 0;

      let mediaOptions;
      if (type === 'audio') mediaOptions = { audio: true };
      if (type === 'video') mediaOptions = { audio: true, video: true };

      
      this.mediaStream = await navigator.mediaDevices.getUserMedia(mediaOptions);
      this.mediaRecorder = new MediaRecorder(this.mediaStream);

      this.mediaRecorder.addEventListener('dataavailable', (e) => {
        this.recordedChunks.push(e.data);
      });

      this.mediaRecorder.start();
      this.renderMediaButtons();
      this.startTimer();

      if (type === 'video') {
       
        this.createVideoPreview();
      }
      
      return true;
      
    } catch (error) {
      this.openModal();
      console.error("Ошибка доступа:", error);
      return false;
    }
  }

  async stopRecording(save = false) {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      return new Promise((resolve) => {
        this.mediaRecorder.addEventListener('stop', () => resolve());
        this.mediaRecorder.stop();
      });
    }

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }

    if (!save) {
      this.recordedChunks = [];
      return null;
    }
  }


  getRecordedMedia() {
    if (this.recordedChunks.length === 0) return null;

    this.removeVideoPreview();
    this.stopTimer();

    let mediaType;
    if (this.currentType === 'audio') mediaType = { type: 'audio/webm' };
    if (this.currentType === 'video') mediaType = { type: 'video/webm' };
    
    const mediaBlob = new Blob(this.recordedChunks, mediaType);

    return {
      blob: mediaBlob,
      url: URL.createObjectURL(mediaBlob),
      duration: this.recordedSeconds,
      type: this.currentType
    };
  }

  createVideoPreview() {
    const form = document.querySelector('.line_form');
    this.previewContainer = document.createElement('div');
    this.previewContainer.classList.add('preview_container');
    form.parentNode.insertBefore(this.previewContainer, form);

    this.videoPreview = document.createElement('video');
    this.videoPreview.classList.add('preview_video');
    this.videoPreview.srcObject = this.mediaStream;
    this.videoPreview.autoplay = true;
    this.videoPreview.muted = true;
    this.videoPreview.playsInline = true;
  
    
    this.previewContainer.append(this.videoPreview);
  }

  removeVideoPreview() {
    if (this.videoPreview) {
      this.previewContainer.remove();
      this.previewContainer = null;
      this.videoPreview = null;
    }
  }

  openModal() {
    document.body.insertAdjacentHTML('afterbegin', this.renderModal());
    const form = document.querySelector('.media_modal');
    const btn = document.querySelector('.submit_btn');

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      form.remove();
    })
  }

  startTimer() {
    this.recordingTimer = setInterval(() => {
      this.recordedSeconds++;
      this.updateTimer();
    }, 1000);
  }

  stopTimer() {
    if (this.recordingTimer) {
      clearInterval(this.recordingTimer);
      this.recordingTimer = null;
    }
  }

  updateTimer() {
    if (!this.container) return;
    
    const timerEl = this.container.querySelector('.timer');
    if (timerEl) {
      const minutes = Math.floor(this.recordedSeconds / 60)
        .toString()
        .padStart(2, '0');
      const seconds = (this.recordedSeconds % 60)
        .toString()
        .padStart(2, '0');
      timerEl.textContent = `${minutes}:${seconds}`;
    }
  }

  renderMediaButtons() {
    if (!this.container) return;

    this.container.innerHTML = `
      <button class="form_ok btn">✔️</button>
      <span class="timer">00:00</span>
      <button class="form_cancel btn">✖️</button>
    `;
  }

  renderModal() {
    return `
      <form action="" class="media_modal">
        <p class="media_modal_text">Что-то пошло не так...</p>
        <p class="media_modal_text">К сожалению, нам не удалось получить доступ к
        микрофону или камере, возможно, браузер не поддерживает запись медиа или
        вы не предоставили доступ.</p>
        <div class="media_modal_btn">
          <button class="submit_btn" type="submit">ОК</button>
        </div>   
      </form>
    `;
  }
}
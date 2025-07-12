export default class Media {
  constructor() {
    this.storage = [];
    this.audioRecorder = null;
    this.mediaStream = null;
    this.recordedChunks = [];
    this.recordingTimer = null;
    this.recordedSeconds = 0;
    this.container = null;
  }

  async startAudioRecording(container, type) {
    try {
      this.container = container;
      this.recordedChunks = [];
      this.recordedSeconds = 0;

      if (type === 'audio') {
        this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        this.audioRecorder = new MediaRecorder(this.mediaStream);

        this.audioRecorder.addEventListener('dataavailable', (e) => {
          this.recordedChunks.push(e.data);
        });

        this.audioRecorder.addEventListener('stop', (e) => this.onRecordingStop);

        this.audioRecorder.start();
        this.renderMediaButtons();
        this.startTimer();
        
        return true;
      }
      
    } catch (error) {
      console.error("Ошибка доступа к микрофону:", error);
      return false;
    }
  }

  stopAudioRecording(save = false) {
    if (this.audioRecorder && this.audioRecorder.state !== 'inactive') {
      this.audioRecorder.stop();
    }
    
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }
    
    this.stopTimer();
    
    if (!save) {
      this.recordedChunks = [];
    }
    
    return save ? this.getRecordedAudio() : null;
  }

  getRecordedAudio() {
    if (this.recordedChunks.length === 0) return null;
    
    const audioBlob = new Blob(this.recordedChunks, { type: 'audio/webm' });
    return {
      blob: audioBlob,
      url: URL.createObjectURL(audioBlob),
      duration: this.recordedSeconds
    };
  }

  onRecordingStop = (e) => {
    const audioBlob = new Blob(this.recordedChunks, { type: 'audio/webm' });
    return {
      blob: audioBlob,
      url: URL.createObjectURL(audioBlob),
      duration: this.recordedSeconds
    };
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
}
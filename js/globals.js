// Safe localStorage wrapper to prevent SecurityError exceptions in sandboxes/iframes
const safeLocalStorage = {
  getItem(key) {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.warn("localStorage.getItem blocked:", e);
      return this._mem[key] || null;
    }
  },
  setItem(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.warn("localStorage.setItem blocked:", e);
      this._mem[key] = String(value);
    }
  },
  removeItem(key) {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn("localStorage.removeItem blocked:", e);
      delete this._mem[key];
    }
  },
  _mem: {}
};
window.safeLocalStorage = safeLocalStorage;

// Synthesizer Engine for retro Zelda sound effects
class RetroSynth {
  constructor() {
    this.ctx = null;
    this.enabled = safeLocalStorage.getItem('codequest_sound') !== 'false';
    this.silentNode = null;
    this.buffers = {};
  }
  
  init() {
    if (this.ctx && this.ctx.state === 'closed') {
      this.ctx = null;
      this.silentNode = null;
    }
    if (!this.ctx) {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioCtx({ latencyHint: 'interactive' });
      } catch (e) {
        try {
          this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        } catch (err) {
          console.warn("Web Audio API is not supported or blocked in this browser:", err);
          this.ctx = null;
        }
      }
      if (this.ctx) {
        this.ctx.onstatechange = () => {
          console.log(`🎵 AudioContext state changed to: ${this.ctx ? this.ctx.state : 'null'}`);
          if (this.ctx && this.ctx.state === 'running') {
            this.preloadBlocklySounds();
          }
        };
        this.startSilentNode();
        this.preloadBlocklySounds();
      }
    }
  }

  async preloadBuffer(name, url) {
    if (this.buffers[name] || !this.ctx) return;
    
    // Skip network fetching in JSDOM test environment
    const isTest = typeof window !== 'undefined' && 
                  window.navigator && 
                  window.navigator.userAgent && 
                  window.navigator.userAgent.toLowerCase().includes('jsdom');
    if (isTest) return;

    if (this.ctx.state !== 'running') {
      console.log(`🎵 Delaying preload for ${name} because AudioContext is suspended/interrupted`);
      return;
    }

    try {
      const response = await fetch(url, { mode: 'cors' });
      const arrayBuffer = await response.arrayBuffer();
      this.ctx.decodeAudioData(arrayBuffer, (decodedBuffer) => {
        this.buffers[name] = decodedBuffer;
        console.log(`🎵 Audio buffer preloaded: ${name}`);
      }, (err) => {
        console.warn(`Failed to decode audio data for ${name}:`, err);
      });
    } catch (e) {
      console.warn(`Failed to preload audio buffer for ${name}:`, e);
    }
  }

  preloadBlocklySounds() {
    this.init();
    if (!this.ctx || this.ctx.state !== 'running') return;
    const mediaBase = 'https://unpkg.com/blockly/media/';
    this.preloadBuffer('click', `${mediaBase}click.mp3`);
    this.preloadBuffer('delete', `${mediaBase}delete.mp3`);
    this.preloadBuffer('disconnect', `${mediaBase}disconnect.mp3`);
  }

  playBuffer(name) {
    if (!this.enabled || !this.ctx) return;
    const buffer = this.buffers[name];
    if (!buffer) {
      // Fallback to synthesized sound if not loaded yet
      if (name === 'delete') {
        this.play('error');
      } else {
        this.play('click');
      }
      return;
    }

    const doPlay = () => {
      try {
        const source = this.ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(this.ctx.destination);
        source.start(0);
      } catch (e) {
        console.warn(`Failed to play buffer ${name}:`, e);
      }
    };

    try {
      if ((this.ctx.state === 'suspended' || this.ctx.state === 'interrupted') && typeof this.ctx.resume === 'function') {
        this.ctx.resume().then(() => {
          this.startSilentNode();
          doPlay();
        }).catch(e => {
          console.warn("Failed to resume AudioContext inside playBuffer():", e);
          doPlay();
        });
      } else {
        this.startSilentNode();
        doPlay();
      }
    } catch (e) {
      console.warn("Error checking AudioContext state:", e);
      doPlay();
    }
  }

  recreateContext() {
    if (this.ctx) {
      try {
        if (this.silentNode) {
          this.silentNode.stop();
        }
      } catch (e) {}
      try {
        if (typeof this.ctx.close === 'function') {
          this.ctx.close();
        }
      } catch (e) {
        console.warn("Error closing old AudioContext:", e);
      }
      this.ctx = null;
      this.silentNode = null;
    }
    this.init();
    if (this.ctx && typeof this.ctx.resume === 'function') {
      return this.ctx.resume().then(() => {
        this.startSilentNode();
        this.preloadBlocklySounds();
      }).catch(e => {
        console.warn("Failed to resume recreated context:", e);
      });
    }
    return Promise.resolve();
  }

  resume(isUserGesture = false) {
    this.init();
    if (!this.ctx) return Promise.resolve();
    
    if (isUserGesture && this.ctx.state === 'interrupted') {
      console.log(`⚠️ AudioContext is interrupted. Recreating context inside user gesture to ensure Safari sound.`);
      return this.recreateContext();
    }
    
    return this.ctx.resume().then(() => {
      this.startSilentNode();
      this.preloadBlocklySounds();
    }).catch(e => {
      console.warn("Failed to resume AudioContext:", e);
      if (isUserGesture) {
        console.log("⚠️ resume() failed. Attempting context recreation as fallback.");
        return this.recreateContext();
      }
      return Promise.reject(e);
    });
  }

  startSilentNode() {
    if (this.silentNode || !this.ctx) return;
    try {
      // In Safari, keeping an active oscillator with 0 gain prevents auto-suspension.
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0, this.ctx.currentTime);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      this.silentNode = osc;
      console.log("🔊 Started persistent silent node to prevent Safari auto-suspension.");
    } catch (e) {
      console.warn("Failed to start silent node:", e);
    }
  }
  
  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }
  
  play(type) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    
    const doPlay = () => {
      // Schedule all sounds slightly in the future (5ms buffer) to prevent browser glitches
      // or silence due to scheduling in the past or exactly on the boundary.
      const start = this.ctx.currentTime + 0.005;
      
      switch (type) {
        case 'click': {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(600, start);
          osc.frequency.exponentialRampToValueAtTime(1000, start + 0.05);
          gain.gain.setValueAtTime(0.15, start);
          gain.gain.linearRampToValueAtTime(0.001, start + 0.05);
          
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(start);
          osc.stop(start + 0.05);
          break;
        }
        case 'step': {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(140, start);
          osc.frequency.exponentialRampToValueAtTime(45, start + 0.08);
          gain.gain.setValueAtTime(0.25, start);
          gain.gain.linearRampToValueAtTime(0.001, start + 0.08);
          
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(start);
          osc.stop(start + 0.08);
          break;
        }
        case 'turn': {
          this.playTone(350, 0.03, 'square', 0.12, start);
          this.playTone(450, 0.03, 'square', 0.12, start + 0.04);
          break;
        }
        case 'collect': {
          this.playTone(987.77, 0.07, 'square', 0.15, start); // B5
          this.playTone(1318.51, 0.22, 'square', 0.15, start + 0.07); // E6
          break;
        }
        case 'win': {
          // Zelda Secret Discovered Melody (Ascending 8-Note Chime)
          const notes = [783.99, 739.99, 622.25, 440.00, 415.30, 659.25, 830.61, 1046.50];
          const tempo = 0.07;
          notes.forEach((freq, idx) => {
            this.playTone(freq, 0.06, 'square', 0.18, start + idx * tempo);
          });
          break;
        }
        case 'crash': {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(160, start);
          osc.frequency.exponentialRampToValueAtTime(10, start + 0.22);
          gain.gain.setValueAtTime(0.3, start);
          gain.gain.linearRampToValueAtTime(0.001, start + 0.22);
          
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(start);
          osc.stop(start + 0.22);
          break;
        }
        case 'print': {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(1400, start);
          osc.frequency.exponentialRampToValueAtTime(600, start + 0.03);
          gain.gain.setValueAtTime(0.12, start);
          gain.gain.linearRampToValueAtTime(0.001, start + 0.03);
          
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(start);
          osc.stop(start + 0.03);
          break;
        }
        case 'error': {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(110, start);
          osc.frequency.setValueAtTime(100, start + 0.1);
          gain.gain.setValueAtTime(0.2, start);
          gain.gain.linearRampToValueAtTime(0.001, start + 0.2);
          
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(start);
          osc.stop(start + 0.2);
          break;
        }
      }
    };

    try {
      if ((this.ctx.state === 'suspended' || this.ctx.state === 'interrupted') && typeof this.ctx.resume === 'function') {
        this.ctx.resume().then(() => {
          this.startSilentNode();
          doPlay();
        }).catch(e => {
          console.warn("Failed to resume AudioContext inside play():", e);
          doPlay();
        });
      } else {
        this.startSilentNode();
        doPlay();
      }
    } catch (e) {
      console.warn("Error checking AudioContext state:", e);
      doPlay();
    }
  }
  
  playTone(freq, duration, type, volume, startTime) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    const start = Math.max(startTime, this.ctx.currentTime + 0.005);
    osc.frequency.setValueAtTime(freq, start);
    gain.gain.setValueAtTime(volume, start);
    gain.gain.linearRampToValueAtTime(0.001, start + duration);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(start);
    osc.stop(start + duration);
  }
}

// Instantiate/Declare Global State
const synth = new RetroSynth();
let currentLevelIndex = 0;
let workspace = null;
let simulator = null;
let completedLevels = {};
let levelsCodeCache = {};
let currentMode = 'blocks';
let isExecutingStart = false;
let isExpertMode = false;

// Pyodide variables
let pyodideInstance = null;
let pyodideLoading = false;

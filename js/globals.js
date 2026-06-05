// The Legend of Python - Global State and Audio Synthesizer

// Synthesizer Engine for retro Zelda sound effects
class RetroSynth {
  constructor() {
    this.ctx = null;
    this.enabled = typeof localStorage !== 'undefined' ? localStorage.getItem('codequest_sound') !== 'false' : true;
  }
  
  init() {
    if (this.ctx && this.ctx.state === 'closed') {
      this.ctx = null;
    }
    if (!this.ctx) {
      try {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        if (this.ctx) {
          this.ctx.onstatechange = () => {
            console.log(`🎵 AudioContext state changed to: ${this.ctx ? this.ctx.state : 'null'}`);
          };
        }
      } catch (e) {
        console.warn("Web Audio API is not supported or blocked in this browser:", e);
        this.ctx = null;
      }
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
      // Schedule all sounds slightly in the future (20ms buffer) to prevent browser glitches
      // or silence due to scheduling in the past or exactly on the boundary.
      const start = this.ctx.currentTime + 0.02;
      
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
          doPlay();
        }).catch(e => {
          console.warn("Failed to resume AudioContext inside play():", e);
          doPlay();
        });
      } else {
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
    const start = Math.max(startTime, this.ctx.currentTime + 0.02);
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

// The Legend of Python - Global State and Audio Synthesizer

// Synthesizer Engine for retro Zelda sound effects
class RetroSynth {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }
  
  init() {
    if (!this.ctx) {
      try {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
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
    
    try {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(e => console.warn("Failed to resume AudioContext:", e));
      }
    } catch (e) {
      console.warn("Error checking AudioContext state:", e);
      return;
    }
    
    const now = this.ctx.currentTime;
    
    switch (type) {
      case 'click': {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(1000, now + 0.05);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.05);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.05);
        break;
      }
      case 'step': {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(45, now + 0.08);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.08);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.08);
        break;
      }
      case 'turn': {
        this.playTone(350, 0.03, 'square', 0.06, now);
        this.playTone(450, 0.03, 'square', 0.06, now + 0.04);
        break;
      }
      case 'collect': {
        this.playTone(987.77, 0.07, 'square', 0.07, now); // B5
        this.playTone(1318.51, 0.22, 'square', 0.07, now + 0.07); // E6
        break;
      }
      case 'win': {
        // Zelda Secret Discovered Melody (Ascending 8-Note Chime)
        const notes = [783.99, 739.99, 622.25, 440.00, 415.30, 659.25, 830.61, 1046.50];
        const tempo = 0.07;
        notes.forEach((freq, idx) => {
          this.playTone(freq, 0.06, 'square', 0.08, now + idx * tempo);
        });
        break;
      }
      case 'crash': {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(160, now);
        osc.frequency.exponentialRampToValueAtTime(10, now + 0.22);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.22);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.22);
        break;
      }
      case 'print': {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1400, now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.03);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.03);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.03);
        break;
      }
      case 'error': {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(110, now);
        osc.frequency.setValueAtTime(100, now + 0.1);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.2);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.2);
        break;
      }
    }
  }
  
  playTone(freq, duration, type, volume, startTime) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);
    gain.gain.setValueAtTime(volume, startTime);
    gain.gain.linearRampToValueAtTime(0, startTime + duration);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(startTime);
    osc.stop(startTime + duration);
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

// Pyodide variables
let pyodideInstance = null;
let pyodideLoading = false;

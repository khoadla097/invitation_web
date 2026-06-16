"use strict";

class AudioManagerClass {
  constructor() {
    this.audioCtx = null;
    this.initialized = false;
    
    // HTML Audio Elements
    this.bgmAmbient = null;
    this.bgmRomantic = null;
    this.sfxCardFlip = null;
    this.sfxWinChime = null;
    
    // Web Audio Nodes
    this.ambientSource = null;
    this.romanticSource = null;
    this.sfxCardFlipSource = null;
    this.sfxWinChimeSource = null;
    
    this.ambientGain = null;
    this.romanticGain = null;
    this.sfxGain = null;
    this.masterGain = null;
    
    // State
    this.currentBGM = null; // 'ambient' or 'romantic'
    this.isMuted = localStorage.getItem("bgm_muted") === "true";
  }
  
  /**
   * Initializes the AudioContext and routes audio elements through the routing graph.
   * This is triggered by user interactions to comply with browser autoplay policies.
   */
  init() {
    if (this.initialized) {
      this.resumeContext();
      return;
    }
    
    try {
      // Get DOM references
      this.bgmAmbient = document.getElementById("bgm-ambient");
      this.bgmRomantic = document.getElementById("bgm-romantic");
      this.sfxCardFlip = document.getElementById("sfx-card-flip");
      this.sfxWinChime = document.getElementById("sfx-win-chime");
      
      if (!this.bgmAmbient || !this.bgmRomantic || !this.sfxCardFlip || !this.sfxWinChime) {
        console.warn("Audio elements not found in the DOM.");
        return;
      }
      
      // Create audio context
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContextClass();
      
      // Create source nodes
      this.ambientSource = this.audioCtx.createMediaElementSource(this.bgmAmbient);
      this.romanticSource = this.audioCtx.createMediaElementSource(this.bgmRomantic);
      this.sfxCardFlipSource = this.audioCtx.createMediaElementSource(this.sfxCardFlip);
      this.sfxWinChimeSource = this.audioCtx.createMediaElementSource(this.sfxWinChime);
      
      // Create gain nodes
      this.ambientGain = this.audioCtx.createGain();
      this.romanticGain = this.audioCtx.createGain();
      this.sfxGain = this.audioCtx.createGain();
      this.masterGain = this.audioCtx.createGain();
      
      // Set initial volumes
      // BGM default to 0 if they're not the active one
      this.ambientGain.gain.setValueAtTime(0, this.audioCtx.currentTime);
      this.romanticGain.gain.setValueAtTime(0, this.audioCtx.currentTime);
      this.sfxGain.gain.setValueAtTime(1, this.audioCtx.currentTime);
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 1, this.audioCtx.currentTime);
      
      // Connect nodes: BGM goes through their gain nodes, then master, then destination
      this.ambientSource.connect(this.ambientGain);
      this.ambientGain.connect(this.masterGain);
      
      this.romanticSource.connect(this.romanticGain);
      this.romanticGain.connect(this.masterGain);
      
      // SFX goes through sfxGain, then master, then destination
      this.sfxCardFlipSource.connect(this.sfxGain);
      this.sfxWinChimeSource.connect(this.sfxGain);
      this.sfxGain.connect(this.masterGain);
      
      this.masterGain.connect(this.audioCtx.destination);
      
      this.initialized = true;
      console.log("Web Audio API Manager successfully initialized.");
      
      // Update UI matching the muted state
      this.updateUIWidget();
      
      // Try to resume and play ambient BGM
      this.resumeContext().then(() => {
        if (!this.currentBGM) {
          this.playBGM("ambient");
        }
      });
    } catch (e) {
      console.error("Failed to initialize Web Audio API manager:", e);
    }
  }
  
  /**
   * Resumes the AudioContext if it is suspended.
   */
  async resumeContext() {
    if (this.audioCtx && this.audioCtx.state === "suspended") {
      await this.audioCtx.resume();
    }
  }
  
  /**
   * Starts playing a BGM track with a smooth fade in.
   * @param {string} track - 'ambient' or 'romantic'
   */
  playBGM(track) {
    if (!this.initialized) {
      this.init();
      return;
    }
    
    this.resumeContext();
    
    if (track === "ambient") {
      this.currentBGM = "ambient";
      this.bgmAmbient.play().catch(e => console.log("Ambient play blocked:", e));
      
      const now = this.audioCtx.currentTime;
      this.ambientGain.gain.setValueAtTime(this.ambientGain.gain.value, now);
      this.ambientGain.gain.linearRampToValueAtTime(1, now + 1.0);
      
      // Fade out romantic if playing
      this.romanticGain.gain.setValueAtTime(this.romanticGain.gain.value, now);
      this.romanticGain.gain.linearRampToValueAtTime(0, now + 1.0);
      
      setTimeout(() => {
        if (this.currentBGM === "ambient") {
          this.bgmRomantic.pause();
          this.bgmRomantic.currentTime = 0;
        }
      }, 1000);
      
    } else if (track === "romantic") {
      this.currentBGM = "romantic";
      this.bgmRomantic.play().catch(e => console.log("Romantic play blocked:", e));
      
      const now = this.audioCtx.currentTime;
      this.romanticGain.gain.setValueAtTime(this.romanticGain.gain.value, now);
      this.romanticGain.gain.linearRampToValueAtTime(1, now + 1.5);
      
      // Fade out ambient if playing
      this.ambientGain.gain.setValueAtTime(this.ambientGain.gain.value, now);
      this.ambientGain.gain.linearRampToValueAtTime(0, now + 1.5);
      
      setTimeout(() => {
        if (this.currentBGM === "romantic") {
          this.bgmAmbient.pause();
          this.bgmAmbient.currentTime = 0;
        }
      }, 1500);
    }
  }
  
  /**
   * Smoothly crossfades between the ambient track and the romantic track.
   * @param {string} target - 'ambient' or 'romantic'
   */
  crossfadeBGM(target) {
    if (!this.initialized) {
      this.init();
      return;
    }
    if (this.currentBGM === target) return;
    this.playBGM(target);
  }
  
  /**
   * Plays a specified SFX file.
   * @param {string} type - 'flip' or 'win'
   */
  playSFX(type) {
    if (!this.initialized) {
      this.init();
    }
    this.resumeContext();
    
    if (type === "flip") {
      if (this.sfxCardFlip) {
        this.sfxCardFlip.currentTime = 0;
        this.sfxCardFlip.play().catch(e => console.log("SFX flip play blocked:", e));
      }
    } else if (type === "win") {
      if (this.sfxWinChime) {
        this.sfxWinChime.currentTime = 0;
        this.sfxWinChime.play().catch(e => console.log("SFX win play blocked:", e));
      }
    }
  }
  
  /**
   * Pauses all music.
   */
  stopAll() {
    if (this.bgmAmbient) this.bgmAmbient.pause();
    if (this.bgmRomantic) this.bgmRomantic.pause();
    this.currentBGM = null;
  }
  
  /**
   * Toggles global audio mute. Fades master volume to prevent clipping.
   */
  toggleMute() {
    this.isMuted = !this.isMuted;
    localStorage.setItem("bgm_muted", this.isMuted);
    
    if (!this.initialized) {
      // If context is not initialized, just save the state
      this.updateUIWidget();
      return this.isMuted;
    }
    
    this.resumeContext();
    const now = this.audioCtx.currentTime;
    
    // Smooth master gain transition (300ms)
    this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
    this.masterGain.gain.linearRampToValueAtTime(this.isMuted ? 0 : 1, now + 0.3);
    
    this.updateUIWidget();
    return this.isMuted;
  }
  
  /**
   * Updates the CSS classes of the floating audio widget.
   */
  updateUIWidget() {
    const btn = document.getElementById("audio-widget-btn");
    if (!btn) return;
    
    const wave = btn.querySelector(".audio-widget-wave");
    const muteIcon = btn.querySelector(".audio-widget-mute-icon");
    
    if (this.isMuted) {
      if (wave) wave.classList.add("hidden");
      if (muteIcon) muteIcon.classList.remove("hidden");
      btn.classList.add("is-muted");
    } else {
      if (wave) wave.classList.remove("hidden");
      if (muteIcon) muteIcon.classList.add("hidden");
      btn.classList.remove("is-muted");
    }
  }
}

window.AudioManager = new AudioManagerClass();

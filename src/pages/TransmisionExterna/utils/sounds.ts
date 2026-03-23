// src/pages/TransmisionExterna/utils/sounds.ts

export const playSound = (type: 'small' | 'medium' | 'large' | 'goal') => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  if (type === 'small') {
    oscillator.frequency.value = 800;
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  } else if (type === 'medium') {
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(1000, audioContext.currentTime + 0.2);
    gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  } else if (type === 'large') {
    const playTone = (freq: number, delay: number, duration: number) => {
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      osc.connect(gain);
      gain.connect(audioContext.destination);
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.5, audioContext.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + delay + duration);
      osc.start(audioContext.currentTime + delay);
      osc.stop(audioContext.currentTime + delay + duration);
    };
    playTone(523, 0, 0.2);
    playTone(659, 0.15, 0.2);
    playTone(784, 0.3, 0.4);
  } else if (type === 'goal') {
    const playTone = (freq: number, delay: number, duration: number) => {
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      osc.connect(gain);
      gain.connect(audioContext.destination);
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.6, audioContext.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + delay + duration);
      osc.start(audioContext.currentTime + delay);
      osc.stop(audioContext.currentTime + delay + duration);
    };
    playTone(523, 0, 0.3);
    playTone(659, 0.2, 0.3);
    playTone(784, 0.4, 0.3);
    playTone(1047, 0.6, 0.6);
  }
};

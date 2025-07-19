const fileInput = document.getElementById('audioFile');
const audio = document.getElementById('audioPlayer');
const canvas = document.getElementById('visualizer');
const ctx = canvas.getContext('2d');

// Resize canvas to fit screen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight * 0.6;

// Create AudioContext and analyser
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioCtx.createAnalyser();
let source;
analyser.fftSize = 256;
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);
ctx.shadowColor = ctx.fillStyle;
ctx.shadowBlur = 20;


// Handle file selection
fileInput.addEventListener('change', function () {
  const file = this.files[0];
  const url = URL.createObjectURL(file);
  audio.src = url;
  audio.load();
  audio.play();

  // Resume AudioContext on user gesture (important for autoplay policies)
  audioCtx.resume();

  // Disconnect previous source if any
  if (source) source.disconnect();

  source = audioCtx.createMediaElementSource(audio);
  source.connect(analyser);
  analyser.connect(audioCtx.destination);
});

// Visualizer animation
function animate() {
  requestAnimationFrame(animate);

  analyser.getByteFrequencyData(dataArray);

  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const barWidth = canvas.width / bufferLength;
  let x = 0;

  for (let i = 0; i < bufferLength; i++) {
    const barHeight = dataArray[i];
    const r = barHeight + 25;
    const g = 50;
    const b = 150;

    ctx.fillStyle = `rgb(${r},${g},${b})`;
    ctx.fillRect(x, canvas.height - barHeight, barWidth - 2, barHeight);

    x += barWidth;
  }
}

animate();

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight * 0.6;
});


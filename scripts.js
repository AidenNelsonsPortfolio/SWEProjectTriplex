const image = document.querySelector('img[src="Assets/TriplexLogo.png"]');
const canvas = document.createElement('canvas');
canvas.style.position = 'absolute';
canvas.style.top = '50%';
canvas.style.left = '50%';
canvas.style.transform = 'translate(-50%, -50%)';

image.addEventListener('click', () => {
  document.body.appendChild(canvas);
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const ctx = canvas.getContext('2d');
  ctx.fillStyle = 'purple';
  ctx.font = '96px Roboto';
  ctx.textAlign = 'center';
  ctx.fillText('This is a pause screen', canvas.width / 2, canvas.height / 2);
});







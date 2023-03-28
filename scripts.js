// Get a reference to the existing image element
const image = document.querySelector('#main-content');

// Add a click event listener to the image
image.addEventListener('click', () => {
  // Create a new canvas element
  const canvas = document.createElement('canvas');
  
  // Set the dimensions of the canvas to 400x400
  canvas.width = 900;
  canvas.height = 900;
  
  // Set the position of the canvas to the center of the screen
  canvas.style.position = 'fixed';
  canvas.style.top = '50%';
  canvas.style.left = '50%';
  canvas.style.transform = 'translate(-50%, -50%)';
  
  // Add the canvas to the document body
  document.body.appendChild(canvas);

  const context = canvas.getContext('2d');
  context.font = '24px Arial';
  context.fillStyle = 'purple';
  context.textAlign = 'center';
  context.fillText('This is a pause screen', canvas.width / 2, canvas.height / 2);
});







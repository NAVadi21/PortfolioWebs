// define canvas and context
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// set canvas dimensions
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// define dot class
class Dot {
constructor(x, y) {
this.x = x;
this.y = y;
this.radius = 3; // Reduced the size of balls
this.color = 'white';
this.velocity = {
 x: (this.x - canvas.width / 2) / canvas.width * 1,
  y: (this.y - canvas.height / 2) / canvas.height * 1
};
}

// update dot position and bounce off walls
update(mouseX, mouseY) {
  // parallax effect
  const dx = this.x - mouseX;
  const dy = this.y - mouseY;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const maxDistance = 100;
  const parallaxSpeed = 0.5;

  if (distance < maxDistance) {
    const xRatio = dx / maxDistance;
    const yRatio = dy / maxDistance;
    this.x += xRatio * parallaxSpeed;
    this.y += yRatio * parallaxSpeed;
    
    // increase radius to highlight dot
    const maxHighlightRadius = 7;
    const highlightSpeed = 2;
    this.radius = Math.min(this.radius + highlightSpeed, maxHighlightRadius);
    this.color = 'White';
  } else {
    // reset radius to normal
    const normalRadius = 3;
    const resetSpeed = 0.5;
    this.radius = Math.max(this.radius - resetSpeed, normalRadius);
    this.color = 'eggshell';
  }

  if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
    this.velocity.x = -this.velocity.x;
  }
  if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
    this.velocity.y = -this.velocity.y;
  }
  this.x += this.velocity.x;
  this.y += this.velocity.y;
  this.draw();
}



// draw dot on canvas
draw() {
ctx.beginPath();
ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
ctx.fillStyle = this.color;
ctx.fill();
ctx.closePath();
}

// check distance between two dots
static distance(dot1, dot2) {
const dx = dot1.x - dot2.x;
const dy = dot1.y - dot2.y;
return Math.sqrt(dx * dx + dy * dy);
}

// connect dots within a certain distance
static connectDots(dots, distance) {
ctx.strokeStyle = 'rgb(240, 240, 230)'; // Changed color of connections to eggshell white
for (let i = 0; i < dots.length; i++) {
for (let j = i + 1; j < dots.length; j++) {
const dot1 = dots[i];
const dot2 = dots[j];
const dist = Dot.distance(dot1, dot2);
if (dist < distance) {
ctx.beginPath();
ctx.moveTo(dot1.x, dot1.y);
ctx.lineTo(dot2.x, dot2.y);
ctx.stroke();
ctx.closePath();
}
}
}
}
}

// create an array of dots and add event listeners
const dots = [];
const numDots = 100;
for (let i = 0; i < numDots; i++) {
dots.push(new Dot(Math.random() * canvas.width, Math.random() * canvas.height));
}
canvas.addEventListener('mousemove', function(event) {
for (let i = 0; i < dots.length; i++) {
const dot = dots[i];
dot.update(event.clientX, event.clientY);
}

});

canvas.addEventListener('mousedown', function(event) {
for (let i = 0; i < dots.length; i++) {
const dot = dots[i];
const dx = dot.x - event.clientX;
const dy = dot.y - event.clientY;
const dist = Math.sqrt(dx * dx + dy * dy);
if (dist < 50) {
dot.velocity = {
x: dot.velocity.x,
y: dot.velocity.y
};

    }
  }
});

// animate dots and connections
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < dots.length; i++) {
    const dot = dots[i];
    dot.update();
  }
  Dot.connectDots(dots, 90);
  requestAnimationFrame(animate);
}
animate(); 
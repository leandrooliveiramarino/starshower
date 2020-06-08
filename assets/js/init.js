import Star from './objects/Star';
import { context, innerWidth, innerHeight } from './base';
import { mouseMove } from './events/mouseMove';
import { generateRandomPosition, randomIntBetween } from './helpers';
let stars = [];
let miniStars = [];

// Background stars
let backgroundStars = [];

for (let i = 0; i < 100; i++) {
  const position = {
    x: Math.random() * innerWidth,
    y: Math.random() * innerHeight,
  };

  backgroundStars.push(
    new Star(
      context,
      { innerWidth, innerHeight, ...position, radius: Math.random() * 3, behavior: 'STAR' },
      { mouseMove }
    )
  );
}

// Setting background gradient
const backgroundGradient = context.createLinearGradient(0, 0, 0, innerHeight);
backgroundGradient.addColorStop(0, '#171e26');
backgroundGradient.addColorStop(1, '#3f586b');


function createMountainRange(mountainAmount, height, color) {
  for(let i = 0; i < mountainAmount; i++) {
    const mountainWidth = innerWidth / mountainAmount
    context.beginPath();
    context.moveTo(i * mountainWidth, innerHeight)
    context.lineTo(i * mountainWidth + mountainWidth + 325, innerHeight);
    context.lineTo(i * mountainWidth + mountainWidth/2, innerHeight - height)
    context.lineTo(i * mountainWidth - 325, innerHeight)
    context.fillStyle = color;
    context.fill();
    context.closePath();
  }
}

let ticker = 0;
let randomSpawnRate = 75;
let groundHeight = 100;

function animate() {
  context.fillStyle = backgroundGradient;
  context.fillRect(0, 0, innerWidth, innerHeight);

  requestAnimationFrame(animate);

  backgroundStars.forEach((star) => {
    star.draw()
  });

  createMountainRange(1, innerHeight - 50, '#384551');
  createMountainRange(2, innerHeight - 100, '#2b3843');
  createMountainRange(3, innerHeight - 300, '#26333e');
  context.fillStyle = '#182028';
  context.fillRect(0, innerHeight - groundHeight, innerWidth, groundHeight)
  let newStars = [];
  stars.forEach((star) => {
    star.update()

    star.ministars.forEach(miniStar => miniStars.push(miniStar))

    star.ministars = [];
  });

  miniStars.forEach((miniStar) => {
    miniStar.update()
  });


  let radius = 12;
  if(ticker % randomSpawnRate === 0) {
    stars.push(
      new Star(
        context,
        { innerWidth, innerHeight, x: Math.max(radius, Math.random() * innerWidth - radius), y: -100, radius: radius, color: '227, 234, 239', behavior: 'STAR', groundHeight },
        { mouseMove }
      )
    );
    randomSpawnRate = randomIntBetween(75, 200)
  }

  stars = stars.filter(star => star.radius)

  miniStars = miniStars.filter(star => star.radius)

  ticker++;
}

animate();

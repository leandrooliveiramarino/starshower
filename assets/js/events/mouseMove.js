export const mouseMove = {
  x: window.innerWidth / 2,
  y: window.innerHeight / 2,
};

window.addEventListener('mousemove', function (event) {
  mouseMove.x = event.x;
  mouseMove.y = event.y;
});

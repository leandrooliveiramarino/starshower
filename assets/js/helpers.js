export const randomIntBetween = (min, max) => {
  return min + Math.floor((max - min) * Math.random());
};

export const getDistance = (circle1, circle2) => {
  let xDistance = circle1.x - circle2.x;
  let yDistance = circle1.y - circle2.y;

  return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
};

export const isCollided = (circle1, circle2) => {
  const distance = getDistance(circle1, circle2);
  return circle1.radius + circle2.radius - distance > 0;
};

export const generateRandomPosition = (
  radius,
  innerHeight,
  innerWidth,
  availablePositions
) => {
  let _position = {};
  let _isCollided = false;
  let collisionAmount = 0;
  do {
    _isCollided = false;
    _position = {
      x: randomIntBetween(radius, innerWidth - radius),
      y: randomIntBetween(radius, innerHeight - radius),
    };

    if (collisionAmount > 8) {
      throw new Error('Collision amount exceeded');
    }
    availablePositions.forEach((position) => {
      if (isCollided({ ..._position, radius }, { ...position, radius })) {
        _isCollided = true;
        collisionAmount++;
        return;
      }
    });
  } while (_isCollided);
  return _position;
};

/**
 * Rotates coordinate system for velocities
 *
 * Takes velocities and alters them as if the coordinate system they're on was rotated
 *
 * @param  Object | velocity | The velocity of an individual particle
 * @param  Float  | angle    | The angle of collision between two objects in radians
 * @return Object | The altered x and y velocities after the coordinate system has been rotated
 */

const rotate = (velocity, angle) => {
  const rotatedVelocities = {
    x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
    y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle),
  };

  return rotatedVelocities;
};

/**
 * Swaps out two colliding particles' x and y velocities after running through
 * an elastic collision reaction equation
 *
 * @param  Object | particle      | A particle object with x and y coordinates, plus velocity
 * @param  Object | otherParticle | A particle object with x and y coordinates, plus velocity
 * @return Null | Does not return a value
 */

export const resolveCollision = (particle, otherParticle) => {
  const xVelocityDiff = particle.velocity.x - otherParticle.velocity.x;
  const yVelocityDiff = particle.velocity.y - otherParticle.velocity.y;

  const xDist = otherParticle.x - particle.x;
  const yDist = otherParticle.y - particle.y;

  // Prevent accidental overlap of particles
  if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {
    // Grab angle between the two colliding particles
    const angle = -Math.atan2(
      otherParticle.y - particle.y,
      otherParticle.x - particle.x
    );

    // Store mass in var for better readability in collision equation
    const m1 = particle.mass;
    const m2 = otherParticle.mass;

    // Velocity before equation
    const u1 = rotate(particle.velocity, angle);
    const u2 = rotate(otherParticle.velocity, angle);

    // Velocity after 1d collision equation
    const v1 = {
      x: (u1.x * (m1 - m2)) / (m1 + m2) + (u2.x * 2 * m2) / (m1 + m2),
      y: u1.y,
    };
    const v2 = {
      x: (u2.x * (m1 - m2)) / (m1 + m2) + (u1.x * 2 * m2) / (m1 + m2),
      y: u2.y,
    };

    // Final velocity after rotating axis back to original location
    const vFinal1 = rotate(v1, -angle);
    const vFinal2 = rotate(v2, -angle);

    // Swap particle velocities for realistic bounce effect
    particle.velocity.x = vFinal1.x;
    particle.velocity.y = vFinal1.y;

    otherParticle.velocity.x = vFinal2.x;
    otherParticle.velocity.y = vFinal2.y;
  }
};

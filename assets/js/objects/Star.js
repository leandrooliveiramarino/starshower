import { randomIntBetween } from '../helpers';

export default class Star {
  constructor(context, props) {
    this.context = context;
    this.innerWidth = props.innerWidth;
    this.innerHeight = props.innerHeight;
    this.x = props.x;
    this.y = props.y;
    this.originalX = props.x;
    this.originalY = props.y;
    this.radius = props.radius;
    this.groundHeight = props.groundHeight;
    this.lastMousePoint = {
      x: props.x,
      y: props.y,
    };
    this.friction = 0.8;
    this.gravity = 0.4;
    this.behavior = props.behavior
    this.ttl = 100;
    this.color = props.color || '255, 255, 255';

    this._init();
  }

  _init() {
    this.ministars = []
    this.velocity = {
      x: randomIntBetween(-10, 10),
      y: randomIntBetween(-5, 5),
    };
    this.opacity = 1;
    this.radians = Math.random() * Math.PI * 2;
    this.distanceFromCenter = randomIntBetween(50, 120);
  }

  draw(lastPoint) {
    this.context.save();
    this.context.beginPath();
    this.context.arc(this.x, this.y, this.radius, Math.PI * 2, false);
    if(this.behavior === 'MINISTAR') {
      this.context.shadowColor = '#e3eaef';
      this.context.shadowBlur = 20;
    }
    this.context.fillStyle = `rgb(${this.color}, ${this.opacity})`;
    this.context.fill();
    this.context.closePath();
    this.context.restore();
  }

  update() {
    const lastPoint = {
      x: this.x,
      y: this.y,
    };
    this._setBehavior();
    this.draw(lastPoint);
  }

  _actionConditions() {
    const actions = [];

    if(this.y + this.radius + this.velocity.y > this.innerHeight - this.groundHeight) {
      actions.push('INVERT_Y_DIRECTION')
      actions.push('SHATTER')
    }

    if(!actions.includes('INVERT_Y_DIRECTION')) {
      actions.push('INCREASE_VELOCITY')
    }

    if (this.x + this.radius + this.velocity.x > this.innerWidth) {
      actions.push('INVERT_X_DIRECTION');
      actions.push('SHATTER')
    }

    if (this.x - this.radius + this.velocity.x < 0) {
      actions.push('INVERT_X_DIRECTION');
      actions.push('SHATTER')
    }

    actions.push('MOVE');
    actions.push('REMOVE_MINISTARS_FROM_ARRAY');
    actions.push('DECREASE_TTL');

    return actions;
  }

  _setBehavior() {
    const actions = this._actionConditions();

    actions.forEach((action) => {
      this._actions(action)();
    });
  }

  _actions(action) {
    const _actions = {
      INVERT_X_DIRECTION: () => {
        this.velocity.x = this.velocity.x * -1;
      },
      INVERT_Y_DIRECTION: () => {
        this.velocity.y = -this.velocity.y * this.friction;
      },
      INCREASE_VELOCITY: () => {
        this.velocity.y += this.gravity;
      },
      MOVE: () => {
        this.y += this.velocity.y;
        this.x += this.velocity.x;

        if(this.behavior === 'MINISTAR') {
          this.x += this.velocity.x
        }
      },
      SHATTER: () => {
        this.radius -= 3;
        this.radius = Math.max(0, this.radius)

        for(let i = 0; i < 8; i++) {
          this.ministars.push(
            new Star(
              this.context,
              { innerWidth: this.innerWidth, innerHeight: this.innerHeight, x: this.x, y: this.y, radius: 5, behavior: 'MINISTAR', groundHeight: this.groundHeight }
            )
          )
        }
      },
      REMOVE_MINISTARS_FROM_ARRAY: () => {
        this.ministars = this.ministars.filter(ministar => ministar.radius > 0)
      },
      DECREASE_TTL: () => {
        if(this.behavior === 'MINISTAR') {
          this.ttl -= 1
          this.opacity -= 1 / this.ttl
        }
      }
    };

    if (!_actions[action]) {
      throw new Error('Action not available: ' + action);
    }

    return _actions[action];
  }
}

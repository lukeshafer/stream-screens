window.addEventListener('load', () => {
  setTimeout(() => {
    window.scroll({
      top: 0,
      left: 0,
      behavior: "instant",
    });
    document.body.style.setProperty('opacity', '1');
  }, 50)
})

customElements.define('dvd-logo', class extends HTMLElement {
  vx = Math.random() * 20 + 55;
  //vx = this.MAX_X / 10
  vy = Math.random() * 20 + 55;
  //vy = this.MAX_Y / 10
  xdir = Math.random() >= 0.5 ? 1 : -1
  ydir = Math.random() >= 0.5 ? 1 : -1
  MIN_X = 0;
  get MAX_X() { return document.body.clientWidth - this.clientWidth }
  MIN_Y = 0;
  get MAX_Y() { return document.body.clientHeight - this.clientHeight }

  #__x = Math.random() * this.MAX_X + this.MIN_X;
  //#__x = 0;
  set x(value) {
    this.#__x = value;
    this.style.setProperty('--x', `${value}px`);
  }
  get x() {
    return this.#__x;
  }

  #__y = Math.random() * this.MAX_Y + this.MIN_Y;
  //#__y = 0;
  set y(value) {
    this.#__y = value;
    this.style.setProperty('--y', `${value}px`);
  }
  get y() {
    return this.#__y;
  }

  connectedCallback() {
    const counter = document.querySelector('corner-hit-counter');

    let prevT = 0;
    const step = (t: number) => {
      const dt = t - prevT;
      const dx = this.vx * dt * this.xdir / 500;
      const dy = this.vy * dt * this.ydir / 500;
      prevT = t

      let newX = clamp(this.MIN_X, this.x + dx, this.MAX_X);
      let newY = clamp(this.MIN_Y, this.y + dy, this.MAX_Y);
      if (newX >= this.MAX_X) this.xdir = -1
      else if (newX <= this.MIN_X) this.xdir = 1;
      if (newY >= this.MAX_Y) this.ydir = -1;
      else if (newY <= this.MIN_Y) this.ydir = 1;

      if ((newX === this.MIN_X || newX === this.MAX_X) && (newY === this.MIN_Y || newY === this.MAX_Y)) {
        const count = Number(counter?.getAttribute('count')) || 0;
        counter?.setAttribute('count', String(count + 1));
      }

      this.x = newX;
      this.y = newY;

      requestAnimationFrame(step)
    }
    step(prevT)
  }
})

customElements.define('corner-hit-counter', class extends HTMLElement {
  static observedAttributes = ["count"];
  count = 0

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (name === 'count') {
      this.count = +newValue;
      this.hidden = this.count > 0;

      if (this.count > 0) {
        console.log("CORNER HIT", this.count, "AT", new Date());
      }
    }
    this.render();
  }

  render() {
    this.innerHTML = (() => {
      switch (this.count) {
        case 0:
          return ``
        case 1:
          return `<p>CORNER HIT</p>`
        default:
          return `<p>CORNER HIT ${this.count} TIMES</p>`
      }
    })()
  }
})

customElements.define('countdown-timer', class extends HTMLElement {
  target: Date
  constructor() {
    super();
    const url = new URL(window.location.href)
    const time = Number(url.searchParams.get('time')) || 0
    this.target = new Date(Date.now() + time * 1000)
  }

  interval = 0;
  connectedCallback() {
    this.interval = setInterval(() => this.render(), 100);
  }

  disconnectedCallback() {
    clearInterval(this.interval)
  }

  getCountdownTime() {
    const now = new Date()
    const difference = (this.target.valueOf() - now.valueOf()) / 1000

    return {
      minutes: Math.max(Math.floor(difference / 60), 0),
      seconds: Math.max(Math.floor(difference % 60), 0),
    }
  }

  render() {
    const { minutes, seconds } = this.getCountdownTime();
    this.innerHTML = `<p>${minutes}:${String(seconds).padStart(2, '0')}</p>`
  }

})

function clamp(min: number, target: number, max: number) {
  return Math.max(min, Math.min(target, max));
}

customElements.define('title-text', class extends HTMLElement {
  dots = ""
  when = "soon"

  whenIsChanging = false
  setWhen(target: string, interval = 100) {
    if (this.whenIsChanging) return
    this.whenIsChanging = true;
    const remove = () => {
      if (this.when.length === 0 || target.slice(0, this.when.length) === this.when) {
        setTimeout(add, interval);
      } else {
        this.when = this.when.slice(0, this.when.length - 1);
        setTimeout(remove, interval)
      };
    }

    const add = () => {
      this.when = target.slice(0, this.when.length + 1);
      if (this.when !== target) setTimeout(add, interval);
      else {
        console.log('done')
        this.whenIsChanging = false
      }
    }

    remove();
  }

  connectedCallback() {
    this.render();
  }

  INTERVAL = 100
  RATIO = 1000 / this.INTERVAL

  render(time = 0) {
    const seconds = (time / 1000);
    const dotTime = Math.floor(seconds % 12);
    if (dotTime === 2) this.dots = "."
    else if (dotTime === 4) this.dots = ".."
    else if (dotTime === 6) this.dots = "..."
    if (dotTime == 0) this.dots = ''

    if (Math.floor(seconds) === 60) this.setWhen('soonish')
    if (Math.floor(seconds) === 70) this.setWhen('soon')
    if (Math.floor(seconds) === 100) this.setWhen('sometime')
    if (Math.floor(seconds) === 120) this.setWhen('eventually')
    if (Math.floor(seconds) === 240) this.setWhen('I swear')
    if (Math.floor(seconds) === 600) this.setWhen('maybe, hopefully')


    const text = `Stream will begin ${this.when}${this.dots}`
    if (text !== this.textContent) this.textContent = text;
    requestAnimationFrame(this.render.bind(this));
  }
})

function isBetween(num: number, min: number, max: number) {
  return num >= min && num <= max
}


customElements.define(
  "countdown-timer",
  class extends HTMLElement {
    constructor() {
      super();
      const url = new URL(window.location.href);
      this.target = new Date(Date.now() + this.timer() * 1000);
    }

    timer() {
      const url = new URL(window.location.href);
      const time =
        url.searchParams.get("time") ||
        url.searchParams.get("timer") ||
        url.searchParams.get("seconds");

      if (!time) return 0;

      if (Number(time)) return Number(time);

      const [m, s] = time.split(/[\D]+/);
      if (+m && +s) {
        return +m * 60 + +s;
      }
      return 0;
    }

    interval = 0;
    connectedCallback() {
      this.interval = setInterval(() => this.render(), 100);
    }

    disconnectedCallback() {
      clearInterval(this.interval);
    }

    getCountdownTime() {
      const now = new Date();
      const difference = (this.target.valueOf() - now.valueOf()) / 1000;

      return {
        minutes: Math.max(Math.floor(difference / 60), 0),
        seconds: Math.max(Math.floor(difference % 60), 0),
      };
    }

    prevRender = "";
    render() {
      const { minutes, seconds } = this.getCountdownTime();
      const newRender = `<p>${minutes}:${String(seconds).padStart(2, "0")}</p>`;
      if (this.prevRender !== newRender) {
        this.innerHTML = newRender;
        this.prevRender = newRender;
      }
    }
  },
);

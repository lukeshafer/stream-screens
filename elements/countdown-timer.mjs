customElements.define(
  "countdown-timer",
  class extends HTMLElement {
    constructor() {
      super();
      const url = new URL(window.location.href);
      const time = Number(url.searchParams.get("time")) || 0;
      this.target = new Date(Date.now() + time * 1000);
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

    render() {
      const { minutes, seconds } = this.getCountdownTime();
      this.innerHTML = `<p>${minutes}:${String(seconds).padStart(2, "0")}</p>`;
    }
  },
);

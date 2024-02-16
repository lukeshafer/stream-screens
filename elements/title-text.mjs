customElements.define(
  "title-text",
  class extends HTMLElement {
    dots = "";
    when = "soon";

    whenIsChanging = false;
    /** @param {string} target */
    setWhen(target, interval = 100) {
      if (this.whenIsChanging) return;
      this.whenIsChanging = true;
      const remove = () => {
        if (
          this.when.length === 0 ||
          target.slice(0, this.when.length) === this.when
        ) {
          setTimeout(add, interval);
        } else {
          this.when = this.when.slice(0, this.when.length - 1);
          setTimeout(remove, interval);
        }
      };

      const add = () => {
        this.when = target.slice(0, this.when.length + 1);
        if (this.when !== target) setTimeout(add, interval);
        else {
          this.whenIsChanging = false;
        }
      };

      remove();
    }

    connectedCallback() {
      this.render();
    }

    INTERVAL = 100;
    RATIO = 1000 / this.INTERVAL;

    render(time = 0) {
      const seconds = time / 1000;
      const dotTime = Math.floor(seconds % 12);
      if (dotTime === 2) this.dots = ".";
      else if (dotTime === 4) this.dots = "..";
      else if (dotTime === 6) this.dots = "...";
      if (dotTime == 0) this.dots = "";

      if (Math.floor(seconds) === 60) this.setWhen("soonish");
      if (Math.floor(seconds) === 70) this.setWhen("soon");
      if (Math.floor(seconds) === 100) this.setWhen("sometime");
      if (Math.floor(seconds) === 120) this.setWhen("eventually");
      if (Math.floor(seconds) === 240) this.setWhen("I swear");
      if (Math.floor(seconds) === 600) this.setWhen("maybe, hopefully");

      const text = `Stream will begin ${this.when}${this.dots}`;
      if (text !== this.textContent) this.textContent = text;
      requestAnimationFrame(this.render.bind(this));
    }
  },
);

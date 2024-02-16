customElements.define(
  "corner-hit-counter",
  class extends HTMLElement {
    static observedAttributes = ["count"];
    count = 0;

    /**
     * @param {string} name
     * @param {string} oldValue
     * @param {string} newValue
     */
    attributeChangedCallback(name, oldValue, newValue) {
      if (name === "count") {
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
            return ``;
          case 1:
            return `<p>CORNER HIT</p>`;
          default:
            return `<p>CORNER HIT ${this.count} TIMES</p>`;
        }
      })();
    }
  },
);

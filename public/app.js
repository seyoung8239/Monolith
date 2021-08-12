import { GlowParticle } from "./glowparticle.js";
import {Hill} from './hill.js';
import { Point } from "./point.js";
import { Dialog } from "./dialog.js";

const COLORS = [
  { r: parseInt("FC", 16), g: parseInt("C8", 16), b: parseInt("75", 16) },
  { r: parseInt("BA", 16), g: parseInt("A8", 16), b: parseInt("96", 16) },
  { r: parseInt("E6", 16), g: parseInt("CC", 16), b: parseInt("B5", 16) },
  { r: parseInt("E3", 16), g: parseInt("8B", 16), b: parseInt("75", 16) },
];

class App {
  constructor() {
    this.canvas = document.createElement("canvas");
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext("2d");

    this.pixelRatio = 1;

    //b
    this.totalParticles = 8;
    this.particles = [];
    this.maxRadius = 1200;
    this.minRadius = 800;

    //h
    this.hills = [
      // new Hill('#fd6bea', 0.2, 12),
      // new Hill('#ff59c2', 0.5, 8),
      // new Hill('#ff4674', 1.0, 6)

      new Hill('#1e0000', 0.3, 12),
      new Hill('#500805', 0.6, 10),
      new Hill('#9d331f', 0.9, 8),
      new Hill('#bc6d4f', 1.2, 6),
    ];

    //o
    this.mousePos = new Point();
    this.cutItem = null;

    this.items = [];
    this.total = 1;
    for (let i = 0; i < this.total; i++) {
      this.items[i] = new Dialog();
    }

    window.addEventListener("resize", this.resize.bind(this), false);
    this.resize();

    window.requestAnimationFrame(this.animate.bind(this));

    document.addEventListener("pointerdown", this.onDown.bind(this), false);
    document.addEventListener("pointermove", this.onMove.bind(this), false);
    document.addEventListener("pointerup", this.onUp.bind(this), false);
  }

  resize() {
    this.stageWidth = document.body.clientWidth;
    this.stageHeight = document.body.clientHeight;

    this.canvas.width = this.stageWidth * this.pixelRatio;
    this.canvas.height = this.stageHeight * this.pixelRatio;
    this.ctx.scale(this.pixelRatio, this.pixelRatio);

    this.createParticles();

    for(let i=0; i<this.hills.length; i++) {
      this.hills[i].resize(this.stageWidth, this.stageHeight);
    }

    this.ctx.shadowOffsetX = 0;
    this.ctx.shadowOffsetY = 3;
    this.ctx.shadowBlur = 6;
    this.ctx.shadowColor = `rgba(0, 0, 0, 0.3)`;

    this.ctx.lineWidth = 2;

    for (let i = 0; i < this.items.length; i++) {
      this.items[i].resize(this.stageWidth, this.stageHeight);
    }
  }

  createParticles() {
    let curColor = 0;
    this.particles = [];

    for (let i = 0; i < this.totalParticles; i++) {
      const item = new GlowParticle(
        Math.random() * this.stageWidth,
        Math.random() * this.stageHeight,
        Math.random() * (this.maxRadius - this.minRadius) + this.minRadius,
        COLORS[curColor]
      );

      if (++curColor >= COLORS.length) {
        curColor = 0;
      }

      this.particles[i] = item;
    }
  }

  animate() {
    window.requestAnimationFrame(this.animate.bind(this));

    this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);

    for (let i = 0; i < this.totalParticles; i++) {
      const item = this.particles[i];
      item.animate(this.ctx, this.stageWidth, this.stageHeight);
    }

    let dots;
    for(let i=0; i<this.hills.length; i++) {
      dots = this.hills[i].draw(this.ctx);
    }

    for (let i = 0; i < this.items.length; i++) {
      this.items[i].animate(this.ctx);
    }
  }

  onDown(e) {
    this.mousePos.x = e.clientX;
    this.mousePos.y = e.clientY;

    for (let i = this.items.length - 1; i >= 0; i--) {
      const item = this.items[i].down(this.mousePos.clone());
      if (item) {
        this.curItem = item;
        const index = this.items.indexOf(item);
        this.items.push(this.items.splice(index, 1)[0]);
        break;
      }
    }
  }

  onMove(e) {
    this.mousePos.x = e.clientX;
    this.mousePos.y = e.clientY;

    for (let i = 0; i < this.items.length; i++) {
      this.items[i].move(this.mousePos.clone());
    }
  }

  onUp(e) {
    this.curItem = null;

    for (let i = 0; i < this.items.length; i++) {
      this.items[i].up();
    }
  }
}

window.onload = () => {
  console.log("onload");
  new App();
};

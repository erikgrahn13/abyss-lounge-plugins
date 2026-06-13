import { Component, getParameter } from "singularity";
import { Knob } from "singularity/knob.js"
import { Button } from "singularity/button.js";
import { Slider } from "singularity/slider.js"
import { DeathMetalKnob } from "./DeathMetalKnob.js";

export default function App() {
  console.log("Hello From JavaScript");
  const width = 800;
  const height = 600;
  return Component({
    width,
    height,
    backgroundColor: "#000000",
    draw(ctx) {
      ctx.fillStyle = "#ffffff";
      ctx.font = "24px sans-serif";
      ctx.textAlign = "center"
      ctx.fillText("BLACK LOUNGE AMP", width / 2, 40);
      ctx.drawImage("./background.png", width / 2 - 125, height / 2 - 125, 250, 250);
    },
    children: [
      DeathMetalKnob({ x: width / 5, y: height / 1.5, size: 80, parameterId: 13 }),
      DeathMetalKnob({ x: width / 3, y: height / 1.5, size: 80, parameterId: 13 }),
      DeathMetalKnob({ x: width / 2, y: height / 1.5, size: 80, parameterId: 13 }),

      // Knob({ x: width / 3, y: height / 1.5, size: 80, parameterId: 13 }),
      // Knob({ x: width / 2, y: height / 1.5, size: 80, parameterId: 13 }),
    ],
  });
}

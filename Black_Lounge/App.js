import { Component, getParameter } from "singularity";
import { Knob } from "singularity/knob.js"
import { Button } from "singularity/button.js";
import { Slider } from "singularity/slider.js"
import { DeathMetalKnob } from "./DeathMetalKnob.js";
import { AnimatedOrb } from "./AnimatedOrb.js";

export default function App() {
  const width = 800;
  const height = 600;

  return Component({
    width,
    height,
    backgroundColor: "#000000",
    flexDirection: "column",
    children: [

      // ── HEADER ────────────────────────────────────────────────────
      Component({
        width,
        height: 70,
        draw(ctx) {
          // Background
          ctx.fillStyle = "#000000";
          ctx.fillRect(0, 0, width, 70);

          // Side ornaments — HDR glow
          ctx.save();
          ctx.bloom = 1.2;
          ctx.font = "bold 22px serif";
          ctx.fillStyle = "color(srgb-linear 2.0 0.0 0.0 1.0)";
          ctx.shadowColor = "color(srgb-linear 4.0 0.0 0.0 1.0)";
          ctx.shadowBlur = 18;
          ctx.fillText("⸸", 22, 46);
          ctx.fillText("⸸", width - 38, 46);
          ctx.restore();

          // Horizontal rule flanking title
          ctx.save();
          ctx.bloom = 0.8;
          ctx.strokeStyle = "color(srgb-linear 1.5 0.0 0.0 1.0)";
          ctx.shadowColor = "color(srgb-linear 2.0 0.0 0.0 1.0)";
          ctx.shadowBlur = 10;
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(68, 34); ctx.lineTo(230, 34); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(width - 68, 34); ctx.lineTo(width - 230, 34); ctx.stroke();
          ctx.restore();

          // Title — HDR bloom glow
          ctx.save();
          ctx.bloom = 1.8;
          ctx.font = "bold 30px serif";
          ctx.textAlign = "center";
          ctx.fillStyle = "color(srgb-linear 1.8 1.4 1.1 1.0)";
          ctx.shadowColor = "color(srgb-linear 6.0 0.0 0.0 1.0)";
          ctx.shadowBlur = 35;
          ctx.fillText("BLACK LOUNGE", width / 2, 37);
          ctx.restore();

          // Subtitle spaced letters
          ctx.save();
          ctx.bloom = 0.6;
          ctx.font = "10px monospace";
          ctx.textAlign = "center";
          ctx.fillStyle = "color(srgb-linear 0.6 0.0 0.0 1.0)";
          ctx.shadowColor = "color(srgb-linear 1.0 0.0 0.0 1.0)";
          ctx.shadowBlur = 8;
          ctx.fillText("A  M  P  L  I  F  I  E  R", width / 2, 56);
          ctx.restore();

          // Bottom glow line
          ctx.save();
          ctx.bloom = 1.4;
          ctx.beginPath();
          ctx.moveTo(0, 69.5);
          ctx.lineTo(width, 69.5);
          ctx.lineWidth = 1;
          ctx.strokeStyle = "color(srgb-linear 5.0 0.0 0.0 1.0)";
          ctx.shadowColor = "color(srgb-linear 4.0 0.0 0.0 1.0)";
          ctx.shadowBlur = 22;
          ctx.stroke();
          ctx.restore();
        },
      }),

      // ── CENTER IMAGE ──────────────────────────────────────────────
      Component({
        width,
        height: 370,
        draw(ctx) {
          ctx.fillStyle = "#000000";
          ctx.fillRect(0, 0, width, 370);

          // Centered square — fully visible, fits the component height
          const size = 370;
          const ix = (width - size) / 2;
          ctx.drawImage("./background.png", ix, 0, size, size);

          // HDR corner brackets
          ctx.save();
          ctx.bloom = 1.2;
          ctx.lineWidth = 1.5;
          ctx.strokeStyle = "color(srgb-linear 4.0 0.0 0.0 1.0)";
          ctx.shadowColor = "color(srgb-linear 3.5 0.0 0.0 1.0)";
          ctx.shadowBlur = 16;
          const bm = 28, bl = 55;
          ctx.beginPath(); ctx.moveTo(bm + bl, bm); ctx.lineTo(bm, bm); ctx.lineTo(bm, bm + bl); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(width - bm - bl, bm); ctx.lineTo(width - bm, bm); ctx.lineTo(width - bm, bm + bl); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(bm + bl, 370 - bm); ctx.lineTo(bm, 370 - bm); ctx.lineTo(bm, 370 - bm - bl); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(width - bm - bl, 370 - bm); ctx.lineTo(width - bm, 370 - bm); ctx.lineTo(width - bm, 370 - bm - bl); ctx.stroke();
          ctx.restore();
        },
      }),

      // ── KNOB PANEL ────────────────────────────────────────────────
      Component({
        width,
        height: 160,
        draw(ctx) {
          // Panel background
          ctx.fillStyle = "#000000";
          ctx.fillRect(0, 0, width, 160);

          // Top glow line
          ctx.save();
          ctx.bloom = 1.4;
          ctx.beginPath();
          ctx.moveTo(0, 0.5);
          ctx.lineTo(width, 0.5);
          ctx.lineWidth = 1;
          ctx.strokeStyle = "color(srgb-linear 5.0 0.0 0.0 1.0)";
          ctx.shadowColor = "color(srgb-linear 4.0 0.0 0.0 1.0)";
          ctx.shadowBlur = 20;
          ctx.stroke();
          ctx.restore();

          // Vertical separators
          ctx.save();
          ctx.bloom = 1.2;
          ctx.lineWidth = 1.5;
          ctx.strokeStyle = "color(srgb-linear 4.0 0.0 0.0 1.0)";
          ctx.shadowColor = "color(srgb-linear 3.5 0.0 0.0 1.0)";
          ctx.shadowBlur = 16;
          const knobSize = 85;
          const gap = (width - 3 * knobSize) / 4;
          const sep1 = gap + knobSize + gap / 2;
          const sep2 = sep1 + knobSize + gap;
          ctx.beginPath(); ctx.moveTo(sep1, 10); ctx.lineTo(sep1, 145); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(sep2, 10); ctx.lineTo(sep2, 145); ctx.stroke();
          ctx.restore();

          // Knob labels
          ctx.save();
          ctx.bloom = 0.5;
          ctx.font = "bold 10px monospace";
          ctx.textAlign = "center";
          ctx.fillStyle = "color(srgb-linear 0.8 0.6 0.5 1.0)";
          ctx.shadowColor = "color(srgb-linear 1.5 0.0 0.0 1.0)";
          ctx.shadowBlur = 6;
          const labels = ["GAIN", "DRIVE", "MASTER"];
          for (let i = 0; i < labels.length; i++) {
            const x = gap + knobSize / 2 + i * (gap + knobSize);
            ctx.fillText(labels[i], x, 153);
          }
          ctx.restore();
        },
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        children: [
          DeathMetalKnob({ size: 85, parameterId: 13, backgroundColor: "#000000" }),
          DeathMetalKnob({ size: 85, parameterId: 13, backgroundColor: "#000000" }),
          DeathMetalKnob({ size: 85, parameterId: 13, backgroundColor: "#000000" }),
          // Knob({ size: 80, parameterId: 13 }),
          // AnimatedOrb({ size: 100 }),
        ]
      }),
    ],
  });
}

import { Knob } from "singularity/knob.js";

// Use the same convention as the default Singularity Knob:
// start at 0.75π and sweep 1.5π clockwise
const startAngle = 0.75 * Math.PI;
const endAngle = startAngle + 1.5 * Math.PI;

function valueToAngle(val) {
    return startAngle + val * (endAngle - startAngle);
}

export function DeathMetalKnob({ x, y, size = 80, parameterId, padding = 7.5, backgroundColor = "#000000" }) {
    return Knob({
        x, y, size, parameterId, backgroundColor,
        draw: (ctx, { value, size }) => {
            const radius        = size / 2;
            const cx            = radius;
            const cy            = radius;
            const drawRadius    = radius - padding;
            const lineW         = drawRadius * 0.135;
            const adjustedR     = drawRadius - lineW * 0.5;
            const currentAngle  = valueToAngle(value);

            ctx.save();

            // Knob body
            ctx.beginPath();
            ctx.arc(cx, cy, drawRadius, 0, Math.PI * 2, true);
            ctx.fillStyle = backgroundColor;
            ctx.fill();

            ctx.lineWidth = lineW;
            ctx.lineCap   = "round";

            // Grey track (full range) — dim HDR so it glows faintly
            ctx.save();
            ctx.bloom = 0.3;
            ctx.strokeStyle = "color(srgb-linear 0.08 0.0 0.0 1.0)";
            ctx.shadowColor  = "color(srgb-linear 0.15 0.0 0.0 1.0)";
            ctx.shadowBlur   = 3;
            ctx.beginPath();
            ctx.arc(cx, cy, adjustedR, startAngle, endAngle, false);
            ctx.stroke();
            ctx.restore();

            // Value arc — blood red HDR bloom
            ctx.save();
            ctx.bloom = 1.2;
            ctx.lineWidth   = lineW;
            ctx.lineCap     = "round";
            ctx.strokeStyle = "color(srgb-linear 4.0 1.1 1.0 1.0)";
            ctx.shadowColor = "color(srgb-linear 3.5 0.0 0.0 1.0)";
            ctx.shadowBlur   = 8;
            ctx.beginPath();
            ctx.arc(cx, cy, adjustedR, startAngle, currentAngle, false);
            ctx.stroke();
            ctx.restore();

            // Pentagram + inner circle (rotates with value) — cold white HDR
            ctx.save();
            ctx.bloom = 0.6;
            ctx.strokeStyle = "color(srgb-linear 1.2 1.1 1.0 1.0)";
            ctx.shadowColor  = "color(srgb-linear 0.6 0.0 0.0 1.0)";
            ctx.shadowBlur   = 5;
            ctx.lineCap     = "butt";
            ctx.lineWidth   = 2;

            ctx.beginPath();
            for (let i = 0; i < 5; i++) {
                const baseAngle = (Math.PI / 180) * (180 + i * 144);
                const pointAngle = baseAngle + currentAngle;
                const px = cx + Math.cos(pointAngle) * (drawRadius * 0.8);
                const py = cy + Math.sin(pointAngle) * (drawRadius * 0.8);
                if (i === 0) ctx.moveTo(px, py);
                else         ctx.lineTo(px, py);
            }
            ctx.closePath();
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(cx, cy, drawRadius * 0.8 * 0.9, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();

            // Cross / pointer — intense red HDR
            const cosA = Math.cos(currentAngle);
            const sinA = Math.sin(currentAngle);
            const rot = (lx, ly) => [cx + lx * cosA - ly * sinA,
                                     cy + lx * sinA + ly * cosA];

            ctx.save();
            ctx.bloom = 0.6;
            ctx.strokeStyle = "color(srgb-linear 1.2 1.1 1.0 1.0)";
            ctx.shadowColor  = "color(srgb-linear 0.6 0.0 0.0 1.0)";
            ctx.shadowBlur   = 5;
            ctx.lineCap     = "butt";
            ctx.lineWidth   = lineW;

            const [x0, y0] = rot(0, 0);
            const [x1, y1] = rot(drawRadius, 0);
            ctx.beginPath();
            ctx.moveTo(x0, y0);
            ctx.lineTo(x1, y1);
            ctx.stroke();

            const [x2, y2] = rot(drawRadius / 3, -drawRadius / 4);
            const [x3, y3] = rot(drawRadius / 3,  drawRadius / 4);
            ctx.beginPath();
            ctx.moveTo(x2, y2);
            ctx.lineTo(x3, y3);
            ctx.stroke();
            ctx.restore();

            ctx.restore();
        },
    });
}

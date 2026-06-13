import { Knob } from "singularity/knob.js";

// Use the same convention as the default Singularity Knob:
// start at 0.75π and sweep 1.5π clockwise
const startAngle = 0.75 * Math.PI;
const endAngle = startAngle + 1.5 * Math.PI;

function valueToAngle(val) {
    return startAngle + val * (endAngle - startAngle);
}

export function DeathMetalKnob({ x, y, size = 80, parameterId, padding = 10 }) {
    return Knob({
        x, y, size, parameterId,
        draw: (ctx, { value, size }) => {
            const radius        = size / 2;
            const cx            = radius;
            const cy            = radius;
            const drawRadius    = radius - padding;
            const lineW         = drawRadius * 0.135;
            const adjustedR     = drawRadius - lineW * 0.5;
            const currentAngle  = valueToAngle(value);

            ctx.save();

            // Background
            ctx.fillStyle = "#000000";
            ctx.fillRect(0, 0, size, size);

            // Knob body
            ctx.beginPath();
            ctx.arc(cx, cy, drawRadius, 0, Math.PI * 2, true);
            ctx.fillStyle = "#000000";
            ctx.fill();

            ctx.lineWidth = lineW;
            ctx.lineCap   = "round";

            // Grey track (full range)
            ctx.strokeStyle = "#808080";
            ctx.beginPath();
            ctx.arc(cx, cy, adjustedR, startAngle, endAngle, false);
            ctx.stroke();

            // White value arc (use the same angle convention as the grey track)
            ctx.strokeStyle = "#ffffff";
            ctx.beginPath();
            ctx.arc(cx, cy, adjustedR, startAngle, currentAngle, false);
            ctx.stroke();

            // Pentagram + inner circle (rotates with value)
            ctx.strokeStyle = "#ffffff";
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

            // Cross / pointer (rotates with value)
            // Rotate local points around (cx, cy) by currentAngle manually:
            //   screen = (cx + lx*cos(a) - ly*sin(a), cy + lx*sin(a) + ly*cos(a))
            const cosA = Math.cos(currentAngle);
            const sinA = Math.sin(currentAngle);
            const rot = (lx, ly) => [cx + lx * cosA - ly * sinA,
                                     cy + lx * sinA + ly * cosA];

            ctx.strokeStyle = "#ffffff";
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
        },
    });
}

import { Component, getParameter, openFileDialog } from "singularity";
import { Knob } from "singularity/knob.js"
import { Button } from "singularity/button.js";
import { Slider } from "singularity/slider.js"
import { DeathMetalKnob } from "./DeathMetalKnob.js";

export default function App() {
  const width = 400;
  const height = 400;

  const sx = width / 800;   // 0.75  — horizontal scale factor
  const sy = height / 600;  // 0.667 — vertical scale factor

  const headerH  = Math.round(70 * sy);
  const knobH    = Math.round(160 * sy);
  const imageH   = height - headerH - knobH;
  const knobSize = Math.round(85 * sx);

  return Component({
    width,
    height,
    backgroundColor: "#000000",
    flexDirection: "column",
    children: [
      // DeathMetalKnob({ x: width / 5, y: height / 1.5, size: 80, parameterId: 13 }),
      // DeathMetalKnob({ x: width / 3, y: height / 1.5, size: 80, parameterId: 13 }),
      // DeathMetalKnob({ x: width / 2, y: height / 1.5, size: 80, parameterId: 13 }),
      // Button({ x: width / 2 - 75, y: 80, width: 150, height: 36, label: "Load IR", onClick: () => {
      //   openFileDialog("Load WAV IR", (path) => {
      //     console.log("Selected file: " + path);
      //   });
      // }}),

      // ── HEADER ────────────────────────────────────────────────────
      Component({
        width,
        height: headerH,
        draw(ctx) {
          // Background
          ctx.fillStyle = "#000000";
          ctx.fillRect(0, 0, width, headerH);

          // Side ornaments — HDR glow
          ctx.save();
          ctx.bloom = 1.2;
          ctx.font = `bold ${Math.round(22 * sx)}px mb-forever-raw.regular.ttf`;
          ctx.fillStyle = "color(srgb-linear 2.0 0.0 0.0 1.0)";
          ctx.shadowColor = "color(srgb-linear 4.0 0.0 0.0 1.0)";
          ctx.shadowBlur = Math.round(18 * sx);
          ctx.fillText("(", Math.round(22 * sx), Math.round(46 * sy));
          ctx.fillText(")", width - Math.round(38 * sx), Math.round(46 * sy));
          ctx.restore();

          // Horizontal rule flanking title
          ctx.save();
          ctx.bloom = 0.8;
          ctx.strokeStyle = "color(srgb-linear 1.5 0.0 0.0 1.0)";
          ctx.shadowColor = "color(srgb-linear 2.0 0.0 0.0 1.0)";
          ctx.shadowBlur = Math.round(10 * sx);
          ctx.lineWidth = 1;
          const lineY = Math.round(34 * sy);
          ctx.beginPath(); ctx.moveTo(Math.round(68 * sx), lineY); ctx.lineTo(Math.round(230 * sx), lineY); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(width - Math.round(68 * sx), lineY); ctx.lineTo(width - Math.round(230 * sx), lineY); ctx.stroke();
          ctx.restore();

          // Title — HDR bloom glow
          ctx.save();
          ctx.bloom = 1.8;
          ctx.font = `bold ${Math.round(30 * sx)}px mb-forever-raw.regular.ttf`;
          ctx.textAlign = "center";
          ctx.fillStyle = "color(srgb-linear 1.8 1.4 1.1 1.0)";
          ctx.shadowColor = "color(srgb-linear 6.0 0.0 0.0 1.0)";
          ctx.shadowBlur = Math.round(35 * sx);
          ctx.fillText("BLACK LOUNGE", width / 2, Math.round(37 * sy));
          ctx.restore();

          // Subtitle spaced letters
          ctx.save();
          ctx.bloom = 0.6;
          ctx.font = `${Math.round(10 * sx)}px mb-forever-raw.regular.ttf`;
          ctx.textAlign = "center";
          ctx.fillStyle = "color(srgb-linear 0.6 0.0 0.0 1.0)";
          ctx.shadowColor = "color(srgb-linear 1.0 0.0 0.0 1.0)";
          ctx.shadowBlur = Math.round(8 * sx);
          ctx.fillText("A  M  P  L  I  F  I  E  R", width / 2, Math.round(56 * sy));
          ctx.restore();

          // Bottom glow line
          ctx.save();
          ctx.bloom = 1.4;
          ctx.beginPath();
          ctx.moveTo(0, headerH - 0.5);
          ctx.lineTo(width, headerH - 0.5);
          ctx.lineWidth = 1;
          ctx.strokeStyle = "color(srgb-linear 5.0 0.0 0.0 1.0)";
          ctx.shadowColor = "color(srgb-linear 4.0 0.0 0.0 1.0)";
          ctx.shadowBlur = Math.round(22 * sx);
          ctx.stroke();
          ctx.restore();
        },
      }),

      // ── CENTER IMAGE ──────────────────────────────────────────────
      Component({
        width,
        height: imageH,
        animate: true,
        draw(ctx) {
          ctx.fillStyle = "#000000";
          ctx.fillRect(0, 0, width, imageH);

          // ── Fire background shader ────────────────────────────────
          ctx.drawShader(`
            uniform float2 iResolution;
            uniform float  iTime;

            float3 mod289_3(float3 x) {
                return x - floor(x * (1.0 / 289.0)) * 289.0;
            }
            float4 mod289_4(float4 x) {
                return x - floor(x * (1.0 / 289.0)) * 289.0;
            }
            float4 permute4(float4 x) {
                return mod289_4(((x * 34.0) + 1.0) * x);
            }

            float snoise(float3 v) {
                const float2 C = float2(1.0/6.0, 1.0/3.0);
                const float4 D = float4(0.0, 0.5, 1.0, 2.0);
                float3 i  = floor(v + dot(v, C.yyy));
                float3 x0 = v - i + dot(i, C.xxx);
                float3 g  = step(x0.yzx, x0.xyz);
                float3 l  = 1.0 - g;
                float3 i1 = min(g.xyz, l.zxy);
                float3 i2 = max(g.xyz, l.zxy);
                float3 x1 = x0 - i1 + C.xxx;
                float3 x2 = x0 - i2 + C.yyy;
                float3 x3 = x0 - D.yyy;
                i = mod289_3(i);
                float4 p = permute4(permute4(permute4(
                    i.z + float4(0.0, i1.z, i2.z, 1.0))
                    + i.y + float4(0.0, i1.y, i2.y, 1.0))
                    + i.x + float4(0.0, i1.x, i2.x, 1.0));
                float  n_ = 0.142857142857;
                float3 ns = n_ * D.wyz - D.xzx;
                float4 j  = p - 49.0 * floor(p * ns.z * ns.z);
                float4 x_ = floor(j * ns.z);
                float4 y_ = floor(j - 7.0 * x_);
                float4 xx = x_ * ns.x + ns.yyyy;
                float4 yy = y_ * ns.x + ns.yyyy;
                float4 hh = 1.0 - abs(xx) - abs(yy);
                float4 b0 = float4(xx.xy, yy.xy);
                float4 b1 = float4(xx.zw, yy.zw);
                float4 s0 = floor(b0) * 2.0 + 1.0;
                float4 s1 = floor(b1) * 2.0 + 1.0;
                float4 sh = -step(hh, float4(0.0));
                float4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
                float4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
                float3 p0v = float3(a0.xy, hh.x);
                float3 p1v = float3(a0.zw, hh.y);
                float3 p2v = float3(a1.xy, hh.z);
                float3 p3v = float3(a1.zw, hh.w);
                float4 norm = inversesqrt(float4(dot(p0v,p0v), dot(p1v,p1v), dot(p2v,p2v), dot(p3v,p3v)));
                p0v *= norm.x; p1v *= norm.y; p2v *= norm.z; p3v *= norm.w;
                float4 m = max(0.6 - float4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
                m = m * m;
                return 42.0 * dot(m*m, float4(dot(p0v,x0), dot(p1v,x1), dot(p2v,x2), dot(p3v,x3)));
            }

            float prng(float2 seed) {
                seed = fract(seed * float2(5.3983, 5.4427));
                seed += dot(seed.yx, seed.xy + float2(21.5351, 14.3137));
                return fract(seed.x * seed.y * 95.4337);
            }

            float noiseStack(float3 pos, int octaves, float falloff) {
                float n = snoise(pos);
                float off = 1.0;
                if (octaves > 1) { pos *= 2.0; off *= falloff; n = (1.0-off)*n + off*snoise(pos); }
                if (octaves > 2) { pos *= 2.0; off *= falloff; n = (1.0-off)*n + off*snoise(pos); }
                if (octaves > 3) { pos *= 2.0; off *= falloff; n = (1.0-off)*n + off*snoise(pos); }
                return (1.0 + n) / 2.0;
            }

            float2 noiseStackUV(float3 pos, int octaves, float falloff, float diff) {
                float da = noiseStack(pos, octaves, falloff);
                float db = noiseStack(pos + float3(3984.293, 423.21, 5235.19), octaves, falloff);
                return float2(da, db);
            }

            half4 main(float2 fragCoord) {
                const float PI = 3.14159265358979;
                float time = iTime;
                float2 resolution = iResolution;
                // Flip Y: Shadertoy origin is bottom-left; Skia origin is top-left
                float2 fc = float2(fragCoord.x, resolution.y - fragCoord.y);

                float xpart = fc.x / resolution.x;
                float ypart = fc.y / resolution.y;
                float clip  = resolution.y * 0.7;   // flame height as fraction of component
                float ypartClip          = fc.y / clip;
                float ypartClippedFalloff = clamp(2.0 - ypartClip, 0.0, 1.0);
                float ypartClipped        = min(ypartClip, 1.0);
                float ypartClippedn       = 1.0 - ypartClipped;
                float xfuel = 1.0 - abs(2.0*xpart - 1.0);

                float timeSpeed = 0.5;
                float realTime  = timeSpeed * time;

                float2 coordScaled = 0.01 * fc;
                float3 position    = float3(coordScaled, 0.0) + float3(1223.0, 6434.0, 8425.0);
                float3 flow        = float3(4.1*(0.5-xpart)*pow(ypartClippedn,4.0),
                                           -2.0*xfuel*pow(ypartClippedn,64.0), 0.0);
                float3 timing      = realTime * float3(0.0, -1.7, 1.1) + flow;

                float3 displacePos = float3(1.0,0.5,1.0)*2.4*position + realTime*float3(0.01,-0.7,1.3);
                float3 displace3   = float3(noiseStackUV(displacePos, 2, 0.4, 0.1), 0.0);

                float3 noiseCoord  = float3(2.0,1.0,1.0)*position + timing + 0.4*displace3;
                float  noise       = noiseStack(noiseCoord, 3, 0.4);

                float flames = pow(max(ypartClipped,1e-5), 0.3*xfuel)
                             * pow(max(noise,       1e-5), 0.3*xfuel);
                float f   = ypartClippedFalloff * pow(1.0 - flames*flames*flames, 8.0);
                float fff = f*f*f;
                float3 fire = 1.5 * float3(f, fff, fff*fff);

                // smoke
                float smokeNoise = 0.5 + snoise(0.4*position + timing*float3(1.0,1.0,0.2)) / 2.0;
                float3 smoke = float3(0.3*pow(xfuel,3.0)*pow(ypart,2.0)*(smokeNoise+0.4*(1.0-noise)));

                // sparks
                float sparkGridSize = 30.0;
                float2 sparkCoord   = fc - float2(0.0, 190.0*realTime);
                sparkCoord -= 30.0 * noiseStackUV(0.01*float3(sparkCoord, 30.0*time), 1, 0.4, 0.1);
                sparkCoord += 100.0 * flow.xy;
                if (mod(sparkCoord.y / sparkGridSize, 2.0) < 1.0)
                    sparkCoord.x += 0.5 * sparkGridSize;
                float2 sparkGridIndex = floor(sparkCoord / sparkGridSize);
                float  sparkRandom    = prng(sparkGridIndex);
                float  sparkLife      = min(10.0*(1.0 - min(
                    (sparkGridIndex.y + (190.0*realTime/sparkGridSize)) / (24.0 - 20.0*sparkRandom),
                    1.0)), 1.0);
                float3 sparks = float3(0.0);
                if (sparkLife > 0.0) {
                    float  sparkSize     = xfuel*xfuel*sparkRandom*0.08;
                    float  sparkRadians  = 999.0*sparkRandom*2.0*PI + 2.0*time;
                    float2 sparkCircular = float2(sin(sparkRadians), cos(sparkRadians));
                    float2 sparkOffset   = (0.5 - sparkSize)*sparkGridSize*sparkCircular;
                    float2 sparkModulus  = mod(sparkCoord+sparkOffset, float2(sparkGridSize)) - 0.5*float2(sparkGridSize);
                    float  sparksGray    = max(0.0, 1.0 - length(sparkModulus)/(sparkSize*sparkGridSize));
                    sparks = sparkLife * sparksGray * float3(1.0, 0.3, 0.0);
                }

                float3 col = max(fire, sparks) + smoke;
                return half4(col, 1.0);
            }
          `, { iResolution: [width, imageH], iTime: ctx.time() },
          0, 0, width, imageH);

          // Centered square — fully visible, fits the component height
          const size = imageH;
          const ix = (width - size) / 2;
          // ctx.drawImage("./background.png", ix, 0, size, size);

          // HDR corner brackets
          ctx.save();
          ctx.bloom = 1.2;
          ctx.lineWidth = 1.5;
          ctx.strokeStyle = "color(srgb-linear 4.0 0.0 0.0 1.0)";
          ctx.shadowColor = "color(srgb-linear 3.5 0.0 0.0 1.0)";
          ctx.shadowBlur = Math.round(16 * sx);
          const bm = Math.round(28 * sy), bl = Math.round(55 * sx);
          ctx.beginPath(); ctx.moveTo(bm + bl, bm); ctx.lineTo(bm, bm); ctx.lineTo(bm, bm + bl); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(width - bm - bl, bm); ctx.lineTo(width - bm, bm); ctx.lineTo(width - bm, bm + bl); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(bm + bl, imageH - bm); ctx.lineTo(bm, imageH - bm); ctx.lineTo(bm, imageH - bm - bl); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(width - bm - bl, imageH - bm); ctx.lineTo(width - bm, imageH - bm); ctx.lineTo(width - bm, imageH - bm - bl); ctx.stroke();
          ctx.restore();
        },
      }),

      // ── KNOB PANEL ────────────────────────────────────────────────
      Component({
        width,
        height: knobH,
        draw(ctx) {
          // Panel background
          ctx.fillStyle = "#000000";
          ctx.fillRect(0, 0, width, knobH);

          // Top glow line
          ctx.save();
          ctx.bloom = 1.4;
          ctx.beginPath();
          ctx.moveTo(0, 0.5);
          ctx.lineTo(width, 0.5);
          ctx.lineWidth = 1;
          ctx.strokeStyle = "color(srgb-linear 5.0 0.0 0.0 1.0)";
          ctx.shadowColor = "color(srgb-linear 4.0 0.0 0.0 1.0)";
          ctx.shadowBlur = Math.round(20 * sx);
          ctx.stroke();
          ctx.restore();

          // Vertical separators
          ctx.save();
          ctx.bloom = 1.2;
          ctx.lineWidth = 1.5;
          ctx.strokeStyle = "color(srgb-linear 4.0 0.0 0.0 1.0)";
          ctx.shadowColor = "color(srgb-linear 3.5 0.0 0.0 1.0)";
          ctx.shadowBlur = Math.round(16 * sx);
          const gap = (width - 3 * knobSize) / 4;
          const sep1 = gap + knobSize + gap / 2;
          const sep2 = sep1 + knobSize + gap;
          ctx.beginPath(); ctx.moveTo(sep1, Math.round(10 * sy)); ctx.lineTo(sep1, Math.round(145 * sy)); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(sep2, Math.round(10 * sy)); ctx.lineTo(sep2, Math.round(145 * sy)); ctx.stroke();
          ctx.restore();

          // Knob labels
          ctx.save();
          ctx.bloom = 0.5;
          ctx.font = `bold ${Math.round(20 * sx)}px mb-forever-raw.regular.ttf`;
          ctx.textAlign = "center";
          ctx.fillStyle = "color(srgb-linear 0.8 0.6 0.5 1.0)";
          ctx.shadowColor = "color(srgb-linear 1.5 0.0 0.0 1.0)";
          ctx.shadowBlur = Math.round(6 * sx);
          const labels = ["DENOISER", "GAIN", "VOLUME"];
          for (let i = 0; i < labels.length; i++) {
            const x = gap + knobSize / 2 + i * (gap + knobSize);
            ctx.fillText(labels[i], x, Math.round(153 * sy));
          }
          ctx.restore();
        },
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        children: [
          DeathMetalKnob({ size: 80, parameterId: 13, backgroundColor: "#000000" }),
          DeathMetalKnob({ size: 80, parameterId: 13, backgroundColor: "#000000" }),
          DeathMetalKnob({ size: 80, parameterId: 13, backgroundColor: "#000000" }),
          // Knob({ size: 80, parameterId: 13 }),
          // AnimatedOrb({ size: 100 }),
        ]
      }),
    ],
  });
}

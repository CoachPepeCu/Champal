"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const FEEL_ASSETS = {
  feelBackground: "/images/FEEL/fondo-feel.webm",
  heart: "/images/FEEL/corazon.webp",
  tree: "/images/FEEL/Arbol.png",
  lavender: "/images/FEEL/Lavanda.mp4",
  heartToSphere: "/images/FEEL/corazon-esfera.webm",
  balloonTurn: "/videos/balloon-turn-alpha.webm",
  feelCube: "/images/FEEL/Cubo.webp",
  feelSphere: "/images/FEEL/Esfera.webp",
  feelHeart: "/images/FEEL/corazon.webp",
  feelBranch: "/images/FEEL/Rama.webp",
  feel4Particles:
    "https://www.figma.com/api/mcp/asset/dae6c5fa-da13-4ad8-a4eb-12690c9dd21d/a8c5e.png",
  feel4Card1: "/images/FEEL/F1.webp",
  feel4Card2: "/images/FEEL/F2.webp",
  feel4Card3: "/images/FEEL/F3.webp",
};

type HeartParticle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  gravity: number;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
  hue: number;
};

type Sparkle = {
  x: number;
  y: number;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
  hue: number;
  glint: boolean;
};

type SparklePoint = {
  x: number;
  y: number;
};

type FeelTrailPoint = {
  x: number;
  y: number;
  born: number;
};

type FeelTrailParticle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  born: number;
  life: number;
  size: number;
};

type SphereParticle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  gravity: number;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
};

type Feel3Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  gravity: number;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
};

type Feel4Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  gravity: number;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
};

const random = (min: number, max: number) =>
  min + Math.random() * (max - min);

function drawHeartWithoutPlate(
  image: HTMLImageElement,
  canvas: HTMLCanvasElement,
) {
  const width = image.naturalWidth;
  const height = image.naturalHeight;

  if (!width || !height) return;

  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return;

  ctx.clearRect(0, 0, width, height);
  ctx.drawImage(image, 0, 0);

  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const count = width * height;

  const candidate = new Uint8Array(count);
  const visited = new Uint8Array(count);

  for (let i = 0; i < count; i += 1) {
    const p = i * 4;
    const r = data[p];
    const g = data[p + 1];
    const b = data[p + 2];

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const chroma = max - min;
    const brightness = (r + g + b) / 3;

    if (brightness > 205 && chroma < 23) {
      candidate[i] = 1;
    }
  }

  const queue = new Int32Array(count);
  let head = 0;
  let tail = 0;

  const push = (index: number) => {
    if (index < 0 || index >= count) return;
    if (!candidate[index] || visited[index]) return;
    visited[index] = 1;
    queue[tail++] = index;
  };

  for (let x = 0; x < width; x += 1) {
    push(x);
    push((height - 1) * width + x);
  }

  for (let y = 0; y < height; y += 1) {
    push(y * width);
    push(y * width + width - 1);
  }

  while (head < tail) {
    const index = queue[head++];
    const x = index % width;
    const y = Math.floor(index / width);

    if (x > 0) push(index - 1);
    if (x < width - 1) push(index + 1);
    if (y > 0) push(index - width);
    if (y < height - 1) push(index + width);
  }

  for (let i = 0; i < count; i += 1) {
    if (!visited[i]) continue;
    const p = i * 4;
    data[p + 3] = 0;
  }

  ctx.putImageData(imageData, 0, 0);
}

export default function FeelHero() {
  const rootRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const feelBackgroundRef = useRef<HTMLDivElement | null>(null);
  const feelBackgroundARef = useRef<HTMLVideoElement | null>(null);
  const feelBackgroundBRef = useRef<HTMLVideoElement | null>(null);

  const heartRef = useRef<HTMLDivElement | null>(null);
  const heartSourceRef = useRef<HTMLImageElement | null>(null);
  const heartVisualRef = useRef<HTMLCanvasElement | null>(null);
  const heartParticlesRef = useRef<HTMLCanvasElement | null>(null);

  const treeRef = useRef<HTMLDivElement | null>(null);
  const treeImageRef = useRef<HTMLImageElement | null>(null);
  const treeCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const eyebrowRef = useRef<HTMLParagraphElement | null>(null);
  const aulaRef = useRef<HTMLParagraphElement | null>(null);
  const feelRef = useRef<HTMLDivElement | null>(null);
  const feelTrailCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const copyRef = useRef<HTMLParagraphElement | null>(null);
  const lavenderRef = useRef<HTMLVideoElement | null>(null);
  const lavenderCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const whitePanelRef = useRef<HTMLDivElement | null>(null);
  const sphereVideoWrapRef = useRef<HTMLDivElement | null>(null);
  const sphereVideoRef = useRef<HTMLVideoElement | null>(null);
  const sphereParticlesRef = useRef<HTMLCanvasElement | null>(null);
  const feel2TextRef = useRef<HTMLParagraphElement | null>(null);
  const feel3WhiteHoleRef = useRef<HTMLDivElement | null>(null);
  const feel3LayerRef = useRef<HTMLDivElement | null>(null);
  const feel3MorphWrapRef = useRef<HTMLDivElement | null>(null);
  const feel3MorphSphereRef = useRef<HTMLImageElement | null>(null);
  const feel3MorphCubeRef = useRef<HTMLImageElement | null>(null);
  const feel3PixelRef = useRef<HTMLDivElement | null>(null);
  const feel3TitleRef = useRef<HTMLParagraphElement | null>(null);
  const feel3SubtitleRef = useRef<HTMLParagraphElement | null>(null);
  const feel3BodyRef = useRef<HTMLParagraphElement | null>(null);
  const feel3BalloonRigRef = useRef<HTMLDivElement | null>(null);
  const feel3BalloonVideoRef = useRef<HTMLVideoElement | null>(null);
  const feel3SignRef = useRef<HTMLDivElement | null>(null);
  const feel3CurtainRef = useRef<HTMLDivElement | null>(null);
  const feel3ParticlesRef = useRef<HTMLCanvasElement | null>(null);
  const feel4MorphWrapRef = useRef<HTMLDivElement | null>(null);
  const feel4MorphCubeRef = useRef<HTMLImageElement | null>(null);
  const feel4MorphHeartRef = useRef<HTMLImageElement | null>(null);
  const feel4ParticlesRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const videoA = feelBackgroundARef.current;
    const videoB = feelBackgroundBRef.current;

    if (!videoA || !videoB) return;

    const CROSSFADE_SECONDS = 0.9;
    let activeIndex = 0;
    let crossfading = false;
    let crossfadeStart = 0;
    let raf = 0;

    const videos = [videoA, videoB];

    const safePlay = (video: HTMLVideoElement) => {
      const promise = video.play();
      if (promise) promise.catch(() => {});
    };

    const resetVideo = (video: HTMLVideoElement) => {
      video.pause();
      try {
        video.currentTime = 0;
      } catch {}
    };

    videoA.style.opacity = "1";
    videoB.style.opacity = "0";
    videoA.muted = true;
    videoB.muted = true;

    const start = () => {
      resetVideo(videoA);
      resetVideo(videoB);
      videoA.style.opacity = "1";
      videoB.style.opacity = "0";
      activeIndex = 0;
      crossfading = false;
      safePlay(videoA);
    };

    const tick = (now: number) => {
      const active = videos[activeIndex];
      const incoming = videos[1 - activeIndex];
      const duration =
        Number.isFinite(active.duration) && active.duration > 0
          ? active.duration
          : 8;

      if (
        !crossfading &&
        active.currentTime >= Math.max(0, duration - CROSSFADE_SECONDS)
      ) {
        crossfading = true;
        crossfadeStart = now;
        try {
          incoming.currentTime = 0;
        } catch {}
        incoming.style.opacity = "0";
        safePlay(incoming);
      }

      if (crossfading) {
        const progress = Math.min(
          1,
          (now - crossfadeStart) / (CROSSFADE_SECONDS * 1000),
        );
        // Smoothstep: evita que se perciba un cambio de luminosidad brusco.
        const eased = progress * progress * (3 - 2 * progress);
        active.style.opacity = String(1 - eased);
        incoming.style.opacity = String(eased);

        if (progress >= 1) {
          resetVideo(active);
          active.style.opacity = "0";
          incoming.style.opacity = "1";
          activeIndex = 1 - activeIndex;
          crossfading = false;
        }
      }

      raf = requestAnimationFrame(tick);
    };

    const onCanPlay = () => {
      if (videoA.paused && videoB.paused) start();
    };

    videoA.addEventListener("canplay", onCanPlay, { once: true });
    videoB.addEventListener("canplay", onCanPlay, { once: true });
    start();
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      videoA.removeEventListener("canplay", onCanPlay);
      videoB.removeEventListener("canplay", onCanPlay);
      resetVideo(videoA);
      resetVideo(videoB);
    };
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const scrollRoot =
      root.closest<HTMLElement>("[data-feel-scroll-root]") ?? null;
    const sentinels = Array.from(
      root.querySelectorAll<HTMLElement>("[data-feel-load-sentinel]"),
    );

    const activateGroup = (group: string) => {
      const media = Array.from(
        root.querySelectorAll<HTMLImageElement | HTMLVideoElement>(
          `[data-feel-load-group="${group}"]`,
        ),
      );

      media.forEach((element) => {
        const source = element.dataset.feelSrc;
        if (!source || element.getAttribute("src")) return;

        element.setAttribute("src", source);

        if (element instanceof HTMLVideoElement) {
          element.load();
          if (element.autoplay) {
            const playPromise = element.play();
            if (playPromise) playPromise.catch(() => {});
          }
        }
      });
    };

    if (!("IntersectionObserver" in window)) {
      sentinels.forEach((sentinel) => {
        const group = sentinel.dataset.feelLoadSentinel;
        if (group) activateGroup(group);
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const sentinel = entry.target as HTMLElement;
          const group = sentinel.dataset.feelLoadSentinel;
          if (group) activateGroup(group);
          observer.unobserve(sentinel);
        });
      },
      {
        root: scrollRoot,
        rootMargin: "40% 0px 40% 0px",
      },
    );

    sentinels.forEach((sentinel) => observer.observe(sentinel));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const loopContainers = Array.from(
      root.querySelectorAll<HTMLElement>(".feel-smooth-loop"),
    );

    const cleanups = loopContainers.map((container) => {
      const videos = Array.from(
        container.querySelectorAll<HTMLVideoElement>("video"),
      );

      if (videos.length !== 2) return () => {};

      const [videoA, videoB] = videos;
      const CROSSFADE_SECONDS = 0.9;
      let activeIndex = 0;
      let crossfading = false;
      let crossfadeStart = 0;
      let raf = 0;

      const safePlay = (video: HTMLVideoElement) => {
        const promise = video.play();
        if (promise) promise.catch(() => {});
      };

      const resetVideo = (video: HTMLVideoElement) => {
        video.pause();
        try {
          video.currentTime = 0;
        } catch {}
      };

      const start = () => {
        resetVideo(videoA);
        resetVideo(videoB);
        videoA.style.opacity = "1";
        videoB.style.opacity = "0";
        activeIndex = 0;
        crossfading = false;
        safePlay(videoA);
      };

      const tick = (now: number) => {
        const active = videos[activeIndex];
        const incoming = videos[1 - activeIndex];
        const duration =
          Number.isFinite(active.duration) && active.duration > 0
            ? active.duration
            : 8;

        if (
          !crossfading &&
          active.currentTime >= Math.max(0, duration - CROSSFADE_SECONDS)
        ) {
          crossfading = true;
          crossfadeStart = now;
          try {
            incoming.currentTime = 0;
          } catch {}
          incoming.style.opacity = "0";
          safePlay(incoming);
        }

        if (crossfading) {
          const progress = Math.min(
            1,
            (now - crossfadeStart) / (CROSSFADE_SECONDS * 1000),
          );
          const eased = progress * progress * (3 - 2 * progress);
          active.style.opacity = String(1 - eased);
          incoming.style.opacity = String(eased);

          if (progress >= 1) {
            resetVideo(active);
            active.style.opacity = "0";
            incoming.style.opacity = "1";
            activeIndex = 1 - activeIndex;
            crossfading = false;
          }
        }

        raf = requestAnimationFrame(tick);
      };

      start();
      raf = requestAnimationFrame(tick);

      return () => {
        cancelAnimationFrame(raf);
        resetVideo(videoA);
        resetVideo(videoB);
      };
    });

    return () => cleanups.forEach((cleanup) => cleanup());
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    const feelBackground = feelBackgroundRef.current;
    // Cuando FEEL se monta dentro del overlay de "Más allá del aula",
    // el body permanece bloqueado. En ese caso usamos el contenedor
    // desplazable del propio overlay como scroller de ScrollTrigger.
    const feelScrollRoot =
      root?.closest<HTMLElement>("[data-feel-scroll-root]") ?? null;
    const scrollTriggerScroller = feelScrollRoot ?? undefined;

    const externalScrollChevron =
      feelScrollRoot?.parentElement?.querySelector<HTMLElement>(".feel-scroll-chevron") ?? null;

    const setScrollIndicatorDirection = (direction: "down" | "up") => {
      if (!externalScrollChevron) return;

      externalScrollChevron.getAnimations().forEach((animation) => animation.cancel());
      externalScrollChevron.style.animation = "none";

      if (direction === "up") {
        externalScrollChevron.style.borderRight = "0";
        externalScrollChevron.style.borderBottom = "0";
        externalScrollChevron.style.borderLeft = "3px solid rgba(255, 255, 255, 0.96)";
        externalScrollChevron.style.borderTop = "3px solid rgba(255, 255, 255, 0.96)";

        externalScrollChevron.animate(
          [
            { opacity: 0.34, transform: "translateY(5px) rotate(45deg)" },
            { opacity: 1, transform: "translateY(-4px) rotate(45deg)" },
            { opacity: 0.34, transform: "translateY(5px) rotate(45deg)" },
          ],
          { duration: 1650, iterations: Infinity, easing: "ease-in-out" },
        );
      } else {
        externalScrollChevron.style.borderLeft = "0";
        externalScrollChevron.style.borderTop = "0";
        externalScrollChevron.style.borderRight = "3px solid rgba(255, 255, 255, 0.96)";
        externalScrollChevron.style.borderBottom = "3px solid rgba(255, 255, 255, 0.96)";

        externalScrollChevron.animate(
          [
            { opacity: 0.34, transform: "translateY(-3px) rotate(45deg)" },
            { opacity: 1, transform: "translateY(5px) rotate(45deg)" },
            { opacity: 0.34, transform: "translateY(-3px) rotate(45deg)" },
          ],
          { duration: 1650, iterations: Infinity, easing: "ease-in-out" },
        );
      }
    };

    setScrollIndicatorDirection("down");
    const heart = heartRef.current;
    const heartSource = heartSourceRef.current;
    const heartVisual = heartVisualRef.current;
    const heartParticlesCanvas = heartParticlesRef.current;
    const tree = treeRef.current;
    const treeImage = treeImageRef.current;
    const treeCanvas = treeCanvasRef.current;
    const eyebrow = eyebrowRef.current;
    const aula = aulaRef.current;
    const feel = feelRef.current;
    const feelTrailCanvas = feelTrailCanvasRef.current;
    const copy = copyRef.current;
    const lavender = lavenderRef.current;
    const lavenderCanvas = lavenderCanvasRef.current;
    const whitePanel = whitePanelRef.current;
    const sphereVideoWrap = sphereVideoWrapRef.current;
    const sphereVideo = sphereVideoRef.current;
    const sphereParticlesCanvas = sphereParticlesRef.current;
    const feel2Text = feel2TextRef.current;
    const feel3WhiteHole = feel3WhiteHoleRef.current;
    const feel3Layer = feel3LayerRef.current;
    const feel3MorphWrap = feel3MorphWrapRef.current;
    const feel3MorphSphere = feel3MorphSphereRef.current;
    const feel3MorphCube = feel3MorphCubeRef.current;
    const feel3Pixel = feel3PixelRef.current;
    const feel3Title = feel3TitleRef.current;
    const feel3Subtitle = feel3SubtitleRef.current;
    const feel3Body = feel3BodyRef.current;
    const feel3BalloonRig = feel3BalloonRigRef.current;
    const feel3BalloonVideo = feel3BalloonVideoRef.current;
    const feel3Sign = feel3SignRef.current;
    const feel3Curtain = feel3CurtainRef.current;
    const feel3ParticlesCanvas = feel3ParticlesRef.current;
    const feel4MorphWrap = feel4MorphWrapRef.current;
    const feel4MorphCube = feel4MorphCubeRef.current;
    const feel4MorphHeart = feel4MorphHeartRef.current;
    const feel4ParticlesCanvas = feel4ParticlesRef.current;

    if (
      !root ||
      !stage ||
      !heart ||
      !heartSource ||
      !heartVisual ||
      !heartParticlesCanvas ||
      !tree ||
      !treeImage ||
      !treeCanvas ||
      !eyebrow ||
      !aula ||
      !feel ||
      !feelTrailCanvas ||
      !copy ||
      !lavender ||
      !lavenderCanvas ||
      !whitePanel ||
      !sphereVideoWrap ||
      !sphereVideo ||
      !sphereParticlesCanvas ||
      !feel2Text ||
      !feel3WhiteHole ||
      !feel3Layer ||
      !feel3MorphWrap ||
      !feel3MorphSphere ||
      !feel3MorphCube ||
      !feel3Pixel ||
      !feel3Title ||
      !feel3Subtitle ||
      !feel3Body ||
      !feel3BalloonRig ||
      !feel3BalloonVideo ||
      !feel3Sign ||
      !feel3Curtain ||
      !feel3ParticlesCanvas ||
      !feel4MorphWrap ||
      !feel4MorphCube ||
      !feel4MorphHeart ||
      !feel4ParticlesCanvas
    ) {
      return;
    }

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const feelTracePaths = Array.from(
      root.querySelectorAll<SVGPathElement>(".feel-trace-path"),
    );

    const feel3CornerCube = feel3Layer.querySelector<HTMLElement>(
      ".feel3-corner-cube",
    );

    const feel4Layer = root.querySelector<HTMLElement>(".feel4-layer");
    const feel4Heart = root.querySelector<HTMLImageElement>(".feel4-heart");
    const feel4Trail = root.querySelector<HTMLImageElement>(".feel4-particles-bg");
    const feel4Cards = Array.from(
      root.querySelectorAll<HTMLElement>(".feel4-card"),
    );

    const feelTrailCtx = feelTrailCanvas.getContext("2d");
    const feelTrailPoints: FeelTrailPoint[] = [];
    const feelTrailParticles: FeelTrailParticle[] = [];
    const feelTrailState = {
      path: null as SVGPathElement | null,
      distance: 0,
      visible: false,
      lastEmitAt: 0,
      lastX: 0,
      lastY: 0,
    };

    // --- Lavanda WebGL ---------------------------------------------------
    // El video se usa como textura. El shader elimina el blanco y su halo
    // píxel por píxel, sin recortar ni engrosar las espigas. Además repetimos
    // horizontalmente la toma para que las plantas se perciban más pequeñas,
    // como en la referencia de Emotion Agency.
    const gl = lavenderCanvas.getContext("webgl", {
      alpha: true,
      premultipliedAlpha: false,
      antialias: true,
    });

    let glProgram: WebGLProgram | null = null;
    let glTexture: WebGLTexture | null = null;
    let glBuffer: WebGLBuffer | null = null;
    let glPosition = -1;
    let glVideoUniform: WebGLUniformLocation | null = null;
    let glResolutionUniform: WebGLUniformLocation | null = null;
    let glVideoSizeUniform: WebGLUniformLocation | null = null;
    let glRepeatUniform: WebGLUniformLocation | null = null;

    const compileShader = (type: number, source: string) => {
      if (!gl) return null;
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("FEEL lavender shader:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const initLavenderWebGL = () => {
      if (!gl) return;

      const vertex = compileShader(
        gl.VERTEX_SHADER,
        `
          attribute vec2 a_position;
          varying vec2 v_uv;
          void main() {
            v_uv = a_position * 0.5 + 0.5;
            gl_Position = vec4(a_position, 0.0, 1.0);
          }
        `,
      );

      const fragment = compileShader(
        gl.FRAGMENT_SHADER,
        `
          precision mediump float;
          varying vec2 v_uv;
          uniform sampler2D u_video;
          uniform vec2 u_resolution;
          uniform vec2 u_videoSize;
          uniform float u_repeatX;

          void main() {
            float tileWidth = u_resolution.x / u_repeatX;
            float tileHeight = tileWidth * (u_videoSize.y / u_videoSize.x);

            float yPx = v_uv.y * u_resolution.y;
            if (yPx > tileHeight) {
              gl_FragColor = vec4(0.0);
              return;
            }

            float tileX = fract(v_uv.x * u_repeatX);
            float tileY = yPx / tileHeight;
            vec2 uv = vec2(tileX, tileY);

            vec4 tex = texture2D(u_video, uv);
            vec3 c = tex.rgb;

            /*
              Key del blanco más estricto.
              El contorno claro es un píxel mezclado entre la hoja morada
              y el fondo blanco del MP4. Usamos dos señales:
              1) distancia al blanco;
              2) saturación/croma.
              Así eliminamos el halo sin engrosar las espigas.
            */
            float minC = min(c.r, min(c.g, c.b));
            float maxC = max(c.r, max(c.g, c.b));
            float key = 1.0 - minC;
            float chroma = maxC - minC;

            float alphaKey = smoothstep(0.085, 0.34, key);
            float alphaChroma = smoothstep(0.022, 0.110, chroma);
            float alpha = alphaKey * alphaChroma;

            // Matte despill ligeramente más fuerte, sin tocar geometría ni escala.
            vec3 clean = (c - vec3(1.0 - alpha)) / max(alpha, 0.058);
            clean = clamp(clean, 0.0, 1.0);

            // Reducir el halo claro conservando las puntas finas.
            float edge = 1.0 - smoothstep(0.58, 0.95, alpha);
            clean = mix(clean, clean * vec3(0.91, 0.69, 1.00), edge * 0.24);

            // Solo descartar residuo casi invisible.
            if (alpha < 0.030) {
              discard;
            }

            gl_FragColor = vec4(clean, alpha);
          }
        `,
      );

      if (!vertex || !fragment) return;

      glProgram = gl.createProgram();
      if (!glProgram) return;
      gl.attachShader(glProgram, vertex);
      gl.attachShader(glProgram, fragment);
      gl.linkProgram(glProgram);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);

      if (!gl.getProgramParameter(glProgram, gl.LINK_STATUS)) {
        console.error("FEEL lavender program:", gl.getProgramInfoLog(glProgram));
        return;
      }

      gl.useProgram(glProgram);
      glBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, glBuffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
        gl.STATIC_DRAW,
      );

      glPosition = gl.getAttribLocation(glProgram, "a_position");
      gl.enableVertexAttribArray(glPosition);
      gl.vertexAttribPointer(glPosition, 2, gl.FLOAT, false, 0, 0);

      glVideoUniform = gl.getUniformLocation(glProgram, "u_video");
      glResolutionUniform = gl.getUniformLocation(glProgram, "u_resolution");
      glVideoSizeUniform = gl.getUniformLocation(glProgram, "u_videoSize");
      glRepeatUniform = gl.getUniformLocation(glProgram, "u_repeatX");

      glTexture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, glTexture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.clearColor(0, 0, 0, 0);
    };

    const resizeLavenderWebGL = () => {
      if (!gl) return;
      const rect = lavenderCanvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(1, Math.round(rect.width * ratio));
      const height = Math.max(1, Math.round(rect.height * ratio));
      if (lavenderCanvas.width !== width || lavenderCanvas.height !== height) {
        lavenderCanvas.width = width;
        lavenderCanvas.height = height;
      }
      gl.viewport(0, 0, width, height);
    };

    const renderLavenderWebGL = () => {
      if (!gl || !glProgram || !glTexture) return;
      if (lavender.readyState < 2 || !lavender.videoWidth || !lavender.videoHeight) return;

      resizeLavenderWebGL();
      gl.useProgram(glProgram);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, glTexture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        lavender,
      );
      gl.uniform1i(glVideoUniform, 0);
      gl.uniform2f(glResolutionUniform, lavenderCanvas.width, lavenderCanvas.height);
      gl.uniform2f(glVideoSizeUniform, lavender.videoWidth, lavender.videoHeight);
      gl.uniform1f(glRepeatUniform, 3.70);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };

    initLavenderWebGL();
    lavender.play().catch(() => {});

    const renderHeart = () => {
      drawHeartWithoutPlate(heartSource, heartVisual);
    };

    if (heartSource.complete) renderHeart();
    else heartSource.addEventListener("load", renderHeart, { once: true });

    const heartParticles: HeartParticle[] = [];
    const sparkles: Sparkle[] = [];
    const sparklePoints: SparklePoint[] = [];

    const heartCtx = heartParticlesCanvas.getContext("2d");
    const treeCtx = treeCanvas.getContext("2d");
    const sphereParticlesCtx = sphereParticlesCanvas.getContext("2d");
    const feel3ParticlesCtx = feel3ParticlesCanvas.getContext("2d");
    const feel4ParticlesCtx = feel4ParticlesCanvas.getContext("2d");

    if (
      !heartCtx ||
      !treeCtx ||
      !sphereParticlesCtx ||
      !feel3ParticlesCtx ||
      !feel4ParticlesCtx
    ) return;

    const sphereParticles: SphereParticle[] = [];
    let sphereParticlesEnabled = false;

    const feel3Particles: Feel3Particle[] = [];
    let feel3ParticlesEnabled = false;
    let feel3CubeParticlesEnabled = false;
    let feel3IntroStarted = false;
    let feel3IntroTimeline: gsap.core.Timeline | null = null;
    let feel3SwayTimeline: gsap.core.Timeline | null = null;
    let sphereMotionTimeline: gsap.core.Timeline | null = null;

    const feel4Particles: Feel4Particle[] = [];
    let feel4HeartParticlesEnabled = false;
    let feel4TransitionStarted = false;
    let feel4TransitionTimeline: gsap.core.Timeline | null = null;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const treeSampler = document.createElement("canvas");
    const treeSamplerCtx = treeSampler.getContext("2d", {
      willReadFrequently: true,
    });

    const resizeCanvas = (
      canvas: HTMLCanvasElement,
      context: CanvasRenderingContext2D,
    ) => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const buildTreeSparkleMap = () => {
      if (!treeSamplerCtx) return;
      const rect = treeCanvas.getBoundingClientRect();
      const width = Math.max(1, Math.round(rect.width));
      const height = Math.max(1, Math.round(rect.height));
      if (!width || !height) return;
      if (!treeImage.naturalWidth || !treeImage.naturalHeight) return;

      treeSampler.width = width;
      treeSampler.height = height;
      treeSamplerCtx.clearRect(0, 0, width, height);
      treeSamplerCtx.drawImage(treeImage, 0, 0, width, height);

      const { data } = treeSamplerCtx.getImageData(0, 0, width, height);
      sparklePoints.length = 0;

      const step = width > 900 ? 5 : 4;

      for (let y = 6; y < height * 0.83; y += step) {
        for (let x = 6; x < width - 6; x += step) {
          const p = (y * width + x) * 4;
          const r = data[p];
          const g = data[p + 1];
          const b = data[p + 2];
          const a = data[p + 3];

          if (a < 132) continue;

          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);
          const brightness = (r + g + b) / 3;
          const chroma = max - min;
          const isFoliageTone = r + b > g + 34;
          const isTooDark = brightness < 48;

          if (!isFoliageTone || isTooDark || chroma < 16) continue;

          if (Math.random() < 0.22) {
            sparklePoints.push({ x, y });
          }
        }
      }
    };

    const resizeFeelTrailCanvas = () => {
      if (!feelTrailCtx) return;
      const rect = feelTrailCanvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      feelTrailCanvas.width = Math.max(1, Math.round(rect.width * ratio));
      feelTrailCanvas.height = Math.max(1, Math.round(rect.height * ratio));
      feelTrailCtx.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const resize = () => {
      resizeCanvas(heartParticlesCanvas, heartCtx);
      resizeCanvas(treeCanvas, treeCtx);
      resizeCanvas(sphereParticlesCanvas, sphereParticlesCtx);
      resizeCanvas(feel3ParticlesCanvas, feel3ParticlesCtx);
      resizeCanvas(feel4ParticlesCanvas, feel4ParticlesCtx);
      buildTreeSparkleMap();
      resizeLavenderWebGL();
      resizeFeelTrailCanvas();
    };

    const emitHeartParticles = () => {
      if (reduceMotion) return;

      const stageRect = stage.getBoundingClientRect();
      const heartRect = heart.getBoundingClientRect();

      const baseX =
        heartRect.left - stageRect.left + heartRect.width * 0.5;
      const baseY =
        heartRect.top - stageRect.top + heartRect.height * 0.68;

      const count = Math.round(random(12, 18));

      for (let i = 0; i < count; i += 1) {
        heartParticles.push({
          x: baseX + random(-heartRect.width * 0.12, heartRect.width * 0.12),
          y: baseY + random(-heartRect.height * 0.03, heartRect.height * 0.07),
          vx: random(-1.25, 1.25),
          vy: random(0.25, 1.05),
          gravity: random(0.018, 0.036),
          size: random(2.4, 6.5),
          alpha: random(0.55, 0.95),
          life: 0,
          maxLife: random(72, 120),
          hue: random(278, 322),
        });
      }
    };

    const emitSparkle = () => {
      if (reduceMotion || sparklePoints.length === 0) return;

      const bursts = Math.random() > 0.68 ? 2 : 1;

      for (let i = 0; i < bursts; i += 1) {
        const point = sparklePoints[Math.floor(Math.random() * sparklePoints.length)];
        sparkles.push({
          x: point.x + random(-2.2, 2.2),
          y: point.y + random(-2.2, 2.2),
          size: random(0.9, 2.6),
          alpha: random(0.42, 0.92),
          life: 0,
          maxLife: random(18, 40),
          hue: random(286, 322),
          glint: Math.random() > 0.62,
        });
      }
    };

    const onTreeReady = () => buildTreeSparkleMap();

    if (treeImage.complete) onTreeReady();
    else treeImage.addEventListener("load", onTreeReady, { once: true });

    const gsapContext = gsap.context(() => {
      gsap.set(feelBackground, { opacity: 1 });
      gsap.set([eyebrow, aula, feel, copy], { autoAlpha: 0 });
      gsap.set(tree, { xPercent: 2.2 });
      gsap.set(lavenderCanvas, { autoAlpha: 0, y: 10 });
      gsap.set(heart, { autoAlpha: 0, scale: 0.96 });

      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .to(lavenderCanvas, { autoAlpha: 1, y: 0, duration: 1.05 }, 0)
        .to(tree, { xPercent: 0, duration: 1 }, 0.18)
        .to(eyebrow, { autoAlpha: 1, duration: 0.55 }, 0.32)
        .fromTo(
          aula,
          { autoAlpha: 0, x: -24 },
          { autoAlpha: 1, x: 0, duration: 0.68 },
          0.46,
        )
        .fromTo(
          feel,
          { autoAlpha: 0, x: -14, scale: 0.985 },
          { autoAlpha: 1, x: 0, scale: 1, duration: 0.7 },
          0.56,
        )
        .fromTo(
          copy,
          { autoAlpha: 0, y: 18 },
          { autoAlpha: 1, y: 0, duration: 0.68 },
          0.76,
        )
        .to(heart, { autoAlpha: 1, scale: 1, duration: 0.65 }, 0.86);

      if (!reduceMotion) {
        gsap
          .timeline({
            repeat: -1,
            repeatDelay: 0.68,
            delay: 1.1,
          })
          .to(heart, {
            scale: 1.038,
            y: -2,
            duration: 0.18,
            ease: "power2.out",
          })
          .to(heart, {
            scale: 0.997,
            y: 0,
            duration: 0.2,
            ease: "power2.inOut",
          })
          .to(heart, {
            scale: 1.018,
            y: -1,
            duration: 0.14,
            ease: "power2.out",
          })
          .to(heart, {
            scale: 1,
            y: 0,
            duration: 0.26,
            ease: "power2.inOut",
          });
      }

      if (feelTracePaths.length && feelTrailCtx) {
        gsap.set(feelTracePaths, { opacity: 0 });

        if (!reduceMotion) {
          const trailTimeline = gsap.timeline({
            repeat: -1,
            repeatDelay: 1.6,
            delay: 1.35,
          });

          feelTracePaths.forEach((path, index) => {
            const length = path.getTotalLength();
            const travel = { distance: 0 };

            trailTimeline
              .call(
                () => {
                  feelTrailPoints.length = 0;
                  feelTrailParticles.length = 0;
                  feelTrailState.path = path;
                  feelTrailState.distance = 0;
                  feelTrailState.visible = true;
                  feelTrailState.lastEmitAt = 0;

                  const startPoint = path.getPointAtLength(0);
                  const startMatrix = path.getScreenCTM();
                  const canvasRect = feelTrailCanvas.getBoundingClientRect();

                  if (startMatrix) {
                    feelTrailState.lastX =
                      startPoint.x * startMatrix.a +
                      startPoint.y * startMatrix.c +
                      startMatrix.e -
                      canvasRect.left;
                    feelTrailState.lastY =
                      startPoint.x * startMatrix.b +
                      startPoint.y * startMatrix.d +
                      startMatrix.f -
                      canvasRect.top;
                  }
                },
                [],
                index === 0 ? 0 : ">+=0.28",
              )
              .to(travel, {
                distance: length,
                duration: index === 3 ? 10.8 : 12.6,
                ease: "sine.inOut",
                onUpdate: () => {
                  feelTrailState.distance = travel.distance;
                },
              })
              .call(() => {
                feelTrailState.visible = false;
              })
              .to({}, { duration: 0.72 });
          });
        }
      }

      const accent = root.querySelector<HTMLElement>(".feel-accent");
      const feel2Words = Array.from(
        feel2Text.querySelectorAll<HTMLElement>(".feel2-word"),
      );

      gsap.set(whitePanel, { xPercent: 100 });
      gsap.set(sphereVideoWrap, {
        left: "3.40%",
        top: "21.7%",
        width: "21.4%",
        opacity: 0,
        scale: 1,
      });
      gsap.set(feel2Words, { opacity: 0 });

      let sphereSequenceStarted = false;

      const resetSphereSequence = () => {
        sphereMotionTimeline?.kill();
        sphereMotionTimeline = null;
        sphereSequenceStarted = false;
        sphereParticlesEnabled = false;

        sphereVideo.pause();
        try {
          sphereVideo.currentTime = 0;
        } catch {}

        gsap.set(heart, {
          opacity: 1,
          scale: 1,
        });

        gsap.set(sphereVideoWrap, {
          opacity: 0,
          scale: 1,
          left: "3.40%",
          top: "21.7%",
          width: "21.4%",
        });
      };

      const playSphereSequence = () => {
        if (sphereSequenceStarted) return;
        sphereSequenceStarted = true;
        sphereParticlesEnabled = false;

        const stageRect = stage.getBoundingClientRect();
        const heartRect = heart.getBoundingClientRect();

        const startLeft = heartRect.left - stageRect.left;
        const startTop = heartRect.top - stageRect.top;
        const startWidth = heartRect.width;

        sphereVideo.pause();
        try {
          sphereVideo.currentTime = 0;
        } catch {}

        gsap.set(sphereVideoWrap, {
          left: startLeft,
          top: startTop,
          width: startWidth,
          opacity: 0,
          scale: 1,
        });

        sphereMotionTimeline = gsap.timeline({
          defaults: { ease: "sine.inOut" },
          onStart: () => {
            sphereVideo.play().catch(() => {});
          },
          onComplete: () => {
            if (sphereVideo.duration) {
              try {
                sphereVideo.currentTime = Math.max(0, sphereVideo.duration - 0.05);
              } catch {}
            }
            sphereVideo.pause();
            sphereParticlesEnabled = true;
          },
        });

        sphereMotionTimeline
          // Crossfade suave: el video nace exactamente encima del corazón.
          .to(
            sphereVideoWrap,
            {
              opacity: 1,
              duration: 0.45,
              ease: "sine.out",
            },
            0,
          )
          .to(
            heart,
            {
              opacity: 0,
              scale: 0.985,
              duration: 0.55,
              ease: "sine.inOut",
            },
            0.08,
          )
          // Trayectoria continua independiente del scroll.
          .to(
            sphereVideoWrap,
            {
              left: "79.65%",
              top: "-14.34%",
              width: "28.47%",
              duration: 4.05,
              ease: "sine.inOut",
            },
            0.10,
          )
          // Asentamiento suave al llegar a la esfera final.
          .to(
            sphereVideoWrap,
            {
              scale: 1.018,
              duration: 0.42,
              ease: "sine.out",
            },
            ">-0.18",
          )
          .to(
            sphereVideoWrap,
            {
              scale: 1,
              opacity: 1,
              duration: 0.75,
              ease: "sine.inOut",
            },
            ">",
          );
      };

      const horizontalTimeline = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        scrollTrigger: {
          trigger: root,
          scroller: scrollTriggerScroller,
          start: "top top",
          end: () => `+=${window.innerHeight * 2.05}`,
          scrub: 1.15,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const progress = self.progress;

            // El scroll sólo revela la segunda composición.
            // Cuando el panel blanco ya quedó en su lugar, la transformación
            // corazón -> esfera se dispara una sola vez y corre por tiempo.
            if (progress >= 0.43 && !sphereSequenceStarted) {
              playSphereSequence();
            }

            // Si el usuario vuelve claramente a la primera escena,
            // dejamos todo listo para poder reproducir de nuevo.
            if (progress < 0.30 && sphereSequenceStarted) {
              resetSphereSequence();
            }
          },
        },
      });

      horizontalTimeline
        .to(
          feelBackground,
          {
            opacity: 0,
            duration: 0.30,
            ease: "sine.inOut",
          },
          0.02,
        )
        .to(
          [eyebrow, accent, aula, feel, copy],
          {
            xPercent: -145,
            opacity: 0,
            duration: 0.30,
            stagger: 0.018,
          },
          0.02,
        )
        .to(
          tree,
          {
            left: "0%",
            width: "42.78%",
            xPercent: 0,
            duration: 0.36,
          },
          0.03,
        )
        .to(
          whitePanel,
          {
            xPercent: 0,
            duration: 0.34,
          },
          0.10,
        )
        .fromTo(
          feel2Words,
          {
            opacity: 0,
            y: (index: number) => Math.sin(index * 0.82) * 44,
            rotation: (index: number) => Math.sin(index * 0.66) * 4.5,
            skewY: (index: number) => Math.sin(index * 0.9) * 7,
          },
          {
            opacity: 1,
            y: 0,
            rotation: 0,
            skewY: 0,
            duration: 0.24,
            stagger: 0.012,
            ease: "sine.out",
          },
          0.52,
        );


      const feel3Lines = Array.from(
        feel3Body.querySelectorAll<HTMLElement>(".feel3-line"),
      );

      const feel3CurtainRows = Array.from(
        feel3Curtain.querySelectorAll<HTMLElement>(".feel3-curtain-row"),
      );

      const feel3PixelCells = Array.from(
        feel3Pixel.querySelectorAll<HTMLElement>(".feel3-pixel-cell"),
      );
      gsap.set(feel3WhiteHole, {
        opacity: 0,
        scale: 0,
        xPercent: -50,
        yPercent: -50,
      });

      gsap.set(feel3Layer, {
        clipPath: "none",
        opacity: 0,
      });

      gsap.set(feel3MorphWrap, {
        opacity: 0,
        left: "50%",
        top: "50%",
        xPercent: -50,
        yPercent: -50,
        width: "38vw",
        maxWidth: 570,
        scale: 1,
        rotation: 0,
      });

      gsap.set(feel3MorphSphere, {
        opacity: 1,
        scale: 1,
        rotation: 0,
        filter: "blur(0px) brightness(1)",
      });

      gsap.set(feel3MorphCube, {
        opacity: 0,
        scale: 0.52,
        rotation: -28,
        filter: "blur(10px) brightness(1.18)",
      });

      gsap.set(feel3Pixel, {
        opacity: 0,
        pointerEvents: "none",
      });

      gsap.set(feel3PixelCells, {
        opacity: 0,
        scale: 0.35,
      });

      if (feel3CornerCube) {
        gsap.set(feel3CornerCube, { opacity: 0 });
      }

      gsap.set([feel3Title, feel3Subtitle], {
        y: 170,
        opacity: 0,
      });

      gsap.set(feel3Lines, {
        color: "#c4add1",
      });

      gsap.set(feel3BalloonRig, {
        yPercent: 220,
        opacity: 0,
      });

      gsap.set(feel3Sign, {
        yPercent: 0,
        rotationZ: -2,
        rotationX: 0,
        opacity: 1,
      });

      gsap.set(feel3Curtain, {
        scaleY: 0,
        transformOrigin: "50% 0%",
        opacity: 0,
      });

      gsap.set(feel3CurtainRows, {
        y: -28,
        opacity: 0,
      });

      const resetFeel3 = () => {
        feel3IntroTimeline?.kill();
        feel3IntroTimeline = null;
        feel3SwayTimeline?.kill();
        feel3SwayTimeline = null;

        feel3IntroStarted = false;
        feel3ParticlesEnabled = false;
        feel3CubeParticlesEnabled = false;
        feel3Particles.length = 0;

        feel3BalloonVideo.pause();
        try {
          feel3BalloonVideo.currentTime = 0;
        } catch {}

        gsap.set(feel3WhiteHole, {
          opacity: 0,
          scale: 0,
          xPercent: -50,
          yPercent: -50,
        });

        gsap.set(feel3Layer, {
          clipPath: "none",
          opacity: 0,
        });

        gsap.set(feel3MorphWrap, {
          opacity: 0,
          left: "50%",
          top: "50%",
          xPercent: -50,
          yPercent: -50,
          width: "38vw",
          maxWidth: 570,
          scale: 1,
          rotation: 0,
        });

        gsap.set(feel3MorphSphere, {
          opacity: 1,
          scale: 1,
          rotation: 0,
          filter: "blur(0px) brightness(1)",
        });

        gsap.set(feel3MorphCube, {
          opacity: 0,
          scale: 0.52,
          rotation: -28,
          filter: "blur(10px) brightness(1.18)",
        });

        gsap.set(feel3Pixel, { opacity: 0 });

        gsap.set(feel3PixelCells, {
          opacity: 0,
          scale: 0.35,
        });

        if (feel3CornerCube) {
          gsap.set(feel3CornerCube, { opacity: 0 });
        }

        gsap.set([feel3Title, feel3Subtitle], {
          y: 170,
          opacity: 0,
          rotation: 0,
        });

        gsap.set(feel3Lines, {
          color: "#c4add1",
        });

        gsap.set(feel3BalloonRig, {
          yPercent: 220,
          opacity: 0,
        });

        gsap.set(feel3Sign, {
          yPercent: 0,
          rotationZ: -2,
          rotationX: 0,
          opacity: 1,
        });

        gsap.set(feel3Curtain, {
          scaleY: 0,
          transformOrigin: "50% 0%",
          opacity: 0,
        });

        gsap.set(feel3CurtainRows, {
          y: -28,
          opacity: 0,
        });

        gsap.set(sphereVideoWrap, {
          zIndex: 8,
          opacity: 1,
          xPercent: 0,
          yPercent: 0,
          left: "79.65%",
          top: "-14.34%",
          width: "28.47%",
          scale: 1,
        });

        gsap.set(feelBackground, { opacity: 1 });
        gsap.set([tree, whitePanel, feel2Text], {
          opacity: 1,
        });
      };

      const playFeel3Transition = () => {
        if (feel3IntroStarted) return;
        feel3IntroStarted = true;

        // Al comenzar la transición a FEEL 3, las partículas de la esfera
        // anterior dejan de emitirse de inmediato.
        sphereParticlesEnabled = false;
        sphereParticles.length = 0;
        sphereParticlesCtx.clearRect(
          0,
          0,
          sphereParticlesCanvas.getBoundingClientRect().width,
          sphereParticlesCanvas.getBoundingClientRect().height,
        );

        feel3IntroTimeline?.kill();
        feel3SwayTimeline?.kill();

        // La esfera debe permanecer visible mientras viaja al centro.
        gsap.set(sphereVideoWrap, {
          zIndex: 26,
          opacity: 1,
        });

        feel3IntroTimeline = gsap.timeline();

        // Colores aproximados del FEEL2 actual para formar el mosaico.
        feel3PixelCells.forEach((cell, index) => {
          const col = index % 12;
          const row = Math.floor(index / 12);
          const isLeft = col < 5;
          const isBottom = row >= 6;

          let background = isLeft
            ? "rgba(147, 85, 178, .98)"
            : "rgba(250, 248, 252, .99)";

          if (isBottom) {
            background = col < 5
              ? "rgba(82, 24, 105, .98)"
              : "rgba(96, 35, 118, .96)";
          } else if (isLeft && (index % 4 === 0 || index % 7 === 0)) {
            background = "rgba(185, 121, 220, .98)";
          }

          cell.style.background = background;
        });

        feel3IntroTimeline
          // 1) La esfera conserva el viaje ya aprobado hasta el centro.
          .to(
            sphereVideoWrap,
            {
              left: "50%",
              top: "50%",
              xPercent: -50,
              yPercent: -50,
              width: "38vw",
              maxWidth: 570,
              scale: 1.03,
              duration: 1.35,
              ease: "power2.inOut",
            },
            0,
          )

          // 2) En el centro hacemos el relevo esfera -> video esfera/cubo.
          .call(
            () => {
              const sphereRect = sphereVideoWrap.getBoundingClientRect();
              const stageRect = stage.getBoundingClientRect();

              gsap.set(feel3MorphWrap, {
                left: sphereRect.left - stageRect.left,
                top: sphereRect.top - stageRect.top,
                xPercent: 0,
                yPercent: 0,
                width: sphereRect.width,
                maxWidth: "none",
                opacity: 0,
                scale: 0.992,
                zIndex: 34,
              });

              gsap.set(feel3MorphSphere, {
                opacity: 1,
                scale: 1,
                rotation: 0,
                filter: "blur(0px) brightness(1)",
              });

              gsap.set(feel3MorphCube, {
                opacity: 0,
                scale: 0.52,
                rotation: -28,
                filter: "blur(10px) brightness(1.18)",
              });
            },
            [],
            1.26,
          )
          .to(
            feel3MorphWrap,
            {
              opacity: 1,
              scale: 1,
              duration: 0.58,
              ease: "sine.inOut",
            },
            1.28,
          )
          .to(
            sphereVideoWrap,
            {
              opacity: 0,
              scale: 1.015,
              duration: 0.58,
              ease: "sine.inOut",
            },
            1.30,
          )

          // 3) FEEL3 queda listo detrás del mosaico.
          .set(
            feel3Layer,
            {
              opacity: 1,
            },
            1.62,
          )

          // 4) FEEL2 se convierte visualmente en bloques/píxeles.
          .to(
            feel3Pixel,
            {
              opacity: 1,
              duration: 0.12,
            },
            1.72,
          )
          .to(
            feel3PixelCells,
            {
              opacity: 1,
              scale: 1,
              duration: 0.20,
              stagger: {
                amount: 0.42,
                grid: [8, 12],
                from: "random",
              },
              ease: "steps(2)",
            },
            1.72,
          )
          .to(
            [tree, whitePanel, feel2Text],
            {
              opacity: 0,
              duration: 0.28,
              stagger: 0.025,
              ease: "none",
            },
            1.90,
          )

          // 5) Los píxeles se retiran aleatoriamente y descubren FEEL3.
          .to(
            feel3PixelCells,
            {
              opacity: 0,
              scale: 0,
              duration: 0.34,
              stagger: {
                amount: 1.05,
                grid: [8, 12],
                from: "random",
              },
              ease: "power1.in",
            },
            2.12,
          )
          .to(
            feel3Pixel,
            {
              opacity: 0,
              duration: 0.12,
            },
            3.30,
          )

          // 6) Mientras desaparece FEEL2, el cubo viaja hacia su esquina.
          .call(
            () => {
              if (!feel3CornerCube) return;

              const cubeImg =
                feel3CornerCube.querySelector<HTMLElement>("img") ??
                feel3CornerCube;
              const cubeRect = cubeImg.getBoundingClientRect();
              const stageRect = stage.getBoundingClientRect();

              gsap.set(cubeImg, {
                rotation: 16,
                scale: 1,
              });

              // El mismo contenedor viaja hasta la esquina.
              gsap.to(feel3MorphWrap, {
                left: cubeRect.left - stageRect.left,
                top: cubeRect.top - stageRect.top,
                xPercent: 0,
                yPercent: 0,
                width: cubeRect.width,
                maxWidth: "none",
                rotation: 16,
                duration: 2.72,
                ease: "power2.inOut",
              });

              // Durante el trayecto, la esfera se disuelve mientras el cubo
              // nace con giro, escala y desenfoque: una transformación visual
              // continua sin depender de video.
              gsap.to(feel3MorphSphere, {
                opacity: 0,
                scale: 0.66,
                rotation: 24,
                filter: "blur(8px) brightness(1.16)",
                duration: 1.35,
                ease: "power2.in",
                delay: 0.24,
              });

              gsap.to(feel3MorphCube, {
                opacity: 1,
                scale: 1,
                rotation: 0,
                filter: "blur(0px) brightness(1)",
                duration: 1.55,
                ease: "back.out(1.25)",
                delay: 0.48,
              });
            },
            [],
            2.08,
          )
          // Pequeño pulso al terminar la metamorfosis.
          .to(
            feel3MorphWrap,
            {
              scale: 1.045,
              duration: 0.26,
              ease: "sine.out",
            },
            3.92,
          )
          .to(
            feel3MorphWrap,
            {
              scale: 1,
              duration: 0.34,
              ease: "sine.inOut",
            },
            4.18,
          )
          // Handoff final: como el morph ya es el mismo Cubo.webp,
          // el cruce con el cubo estático es prácticamente invisible.
          .to(
            feel3CornerCube,
            {
              opacity: 1,
              duration: 0.58,
              ease: "sine.inOut",
            },
            4.72,
          )
          .to(
            feel3MorphWrap,
            {
              opacity: 0,
              duration: 0.58,
              ease: "sine.inOut",
            },
            4.74,
          )
          .call(
            () => {
              feel3CubeParticlesEnabled = true;
            },
            [],
            5.18,
          )

          // 7) Título y subtítulo conservan la entrada que ya funcionaba.

          .fromTo(
            feel3Title,
            {
              y: 180,
              opacity: 0,
            },
            {
              y: 0,
              opacity: 1,
              duration: 1.05,
              ease: "back.out(1.9)",
            },
            5.48,
          )
          .fromTo(
            feel3Subtitle,
            {
              y: 155,
              opacity: 0,
            },
            {
              y: 0,
              opacity: 1,
              duration: 1.0,
              ease: "back.out(1.75)",
            },
            5.72,
          );

        // 6) El texto está compuesto en línea natural. Cada fragmento se
        //    oscurece en secuencia sin romper el párrafo.
        const readingStart = 6.80;

        feel3Lines.forEach((line, index) => {
          feel3IntroTimeline?.to(
            line,
            {
              color: "#3a0b58",
              duration: 0.82,
              ease: "sine.inOut",
            },
            readingStart + index * 0.84,
          );
        });

        const balloonStart =
          readingStart + Math.max(1, feel3Lines.length) * 0.84 + 0.62;

        // 7) Globo + letrero: el globo sube primero y el letrero lo sigue,
        //    como si realmente viniera jalándolo desde abajo.
        feel3IntroTimeline
          .call(
            () => {
              try {
                feel3BalloonVideo.currentTime = 0;
              } catch {}
              feel3BalloonVideo.play().catch(() => {});
              feel3ParticlesEnabled = true;
            },
            [],
            balloonStart,
          )
          // Globo y letrero nacen completamente fuera de pantalla.
          .fromTo(
            feel3BalloonRig,
            {
              yPercent: 220,
              opacity: 0,
            },
            {
              yPercent: 0,
              opacity: 1,
              duration: 2.85,
              ease: "power2.out",
            },
            balloonStart,
          )
          .to(
            feel3Sign,
            {
              rotationZ: 0,
              rotationX: 0,
              duration: 0.75,
              ease: "sine.out",
            },
            balloonStart + 2.15,
          )
          // Cuando ambos llegaron, baja primero el cristal como cortina.
          .to(
            feel3Curtain,
            {
              scaleY: 1,
              opacity: 1,
              duration: 1.0,
              ease: "power3.out",
            },
            balloonStart + 2.92,
          )
          // Y después cada característica cae separadamente hacia su lugar.
          .fromTo(
            feel3CurtainRows,
            {
              y: -28,
              opacity: 0,
            },
            {
              y: 0,
              opacity: 1,
              duration: 0.58,
              stagger: 0.24,
              ease: "back.out(1.35)",
            },
            balloonStart + 3.48,
          )
          .call(
            () => {
              if (feel3BalloonVideo.duration) {
                try {
                  feel3BalloonVideo.currentTime = Math.max(
                    0,
                    feel3BalloonVideo.duration - 0.05,
                  );
                } catch {}
              }
              feel3BalloonVideo.pause();

              // El cuadro de título conserva el movimiento suave solicitado.
              feel3SwayTimeline = gsap.timeline({
                repeat: -1,
                yoyo: true,
                defaults: { ease: "sine.inOut" },
              });

              feel3SwayTimeline
                .to(feel3Sign, {
                  rotationZ: 1.15,
                  rotationX: 2.1,
                  y: 2,
                  duration: 2.8,
                  transformPerspective: 900,
                  transformOrigin: "50% 0%",
                })
                .to(feel3Sign, {
                  rotationZ: -1.05,
                  rotationX: -1.8,
                  y: -2,
                  duration: 3.0,
                  transformPerspective: 900,
                  transformOrigin: "50% 0%",
                });
            },
            [],
            balloonStart + 4.45,
          );
      };

      ScrollTrigger.create({
        trigger: root,
        scroller: scrollTriggerScroller,
        start: () => `top+=${window.innerHeight * 2.42} top`,
        invalidateOnRefresh: true,
        onEnter: playFeel3Transition,
        onEnterBack: () => {
          if (!feel3IntroStarted) playFeel3Transition();
        },
        onLeaveBack: () => {
          resetFeel3();
          sphereParticlesEnabled = true;
        },
      });


      if (feel4Layer && feel4Heart && feel4Trail && feel4Cards.length === 3) {
        const [feel4CardLeft, feel4CardCenter, feel4CardRight] = feel4Cards;

        gsap.set(feel4Layer, { opacity: 0 });
        gsap.set(feel4Heart, {
          opacity: 0,
          scale: 0.96,
          x: -4,
          y: 3,
          rotation: 15,
          transformOrigin: "50% 50%",
        });
        gsap.set(feel4Trail, { opacity: 0 });

        // Los tres cuadros nacen centrados y superpuestos.
        gsap.set(feel4Cards, {
          position: "absolute",
          left: "50%",
          top: "0%",
          width: "31.0%",
          height: "100%",
          xPercent: -50,
          opacity: 0,
        });
        gsap.set(feel4CardCenter, {
          opacity: 0,
          zIndex: 3,
        });
        gsap.set([feel4CardLeft, feel4CardRight], {
          zIndex: 2,
        });

        gsap.set(feel4MorphWrap, {
          opacity: 0,
          scale: 1,
          rotation: 0,
        });
        gsap.set(feel4MorphCube, {
          opacity: 1,
          scale: 1,
          rotation: 16,
          filter: "blur(0px) brightness(1)",
        });
        gsap.set(feel4MorphHeart, {
          opacity: 0,
          scale: 0.58,
          rotation: -18,
          filter: "blur(10px) brightness(1.18)",
        });

        const resetFeel4 = () => {
          setScrollIndicatorDirection("down");
          feel4TransitionTimeline?.kill();
          feel4TransitionTimeline = null;
          feel4TransitionStarted = false;
          feel4HeartParticlesEnabled = false;
          feel4Particles.length = 0;

          gsap.set(feel4Layer, { opacity: 0 });
          gsap.set(feel4Heart, {
            opacity: 0,
            scale: 0.96,
            x: -4,
            y: 3,
            rotation: 15,
            transformOrigin: "50% 50%",
          });
          gsap.set(feel4Trail, { opacity: 0 });
          gsap.set(feel4MorphWrap, {
            opacity: 0,
            scale: 1,
            rotation: 0,
          });

          gsap.set(feel4Cards, {
            left: "50%",
            xPercent: -50,
            opacity: 0,
          });
          gsap.set(feel4CardCenter, {
            opacity: 0,
            zIndex: 3,
          });

          if (feel3CornerCube) {
            gsap.set(feel3CornerCube, { opacity: 1 });
          }

          gsap.set(feel3Layer, { opacity: 1 });
          feel3CubeParticlesEnabled = true;
        };

        const playFeel4Transition = () => {
          if (feel4TransitionStarted || !feel3CornerCube) return;
          feel4TransitionStarted = true;
          setScrollIndicatorDirection("up");

          feel3ParticlesEnabled = false;
          feel3CubeParticlesEnabled = false;
          feel3Particles.length = 0;

          const sourceImg =
            feel3CornerCube.querySelector<HTMLElement>("img") ??
            feel3CornerCube;
          const sourceRect = sourceImg.getBoundingClientRect();
          const stageRect = stage.getBoundingClientRect();

          const targetHeartRect = feel4Heart.getBoundingClientRect();

          gsap.set(feel4MorphWrap, {
            left: sourceRect.left - stageRect.left,
            top: sourceRect.top - stageRect.top,
            width: sourceRect.width,
            height: sourceRect.height,
            opacity: 1,
            zIndex: 38,
          });

          gsap.set(feel3CornerCube, { opacity: 0 });

          feel4TransitionTimeline = gsap.timeline({
            defaults: { ease: "power2.inOut" },
          });

          feel4TransitionTimeline
            // 1) Aún estamos visualmente en FEEL3:
            //    el cubo sale de la esquina, va al centro y CRECE.
            .to(
              feel4MorphWrap,
              {
                left: "50%",
                top: "50%",
                xPercent: -50,
                yPercent: -50,
                width: "31vw",
                height: "31vw",
                maxWidth: 470,
                maxHeight: 470,
                rotation: 0,
                scale: 1.06,
                duration: 1.42,
                ease: "power2.inOut",
              },
              0,
            )
            .to(
              feel4MorphWrap,
              {
                scale: 1,
                duration: 0.30,
                ease: "sine.inOut",
              },
              1.34,
            )

            // 2) Sólo después de llegar al centro cambiamos de FEEL3 a FEEL4.
            .to(
              feel3Layer,
              {
                opacity: 0,
                duration: 0.46,
                ease: "sine.inOut",
              },
              1.48,
            )
            .to(
              feel4Layer,
              {
                opacity: 1,
                duration: 0.46,
                ease: "sine.inOut",
              },
              1.48,
            )

            // 3) Durante el viaje centro -> esquina superior derecha,
            //    el cubo se transforma en corazón.
            .call(
              () => {
                gsap.to(feel4MorphCube, {
                  opacity: 0,
                  scale: 0.60,
                  rotation: 38,
                  filter: "blur(10px) brightness(1.15)",
                  duration: 1.42,
                  ease: "power2.in",
                });

                gsap.to(feel4MorphHeart, {
                  opacity: 1,
                  scale: 1,
                  rotation: 0,
                  filter: "blur(0px) brightness(1)",
                  duration: 1.62,
                  ease: "back.out(1.16)",
                  delay: 0.20,
                });
              },
              [],
              1.72,
            )

            .to(
              feel4MorphWrap,
              {
                left: targetHeartRect.left - stageRect.left,
                top: targetHeartRect.top - stageRect.top,
                xPercent: 0,
                yPercent: 0,
                width: targetHeartRect.width,
                height: targetHeartRect.height,
                maxWidth: "none",
                maxHeight: "none",
                rotation: 15,
                duration: 1.86,
                ease: "power2.inOut",
              },
              1.72,
            )

            // 4) El corazón ya está completo en su esquina:
            //    hacemos un handoff más suave al corazón fijo.
            .to(
              feel4Heart,
              {
                opacity: 1,
                scale: 1,
                x: 0,
                y: 0,
                duration: 0.82,
                ease: "sine.inOut",
              },
              3.14,
            )
            .to(
              feel4MorphWrap,
              {
                opacity: 0,
                scale: 1.025,
                duration: 0.82,
                ease: "sine.inOut",
              },
              3.18,
            )
            .to(
              feel4Heart,
              {
                scale: 1.018,
                duration: 0.22,
                ease: "sine.out",
              },
              3.94,
            )
            .to(
              feel4Heart,
              {
                scale: 1,
                duration: 0.28,
                ease: "sine.inOut",
              },
              4.16,
            )
            .call(
              () => {
                feel4HeartParticlesEnabled = true;
              },
              [],
              3.78,
            )

            // 5) Ya convertido en corazón, aparece suavemente la estela
            //    decorativa que está detrás de él.
            .to(
              feel4Trail,
              {
                opacity: 0.50,
                duration: 0.90,
                ease: "sine.inOut",
              },
              3.66,
            )

            // 6) Sólo después de terminar la estela soltamos las tarjetas:
            //    primero la central visible, luego los laterales se abren.
            // 6) El corazón ya llegó y quedó fijo en la esquina.
            //    Ahora aparece la tarjeta central.
            .to(
              feel4CardCenter,
              {
                opacity: 1,
                duration: 0.82,
                ease: "sine.inOut",
              },
              4.58,
            )
            .to(
              feel4CardCenter,
              {
                left: "34.5%",
                xPercent: 0,
                duration: 0.66,
                ease: "power2.out",
              },
              4.64,
            )
            // 7) Sólo después salen las otras dos tarjetas.
            .to(
              feel4CardLeft,
              {
                left: "0%",
                xPercent: 0,
                opacity: 1,
                duration: 1.00,
                ease: "power3.out",
              },
              5.08,
            )
            .to(
              feel4CardRight,
              {
                left: "69%",
                xPercent: 0,
                opacity: 1,
                duration: 1.00,
                ease: "power3.out",
              },
              5.08,
            );
        };

        ScrollTrigger.create({
          trigger: root,
          scroller: scrollTriggerScroller,
          start: () => `top+=${window.innerHeight * 3.10} top`,
          invalidateOnRefresh: true,
          onEnter: playFeel4Transition,
          onEnterBack: () => {
            if (!feel4TransitionStarted) playFeel4Transition();
          },
          onLeaveBack: resetFeel4,
        });
      }

    }, root);

    let raf = 0;
    let last = performance.now();
    let sparkleClock = 0;
    let nextSparkle = random(7, 14);

    const drawFeelTrail = (now: number) => {
      if (!feelTrailCtx) return;

      const rect = feelTrailCanvas.getBoundingClientRect();
      feelTrailCtx.clearRect(0, 0, rect.width, rect.height);

      const activePath = feelTrailState.path;
      if (activePath && feelTrailState.visible) {
        const localPoint = activePath.getPointAtLength(feelTrailState.distance);
        const matrix = activePath.getScreenCTM();

        if (matrix) {
          const screenX =
            localPoint.x * matrix.a + localPoint.y * matrix.c + matrix.e;
          const screenY =
            localPoint.x * matrix.b + localPoint.y * matrix.d + matrix.f;

          const x = screenX - rect.left;
          const y = screenY - rect.top;

          const moved = Math.hypot(x - feelTrailState.lastX, y - feelTrailState.lastY);
          if (moved > 0.8 || now - feelTrailState.lastEmitAt > 38) {
            feelTrailPoints.push({ x, y, born: now });
            feelTrailState.lastEmitAt = now;
            feelTrailState.lastX = x;
            feelTrailState.lastY = y;

            if (Math.random() < 0.16) {
              feelTrailParticles.push({
                x: x + random(-1.2, 1.2),
                y: y + random(-1.2, 1.2),
                vx: random(-0.07, 0.07),
                vy: random(-0.11, 0.03),
                born: now,
                life: random(520, 980),
                size: random(0.6, 1.35),
              });
            }
          }
        }
      }

      // Estela: aproximadamente 1.15 s de recorrido visible.
      while (feelTrailPoints.length && now - feelTrailPoints[0].born > 1150) {
        feelTrailPoints.shift();
      }

      if (feelTrailPoints.length > 1) {
        // Halo exterior etéreo.
        for (let pass = 0; pass < 2; pass += 1) {
          feelTrailCtx.beginPath();
          feelTrailPoints.forEach((p, i) => {
            if (i === 0) feelTrailCtx.moveTo(p.x, p.y);
            else feelTrailCtx.lineTo(p.x, p.y);
          });
          feelTrailCtx.lineCap = "round";
          feelTrailCtx.lineJoin = "round";
          feelTrailCtx.strokeStyle =
            pass === 0 ? "rgba(190,120,242,0.13)" : "rgba(224,184,255,0.28)";
          feelTrailCtx.lineWidth = pass === 0 ? 5.2 : 1.45;
          feelTrailCtx.shadowBlur = pass === 0 ? 9 : 4;
          feelTrailCtx.shadowColor =
            pass === 0 ? "rgba(172,91,228,0.34)" : "rgba(229,196,255,0.42)";
          feelTrailCtx.stroke();
        }

        // Desvanecer progresivamente la parte antigua de la estela.
        const fadeCount = Math.min(feelTrailPoints.length - 1, 18);
        for (let i = 0; i < fadeCount; i += 1) {
          const p0 = feelTrailPoints[i];
          const p1 = feelTrailPoints[i + 1];
          const alpha = (i / fadeCount) * 0.34;
          feelTrailCtx.beginPath();
          feelTrailCtx.moveTo(p0.x, p0.y);
          feelTrailCtx.lineTo(p1.x, p1.y);
          feelTrailCtx.strokeStyle = `rgba(145,92,182,${0.24 - alpha * 0.5})`;
          feelTrailCtx.lineWidth = 6;
          feelTrailCtx.shadowBlur = 0;
          feelTrailCtx.stroke();
        }

        const head = feelTrailPoints[feelTrailPoints.length - 1];

        // Cabeza: pequeña, suave, más "gota de luz" que láser.
        const glow = feelTrailCtx.createRadialGradient(
          head.x,
          head.y,
          0,
          head.x,
          head.y,
          8,
        );
        glow.addColorStop(0, "rgba(255,250,255,0.95)");
        glow.addColorStop(0.22, "rgba(226,184,255,0.72)");
        glow.addColorStop(0.58, "rgba(196,123,246,0.28)");
        glow.addColorStop(1, "rgba(196,123,246,0)");
        feelTrailCtx.fillStyle = glow;
        feelTrailCtx.beginPath();
        feelTrailCtx.arc(head.x, head.y, 8, 0, Math.PI * 2);
        feelTrailCtx.fill();
      }

      for (let i = feelTrailParticles.length - 1; i >= 0; i -= 1) {
        const p = feelTrailParticles[i];
        const age = now - p.born;
        if (age >= p.life) {
          feelTrailParticles.splice(i, 1);
          continue;
        }
        const t = age / p.life;
        p.x += p.vx;
        p.y += p.vy;
        const alpha = Math.sin(Math.PI * t) * 0.32;

        feelTrailCtx.beginPath();
        feelTrailCtx.fillStyle = `rgba(220,173,255,${alpha})`;
        feelTrailCtx.shadowBlur = 4;
        feelTrailCtx.shadowColor = `rgba(199,128,247,${alpha})`;
        feelTrailCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        feelTrailCtx.fill();
      }

      feelTrailCtx.shadowBlur = 0;
    };

    const draw = (now: number) => {
      const dt = Math.min(2, Math.max(0.5, (now - last) / 16.6667));
      last = now;

      const heartRect = heartParticlesCanvas.getBoundingClientRect();
      const treeRect = treeCanvas.getBoundingClientRect();

      heartCtx.clearRect(0, 0, heartRect.width, heartRect.height);
      treeCtx.clearRect(0, 0, treeRect.width, treeRect.height);

      heartParticles.length = 0;

      for (let i = heartParticles.length - 1; i >= 0; i -= 1) {
        const p = heartParticles[i];
        p.life += dt;
        p.vy += p.gravity * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;

        const progress = p.life / p.maxLife;
        const fade = Math.max(0, 1 - progress);

        heartCtx.beginPath();
        heartCtx.shadowBlur = 10;
        heartCtx.shadowColor = `hsla(${p.hue},95%,76%,${fade * 0.65})`;
        heartCtx.fillStyle = `hsla(${p.hue},95%,75%,${p.alpha * fade})`;
        heartCtx.arc(
          p.x,
          p.y,
          p.size * (0.72 + progress * 0.42),
          0,
          Math.PI * 2,
        );
        heartCtx.fill();

        if (p.life >= p.maxLife || p.y > heartRect.height + 20) {
          heartParticles.splice(i, 1);
        }
      }

      sparkleClock += dt;

      if (!reduceMotion && sparkleClock >= nextSparkle) {
        sparkleClock = 0;
        nextSparkle = random(6, 14);
        emitSparkle();
      }

      treeCtx.save();
      treeCtx.globalCompositeOperation = "screen";

      for (let i = sparkles.length - 1; i >= 0; i -= 1) {
        const s = sparkles[i];
        s.life += dt;

        const progress = Math.min(1, s.life / s.maxLife);
        const envelope = Math.sin(Math.PI * progress);
        const alpha = s.alpha * envelope;
        const size = s.size * (0.9 + envelope * 0.7);

        treeCtx.save();
        treeCtx.translate(s.x, s.y);
        treeCtx.shadowBlur = 10;
        treeCtx.shadowColor = `hsla(${s.hue},100%,84%,${alpha * 0.95})`;

        treeCtx.beginPath();
        treeCtx.fillStyle = `hsla(${s.hue},100%,88%,${alpha})`;
        treeCtx.arc(0, 0, Math.max(0.8, size), 0, Math.PI * 2);
        treeCtx.fill();

        if (s.glint) {
          treeCtx.strokeStyle = `hsla(${s.hue},100%,96%,${alpha * 0.82})`;
          treeCtx.lineWidth = 0.85;
          treeCtx.beginPath();
          treeCtx.moveTo(-size * 1.2, 0);
          treeCtx.lineTo(size * 1.2, 0);
          treeCtx.moveTo(0, -size * 1.2);
          treeCtx.lineTo(0, size * 1.2);
          treeCtx.stroke();
        }

        treeCtx.restore();

        if (s.life >= s.maxLife) {
          sparkles.splice(i, 1);
        }
      }

      treeCtx.restore();
      drawFeelTrail(now);

      const sphereRect = sphereVideoWrap.getBoundingClientRect();
      const stageRect = stage.getBoundingClientRect();
      const sphereCanvasRect = sphereParticlesCanvas.getBoundingClientRect();

      sphereParticlesCtx.clearRect(
        0,
        0,
        sphereCanvasRect.width,
        sphereCanvasRect.height,
      );

      if (sphereParticlesEnabled && Math.random() < 0.40) {
        const originX =
          sphereRect.left - stageRect.left + sphereRect.width * random(0.34, 0.66);
        const originY =
          sphereRect.top - stageRect.top + sphereRect.height * random(0.54, 0.76);

        sphereParticles.push({
          x: originX,
          y: originY,
          vx: random(-0.28, 0.16),
          vy: random(0.42, 0.92),
          gravity: random(0.009, 0.017),
          size: random(1.0, 2.8),
          alpha: random(0.24, 0.55),
          life: 0,
          maxLife: random(210, 330),
        });
      }

      for (let i = sphereParticles.length - 1; i >= 0; i -= 1) {
        const p = sphereParticles[i];
        p.life += dt;
        p.vy += p.gravity * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;

        const progress = p.life / p.maxLife;
        const fade = Math.max(0, 1 - progress);

        sphereParticlesCtx.beginPath();
        sphereParticlesCtx.fillStyle =
          `rgba(205,145,250,${p.alpha * fade})`;
        sphereParticlesCtx.shadowBlur = 8;
        sphereParticlesCtx.shadowColor =
          `rgba(188,105,242,${0.30 * fade})`;
        sphereParticlesCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        sphereParticlesCtx.fill();

        if (
          p.life >= p.maxLife ||
          p.y > sphereCanvasRect.height - 20
        ) {
          sphereParticles.splice(i, 1);
        }
      }

      sphereParticlesCtx.shadowBlur = 0;

      const feel3CanvasRect = feel3ParticlesCanvas.getBoundingClientRect();
      feel3ParticlesCtx.clearRect(
        0,
        0,
        feel3CanvasRect.width,
        feel3CanvasRect.height,
      );

      const stageRectForFeel3 = stage.getBoundingClientRect();

      if (feel3ParticlesEnabled) {
        const rigRect = feel3BalloonRig.getBoundingClientRect();

        if (Math.random() < 0.48) {
          const count = Math.random() > 0.78 ? 2 : 1;
          for (let n = 0; n < count; n += 1) {
            feel3Particles.push({
              x:
                rigRect.left -
                stageRectForFeel3.left +
                rigRect.width * random(0.34, 0.66),
              y:
                rigRect.top -
                stageRectForFeel3.top +
                rigRect.height * random(0.18, 0.30),
              vx: random(-0.22, 0.22),
              vy: random(0.45, 0.9),
              gravity: random(0.007, 0.015),
              size: random(0.9, 2.5),
              alpha: random(0.20, 0.52),
              life: 0,
              maxLife: random(210, 360),
            });
          }
        }
      }

      if (feel3CubeParticlesEnabled && feel3CornerCube) {
        const cubeImg =
          feel3CornerCube.querySelector<HTMLElement>("img") ??
          feel3CornerCube;
        const cubeRect = cubeImg.getBoundingClientRect();

        if (Math.random() < 0.34) {
          const count = Math.random() > 0.84 ? 2 : 1;

          for (let n = 0; n < count; n += 1) {
            feel3Particles.push({
              x:
                cubeRect.left -
                stageRectForFeel3.left +
                cubeRect.width * random(0.28, 0.72),
              y:
                cubeRect.top -
                stageRectForFeel3.top +
                cubeRect.height * random(0.58, 0.82),
              vx: random(-0.16, 0.16),
              vy: random(0.34, 0.68),
              gravity: random(0.008, 0.014),
              size: random(0.8, 2.0),
              alpha: random(0.16, 0.40),
              life: 0,
              maxLife: random(260, 430),
            });
          }
        }
      }

      for (let i = feel3Particles.length - 1; i >= 0; i -= 1) {
        const p = feel3Particles[i];
        p.life += dt;
        p.vy += p.gravity * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;

        const progress = p.life / p.maxLife;
        const fade = Math.max(0, 1 - progress);

        feel3ParticlesCtx.beginPath();
        feel3ParticlesCtx.fillStyle =
          `rgba(213,159,255,${p.alpha * fade})`;
        feel3ParticlesCtx.shadowBlur = 7;
        feel3ParticlesCtx.shadowColor =
          `rgba(184,102,238,${0.30 * fade})`;
        feel3ParticlesCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        feel3ParticlesCtx.fill();

        if (
          p.life >= p.maxLife ||
          p.y > feel3CanvasRect.height - 18
        ) {
          feel3Particles.splice(i, 1);
        }
      }

      feel3ParticlesCtx.shadowBlur = 0;

      const feel4CanvasRect = feel4ParticlesCanvas.getBoundingClientRect();
      feel4ParticlesCtx.clearRect(
        0,
        0,
        feel4CanvasRect.width,
        feel4CanvasRect.height,
      );

      if (feel4HeartParticlesEnabled && feel4Heart) {
        const heartRect = feel4Heart.getBoundingClientRect();
        const stageRect = stage.getBoundingClientRect();

        if (Math.random() < 0.40) {
          const count = Math.random() > 0.82 ? 2 : 1;

          for (let n = 0; n < count; n += 1) {
            feel4Particles.push({
              x:
                heartRect.left -
                stageRect.left +
                heartRect.width * random(0.30, 0.70),
              y:
                heartRect.top -
                stageRect.top +
                heartRect.height * random(0.55, 0.80),
              vx: random(-0.18, 0.18),
              vy: random(0.38, 0.74),
              gravity: random(0.008, 0.015),
              size: random(0.9, 2.4),
              alpha: random(0.18, 0.46),
              life: 0,
              maxLife: random(260, 430),
            });
          }
        }
      }

      for (let i = feel4Particles.length - 1; i >= 0; i -= 1) {
        const p = feel4Particles[i];
        p.life += dt;
        p.vy += p.gravity * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;

        const progress = p.life / p.maxLife;
        const fade = Math.max(0, 1 - progress);

        feel4ParticlesCtx.beginPath();
        feel4ParticlesCtx.fillStyle =
          `rgba(220,166,255,${p.alpha * fade})`;
        feel4ParticlesCtx.shadowBlur = 7;
        feel4ParticlesCtx.shadowColor =
          `rgba(192,113,242,${0.30 * fade})`;
        feel4ParticlesCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        feel4ParticlesCtx.fill();

        if (
          p.life >= p.maxLife ||
          p.y > feel4CanvasRect.height - 18
        ) {
          feel4Particles.splice(i, 1);
        }
      }

      feel4ParticlesCtx.shadowBlur = 0;
      renderLavenderWebGL();
      raf = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);

    if (!reduceMotion) {
      raf = requestAnimationFrame(draw);
    }

    return () => {
      heartSource.removeEventListener("load", renderHeart);
      treeImage.removeEventListener("load", onTreeReady);
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
      if (gl) {
        if (glTexture) gl.deleteTexture(glTexture);
        if (glBuffer) gl.deleteBuffer(glBuffer);
        if (glProgram) gl.deleteProgram(glProgram);
      }
      sphereMotionTimeline?.kill();
      feel3IntroTimeline?.kill();
      feel3SwayTimeline?.kill();
      sphereParticlesEnabled = false;
      feel3ParticlesEnabled = false;
      feel3CubeParticlesEnabled = false;
      feel4HeartParticlesEnabled = false;
      feel4TransitionTimeline?.kill();
      externalScrollChevron?.getAnimations().forEach((animation) => animation.cancel());
      if (externalScrollChevron) {
        externalScrollChevron.removeAttribute("style");
      }
      sphereVideo.pause();
      feel3BalloonVideo.pause();
      gsapContext.revert();
    };
  }, []);

  return (
    <section ref={rootRef} className="feel-hero" aria-labelledby="feel-title">
      <span
        className="feel-load-sentinel feel-load-sentinel-2"
        data-feel-load-sentinel="feel2"
        aria-hidden="true"
      />
      <span
        className="feel-load-sentinel feel-load-sentinel-3"
        data-feel-load-sentinel="feel3"
        aria-hidden="true"
      />
      <span
        className="feel-load-sentinel feel-load-sentinel-4"
        data-feel-load-sentinel="feel4"
        aria-hidden="true"
      />
      <style>{`
        .feel-hero {
          position: relative;
          width: 100%;
          height: 560svh;
          min-height: 3800px;
          /* IMPORTANTE:
             overflow:hidden convertía FEEL en un contenedor de scroll y rompía
             el sticky. Así la página bajaba físicamente en vez de mantener la
             escena fija mientras el scroll controla el movimiento horizontal. */
          overflow: clip;
          isolation: isolate;
          background:
            radial-gradient(
              ellipse 49% 78% at 67.5% 35%,
              #b8a6ee 0%,
              #a077c7 50%,
              #8847a0 100%
            );
        }

        .feel-stage {
          position: sticky;
          top: 0;
          width: 100%;
          height: 100svh;
          min-height: 680px;
          overflow: hidden;
        }

        .feel-video-background {
          position: absolute;
          inset: 0;
          z-index: 0;
          overflow: hidden;
          pointer-events: none;
          background: #895b8a;
          will-change: opacity;
        }

        .feel-video-background video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          display: block;
          pointer-events: none;
          will-change: opacity;
        }

        .feel-video-background video + video {
          opacity: 0;
        }

        .feel-eyebrow {
          position: absolute;
          z-index: 8;
          left: 3.6806%;
          top: 7.3%;
          margin: 0;
          color: #fff;
          font-family: "Outfit", sans-serif;
          font-size: clamp(16px, 1.3889vw, 26px);
          font-weight: 600;
          line-height: 1.12;
          letter-spacing: .08em;
          white-space: nowrap;
        }

        .feel-accent {
          position: absolute;
          z-index: 8;
          left: 3.6806%;
          top: 14.7%;
          width: 1.1806%;
          height: 11.4474%;
          background: #4f1367;
        }

        .feel-aula {
          position: absolute;
          z-index: 8;
          margin: 0;
          color: #fff;
          font-family: "Fredoka", sans-serif;
          line-height: .9;
          white-space: nowrap;
          text-shadow: 0 4px 4px rgba(0,0,0,.25);
        }

        .feel-aula {
          left: 6.6667%;
          top: 13.6%;
          font-size: clamp(64px, 6.6667vw, 126px);
          font-weight: 600;
          letter-spacing: .08em;
        }

        .feel-feel {
          position: absolute;
          z-index: 8;
          left: 27.9861%;
          top: 13.6%;
          width: clamp(285px, 26vw, 500px);
          overflow: visible;
          filter: drop-shadow(0 4px 4px rgba(0,0,0,.25));
          will-change: transform, opacity;
        }

        .feel-feel-svg {
          display: block;
          width: 100%;
          height: auto;
          overflow: visible;
        }

        .feel-load-sentinel {
          position: absolute;
          left: 0;
          width: 1px;
          height: 1px;
          pointer-events: none;
          opacity: 0;
        }

        .feel-load-sentinel-2 { top: 150svh; }
        .feel-load-sentinel-3 { top: 260svh; }
        .feel-load-sentinel-4 { top: 430svh; }

        .feel-base-path {
          fill: #ffffff;
        }

        .feel-trace-path {
          fill: none;
          stroke: transparent;
          stroke-width: 1px;
          opacity: 0;
          pointer-events: none;
        }

        .feel-trail-canvas {
          position: absolute;
          z-index: 3;
          inset: 0;
          width: 100%;
          height: 100%;
          overflow: visible;
          pointer-events: none;
        }

        .feel-copy {
          position: absolute;
          z-index: 8;
          left: 23.4028%;
          top: 32.3%;
          width: 29.375%;
          margin: 0;
          color: #fff;
          font-family: "Outfit", sans-serif;
          font-size: clamp(17px, 1.5278vw, 28px);
          font-weight: 400;
          line-height: 1.36;
        }

        .feel-heart-zone {
          position: absolute;
          z-index: 7;
          left: 1.6%;
          top: 21.7%;
          width: 23.6%;
          height: 54%;
          overflow: visible;
          pointer-events: none;
        }

        .feel-heart {
          position: absolute;
          z-index: 2;
          left: 7.65%;
          top: 8.65%;
          width: 85.9%;
          aspect-ratio: 1;
          transform-origin: 50% 52%;
          will-change: transform;
        }

        .feel-heart-source {
          position: absolute;
          width: 1px;
          height: 1px;
          opacity: 0;
          pointer-events: none;
        }

        .feel-heart-visual {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: contain;
          filter: drop-shadow(0 8px 18px rgba(68,0,102,.20));
        }

        .feel-heart-particles {
          position: absolute;
          z-index: 9;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          overflow: visible;
        }

        .feel-tree {
          position: absolute;
          z-index: 5;
          left: 64.6528%;
          top: 0;
          width: 42.7778%;
          height: 100%;
          overflow: visible;
          pointer-events: none;
          will-change: transform, opacity;
        }

        .feel-tree img {
          position: absolute;
          left: 0;
          top: -8.8158%;
          width: 100%;
          height: 121.7105%;
          display: block;
          object-fit: contain;
          object-position: left top;
        }

        .feel-tree-sparkles {
          position: absolute;
          z-index: 2;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .feel-lavender {
          position: absolute;
          z-index: 30;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          overflow: hidden;
          pointer-events: none;
        }

        .feel-lavender-canvas {
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          width: 100%;
          height: 100%;
          margin: 0;
          display: block;
          pointer-events: none;
        }

        .feel-lavender-source {
          position: absolute;
          width: 1px;
          height: 1px;
          opacity: 0;
          pointer-events: none;
        }


        .feel2-white-panel {
          position: absolute;
          z-index: 4;
          left: 42.78%;
          top: 0;
          width: 57.22%;
          height: 100%;
          background: #ffffff;
          pointer-events: none;
          will-change: transform;
        }

        .feel2-text {
          position: absolute;
          z-index: 8;
          left: 51.60%;
          top: 31.45%;
          width: 43.33%;
          margin: 0;
          color: #3a0b58;
          font-family: "Outfit", sans-serif;
          font-size: clamp(24px, 2.5vw, 36px);
          font-weight: 400;
          line-height: 1.5556;
          pointer-events: none;
        }

        .feel2-word {
          display: inline-block;
          transform-origin: 50% 70%;
          will-change: transform, opacity;
        }

        .feel2-strong {
          font-weight: 600;
        }

        .feel2-sphere-wrap {
          position: absolute;
          z-index: 8;
          aspect-ratio: 1;
          overflow: visible;
          pointer-events: none;
          will-change: left, top, width, opacity;
        }

        .feel2-sphere-video {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: contain;
          opacity: 1;
          transition: opacity .45s ease;
          will-change: opacity;
        }

        .feel2-sphere-particles {
          position: absolute;
          z-index: 9;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }


        .feel3-morph-wrap {
          position: absolute;
          z-index: 34;
          aspect-ratio: 1;
          pointer-events: none;
          overflow: visible;
          isolation: isolate;
          will-change: left, top, width, opacity, transform;
        }

        .feel3-morph-image {
          position: absolute;
          inset: 0;
          display: block;
          width: 100%;
          height: 100%;
          object-fit: contain;
          transform-origin: 50% 50%;
          will-change: opacity, transform, filter;
        }

        .feel3-morph-cube {
          opacity: 0;
        }

        .feel3-pixel-transition {
          position: absolute;
          z-index: 33;
          inset: 0;
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          grid-template-rows: repeat(8, 1fr);
          pointer-events: none;
          overflow: hidden;
          opacity: 0;
        }

        .feel3-pixel-cell {
          width: 102%;
          height: 102%;
          transform-origin: 50% 50%;
          will-change: transform, opacity;
        }

        .feel3-white-hole {
          position: absolute;
          z-index: 27;
          left: 50%;
          top: 50%;
          width: min(19vw, 280px);
          aspect-ratio: 1;
          border-radius: 50%;
          background: #ffffff;
          opacity: 0;
          pointer-events: none;
          transform-origin: 50% 50%;
          will-change: transform, opacity;
        }

        .feel3-layer {
          position: absolute;
          z-index: 28;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
          background:
            radial-gradient(
              ellipse 49% 78% at 67.5% 35%,
              #b8a6ee 0%,
              #a077c7 50%,
              #8847a0 100%
            );
          clip-path: circle(0% at 50% 50%);
          will-change: clip-path;
        }

        .feel-section-video-background {
          position: absolute;
          inset: 0;
          z-index: 0;
          overflow: hidden;
          pointer-events: none;
        }

        .feel-section-video-background video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
          object-position: center;
          pointer-events: none;
          will-change: opacity, transform;
        }

        .feel-section-video-background video + video {
          opacity: 0;
        }

        /* FEEL3: espejo horizontal para que el flujo visual cambie respecto a FEEL1. */
        .feel3-video-background video {
          transform: scaleX(-1);
        }

        /* FEEL4: espejo vertical. */
        .feel4-video-background video {
          transform: scaleY(-1);
        }

        .feel3-branch {
          position: absolute;
          z-index: 2;
          left: 0;
          top: -0.7895%;
          width: 49.0278%;
          height: 52.2368%;
          object-fit: cover;
          object-position: left top;
          opacity: .5;
          pointer-events: none;
          user-select: none;
        }

        .feel3-corner-cube {
          position: absolute;
          z-index: 2;
          left: 76.7361%;
          top: -25.7895%;
          width: 37.1069%;
          aspect-ratio: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
          user-select: none;
        }

        .feel3-corner-cube img {
          width: 80.85%;
          height: 80.85%;
          object-fit: contain;
          transform: rotate(16deg);
          filter: drop-shadow(0 8px 18px rgba(65, 0, 92, .14));
        }

        .feel3-title {
          position: absolute;
          z-index: 4;
          left: 5.2083%;
          top: 9.8684%;
          margin: 0;
          color: #ffffff;
          font-family: "Fredoka", sans-serif;
          font-size: clamp(34px, 3.3333vw, 58px);
          font-weight: 600;
          line-height: 1.1667;
          white-space: nowrap;
          text-shadow: 0 4px 4px rgba(0,0,0,.25);
          will-change: transform, opacity;
        }

        .feel3-subtitle {
          position: absolute;
          z-index: 4;
          left: 5.2083%;
          top: 19.0789%;
          width: 60.8333%;
          margin: 0;
          color: #ffffff;
          font-family: "Outfit", sans-serif;
          font-size: clamp(23px, 2.5vw, 38px);
          font-weight: 400;
          line-height: 1.5556;
          will-change: transform, opacity;
        }

        .feel3-subtitle strong {
          font-weight: 600;
        }

        .feel3-body {
          position: absolute;
          z-index: 4;
          left: 5.2083%;
          top: 29.8684%;
          width: 51.6667%;
          margin: 0;
          color: #c4add1;
          font-family: "Outfit", sans-serif;
          font-size: clamp(22px, 2.5vw, 38px);
          font-weight: 400;
          line-height: 1.5556;
        }

        .feel3-line {
          display: inline;
          color: #c4add1;
          transition: color .35s ease;
        }

        .feel3-body-strong {
          font-weight: 600;
        }

        .feel3-balloon-rig {
          position: absolute;
          z-index: 8;
          left: 60.5556%;
          top: 11.5789%;
          width: 37.8472%;
          aspect-ratio: 1;
          opacity: 1;
          pointer-events: none;
          will-change: transform, opacity;
        }

        .feel3-balloon-video {
          position: absolute;
          z-index: 3;
          left: 27.71%;
          top: 0;
          width: 38.35%;
          aspect-ratio: 1;
          object-fit: contain;
          display: block;
        }

        .feel3-sign {
          position: absolute;
          z-index: 8;
          left: 0;
          top: 38.35%;
          width: 100%;
          height: 9.17%;
          padding: 0 24px;
          box-sizing: border-box;
          border-radius: 20px;
          background:
            linear-gradient(
              180deg,
              rgba(255,255,255,.14) 0%,
              rgba(83,24,112,.20) 100%
            );
          border: 1px solid rgba(255,255,255,.20);
          -webkit-backdrop-filter: blur(16px) saturate(135%);
          backdrop-filter: blur(16px) saturate(135%);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,.22),
            inset 0 -1px 0 rgba(72,10,99,.14),
            0 10px 28px rgba(55,0,80,.12);
          color: #ffffff;
          font-family: "Patrick Hand", cursive;
          font-size: clamp(18px, 1.6667vw, 26px);
          line-height: 1;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          transform-style: preserve-3d;
          will-change: transform;
        }

        .feel3-curtain {
          position: absolute;
          z-index: 7;
          left: -0.73%;
          top: 49.91%;
          width: 100.73%;
          height: 39.27%;
          border-radius: 20px;
          background:
            linear-gradient(
              180deg,
              rgba(255,255,255,.16) 0%,
              rgba(191,145,242,.16) 48%,
              rgba(126,70,169,.16) 100%
            );
          border: 1px solid rgba(255,255,255,.22);
          -webkit-backdrop-filter: blur(18px) saturate(140%);
          backdrop-filter: blur(18px) saturate(140%);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,.26),
            inset 0 -1px 0 rgba(70,12,96,.10),
            0 14px 34px rgba(55,0,80,.10);
          overflow: hidden;
          transform-origin: 50% 0%;
          will-change: transform, opacity;
        }

        .feel3-curtain-row {
          position: absolute;
          left: 3.46%;
          width: 93%;
          min-height: 50px;
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .feel3-curtain-row:nth-child(1) { top: 6.07%; }
        .feel3-curtain-row:nth-child(2) { top: 35.05%; }
        .feel3-curtain-row:nth-child(3) { top: 63.55%; }

        .feel3-curtain-row:nth-child(2)::before,
        .feel3-curtain-row:nth-child(3)::before {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          top: -10px;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255,255,255,.18),
            transparent
          );
        }

        .feel3-curtain-icon {
          flex: 0 0 50px;
          width: 50px;
          height: 50px;
          object-fit: contain;
          filter: drop-shadow(0 4px 4px rgba(0,0,0,.25));
        }

        .feel3-curtain-text {
          margin: 0;
          flex: 1 1 auto;
          max-width: calc(100% - 64px);
          color: #3a0b58;
          font-family: "Patrick Hand", cursive;
          font-size: clamp(15px, 1.25vw, 20px);
          line-height: 1.14;
        }

        .feel3-curtain-row:nth-child(1) .feel3-curtain-text,
        .feel3-curtain-row:nth-child(2) .feel3-curtain-text {
          white-space: nowrap;
        }

        .feel3-particles {
          position: absolute;
          z-index: 6;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }


        .feel4-morph-wrap {
          position: absolute;
          z-index: 38;
          pointer-events: none;
          transform-origin: 50% 50%;
          will-change: left, top, width, height, opacity, transform;
        }

        .feel4-morph-image {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: contain;
          transform-origin: 50% 50%;
          will-change: opacity, transform, filter;
        }

        .feel4-particles {
          position: absolute;
          z-index: 8;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .feel4-layer {
          position: absolute;
          z-index: 29;
          inset: 0;
          overflow: hidden;
          opacity: 0;
          pointer-events: none;
          background:
            radial-gradient(
              ellipse 49% 78% at 67.5% 35%,
              #b8a6ee 0%,
              #a077c7 50%,
              #8847a0 100%
            );
        }

        .feel4-lower-gradient {
          position: absolute;
          z-index: 1;
          left: 0;
          right: 0;
          top: 49.87%;
          bottom: 0;
          background:
            linear-gradient(
              0deg,
              #ac8dda 1.99%,
              #62377f 97.69%
            );
        }

        .feel4-particles-bg {
          position: absolute;
          z-index: 2;
          left: 25.90%;
          top: -25.13%;
          width: 80.56%;
          height: 85.79%;
          object-fit: cover;
          opacity: .50;
          transform: rotate(180deg) scaleY(-1);
          pointer-events: none;
          user-select: none;
        }

        .feel4-accent {
          position: absolute;
          z-index: 5;
          left: 6.18%;
          top: 7.10%;
          width: .625%;
          height: 7.63%;
          background: #4f1367;
        }

        .feel4-title {
          position: absolute;
          z-index: 5;
          left: 6.80%;
          top: 7.75%;
          width: 47.50%;
          margin: 0;
          color: #fff;
          font-family: "Fredoka", sans-serif;
          font-size: clamp(28px, 2.5vw, 40px);
          font-weight: 600;
          line-height: 1.05;
          text-align: center;
          text-shadow: 0 4px 4px rgba(0,0,0,.25);
        }

        .feel4-tree {
          position: absolute;
          z-index: 4;
          left: 3.54%;
          top: 14.74%;
          width: 13.89%;
          height: 39.47%;
          object-fit: contain;
          pointer-events: none;
          user-select: none;
        }

        .feel4-heart {
          position: absolute;
          z-index: 3;
          left: 78.0%;
          top: -5.79%;
          width: 24.84%;
          aspect-ratio: 1;
          object-fit: contain;
          transform: rotate(15deg);
          opacity: .96;
          pointer-events: none;
          user-select: none;
          filter: drop-shadow(0 8px 18px rgba(64,0,85,.12));
        }

        .feel4-cards {
          position: absolute;
          z-index: 6;
          left: 19.31%;
          top: 18.55%;
          width: 65.76%;
          height: 71.18%;
        }

        .feel4-card {
          position: absolute;
          top: 0;
          width: 31%;
          height: 100%;
          min-width: 0;
          border: 1px solid rgba(255,255,255,.82);
          border-radius: 20px;
          overflow: hidden;
          background:
            linear-gradient(
              180deg,
              rgba(255,255,255,.09) 0%,
              rgba(127,127,127,.20) 100%
            );
          -webkit-backdrop-filter: blur(12px) saturate(125%);
          backdrop-filter: blur(12px) saturate(125%);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,.16),
            0 12px 30px rgba(62,16,89,.08);
        }

        .feel4-card-image {
          position: absolute;
          left: 50%;
          top: 6.28%;
          width: 81.70%;
          aspect-ratio: 1;
          transform: translateX(-50%);
          border-radius: 20px;
          object-fit: cover;
          pointer-events: none;
          user-select: none;
        }

        .feel4-card-copy {
          position: absolute;
          left: 7.52%;
          right: 7.52%;
          top: 57.30%;
          margin: 0;
          color: #fff;
          font-family: "Outfit", sans-serif;
          font-size: clamp(16px, 1.3889vw, 22px);
          font-weight: 400;
          line-height: 1.50;
        }

        @media (max-width: 800px) {
          .feel-eyebrow {
            left: 24px;
            top: 36px;
            width: calc(100% - 48px);
            font-size: 13px;
            white-space: normal;
          }

          .feel-accent {
            left: 24px;
            top: 90px;
            width: 8px;
            height: 62px;
          }

          .feel-aula {
            left: 48px;
            top: 105px;
            font-size: 54px;
          }

          .feel-feel {
            left: 48px;
            top: 160px;
            width: min(68vw, 330px);
          }

          .feel-copy {
            left: 48px;
            top: 235px;
            width: calc(100% - 82px);
            font-size: 17px;
            line-height: 1.4;
          }

          .feel-heart-zone {
            left: 8px;
            top: 385px;
            width: 245px;
            height: 300px;
          }

          .feel-tree {
            left: 46%;
            top: 335px;
            width: 71%;
            height: 55%;
          }

          .feel2-white-panel {
            left: 38%;
            width: 62%;
          }

          .feel2-text {
            left: 45%;
            top: 28%;
            width: 49%;
            font-size: 20px;
            line-height: 1.45;
          }

          .feel3-branch {
            width: 72%;
            height: 42%;
            opacity: .38;
          }

          .feel3-corner-cube {
            left: 72%;
            top: -10%;
            width: 42%;
          }

          .feel3-title {
            left: 24px;
            top: 72px;
            font-size: 34px;
          }

          .feel3-subtitle {
            left: 24px;
            top: 130px;
            width: calc(100% - 48px);
            font-size: 20px;
            line-height: 1.35;
          }

          .feel3-body {
            left: 24px;
            top: 215px;
            width: 62%;
            font-size: 18px;
            line-height: 1.42;
          }

          .feel3-balloon-rig {
            left: 54%;
            top: 16%;
            width: 43%;
          }

          .feel3-sign {
            left: 0;
            top: 38.35%;
            width: 100%;
            height: 10%;
            font-size: 17px;
          }

          .feel3-curtain {
            left: 0;
            top: 50%;
            width: 100%;
            height: 42%;
          }

          .feel3-curtain-icon {
            flex-basis: 38px;
            width: 38px;
            height: 38px;
          }

          .feel3-curtain-text {
            font-size: 14px;
          }


          .feel4-accent {
            left: 24px;
            top: 58px;
            width: 6px;
            height: 48px;
          }

          .feel4-title {
            left: 42px;
            top: 64px;
            width: calc(100% - 66px);
            font-size: 28px;
            text-align: left;
          }

          .feel4-tree {
            left: -3%;
            top: 16%;
            width: 25%;
            height: 30%;
          }

          .feel4-heart {
            left: 77%;
            top: -2%;
            width: 30%;
          }

          .feel4-cards {
            left: 8%;
            top: 22%;
            width: 84%;
            height: 62%;
          }

          .feel4-card {
            width: 31%;
          }

          .feel4-card-image {
            width: 82%;
          }

          .feel4-card-copy {
            font-size: 14px;
            line-height: 1.30;
          }



        }
      `}</style>

      <div ref={stageRef} className="feel-stage">
        <div
          ref={feelBackgroundRef}
          className="feel-video-background"
          aria-hidden="true"
        >
          <video
            ref={feelBackgroundARef}
            src={FEEL_ASSETS.feelBackground}
            autoPlay
            muted
            playsInline
            preload="auto"
          />
          <video
            ref={feelBackgroundBRef}
            src={FEEL_ASSETS.feelBackground}
            muted
            playsInline
            preload="auto"
          />
        </div>

        <div
          ref={feel4MorphWrapRef}
          className="feel4-morph-wrap"
          aria-hidden="true"
        >
          <img
            ref={feel4MorphCubeRef}
            className="feel4-morph-image"
            data-feel-load-group="feel4"
            data-feel-src={FEEL_ASSETS.feelCube}
            alt=""
          />
          <img
            ref={feel4MorphHeartRef}
            className="feel4-morph-image"
            data-feel-load-group="feel4"
            data-feel-src={FEEL_ASSETS.feelHeart}
            alt=""
          />
        </div>

        <canvas
          ref={heartParticlesRef}
          className="feel-heart-particles"
          aria-hidden="true"
        />

        <p ref={eyebrowRef} className="feel-eyebrow">
          DESCUBRIENDO EL MUNDO A TRAVÉS DE LAS EMOCIONES
        </p>

        <div className="feel-accent" aria-hidden="true" />

        <p ref={aulaRef} className="feel-aula" id="feel-title">
          AULA
        </p>

        <div ref={feelRef} className="feel-feel" aria-label="FEEL">
          <svg
            className="feel-feel-svg"
            aria-hidden="true"
            viewBox="0 0 1071 321"
            preserveAspectRatio="xMinYMid meet"
          >
            <g transform="translate(-1404.689276 -680.109819)">
              <path className="feel-base-path" d="M1446.398,1000.943C1432.648,1000.943 1422.87,998.881 1417.064,994.756C1411.259,990.631 1407.745,985.283 1406.523,978.714C1405.3,972.145 1404.689,965.499 1404.689,958.776L1404.689,721.818C1404.689,705.929 1407.821,695.006 1414.085,689.047C1420.349,683.089 1431.578,680.11 1447.773,680.11L1615.523,680.11C1622.55,680.11 1629.196,680.721 1635.46,681.943C1641.724,683.165 1646.842,686.679 1650.814,692.485C1654.786,698.29 1656.773,708.221 1656.773,722.276C1656.773,736.026 1654.71,745.804 1650.585,751.61C1646.46,757.415 1641.189,760.929 1634.773,762.151C1628.356,763.374 1621.634,763.985 1614.606,763.985L1488.564,763.985L1488.564,804.776L1572.898,804.776C1579.925,804.776 1586.266,805.311 1591.918,806.381C1597.571,807.45 1602.002,810.506 1605.21,815.547C1608.418,820.589 1610.023,829.221 1610.023,841.443C1610.023,853.054 1608.342,861.304 1604.981,866.193C1601.62,871.082 1597.113,873.985 1591.46,874.901C1585.807,875.818 1579.467,876.276 1572.439,876.276L1488.564,876.276L1488.564,959.235C1488.564,965.957 1487.953,972.526 1486.731,978.943C1485.509,985.36 1481.995,990.631 1476.189,994.756C1470.384,998.881 1460.453,1000.943 1446.398,1000.943Z" />
              <path className="feel-base-path" d="M1727.356,1000.943C1713.606,1000.943 1703.828,998.881 1698.023,994.756C1692.217,990.631 1688.703,985.283 1687.481,978.714C1686.259,972.145 1685.648,965.499 1685.648,958.776L1685.648,721.818C1685.648,705.929 1688.78,695.006 1695.043,689.047C1701.307,683.089 1712.536,680.11 1728.731,680.11L1896.481,680.11C1903.509,680.11 1910.155,680.721 1916.418,681.943C1922.682,683.165 1927.877,686.679 1932.002,692.485C1936.127,698.29 1938.189,708.221 1938.189,722.276C1938.189,736.026 1936.127,745.804 1932.002,751.61C1927.877,757.415 1922.606,760.929 1916.189,762.151C1909.773,763.374 1903.05,763.985 1896.023,763.985L1769.523,763.985L1769.523,804.776L1854.314,804.776C1861.342,804.776 1867.606,805.311 1873.106,806.381C1878.606,807.45 1883.036,810.429 1886.398,815.318C1889.759,820.207 1891.439,828.763 1891.439,840.985C1891.439,852.596 1889.759,860.922 1886.398,865.964C1883.036,871.006 1878.453,873.985 1872.648,874.901C1866.842,875.818 1860.425,876.276 1853.398,876.276L1769.523,876.276L1769.523,917.068L1896.481,917.068C1903.509,917.068 1910.155,917.679 1916.418,918.901C1922.682,920.124 1927.877,923.638 1932.002,929.443C1936.127,935.249 1938.189,945.179 1938.189,959.235C1938.189,972.985 1936.127,982.763 1932.002,988.568C1927.877,994.374 1922.606,997.888 1916.189,999.11C1909.773,1000.332 1903.05,1000.943 1896.023,1000.943L1727.356,1000.943Z" />
              <path className="feel-base-path" d="M2003.731,1000.943C1989.981,1000.943 1980.203,998.881 1974.398,994.756C1968.592,990.631 1965.078,985.283 1963.856,978.714C1962.634,972.145 1962.023,965.499 1962.023,958.776L1962.023,721.818C1962.023,705.929 1965.155,695.006 1971.418,689.047C1977.682,683.089 1988.911,680.11 2005.106,680.11L2172.856,680.11C2179.884,680.11 2186.53,680.721 2192.793,681.943C2199.057,683.165 2204.252,686.679 2208.377,692.485C2212.502,698.29 2214.564,708.221 2214.564,722.276C2214.564,736.026 2212.502,745.804 2208.377,751.61C2204.252,757.415 2198.981,760.929 2192.564,762.151C2186.148,763.374 2179.425,763.985 2172.398,763.985L2045.898,763.985L2045.898,804.776L2130.689,804.776C2137.717,804.776 2143.981,805.311 2149.481,806.381C2154.981,807.45 2159.411,810.429 2162.773,815.318C2166.134,820.207 2167.814,828.763 2167.814,840.985C2167.814,852.596 2166.134,860.922 2162.773,865.964C2159.411,871.006 2154.828,873.985 2149.023,874.901C2143.217,875.818 2136.8,876.276 2129.773,876.276L2045.898,876.276L2045.898,917.068L2172.856,917.068C2179.884,917.068 2186.53,917.679 2192.793,918.901C2199.057,920.124 2204.252,923.638 2208.377,929.443C2212.502,935.249 2214.564,945.179 2214.564,959.235C2214.564,972.985 2212.502,982.763 2208.377,988.568C2204.252,994.374 2198.981,997.888 2192.564,999.11C2186.148,1000.332 2179.425,1000.943 2172.398,1000.943L2003.731,1000.943Z" />
              <path className="feel-base-path" d="M2285.606,1000.943C2271.856,1000.943 2262.078,998.881 2256.273,994.756C2250.467,990.631 2246.953,985.283 2245.731,978.714C2244.509,972.145 2243.898,965.499 2243.898,958.776L2243.898,721.818C2243.898,715.096 2244.509,708.526 2245.731,702.11C2246.953,695.693 2250.467,690.422 2256.273,686.297C2262.078,682.172 2272.009,680.11 2286.064,680.11C2300.12,680.11 2309.974,682.172 2315.627,686.297C2321.28,690.422 2324.717,695.693 2325.939,702.11C2327.161,708.526 2327.773,715.249 2327.773,722.276L2327.773,929.443L2439.606,929.443C2445.411,929.443 2450.988,929.901 2456.335,930.818C2461.682,931.735 2466.113,934.714 2469.627,939.756C2473.141,944.797 2474.898,953.276 2474.898,965.193C2474.898,976.804 2473.064,985.131 2469.398,990.172C2465.731,995.214 2461.224,998.27 2455.877,999.339C2450.53,1000.408 2444.953,1000.943 2439.148,1000.943L2285.606,1000.943Z" />
            </g>
            <g className="feel-trace-group" transform="translate(-1404.689276 -680.109819)">
              <path className="feel-trace-path" d="M1446.398,1000.943C1432.648,1000.943 1422.87,998.881 1417.064,994.756C1411.259,990.631 1407.745,985.283 1406.523,978.714C1405.3,972.145 1404.689,965.499 1404.689,958.776L1404.689,721.818C1404.689,705.929 1407.821,695.006 1414.085,689.047C1420.349,683.089 1431.578,680.11 1447.773,680.11L1615.523,680.11C1622.55,680.11 1629.196,680.721 1635.46,681.943C1641.724,683.165 1646.842,686.679 1650.814,692.485C1654.786,698.29 1656.773,708.221 1656.773,722.276C1656.773,736.026 1654.71,745.804 1650.585,751.61C1646.46,757.415 1641.189,760.929 1634.773,762.151C1628.356,763.374 1621.634,763.985 1614.606,763.985L1488.564,763.985L1488.564,804.776L1572.898,804.776C1579.925,804.776 1586.266,805.311 1591.918,806.381C1597.571,807.45 1602.002,810.506 1605.21,815.547C1608.418,820.589 1610.023,829.221 1610.023,841.443C1610.023,853.054 1608.342,861.304 1604.981,866.193C1601.62,871.082 1597.113,873.985 1591.46,874.901C1585.807,875.818 1579.467,876.276 1572.439,876.276L1488.564,876.276L1488.564,959.235C1488.564,965.957 1487.953,972.526 1486.731,978.943C1485.509,985.36 1481.995,990.631 1476.189,994.756C1470.384,998.881 1460.453,1000.943 1446.398,1000.943Z" />
              <path className="feel-trace-path" d="M1727.356,1000.943C1713.606,1000.943 1703.828,998.881 1698.023,994.756C1692.217,990.631 1688.703,985.283 1687.481,978.714C1686.259,972.145 1685.648,965.499 1685.648,958.776L1685.648,721.818C1685.648,705.929 1688.78,695.006 1695.043,689.047C1701.307,683.089 1712.536,680.11 1728.731,680.11L1896.481,680.11C1903.509,680.11 1910.155,680.721 1916.418,681.943C1922.682,683.165 1927.877,686.679 1932.002,692.485C1936.127,698.29 1938.189,708.221 1938.189,722.276C1938.189,736.026 1936.127,745.804 1932.002,751.61C1927.877,757.415 1922.606,760.929 1916.189,762.151C1909.773,763.374 1903.05,763.985 1896.023,763.985L1769.523,763.985L1769.523,804.776L1854.314,804.776C1861.342,804.776 1867.606,805.311 1873.106,806.381C1878.606,807.45 1883.036,810.429 1886.398,815.318C1889.759,820.207 1891.439,828.763 1891.439,840.985C1891.439,852.596 1889.759,860.922 1886.398,865.964C1883.036,871.006 1878.453,873.985 1872.648,874.901C1866.842,875.818 1860.425,876.276 1853.398,876.276L1769.523,876.276L1769.523,917.068L1896.481,917.068C1903.509,917.068 1910.155,917.679 1916.418,918.901C1922.682,920.124 1927.877,923.638 1932.002,929.443C1936.127,935.249 1938.189,945.179 1938.189,959.235C1938.189,972.985 1936.127,982.763 1932.002,988.568C1927.877,994.374 1922.606,997.888 1916.189,999.11C1909.773,1000.332 1903.05,1000.943 1896.023,1000.943L1727.356,1000.943Z" />
              <path className="feel-trace-path" d="M2003.731,1000.943C1989.981,1000.943 1980.203,998.881 1974.398,994.756C1968.592,990.631 1965.078,985.283 1963.856,978.714C1962.634,972.145 1962.023,965.499 1962.023,958.776L1962.023,721.818C1962.023,705.929 1965.155,695.006 1971.418,689.047C1977.682,683.089 1988.911,680.11 2005.106,680.11L2172.856,680.11C2179.884,680.11 2186.53,680.721 2192.793,681.943C2199.057,683.165 2204.252,686.679 2208.377,692.485C2212.502,698.29 2214.564,708.221 2214.564,722.276C2214.564,736.026 2212.502,745.804 2208.377,751.61C2204.252,757.415 2198.981,760.929 2192.564,762.151C2186.148,763.374 2179.425,763.985 2172.398,763.985L2045.898,763.985L2045.898,804.776L2130.689,804.776C2137.717,804.776 2143.981,805.311 2149.481,806.381C2154.981,807.45 2159.411,810.429 2162.773,815.318C2166.134,820.207 2167.814,828.763 2167.814,840.985C2167.814,852.596 2166.134,860.922 2162.773,865.964C2159.411,871.006 2154.828,873.985 2149.023,874.901C2143.217,875.818 2136.8,876.276 2129.773,876.276L2045.898,876.276L2045.898,917.068L2172.856,917.068C2179.884,917.068 2186.53,917.679 2192.793,918.901C2199.057,920.124 2204.252,923.638 2208.377,929.443C2212.502,935.249 2214.564,945.179 2214.564,959.235C2214.564,972.985 2212.502,982.763 2208.377,988.568C2204.252,994.374 2198.981,997.888 2192.564,999.11C2186.148,1000.332 2179.425,1000.943 2172.398,1000.943L2003.731,1000.943Z" />
              <path className="feel-trace-path" d="M2285.606,1000.943C2271.856,1000.943 2262.078,998.881 2256.273,994.756C2250.467,990.631 2246.953,985.283 2245.731,978.714C2244.509,972.145 2243.898,965.499 2243.898,958.776L2243.898,721.818C2243.898,715.096 2244.509,708.526 2245.731,702.11C2246.953,695.693 2250.467,690.422 2256.273,686.297C2262.078,682.172 2272.009,680.11 2286.064,680.11C2300.12,680.11 2309.974,682.172 2315.627,686.297C2321.28,690.422 2324.717,695.693 2325.939,702.11C2327.161,708.526 2327.773,715.249 2327.773,722.276L2327.773,929.443L2439.606,929.443C2445.411,929.443 2450.988,929.901 2456.335,930.818C2461.682,931.735 2466.113,934.714 2469.627,939.756C2473.141,944.797 2474.898,953.276 2474.898,965.193C2474.898,976.804 2473.064,985.131 2469.398,990.172C2465.731,995.214 2461.224,998.27 2455.877,999.339C2450.53,1000.408 2444.953,1000.943 2439.148,1000.943L2285.606,1000.943Z" />
            </g>
          </svg>
          <canvas
            ref={feelTrailCanvasRef}
            className="feel-trail-canvas"
            aria-hidden="true"
          />
        </div>

        <p ref={copyRef} className="feel-copy">
          Un espacio de aprendizaje socioemocional creado para que nuestros
          alumnos aprendan a reconocer, expresar y regular sus emociones en un
          entorno seguro, cercano, lúdico y estimulante.
        </p>

        <div className="feel-heart-zone" aria-hidden="true">
          <div ref={heartRef} className="feel-heart">
            <img
              ref={heartSourceRef}
              className="feel-heart-source"
              src={FEEL_ASSETS.heart}
              alt=""
            />
            <canvas ref={heartVisualRef} className="feel-heart-visual" />
          </div>
        </div>

        <div ref={treeRef} className="feel-tree" aria-hidden="true">
          <img ref={treeImageRef} src={FEEL_ASSETS.tree} alt="" />
          <canvas ref={treeCanvasRef} className="feel-tree-sparkles" />
        </div>

        <div
          ref={whitePanelRef}
          className="feel2-white-panel"
          aria-hidden="true"
        />

        <p ref={feel2TextRef} className="feel2-text">
          <span className="feel2-word">En&nbsp;</span>
          <span className="feel2-word">Champal&nbsp;</span>
          <span className="feel2-word">acompañamos&nbsp;</span>
          <span className="feel2-word">a&nbsp;</span>
          <span className="feel2-word">los&nbsp;</span>
          <span className="feel2-word">alumnos&nbsp;</span>
          <span className="feel2-word">para&nbsp;</span>
          <span className="feel2-word">que&nbsp;</span>
          <span className="feel2-word feel2-strong">comprendan&nbsp;</span>
          <span className="feel2-word feel2-strong">lo&nbsp;</span>
          <span className="feel2-word feel2-strong">que&nbsp;</span>
          <span className="feel2-word feel2-strong">sienten,&nbsp;</span>
          <span className="feel2-word">lo&nbsp;</span>
          <span className="feel2-word feel2-strong">expresen&nbsp;</span>
          <span className="feel2-word feel2-strong">de&nbsp;</span>
          <span className="feel2-word feel2-strong">forma&nbsp;</span>
          <span className="feel2-word feel2-strong">saludable&nbsp;</span>
          <span className="feel2-word">y&nbsp;</span>
          <span className="feel2-word">desarrollen&nbsp;</span>
          <span className="feel2-word">herramientas&nbsp;</span>
          <span className="feel2-word">para&nbsp;</span>
          <span className="feel2-word feel2-strong">relacionarse&nbsp;</span>
          <span className="feel2-word feel2-strong">mejor&nbsp;</span>
          <span className="feel2-word feel2-strong">consigo&nbsp;</span>
          <span className="feel2-word feel2-strong">mismos&nbsp;</span>
          <span className="feel2-word feel2-strong">y&nbsp;</span>
          <span className="feel2-word feel2-strong">con&nbsp;</span>
          <span className="feel2-word feel2-strong">los&nbsp;</span>
          <span className="feel2-word feel2-strong">demás.</span>
        </p>

        <div
          ref={sphereVideoWrapRef}
          className="feel2-sphere-wrap"
          aria-hidden="true"
        >
          <video
            ref={sphereVideoRef}
            className="feel2-sphere-video"
            data-feel-load-group="feel2"
            data-feel-src={FEEL_ASSETS.heartToSphere}
            muted
            playsInline
            preload="none"
          />
        </div>

        <canvas
          ref={sphereParticlesRef}
          className="feel2-sphere-particles"
          aria-hidden="true"
        />


        <div
          ref={feel3WhiteHoleRef}
          className="feel3-white-hole"
          aria-hidden="true"
        />

        <div
          ref={feel3MorphWrapRef}
          className="feel3-morph-wrap"
          aria-hidden="true"
        >
          <img
            ref={feel3MorphSphereRef}
            className="feel3-morph-image feel3-morph-sphere"
            data-feel-load-group="feel3"
            data-feel-src={FEEL_ASSETS.feelSphere}
            alt=""
          />
          <img
            ref={feel3MorphCubeRef}
            className="feel3-morph-image feel3-morph-cube"
            data-feel-load-group="feel3"
            data-feel-src={FEEL_ASSETS.feelCube}
            alt=""
          />
        </div>

        <div
          ref={feel3PixelRef}
          className="feel3-pixel-transition"
          aria-hidden="true"
        >
          {Array.from({ length: 96 }, (_, index) => (
            <span
              key={`feel3-pixel-${index}`}
              className="feel3-pixel-cell"
            />
          ))}
        </div>

        <div
          ref={feel3LayerRef}
          className="feel3-layer"
          aria-label="¿Qué es el aula FEEL?"
        >
          <div
            className="feel-section-video-background feel3-video-background feel-smooth-loop"
            aria-hidden="true"
          >
            <video
              data-feel-load-group="feel3"
              data-feel-src={FEEL_ASSETS.feelBackground}
              autoPlay
              muted
              playsInline
              preload="none"
            />
            <video
              data-feel-load-group="feel3"
              data-feel-src={FEEL_ASSETS.feelBackground}
              muted
              playsInline
              preload="none"
            />
          </div>

          <img
            className="feel3-branch"
            data-feel-load-group="feel3"
            data-feel-src={FEEL_ASSETS.feelBranch}
            alt=""
            aria-hidden="true"
          />

          <div className="feel3-corner-cube" aria-hidden="true">
            <img
              data-feel-load-group="feel3"
              data-feel-src={FEEL_ASSETS.feelCube}
              alt=""
            />
          </div>

          <p ref={feel3TitleRef} className="feel3-title">
            ¿Qué es el aula FEEL?
          </p>

          <p ref={feel3SubtitleRef} className="feel3-subtitle">
            FEEL (
            <strong>F</strong>ormación,{" "}
            <strong>E</strong>xpresión y{" "}
            <strong>E</strong>mpatía{" "}
            <strong>E</strong>mocional)
          </p>

          <p ref={feel3BodyRef} className="feel3-body">
            <span className="feel3-line">
              Un lugar donde los alumnos{" "}
              <span className="feel3-body-strong">
                convierten sus emociones en aprendizaje
              </span>
              .{" "}
            </span>
            <span className="feel3-line">
              A través del juego, el arte, la música y el movimiento,{" "}
            </span>
            <span className="feel3-line feel3-body-strong">
              fortalecen su autoestima, su empatía{" "}
            </span>
            <span className="feel3-line feel3-body-strong">
              y su capacidad para enfrentar los retos cotidianos
            </span>
            <span className="feel3-line">.</span>
          </p>

          <canvas
            ref={feel3ParticlesRef}
            className="feel3-particles"
            aria-hidden="true"
          />

          <div
            ref={feel3BalloonRigRef}
            className="feel3-balloon-rig"
            aria-hidden="true"
          >
            <video
              ref={feel3BalloonVideoRef}
              className="feel3-balloon-video"
              data-feel-load-group="feel3"
              data-feel-src={FEEL_ASSETS.balloonTurn}
              muted
              playsInline
              preload="none"
            />

            <div ref={feel3SignRef} className="feel3-sign">
              Aprendemos a reconocer lo que sentimos
            </div>

            <div ref={feel3CurtainRef} className="feel3-curtain">
              <div className="feel3-curtain-row">
                <img
                  className="feel3-curtain-icon"
                  data-feel-load-group="feel3"
                  data-feel-src={FEEL_ASSETS.feelHeart}
                  alt=""
                />
                <p className="feel3-curtain-text">
                  Aprendemos a ponerle nombre a nuestras emociones
                </p>
              </div>

              <div className="feel3-curtain-row">
                <img
                  className="feel3-curtain-icon"
                  data-feel-load-group="feel3"
                  data-feel-src={FEEL_ASSETS.feelCube}
                  alt=""
                />
                <p className="feel3-curtain-text">
                  Descubrimos recursos sencillos para recuperar la calma
                </p>
              </div>

              <div className="feel3-curtain-row">
                <img
                  className="feel3-curtain-icon"
                  data-feel-load-group="feel3"
                  data-feel-src={FEEL_ASSETS.feelSphere}
                  alt=""
                />
                <p className="feel3-curtain-text">
                  Aprendemos a observar expresiones, gestos y emociones en
                  <br />
                  los demás para comprenderlos y relacionarnos mejor con ellos.
                </p>
              </div>
            </div>
          </div>
        </div>


        <section
          className="feel4-layer"
          aria-labelledby="feel4-title"
        >
          <div
            className="feel-section-video-background feel4-video-background feel-smooth-loop"
            aria-hidden="true"
          >
            <video
              data-feel-load-group="feel4"
              data-feel-src={FEEL_ASSETS.feelBackground}
              autoPlay
              muted
              playsInline
              preload="none"
            />
            <video
              data-feel-load-group="feel4"
              data-feel-src={FEEL_ASSETS.feelBackground}
              muted
              playsInline
              preload="none"
            />
          </div>

          <canvas
            ref={feel4ParticlesRef}
            className="feel4-particles"
            aria-hidden="true"
          />

          <div className="feel4-lower-gradient" aria-hidden="true" />

          <img
            className="feel4-particles-bg"
            data-feel-load-group="feel4"
            data-feel-src={FEEL_ASSETS.feel4Particles}
            alt=""
            aria-hidden="true"
          />

          <div className="feel4-accent" aria-hidden="true" />

          <h2 id="feel4-title" className="feel4-title">
            Desarrollamos herramientas para la vida
          </h2>

          <img
            className="feel4-tree"
            data-feel-load-group="feel4"
            data-feel-src={FEEL_ASSETS.tree}
            alt=""
            aria-hidden="true"
          />

          <img
            className="feel4-heart"
            data-feel-load-group="feel4"
            data-feel-src={FEEL_ASSETS.feelHeart}
            alt=""
            aria-hidden="true"
          />

          <div className="feel4-cards">
            <article className="feel4-card">
              <img
                className="feel4-card-image"
                data-feel-load-group="feel4"
                data-feel-src={FEEL_ASSETS.feel4Card1}
                alt=""
              />
              <p className="feel4-card-copy">
                Practicamos el diálogo, la escucha y el juego de roles para
                expresar lo que necesitamos y encontrar soluciones ante
                desacuerdos cotidianos.
              </p>
            </article>

            <article className="feel4-card">
              <img
                className="feel4-card-image"
                data-feel-load-group="feel4"
                data-feel-src={FEEL_ASSETS.feel4Card2}
                alt=""
              />
              <p className="feel4-card-copy">
                Reconocemos cualidades y fortalezas personales para ganar
                confianza frente a los retos académicos, sociales y personales.
              </p>
            </article>

            <article className="feel4-card">
              <img
                className="feel4-card-image"
                data-feel-load-group="feel4"
                data-feel-src={FEEL_ASSETS.feel4Card3}
                alt=""
              />
              <p className="feel4-card-copy">
                Incorporamos pausas activas, respiración consciente y ejercicios
                de atención plena para ayudar a la mente y el cuerpo a estar
                listos para aprender.
              </p>
            </article>
          </div>
        </section>

        <div className="feel-lavender" aria-hidden="true">
          <video
            ref={lavenderRef}
            className="feel-lavender-source"
            src={FEEL_ASSETS.lavender}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          />
          <canvas
            ref={lavenderCanvasRef}
            className="feel-lavender-canvas"
          />
        </div>
      </div>
    </section>
  );
}

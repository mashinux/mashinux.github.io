/* ==========================================================================
   MASHINUX — 3D logo in the About section
   Act 1: the logo is printed layer by layer (additive).
   Act 2: an end mill makes a finishing pass and reveals the polished face (subtractive).
   Act 3: one glint of light, then the logo stays 3D and follows the pointer.
   Loads three.js only when the section is near. Without WebGL the SVG logo stays.
   ========================================================================== */
(() => {
  'use strict';

  const host = document.getElementById('aboutBrand');
  if (!host) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const small = matchMedia('(max-width: 760px)').matches;
  const THREE_URL = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';

  const hasWebGL = (() => {
    try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); }
    catch { return false; }
  })();
  if (!hasWebGL) return;

  let booted = false;
  const io = new IntersectionObserver(es => {
    if (booted || !es.some(e => e.isIntersecting)) return;
    booted = true; io.disconnect(); boot();
  }, { rootMargin: '400px 0px' });
  io.observe(host);

  function loadThree() {
    if (window.THREE) return Promise.resolve(window.THREE);
    return new Promise((res, rej) => {
      const s = document.createElement('script');
      s.src = THREE_URL; s.async = true;
      s.onload = () => (window.THREE ? res(window.THREE) : rej());
      s.onerror = rej;
      document.head.appendChild(s);
    });
  }

  async function boot() {
    let THREE;
    try { THREE = await loadThree(); } catch { return; }
    try { await document.fonts.load('600 40px "IBM Plex Sans"'); } catch { /* fallback font is fine */ }
    try { build(THREE); } catch (err) { console.warn('logo3d', err); }
  }

  /* ---------- the logo, drawn flat on a canvas (becomes the texture) ---------- */
  const VB = { x: -6, y: -6, w: 312, h: 142 };          // lockup viewBox + margin
  function drawLogo(gearD, mode) {
    const S = small ? 4 : 6;
    const c = document.createElement('canvas');
    c.width = VB.w * S; c.height = VB.h * S;
    const g = c.getContext('2d');
    g.scale(S, S); g.translate(-VB.x, -VB.y);
    const raw = mode === 'raw';
    // gear: same placement as the SVG lockup (shift right, tilt back 14°)
    g.save();
    g.translate(12, 0); g.translate(62, 62); g.rotate(-14 * Math.PI / 180); g.translate(-62, -62);
    g.fillStyle = raw ? '#8E959D' : '#C9CFD6';
    g.fill(new Path2D(gearD));
    g.restore();
    // wordmark, letter by letter (letter-spacing 2.5 like the SVG)
    g.direction = 'ltr'; g.textBaseline = 'alphabetic';
    g.font = '600 34px "IBM Plex Sans", "Helvetica Neue", Arial, sans-serif';
    let x = 72;
    for (const ch of 'MASHINUX') {
      g.fillStyle = raw ? '#8E959D' : (ch === 'X' ? '#C8231E' : '#F2F3F5');
      g.fillText(ch, x, 76);
      x += g.measureText(ch).width + 2.5;
    }
    return c;
  }

  function build(THREE) {
    const gearD = document.getElementById('gear')?.getAttribute('d');
    if (!gearD) return;

    /* renderer */
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, small ? 1.5 : 2));
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.localClippingEnabled = true;
    const canvas = renderer.domElement;
    canvas.className = 'about__3d';
    canvas.setAttribute('aria-hidden', 'true');
    host.appendChild(canvas);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(26, 1, 0.1, 60);
    const target = new THREE.Vector3(0, 0.06, 0);

    /* light */
    scene.add(new THREE.HemisphereLight(0xe6ecf2, 0x0c0d10, 0.85));
    const key = new THREE.DirectionalLight(0xffffff, 1.15); key.position.set(2.5, 4, 3); scene.add(key);
    const rim = new THREE.DirectionalLight(0xbfd2ff, 0.55); rim.position.set(-3, 2.2, -2.5); scene.add(rim);
    const glint = new THREE.PointLight(0xffffff, 0, 3.2, 2); glint.position.set(-2, 0.6, 0.4); scene.add(glint);

    /* textures */
    const mkTex = mode => {
      const t = new THREE.CanvasTexture(drawLogo(gearD, mode));
      t.encoding = THREE.sRGBEncoding;
      t.anisotropy = renderer.capabilities.getMaxAnisotropy();
      return t;
    };
    const texRaw = mkTex('raw'), texDone = mkTex('done');

    /* geometry: the logo as a stack of thin layers (printed look on the sides) */
    const W = 3.0, D = W * VB.h / VB.w;
    const LAYERS = small ? 24 : 36, H = 0.22, step = H / LAYERS;
    const plane = new THREE.PlaneGeometry(W, D); plane.rotateX(-Math.PI / 2);
    const logo = new THREE.Group(); scene.add(logo);

    // one clipping plane per material, always present (changing the count would recompile shaders)
    const OPEN = 99;
    const reveal = (pl, x, dir) => { pl.normal.set(-dir, 0, 0); pl.constant = dir * x; };   // dir 1: keep x < x0 · dir -1: keep x > x0

    const layers = [];
    for (let i = 0; i < LAYERS; i++) {
      const k = i / (LAYERS - 1);
      const shade = new THREE.Color().setHSL(0.58, 0.05, 0.22 + k * 0.28);
      const clip = new THREE.Plane(new THREE.Vector3(-1, 0, 0), OPEN);
      const m = new THREE.MeshStandardMaterial({ map: texRaw, alphaTest: 0.5, color: shade, metalness: 0.35, roughness: 0.55, clippingPlanes: [clip] });
      const mesh = new THREE.Mesh(plane, m);
      mesh.position.y = (i + 1) * step;
      mesh.visible = false;
      mesh.userData.clip = clip;
      logo.add(mesh); layers.push(mesh);
    }
    // finished face: sits just above the top layer, revealed behind the end mill
    const faceClip = new THREE.Plane(new THREE.Vector3(-1, 0, 0), OPEN);
    const faceMat = new THREE.MeshStandardMaterial({ map: texDone, alphaTest: 0.5, metalness: 0.55, roughness: 0.28, clippingPlanes: [faceClip] });
    const face = new THREE.Mesh(plane, faceMat);
    face.position.y = H + 0.002; face.visible = false; logo.add(face);

    // soft contact shadow on the "table"
    const sh = document.createElement('canvas'); sh.width = sh.height = 128;
    const sg = sh.getContext('2d'); const gr = sg.createRadialGradient(64, 64, 4, 64, 64, 64);
    gr.addColorStop(0, 'rgba(0,0,0,.55)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); sg.fillStyle = gr; sg.fillRect(0, 0, 128, 128);
    const shadow = new THREE.Mesh(new THREE.PlaneGeometry(W * 1.15, D * 1.5).rotateX(-Math.PI / 2),
      new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(sh), transparent: true, depthWrite: false }));
    shadow.position.y = 0.001; scene.add(shadow);

    /* tools */
    const steel = new THREE.MeshStandardMaterial({ color: 0xb9c0c8, metalness: 0.8, roughness: 0.25 });
    const dark = new THREE.MeshStandardMaterial({ color: 0x23272c, metalness: 0.4, roughness: 0.6 });
    // print head: block + nozzle
    const head = new THREE.Group();
    const hb = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.12, 0.16), dark); hb.position.y = 0.17; head.add(hb);
    const nz = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.09, 20), steel); nz.rotation.x = Math.PI; nz.position.y = 0.065; head.add(nz);
    const hot = new THREE.Mesh(new THREE.SphereGeometry(0.012, 10, 10), new THREE.MeshBasicMaterial({ color: 0xc8231e })); hot.position.y = 0.018; head.add(hot);
    head.visible = false; scene.add(head);
    // end mill: flutes + shank + collet
    const mill = new THREE.Group();
    const fl = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.16, 18), steel); fl.position.y = 0.08; mill.add(fl);
    const sk = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.22, 18), steel); sk.position.y = 0.27; mill.add(sk);
    const co = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.075, 0.16, 24), dark); co.position.y = 0.45; mill.add(co);
    mill.visible = false; scene.add(mill);

    /* chips */
    const N = small ? 90 : 160;
    const pos = new Float32Array(N * 3), vel = new Float32Array(N * 3), life = new Float32Array(N);
    for (let i = 0; i < N; i++) pos[i * 3 + 1] = -99;
    const chipGeo = new THREE.BufferGeometry(); chipGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const chips = new THREE.Points(chipGeo, new THREE.PointsMaterial({ color: 0xdfe4ea, size: small ? 0.03 : 0.022, sizeAttenuation: true }));
    scene.add(chips);
    let nextChip = 0;
    function spawnChip(x, y, z) {
      const i = nextChip; nextChip = (nextChip + 1) % N;
      pos[i * 3] = x; pos[i * 3 + 1] = y; pos[i * 3 + 2] = z;
      const a = Math.random() * Math.PI * 2, s = 0.6 + Math.random() * 1.1;
      vel[i * 3] = Math.cos(a) * s; vel[i * 3 + 1] = 0.8 + Math.random() * 1.4; vel[i * 3 + 2] = Math.sin(a) * s;
      life[i] = 0.7 + Math.random() * 0.4;
    }
    function stepChips(dt) {
      for (let i = 0; i < N; i++) {
        if (life[i] <= 0) continue;
        life[i] -= dt;
        vel[i * 3 + 1] -= 6.5 * dt;
        pos[i * 3] += vel[i * 3] * dt; pos[i * 3 + 1] += vel[i * 3 + 1] * dt; pos[i * 3 + 2] += vel[i * 3 + 2] * dt;
        if (pos[i * 3 + 1] < 0.004) { pos[i * 3 + 1] = 0.004; vel[i * 3] *= 0.4; vel[i * 3 + 2] *= 0.4; vel[i * 3 + 1] = 0; }
        if (life[i] <= 0) pos[i * 3 + 1] = -99;
      }
      chipGeo.attributes.position.needsUpdate = true;
    }

    /* camera framing: fit the logo width, two angles (low → high) */
    const dirLow = new THREE.Vector3(0, 0.46, 0.89).normalize();
    const dirHigh = new THREE.Vector3(0, 0.84, 0.54).normalize();
    let fitDist = 6;
    function resize() {
      const w = host.clientWidth, h = host.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h; camera.updateProjectionMatrix();
      const hf = 2 * Math.atan(Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.aspect);
      fitDist = (W * 0.62) / Math.tan(hf / 2);
    }
    resize();
    new ResizeObserver(resize).observe(host);

    /* timeline (seconds) */
    const T_PRINT = 2.1, T_MILL = 1.5, T_LIFT = 0.45, T_GLINT = 0.9;
    const T_END = T_PRINT + T_MILL + T_LIFT + T_GLINT;
    const ease = t => 1 - Math.pow(1 - Math.min(Math.max(t, 0), 1), 3);
    const lerp = (a, b, t) => a + (b - a) * t;
    let t0 = null, last = performance.now(), visible = false, running = true;   // the show starts when the panel is in view
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };

    function setState(t) {
      // Act 1 — printing
      const pT = Math.min(t / T_PRINT, 1);
      const done = Math.floor(pT * LAYERS);
      layers.forEach((l, i) => {
        l.visible = i < done || (i === done && pT < 1);
        l.userData.clip.normal.set(-1, 0, 0); l.userData.clip.constant = OPEN;
      });
      if (pT < 1) {
        const cur = layers[done];
        const within = pT * LAYERS - done;                 // 0..1 across the current layer
        const dir = done % 2 ? -1 : 1;
        const hx = dir * lerp(-W / 2, W / 2, within);
        if (cur) reveal(cur.userData.clip, hx, dir);
        head.visible = true; head.position.set(hx, (done + 1) * step, Math.sin(within * Math.PI * 6) * D * 0.18);
      } else head.visible = false;

      // Act 2 — finishing pass with the end mill
      const mT = (t - T_PRINT) / T_MILL;
      if (mT >= 0) {
        layers[LAYERS - 1].visible = true;
        face.visible = true;
        const mx = lerp(-W / 2 - 0.2, W / 2 + 0.2, Math.min(mT, 1));
        reveal(faceClip, mT < 1 ? mx : OPEN, 1);          // finished face shows where the mill has passed
        const lT = Math.max(0, (t - T_PRINT - T_MILL) / T_LIFT);
        mill.visible = lT < 1;
        mill.position.set(mx, H + ease(lT) * 1.6, Math.sin(mT * Math.PI * 4) * D * 0.25);
        mill.rotation.y = t * 40;
      } else { face.visible = false; mill.visible = false; }

      // Act 3 — glint sweep
      const gT = (t - T_PRINT - T_MILL - T_LIFT) / T_GLINT;
      glint.intensity = gT > 0 && gT < 1 ? Math.sin(gT * Math.PI) * 2.4 : 0;
      glint.position.x = lerp(-2.2, 2.2, Math.min(Math.max(gT, 0), 1));

      // camera: rises from a low angle to a readable one
      const cT = ease(t / (T_END - 0.4));
      const dir = dirLow.clone().lerp(dirHigh, cT).normalize();
      camera.position.copy(dir.multiplyScalar(fitDist * lerp(1.12, 1, cT))).add(target);
      camera.lookAt(target);
    }

    function frame(now) {
      if (!running) return;
      requestAnimationFrame(frame);
      if (!visible || t0 === null) { last = now; return; }
      const dt = Math.min((now - last) / 1000, 0.05); last = now;
      const t = reduce ? T_END : (now - t0) / 1000;
      setState(t);

      if (!reduce && t > T_PRINT && t < T_PRINT + T_MILL) {
        for (let k = 0; k < (small ? 2 : 4); k++) spawnChip(mill.position.x, H + 0.01, mill.position.z);
      }
      stepChips(dt);

      // idle: gentle sway + pointer tilt
      pointer.x += (pointer.tx - pointer.x) * 0.06; pointer.y += (pointer.ty - pointer.y) * 0.06;
      const idle = reduce ? 0 : Math.max(0, Math.min((t - T_END) / 1.2, 1));
      logo.rotation.y = idle * (Math.sin(now / 2400) * 0.05) + pointer.x * 0.22;
      logo.rotation.x = pointer.y * 0.12;
      shadow.rotation.y = logo.rotation.y;

      renderer.render(scene, camera);
      if (!host.classList.contains('is-3d')) host.classList.add('is-3d');
    }
    requestAnimationFrame(frame);

    /* pause when off screen */
    new IntersectionObserver(es => {
      visible = es.some(e => e.isIntersecting);
      if (visible && t0 === null) t0 = performance.now();
    }, { threshold: 0.35 }).observe(host);

    /* pointer / touch tilt */
    host.addEventListener('pointermove', e => {
      const r = host.getBoundingClientRect();
      pointer.tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      pointer.ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
    });
    host.addEventListener('pointerleave', () => { pointer.tx = 0; pointer.ty = 0; });

    /* replay */
    const btn = document.getElementById('aboutReplay');
    if (btn && !reduce) {
      btn.hidden = false;
      btn.addEventListener('click', () => { t0 = performance.now(); });
    }
  }
})();

/* =========================================================
   FAMILY 100 | script.js
   Logika permainan, bank soal, dan fungsi suara
   ========================================================= */
(function () {
  'use strict';

  /* ---------- KONFIGURASI POIN ---------- */
  const TEAM_NAMES = ['TIM 1', 'TIM 2'];
  const ROUND_POINTS = [
    [60, 50, 45, 40, 35, 30, 20, 20],
    [60, 50, 45, 40, 35, 30, 25, 15],
    [80, 70, 55, 45, 30, 15, 5],
    [75, 60, 50, 45, 40, 30],
    [100, 80, 60, 40, 20]
  ];
  const TOTAL_ROUNDS = ROUND_POINTS.length;
  const MUTE_KEY = 'family100-muted';

  /* ---------- BANK SOAL ----------
     Setiap ronde: pool jawaban (t = teks, k = kata kunci tersembunyi)
     dan tiga soal kandidat (pick = urutan indeks pool, dari poin terbesar).
     Kata kunci tidak pernah ditampilkan di layar. */
const GROUPS = [
  /* RONDE 1 : perjuangan mempertahankan kemerdekaan 1945-1946 */
  {
    pool: [
      { t: 'Pertempuran Surabaya 10 November 1945', k: ['pertempuran surabaya', 'surabaya', '10 november 1945', '10 november'] },
      { t: 'Bandung Lautan Api 24 Maret 1946', k: ['bandung lautan api', 'lautan api', 'bandung', '24 maret 1946'] },
      { t: 'Pertempuran Ambarawa', k: ['pertempuran ambarawa', 'ambarawa'] },
      { t: 'Pertempuran Lima Hari di Semarang', k: ['lima hari semarang', 'pertempuran lima hari', 'lima hari'] },
      { t: 'Pertempuran Medan Area', k: ['pertempuran medan area', 'medan area'] },
      { t: 'Puputan Margarana 20 November 1946', k: ['puputan margarana', 'margarana', 'puputan bali'] },
      { t: 'Bung Tomo membakar semangat rakyat Surabaya', k: ['bung tomo surabaya', 'bung tomo', 'sutomo'] },
      { t: 'Kedatangan Sekutu dan NICA yang memicu perlawanan', k: ['sekutu', 'nica', 'kedatangan sekutu'] },
      { t: 'Proklamasi Kemerdekaan 17 Agustus 1945', k: ['proklamasi kemerdekaan', 'proklamasi', '17 agustus 1945'] }
    ],
    candidates: [
      { id: 'R1-A', text: 'Sebutkan peristiwa dan tokoh penting perjuangan mempertahankan kemerdekaan tahun 1945 sampai 1946.', pick: [0, 1, 2, 3, 4, 5, 7, 6] },
      { id: 'R1-B', text: 'Sebutkan tokoh dan pertempuran melawan Sekutu dan NICA pada tahun 1945 sampai 1946.', pick: [6, 7, 0, 3, 2, 4, 1, 5] },
      { id: 'R1-C', text: 'Sebutkan peristiwa awal perjuangan setelah Proklamasi Kemerdekaan.', pick: [8, 7, 0, 6, 3, 2, 1, 4] }
    ]
  },

  /* RONDE 2 : agresi dan perundingan Indonesia-Belanda 1946-1949 */
  {
    pool: [
      { t: 'Perjanjian Linggarjati 1946-1947', k: ['perjanjian linggarjati', 'linggarjati', 'linggajati'] },
      { t: 'Agresi Militer Belanda I 1947', k: ['agresi militer belanda i', 'agresi militer belanda 1', 'agresi belanda i', 'agresi belanda 1', 'agresi militer 1', 'agresi 1', 'agresi i'] },
      { t: 'Perjanjian Renville 1948', k: ['perjanjian renville', 'renville'] },
      { t: 'Agresi Militer Belanda II 1948', k: ['agresi militer belanda ii', 'agresi militer belanda 2', 'agresi belanda ii', 'agresi belanda 2', 'agresi militer 2', 'agresi 2', 'agresi ii'] },
      { t: 'Serangan Umum 1 Maret 1949', k: ['serangan umum 1 maret', 'serangan umum 1949', 'serangan umum'] },
      { t: 'Perjanjian Roem-Royen 1949', k: ['roem van royen', 'roem royen', 'roemroyen', 'roem'] },
      { t: 'Konferensi Meja Bundar 1949', k: ['konferensi meja bundar', 'meja bundar', 'kmb'] },
      { t: 'Gerilya Jenderal Sudirman', k: ['gerilya sudirman', 'jenderal sudirman', 'sudirman'] }
    ],
    candidates: [
      { id: 'R2-A', text: 'Sebutkan peristiwa penting perjuangan dan perundingan Indonesia dan Belanda tahun 1946 sampai 1949.', pick: [0, 2, 5, 6, 4, 7, 1, 3] },
      { id: 'R2-B', text: 'Sebutkan peristiwa penting masa revolusi kemerdekaan tahun 1946 sampai 1949.', pick: [3, 1, 4, 7, 2, 0, 5, 6] },
      { id: 'R2-C', text: 'Sebutkan peristiwa penting antara Indonesia dan Belanda pada tahun 1946 sampai 1949.', pick: [1, 3, 2, 0, 4, 5, 6, 7] }
    ]
  },

  /* RONDE 3 : awal negara kesatuan dan Demokrasi Liberal 1950-1955 */
  {
    pool: [
      { t: 'Pembubaran RIS dan terbentuknya NKRI 17 Agustus 1950', k: ['pembubaran ris', 'negara kesatuan', 'nkri'] },
      { t: 'UUDS 1950', k: ['undang undang dasar sementara', 'uuds 1950', 'uuds'] },
      { t: 'Kabinet Natsir', k: ['kabinet natsir', 'natsir'] },
      { t: 'Kabinet Sukiman', k: ['kabinet sukiman', 'sukiman'] },
      { t: 'Kabinet Wilopo', k: ['kabinet wilopo', 'wilopo'] },
      { t: 'Kabinet Ali Sastroamidjojo I', k: ['kabinet ali sastroamidjojo', 'kabinet ali sastroamijoyo', 'ali sastroamidjojo', 'ali sastroamijoyo', 'sastroamidjojo', 'sastroamijoyo', 'kabinet ali 1', 'kabinet ali i'] },
      { t: 'Gerakan Benteng', k: ['gerakan benteng', 'benteng'] },
      { t: 'Nasionalisasi De Javasche Bank', k: ['nasionalisasi de javasche bank', 'de javasche bank', 'nasionalisasi bank'] },
      { t: 'Sistem Ekonomi Ali Baba', k: ['sistem ekonomi ali baba', 'ekonomi ali baba', 'ali baba'] },
      { t: 'Pemberontakan APRA', k: ['pemberontakan apra', 'apra'] },
      { t: 'Pemberontakan Andi Azis', k: ['pemberontakan andi azis', 'pemberontakan andi aziz', 'andi azis', 'andi aziz'] },
      { t: 'Pemberontakan RMS', k: ['republik maluku selatan', 'rms'] },
      { t: 'Pemberontakan DI/TII', k: ['darul islam', 'di tii', 'ditii'] },
      { t: 'Peristiwa 17 Oktober 1952', k: ['peristiwa 17 oktober', '17 oktober 1952', '17 oktober'] }
    ],
    candidates: [
      { id: 'R3-A', text: 'Sebutkan kabinet dan kebijakan pemerintah pada masa Demokrasi Liberal awal.', pick: [2, 3, 4, 5, 6, 8, 7] },
      { id: 'R3-B', text: 'Sebutkan pemberontakan dan peristiwa politik dalam negeri pada tahun 1950 sampai 1952.', pick: [9, 10, 11, 12, 13, 0, 1] },
      { id: 'R3-C', text: 'Sebutkan kebijakan ekonomi, kabinet, dan tonggak awal negara kesatuan.', pick: [0, 1, 6, 7, 8, 2, 4] }
    ]
  },

  /* RONDE 4 : pemilu dan dinamika politik Demokrasi Liberal 1955-1958 */
  {
    pool: [
      { t: 'Pemilu DPR 29 September 1955', k: ['pemilu dpr', 'pemilu 1955', '29 september 1955'] },
      { t: 'Pemilihan Konstituante 15 Desember 1955', k: ['pemilihan konstituante', 'konstituante', '15 desember 1955'] },
      { t: 'PNI (Partai Nasional Indonesia)', k: ['partai nasional indonesia', 'pni'] },
      { t: 'Masyumi', k: ['partai masyumi', 'masyumi'] },
      { t: 'NU (Nahdlatul Ulama)', k: ['nahdlatul ulama', 'nahdhatul ulama', 'nu'] },
      { t: 'PKI (Partai Komunis Indonesia)', k: ['partai komunis indonesia', 'pki'] },
      { t: 'Konferensi Asia Afrika 1955 dengan hasil Dasasila Bandung', k: ['dasasila bandung', 'konferensi asia afrika', 'asia afrika', 'kaa'] },
      { t: 'Deklarasi Djuanda 13 Desember 1957', k: ['deklarasi djuanda', 'deklarasi juanda', 'djuanda', 'juanda', 'wawasan nusantara'] },
      { t: 'Konsepsi Presiden 1957', k: ['konsepsi presiden', 'konsepsi'] },
      { t: 'Pemberontakan PRRI Permesta 1958', k: ['prri permesta', 'prri', 'permesta'] }
    ],
    candidates: [
      { id: 'R4-A', text: 'Sebutkan partai besar dan pemilu yang berlangsung pada tahun 1955.', pick: [2, 3, 4, 5, 0, 1] },
      { id: 'R4-B', text: 'Sebutkan peristiwa politik penting pada tahun 1955 sampai 1958.', pick: [0, 6, 7, 8, 9, 1] },
      { id: 'R4-C', text: 'Sebutkan partai dan peristiwa politik pada masa Demokrasi Liberal 1955 sampai 1958.', pick: [3, 5, 6, 7, 9, 4] }
    ]
  },

  /* RONDE 5 : akhir Orde Lama 1959-1966 */
  {
    pool: [
      { t: 'Dekrit Presiden 5 Juli 1959', k: ['dekrit presiden', 'dekrit', '5 juli 1959'] },
      { t: 'Demokrasi Terpimpin', k: ['demokrasi terpimpin', 'terpimpin'] },
      { t: 'Trikora 1961', k: ['tri komando rakyat', 'trikora'] },
      { t: 'Konfrontasi Malaysia dan Dwikora 1963-1966', k: ['konfrontasi malaysia', 'ganyang malaysia', 'konfrontasi', 'dwikora', 'dwi komando rakyat'] },
      { t: 'Peristiwa G30S 1965', k: ['30 september 1965', 'g30s pki', 'g30s', 'g 30 s pki', 'g 30 s', 'gestapu'] },
      { t: 'Supersemar 11 Maret 1966', k: ['surat perintah 11 maret', '11 maret 1966', 'supersemar'] }
    ],
    candidates: [
      { id: 'R5-A', text: 'Sebutkan kebijakan dan peristiwa penting masa Orde Lama tahun 1959 sampai 1966.', pick: [0, 1, 2, 3, 5] },
      { id: 'R5-B', text: 'Sebutkan peristiwa dan kebijakan yang mewarnai masa Demokrasi Terpimpin.', pick: [4, 5, 3, 1, 0] },
      { id: 'R5-C', text: 'Sebutkan dekrit, surat perintah, atau komando yang dikeluarkan Presiden Soekarno.', pick: [0, 5, 2, 3] }
    ]
  }
];

/* ---------- Fungsi pencocokan jawaban ---------- */

function norm(s) {
  return String(s).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function findMatches(input, pool) {
  let text = ' ' + norm(input) + ' ';
  const entries = [];
  pool.forEach((item, i) => item.k.forEach(k => entries.push({ i, k: norm(k) })));
  entries.sort((a, b) => b.k.length - a.k.length);

  const hit = new Set();
  for (const { i, k } of entries) {
    const needle = ' ' + k + ' ';
    if (text.includes(needle)) {
      hit.add(i);
      text = text.split(needle).join(' ');
    }
  }
  return [...hit];
}

  /* ---------- STATE ---------- */
  const state = {
    scores: [0, 0],
    usedIds: [],
    rounds: [],
    current: 0,
    furthest: -1,
    over: false,
    selected: -1,
    boardKey: null,
    locked: false,
    lockTimer: null
  };

  let muted = false;
  const reduceMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  const $ = (id) => document.getElementById(id);
  const cur = () => state.rounds[state.current] || null;
  const isReadOnly = () => state.current !== state.furthest;

  /* =========================================================
     SUARA (Web Audio API, tanpa library dan tanpa file eksternal)
     ========================================================= */
  let audioCtx = null;
  let masterGain = null;

  function getAudio() {
    if (!audioCtx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      audioCtx = new AC();
      masterGain = audioCtx.createGain();
      masterGain.gain.value = 0.3;
      masterGain.connect(audioCtx.destination);
    }
    if (audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
  }

  function playTone(freq, startOffset, duration, type, peak) {
    if (muted) return;
    const ctx = getAudio();
    if (!ctx) return;
    const t0 = ctx.currentTime + startOffset;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.linearRampToValueAtTime(peak, t0 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
    osc.connect(gain);
    gain.connect(masterGain);
    osc.start(t0);
    osc.stop(t0 + duration + 0.05);
  }

  /* Suara benar: chime gembira dua nada naik (523 Hz lalu 659 Hz, sine) */
  function playCorrectSound() {
    playTone(523, 0, 0.25, 'sine', 0.9);
    playTone(659, 0.25, 0.25, 'sine', 0.9);
  }

  /* Suara salah: buzzer satu nada rendah 150 Hz (sawtooth, sekitar setengah detik) */
  function playWrongSound() {
    playTone(150, 0, 0.5, 'sawtooth', 0.7);
  }

  /* Suara kemenangan: fanfare naik 523, 659, 784, 1047 Hz (triangle, sekitar 1,5 detik) */
  function playWinSound() {
    const notes = [523, 659, 784, 1047];
    notes.forEach((f, i) => playTone(f, i * 0.375, 0.375, 'triangle', 0.9));
  }

  /* Mute / unmute */
  function renderMute() {
    const b = $('btn-mute');
    b.textContent = muted ? '🔇' : '🔊';
    b.setAttribute('aria-label', muted ? 'Suara mati, klik untuk menyalakan' : 'Suara menyala, klik untuk mematikan');
    b.title = b.getAttribute('aria-label');
  }

  function toggleMute() {
    muted = !muted;
    try {
      localStorage.setItem(MUTE_KEY, muted ? '1' : '0');
    } catch (e) { /* abaikan jika storage tidak tersedia */ }
    renderMute();
  }

  function loadMute() {
    try {
      muted = localStorage.getItem(MUTE_KEY) === '1';
    } catch (e) {
      muted = false;
    }
  }

  /* =========================================================
     ANTRIAN EFEK (agar overlay tidak bertumpuk)
     ========================================================= */
  const fxQueue = [];
  let fxBusy = false;

  function queueFx(fn, duration) {
    fxQueue.push({ fn, duration });
    pumpFx();
  }

  function pumpFx() {
    if (fxBusy || fxQueue.length === 0) return;
    fxBusy = true;
    const item = fxQueue.shift();
    item.fn();
    setTimeout(() => {
      fxBusy = false;
      pumpFx();
    }, item.duration);
  }

  function showXOverlay() {
    const el = $('x-overlay');
    el.classList.remove('show');
    void el.offsetWidth;
    el.classList.add('show');
  }

  function floatPoints(team, pts) {
    const layer = $('float-' + team);
    const el = document.createElement('div');
    el.className = 'float-txt';
    el.textContent = 'TAMBAH ' + pts + ' POIN';
    layer.appendChild(el);
    setTimeout(() => el.remove(), 1200);
  }

  function blinkTeam(t) {
    const el = $('team-' + t);
    el.classList.remove('blink');
    void el.offsetWidth;
    el.classList.add('blink');
    setTimeout(() => el.classList.remove('blink'), 3300);
  }

  /* =========================================================
     UTILITAS PENCOCOKAN JAWABAN
     ========================================================= */
  function levenshtein(a, b) {
    const m = a.length;
    const n = b.length;
    if (m === 0) return n;
    if (n === 0) return m;
    let prev = [];
    for (let j = 0; j <= n; j++) prev[j] = j;
    for (let i = 1; i <= m; i++) {
      const cur = [i];
      for (let j = 1; j <= n; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
      }
      prev = cur;
    }
    return prev[n];
  }

  /* Mengembalikan indeks jawaban yang cocok (belum terbuka), atau -1. */
  function matchAnswer(rs, norm) {
    let fuzzy = -1;
    for (let i = 0; i < rs.answers.length; i++) {
      if (rs.opened[i]) continue;
      const keys = rs.answers[i].k;
      for (let j = 0; j < keys.length; j++) {
        const k = keys[j];
        if (norm === k) return i;
        if (k.length > 4 && fuzzy < 0 && levenshtein(norm, k) <= 2) fuzzy = i;
      }
    }
    return fuzzy;
  }

  /* =========================================================
     PEMBUATAN RONDE
     ========================================================= */
  function makeRound(r, q) {
    const pool = GROUPS[r].pool;
    return {
      q: q,
      answers: q.pick.map((pi, idx) => ({
        t: pool[pi].t,
        k: pool[pi].k,
        pts: ROUND_POINTS[r][idx]
      })),
      opened: q.pick.map(() => false),
      strikes: [0, 0],
      pool: 0,
      gained: 0,
      owner: 0,
      steal: -1,
      phase: 'rebutan',
      presses: [],
      fastest: -1,
      done: false,
      winner: -1
    };
  }

  function startRound(r) {
    const group = GROUPS[r];
    const q = group.candidates.find((c) => state.usedIds.indexOf(c.id) < 0);
    if (!q) return false;
    state.usedIds.push(q.id);
    state.rounds[r] = makeRound(r, q);
    state.furthest = r;
    state.current = r;
    state.selected = -1;
    state.boardKey = null;
    clearTimeout(state.lockTimer);
    state.locked = false;
    $('transfer-msg').textContent = '';
    return true;
  }

  function resetGame() {
    state.scores = [0, 0];
    state.usedIds = [];
    state.rounds = [];
    state.current = 0;
    state.furthest = -1;
    state.over = false;
    state.selected = -1;
    state.boardKey = null;
    clearTimeout(state.lockTimer);
    state.locked = false;
    closeModal('modal-settings');
    closeModal('modal-win');
    $('fx-layer').innerHTML = '';
    setMsg('');
    startRound(0);
    renderAll();
  }

  /* Mengakhiri ronde: poin ronde yang terkumpul masuk ke skor tim pemenang ronde */
  function finishRound(r, winner) {
    const rs = state.rounds[r];
    if (!rs || rs.done) return;
    rs.done = true;
    rs.phase = 'selesai';
    rs.steal = -1;
    rs.winner = winner;
    rs.gained = rs.pool;
    state.scores[winner] += rs.pool;
    clearTimeout(state.lockTimer);
    state.locked = false;
    setMsg(rs.gained > 0
      ? 'Ronde selesai. ' + rs.gained + ' poin untuk ' + TEAM_NAMES[winner] + '.'
      : 'Ronde selesai.');
    renderAll();
    if (r === TOTAL_ROUNDS - 1) {
      setTimeout(() => showVictory(false), 1400);
    }
  }

  /* Lanjut ke ronde berikutnya (atau akhiri permainan jika bank soal habis) */
  function goNext() {
    if (state.over || state.furthest < 0) return;
    const fr = state.furthest;
    const rs = state.rounds[fr];
    if (!rs.done) finishRound(fr, rs.owner);
    if (fr >= TOTAL_ROUNDS - 1) {
      renderAll();
      showVictory(false);
      return;
    }
    if (!startRound(fr + 1)) {
      state.over = true;
      setMsg('Bank soal habis. Permainan diakhiri lebih awal.', 'warn');
      renderAll();
      showVictory(true);
      return;
    }
    setMsg('');
    renderAll();
  }

  /* =========================================================
     AKSI BABAK REBUTAN
     ========================================================= */
  function onBuzz(t) {
    const rs = cur();
    if (!rs || rs.done || isReadOnly() || rs.phase !== 'rebutan') return;
    if (rs.presses.indexOf(t) >= 0) return;
    rs.presses.push(t);
    if (rs.presses.length === 2) {
      rs.phase = 'pilih';
      rs.fastest = rs.presses[0];
    }
    renderAll();
  }

  function onChoose(main) {
    const rs = cur();
    if (!rs || rs.phase !== 'pilih' || isReadOnly()) return;
    rs.owner = main ? rs.fastest : 1 - rs.fastest;
    rs.phase = 'main';
    state.selected = -1;
    setMsg(TEAM_NAMES[rs.owner] + (main
      ? ' langsung bermain di papan jawaban.'
      : ' mendapat giliran bermain setelah lemparan.'));
    renderAll();
    focusInput();
  }

  function onUlangRebutan() {
    const rs = cur();
    if (!rs || rs.done || isReadOnly()) return;
    rs.presses = [];
    rs.fastest = -1;
    rs.phase = 'rebutan';
    setMsg('Rebutan diulang.');
    renderAll();
  }

  /* =========================================================
     AKSI PAPAN JAWABAN
     ========================================================= */
  function activeTeam(rs) {
    return rs.steal >= 0 ? rs.steal : rs.owner;
  }

  function canAnswer() {
    const rs = cur();
    return !!rs && !rs.done && rs.phase === 'main' && !isReadOnly() && !state.locked;
  }

  function openAnswer(idx, team) {
    const rs = cur();
    if (!rs || rs.opened[idx]) return;
    rs.opened[idx] = true;
    const pts = rs.answers[idx].pts;
    rs.pool += pts;
    state.selected = -1;
    queueFx(() => {
      playCorrectSound();
      floatPoints(team, pts);
    }, 1000);

    if (rs.steal >= 0) {
      setMsg(TEAM_NAMES[rs.steal] + ' berhasil mencuri!');
      finishRound(state.furthest, rs.steal);
      return;
    }
    if (rs.opened.every(Boolean)) {
      finishRound(state.furthest, rs.owner);
      return;
    }
    renderAll();
  }

  function onSubmit() {
    if (!canAnswer()) return;
    const input = $('answer-input');
    const norm = input.value.trim().toLowerCase();
    if (!norm) return;
    const rs = cur();
    const idx = matchAnswer(rs, norm);
    if (idx < 0) {
      setMsg('Belum cocok coba cek manual', 'warn');
      focusInput();
      return;
    }
    input.value = '';
    setMsg('');
    openAnswer(idx, activeTeam(rs));
    focusInput();
  }

  function startSteal(rs) {
    rs.steal = 1 - rs.owner;
    state.locked = true;
    clearTimeout(state.lockTimer);
    state.lockTimer = setTimeout(() => {
      state.locked = false;
      renderAll();
    }, 2500);
    blinkTeam(rs.owner);
    setMsg(TEAM_NAMES[rs.owner] + ' kehabisan kesempatan. ' + TEAM_NAMES[rs.steal] + ' mendapat satu kesempatan mencuri.', 'warn');
  }

  function onWrong() {
    if (!canAnswer()) return;
    const rs = cur();
    const owner = rs.owner;
    queueFx(() => {
      playWrongSound();
      showXOverlay();
    }, 900);
    $('answer-input').value = '';

    if (rs.steal >= 0) {
      setMsg('Curian gagal. Poin tetap milik ' + TEAM_NAMES[owner] + '.', 'warn');
      finishRound(state.furthest, owner);
      return;
    }

    rs.strikes[owner] += 1;
    if (rs.strikes[owner] >= 3) {
      startSteal(rs);
    } else {
      setMsg('Jawaban salah.', 'warn');
    }
    renderAll();
    focusInput();
  }

  function onCorrectManual() {
    if (!canAnswer()) return;
    const rs = cur();
    if (state.selected < 0 || rs.opened[state.selected]) {
      setMsg('Pilih dulu bar jawaban yang ingin dibuka.', 'warn');
      return;
    }
    setMsg('');
    openAnswer(state.selected, activeTeam(rs));
  }

  function onBarClick(idx) {
    const rs = cur();
    if (!rs || rs.done || isReadOnly() || rs.phase !== 'main') return;
    if (rs.opened[idx]) return;
    state.selected = idx;
    updateBars(rs);
  }

  function onSwap() {
    const rs = cur();
    if (!rs || rs.done || isReadOnly() || rs.phase !== 'main' || rs.steal >= 0) return;
    rs.owner = 1 - rs.owner;
    state.selected = -1;
    setMsg('Giliran dipindah ke ' + TEAM_NAMES[rs.owner] + '.');
    renderAll();
  }

  function onBackRebutan() {
    const rs = cur();
    if (!rs || rs.done || isReadOnly() || rs.phase !== 'main' || rs.steal >= 0) return;
    rs.phase = 'rebutan';
    rs.presses = [];
    rs.fastest = -1;
    state.selected = -1;
    setMsg('Kembali ke babak rebutan.');
    renderAll();
  }

  function onTransfer() {
    const rs = cur();
    if (!rs || rs.done || isReadOnly()) return;
    const to = Number($('transfer-to').value);
    if (rs.pool <= 0) {
      $('transfer-msg').textContent = 'Tidak ada poin ronde untuk ditransfer.';
      return;
    }
    const amt = rs.pool;
    state.scores[to] += amt;
    rs.pool = 0;
    $('transfer-msg').textContent = amt + ' poin dipindahkan ke ' + TEAM_NAMES[to] + '.';
    renderAll();
  }

  function onViewQuestion() {
    const el = $('question-box');
    el.classList.remove('flash');
    void el.offsetWidth;
    el.classList.add('flash');
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  /* =========================================================
     AKSI TOMBOL BERISIKO (selalu lewat konfirmasi)
     ========================================================= */
  function confirmAct(message, fn) {
    if (window.confirm(message)) fn();
  }

  function onResetStrikes() {
    const rs = cur();
    if (!rs || rs.done || isReadOnly()) return;
    rs.strikes = [0, 0];
    rs.steal = -1;
    clearTimeout(state.lockTimer);
    state.locked = false;
    setMsg('Tanda silang di ronde ini sudah direset.');
    renderAll();
  }

  function onOpenAll() {
    const rs = cur();
    if (!rs || rs.done || isReadOnly()) return;
    rs.opened = rs.opened.map(() => true);
    finishRound(state.furthest, rs.owner);
  }

  function onNextRoundConfirmed() {
    closeModal('modal-settings');
    if (isReadOnly()) state.current = state.furthest;
    goNext();
  }

  function onNextArrow() {
    if (isReadOnly()) {
      state.current += 1;
      state.selected = -1;
      renderAll();
      return;
    }
    const rs = cur();
    if (rs && !rs.done && !window.confirm('Ronde ini belum selesai. Tetap lanjut ke ronde berikutnya?')) return;
    goNext();
  }

  function goPrev() {
    if (state.current <= 0) return;
    state.current -= 1;
    state.selected = -1;
    renderAll();
  }

  /* =========================================================
     KEMENANGAN
     ========================================================= */
  function showVictory(early) {
    if (isOpen('modal-win')) return;
    const a = state.scores[0];
    const b = state.scores[1];
    let title;
    if (a > b) title = 'TIM 1 MENANG!';
    else if (b > a) title = 'TIM 2 MENANG!';
    else title = 'HASIL SERI';

    $('win-title').textContent = title;
    $('win-s0').textContent = a;
    $('win-s1').textContent = b;
    $('win-total').textContent = a + b;
    $('win-note').textContent = early
      ? 'Bank soal habis, permainan diakhiri lebih awal.'
      : 'Semua ronde telah selesai.';
    openModal('modal-win');

    if (a === b) {
      playCorrectSound();
      spawnSparkles();
    } else {
      playWinSound();
      spawnConfetti();
    }
  }

  function spawnConfetti() {
    if (reduceMotion) return;
    const layer = $('fx-layer');
    const colors = ['#f5c542', '#ff7eb6', '#5ec8ff', '#7bf0a4', '#ffffff', '#ff5b5b'];
    for (let i = 0; i < 120; i++) {
      const p = document.createElement('span');
      p.className = 'confetti';
      p.style.left = (Math.random() * 100) + 'vw';
      p.style.background = colors[i % colors.length];
      p.style.animationDuration = (2.5 + Math.random() * 2) + 's';
      p.style.animationDelay = (Math.random() * 1.2) + 's';
      layer.appendChild(p);
    }
    setTimeout(() => {
      layer.innerHTML = '';
    }, 6000);
  }

  /* Untuk hasil seri: kilau lembut yang lebih netral */
  function spawnSparkles() {
    if (reduceMotion) return;
    const layer = $('fx-layer');
    for (let i = 0; i < 30; i++) {
      const s = document.createElement('span');
      s.className = 'sparkle';
      s.style.left = (Math.random() * 90 + 5) + 'vw';
      s.style.top = (Math.random() * 80 + 10) + 'vh';
      s.style.animationDelay = (Math.random() * 1.5) + 's';
      layer.appendChild(s);
    }
    setTimeout(() => {
      layer.innerHTML = '';
    }, 5000);
  }

  /* =========================================================
     MODAL & PESAN
     ========================================================= */
  function openModal(id) {
    $(id).classList.add('open');
  }

  function closeModal(id) {
    $(id).classList.remove('open');
  }

  function isOpen(id) {
    return $(id).classList.contains('open');
  }

  function setMsg(text, kind) {
    const el = $('msg');
    el.textContent = text || '';
    el.className = 'msg' + (kind === 'warn' ? ' warn' : '');
  }

  function focusInput() {
    const el = $('answer-input');
    if (el && !el.disabled) el.focus();
  }

  function showScreen(name) {
    document.querySelectorAll('.screen').forEach((s) => {
      s.classList.toggle('active', s.id === 'screen-' + name);
    });
  }

  /* =========================================================
     RENDER
     ========================================================= */
  function buildBars(rs) {
    const wrap = $('bars');
    wrap.innerHTML = '';
    rs.answers.forEach((a, i) => {
      const bar = document.createElement('div');
      bar.className = 'bar';
      bar.dataset.idx = String(i);
      bar.innerHTML =
        '<div class="bar-inner">' +
          '<div class="face front">' +
            '<span class="num">' + (i + 1) + '</span>' +
            '<span class="dots">' + '•'.repeat(14) + '</span>' +
            '<span class="qbox">?</span>' +
          '</div>' +
          '<div class="face back">' +
            '<span class="num">' + (i + 1) + '</span>' +
            '<span class="ans"></span>' +
            '<span class="pts"></span>' +
          '</div>' +
        '</div>';
      wrap.appendChild(bar);
    });
  }

  /* Teks jawaban hanya dimasukkan ke DOM saat bar sudah terbuka */
  function updateBars(rs) {
    const bars = $('bars').children;
    for (let i = 0; i < bars.length; i++) {
      const bar = bars[i];
      if (rs.opened[i] && !bar.classList.contains('open')) {
        bar.querySelector('.ans').textContent = rs.answers[i].t;
        bar.querySelector('.pts').textContent = rs.answers[i].pts;
        bar.classList.add('open');
      }
      bar.classList.toggle('selected', !rs.opened[i] && state.selected === i);
    }
  }

  function renderAll() {
    const rs = cur();
    const r = state.current;
    const ro = isReadOnly();
    const isLast = r === TOTAL_ROUNDS - 1;

    /* Judul & navigasi ronde */
    $('round-title').textContent = 'RONDE ' + (r + 1);
    $('btn-prev').disabled = r <= 0;
    const lastDone = !!rs && state.furthest === TOTAL_ROUNDS - 1 && rs.done && r === state.furthest;
    $('btn-next').disabled = state.over || state.furthest < 0 || lastDone;

    /* Panel tim */
    for (let t = 0; t < 2; t++) {
      $('score-' + t).textContent = state.scores[t];
      const s = rs ? rs.strikes[t] : 0;
      document.querySelectorAll('#strikes-' + t + ' .strike').forEach((m, i) => {
        m.classList.toggle('on', i < s);
      });
      const active = !!rs && rs.phase === 'main' && !rs.done && rs.owner === t;
      $('team-' + t).classList.toggle('active', active);
    }

    /* Kotak soal */
    $('q-text').textContent = rs ? rs.q.text : '';
    const phase = rs ? rs.phase : 'rebutan';
    $('badge-rebutan').classList.toggle('hidden', phase !== 'rebutan');

    const rebutanPhase = phase === 'rebutan' || phase === 'pilih';
    $('rebutan').classList.toggle('hidden', !rebutanPhase);
    $('board').classList.toggle('hidden', rebutanPhase);
    $('guru-rebutan').classList.toggle('hidden', !rebutanPhase);
    $('guru-board').classList.toggle('hidden', rebutanPhase);

    /* ----- Babak rebutan ----- */
    if (rebutanPhase && rs) {
      for (let t = 0; t < 2; t++) {
        const btn = document.querySelector('.btn-buzz[data-team="' + t + '"]');
        const pos = rs.presses.indexOf(t);
        btn.textContent = pos >= 0 ? 'SUDAH MENEKAN' : 'TEKAN UNTUK MENJAWAB';
        btn.disabled = pos >= 0 || rs.phase !== 'rebutan' || ro || rs.done;
        $('buzz-order-' + t).textContent = pos >= 0 ? 'TERCEPAT URUTAN ' + (pos + 1) : '';
      }
      const showAdu = rs.phase === 'pilih';
      $('adu-result').classList.toggle('hidden', !showAdu);
      if (showAdu) $('adu-winner').textContent = TEAM_NAMES[rs.fastest] + ' TERCEPAT';
      $('btn-main').disabled = ro || !showAdu;
      $('btn-lempar').disabled = ro || !showAdu;
      $('btn-ulang').disabled = ro || rs.done;
    }

    /* ----- Papan jawaban ----- */
    if (!rebutanPhase && rs) {
      if (state.boardKey !== state.current) {
        buildBars(rs);
        state.boardKey = state.current;
      }
      updateBars(rs);

      const owner = rs.owner;
      $('board-team').textContent = TEAM_NAMES[owner];
      $('pool').textContent = rs.pool;

      document.querySelectorAll('#board-strikes .circle').forEach((c, i) => {
        const on = i < rs.strikes[owner];
        c.classList.toggle('on', on);
        c.textContent = on ? '✕' : '';
      });

      /* Banner */
      const banner = $('banner');
      let text = '';
      let kind = '';
      if (rs.done) {
        text = 'RONDE SELESAI: ' + TEAM_NAMES[rs.winner] + ' mendapat ' + rs.gained + ' poin';
        kind = 'success';
      } else if (rs.steal >= 0) {
        text = 'GILIRAN TIM HABIS: ' + TEAM_NAMES[rs.steal] + ' punya satu kesempatan mencuri';
        kind = 'danger';
      } else if (rs.strikes[owner] >= 3) {
        text = 'GILIRAN TIM HABIS';
        kind = 'danger';
      }
      banner.textContent = text;
      banner.className = 'banner' + (kind ? ' ' + kind : ' hidden');

      /* Kotak selesai ronde */
      $('finish-box').classList.toggle('hidden', !rs.done);
      if (rs.done) {
        $('finish-text').textContent = isLast
          ? 'Semua ronde selesai.'
          : (ro ? 'Ronde ini sudah selesai.' : 'Ronde selesai. Lanjut ke ronde berikutnya?');
        $('btn-next-round').classList.toggle('hidden', isLast || ro);
        $('btn-show-result').classList.toggle('hidden', !(isLast && !ro));
      }

      /* Status tombol guru */
      const live = !ro && !rs.done && rs.phase === 'main';
      const canAns = canAnswer();
      $('btn-submit').disabled = !canAns;
      $('btn-wrong').disabled = !canAns;
      $('btn-correct').disabled = !canAns;
      $('btn-back-rebutan').disabled = !(live && rs.steal < 0);
      $('btn-swap').disabled = !(live && rs.steal < 0);
      const canTransfer = !ro && !rs.done && rs.pool > 0;
      $('btn-transfer').disabled = !canTransfer;
      $('transfer-to').disabled = !canTransfer;
    }
  }

  /* =========================================================
     BINDING EVENT
     ========================================================= */
  function bindEvents() {
    $('btn-mute').addEventListener('click', toggleMute);

    $('btn-play').addEventListener('click', () => {
      getAudio();
      resetGame();
      showScreen('game');
    });

    $('btn-prev').addEventListener('click', goPrev);
    $('btn-next').addEventListener('click', onNextArrow);

    document.querySelectorAll('.btn-buzz').forEach((b) => {
      b.addEventListener('click', () => onBuzz(Number(b.dataset.team)));
    });
    $('btn-main').addEventListener('click', () => onChoose(true));
    $('btn-lempar').addEventListener('click', () => onChoose(false));
    $('btn-ulang').addEventListener('click', onUlangRebutan);

    $('btn-submit').addEventListener('click', onSubmit);
    $('answer-input').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        onSubmit();
      }
    });
    $('btn-view-q').addEventListener('click', onViewQuestion);
    $('btn-correct').addEventListener('click', onCorrectManual);
    $('btn-wrong').addEventListener('click', onWrong);
    $('btn-swap').addEventListener('click', onSwap);
    $('btn-back-rebutan').addEventListener('click', onBackRebutan);
    $('btn-transfer').addEventListener('click', onTransfer);

    $('bars').addEventListener('click', (e) => {
      const bar = e.target.closest('.bar');
      if (bar) onBarClick(Number(bar.dataset.idx));
    });

    document.querySelectorAll('.btn-settings').forEach((b) => {
      b.addEventListener('click', () => openModal('modal-settings'));
    });
    $('btn-close-settings').addEventListener('click', () => closeModal('modal-settings'));
    $('btn-reset-x').addEventListener('click', () =>
      confirmAct('Reset semua tanda silang di ronde ini?', onResetStrikes));
    $('btn-open-all').addEventListener('click', () =>
      confirmAct('Buka semua jawaban yang tersisa tanpa menambah poin?', onOpenAll));
    $('btn-next-risky').addEventListener('click', () =>
      confirmAct('Pindah ke ronde berikutnya?', onNextRoundConfirmed));
    $('btn-reset-game').addEventListener('click', () =>
      confirmAct('Reset game dari awal dengan skor nol?', resetGame));

    $('btn-next-round').addEventListener('click', () =>
      confirmAct('Lanjut ke ronde berikutnya?', onNextRoundConfirmed));
    $('btn-show-result').addEventListener('click', () => showVictory(false));

    $('btn-again').addEventListener('click', resetGame);
    $('btn-win-close').addEventListener('click', () => closeModal('modal-win'));

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal('modal-settings');
    });

    /* AudioContext hanya dibuat/dilanjutkan setelah interaksi pertama pengguna */
    document.addEventListener('pointerdown', () => getAudio(), { passive: true });
    document.addEventListener('keydown', () => getAudio());
  }

  /* =========================================================
     INISIALISASI
     ========================================================= */
  function init() {
    loadMute();
    renderMute();
    bindEvents();
    showScreen('start');
  }

  init();
})();

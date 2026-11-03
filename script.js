/* Terminal Quiz: APC 440 Module 11 Show What You Know
   Part 1: drag each command onto what it does.
   Part 2: type the commands in a practice terminal that tracks your folder.
   Scores count first tries only. Students can replay either part as often as they like;
   the best score for each part is kept until the page is reloaded. */
(function () {
  'use strict';

  var SECRET = 'apc440-m11-tq-7Kp2Vx9Q';
  var NAME_KEY = 'apc440-m11-terminal-quiz-name';
  var MODULE_LABEL = 'Module 11';

  /* ---------- Part 1 content ---------- */
  var MATCH = [
    { id: 'cd-up', cmd: 'cd ..', def: 'Go back up one folder level.' },
    { id: 'cd-in', cmd: 'cd node-lab-11', def: 'Move into the node-lab-11 folder.' },
    { id: 'ci', cmd: 'npm ci', def: 'Clean install: delete node_modules and install the exact package versions listed in package-lock.json.' },
    { id: 'dev', cmd: 'npm run dev', def: 'Run the "dev" script from package.json, usually a development server that restarts or reloads when you save.' },
    { id: 'start', cmd: 'npm start', def: 'Run the "start" script from package.json. For a Node.js app, this usually starts the server.' },
    { id: 'npmv', cmd: 'npm -v', def: 'Show which version of npm is installed.' },
    { id: 'add', cmd: 'git add -A', def: 'Stage every change in the repository (new, edited, and deleted files) for the next commit.' },
    { id: 'clone', cmd: 'git clone <repo-url>', def: 'Copy a repository from GitHub onto your computer.' },
    { id: 'commit', cmd: 'git commit -m "message"', def: 'Save the staged changes as a snapshot, with a short description of what you did.' },
    { id: 'push', cmd: 'git push', def: 'Send your new commits from your computer up to GitHub.' },
    { id: 'tag', cmd: 'git tag module-11', def: 'Put a name label on the current commit so this version is easy to find later.' },
    { id: 'pushtag', cmd: 'git push origin module-11', def: 'Send the module-11 tag from your computer up to GitHub.' }
  ];

  /* ---------- Part 2 content ---------- */
  var KNOWN = ['cd', 'ls', 'pwd', 'mkdir', 'git', 'npm', 'node', 'npx', 'clear', 'dir'];

  function cdTarget(cmd) {
    var m = /^cd (\S+)$/.exec(cmd);
    if (!m) return null;
    var t = m[1];
    if (t === '..' || t === '../') return '..';
    return t.replace(/^\.\//, '').replace(/\/$/, '');
  }
  function oneOf() {
    var alts = Array.prototype.slice.call(arguments);
    return function (cmd) { return alts.indexOf(cmd) !== -1; };
  }
  function cdInto(nameFn) {
    return function (cmd, st) { var t = cdTarget(cmd); return t !== null && t !== '..' && t === nameFn(st); };
  }
  function lsLines(st) { return [{ c: 't-out', t: kids(st).join('    ') }]; }

  var TASKS = [
    {
      task: function () { return 'Print the full path of the folder you are in right now.'; },
      answer: function () { return 'pwd'; },
      hint: 'This command\'s name stands for "print working directory."',
      check: oneOf('pwd'),
      run: function (st) { return [{ c: 't-out', t: '/home/student' + (st.cwd.length ? '/' + st.cwd.join('/') : '') }]; }
    },
    {
      task: function () { return 'List what is inside this folder.'; },
      answer: function () { return 'ls'; },
      hint: 'It is a two-letter command, short for "list."',
      check: oneOf('ls'),
      run: lsLines
    },
    {
      task: function () { return 'Move into the projects folder.'; },
      answer: function () { return 'cd projects'; },
      hint: 'Use cd, a space, then the folder name.',
      check: cdInto(function () { return 'projects'; }),
      run: function (st) { st.cwd.push('projects'); return []; }
    },
    {
      task: function () { return 'Copy your Lab 11 repository from GitHub onto your computer. Its link is <code>https://github.com/your-username/node-lab-11</code>'; },
      answer: function () { return 'git clone https://github.com/your-username/node-lab-11'; },
      hint: 'Start with git clone, then a space, then the full link that starts with https://github.com/',
      check: function (cmd) {
        var m = /^git clone https:\/\/github\.com\/[A-Za-z0-9_.-]+\/([A-Za-z0-9_.-]+?)(?:\.git)?\/?$/.exec(cmd);
        return m ? { repo: m[1], url: cmd.slice(10) } : false;
      },
      run: function (st, res) {
        st.repo = res.repo;
        st.repoUrl = res.url.replace(/\/$/, '').replace(/\.git$/, '') + '.git';
        addDir(st, res.repo);
        return [
          { c: 't-out', t: 'Cloning into \'' + res.repo + '\'...' },
          { c: 't-out', t: 'remote: Enumerating objects: 24, done.' },
          { c: 't-out', t: 'Receiving objects: 100% (24/24), 9.81 KiB | 1.4 MiB/s, done.' }
        ];
      }
    },
    {
      task: function () { return 'Check that the new folder is here. List what is inside the projects folder.'; },
      answer: function () { return 'ls'; },
      hint: 'Same two-letter command you used earlier.',
      check: oneOf('ls'),
      run: lsLines
    },
    {
      task: function (st) { return 'Move into the <code>' + esc(st.repo) + '</code> folder that git clone just made.'; },
      answer: function (st) { return 'cd ' + st.repo; },
      hint: 'Use cd, a space, then the folder name exactly as ls showed it.',
      check: cdInto(function (st) { return st.repo; }),
      run: function (st) { st.cwd.push(st.repo); return []; }
    },
    {
      task: function () { return 'Check which version of Node.js is installed.'; },
      answer: function () { return 'node -v'; },
      hint: 'Start with node, then the short flag for "version."',
      check: oneOf('node -v'),
      run: function () { return [{ c: 't-out', t: 'v24.11.0' }]; }
    },
    {
      task: function () { return 'Check which version of npm is installed.'; },
      answer: function () { return 'npm -v'; },
      hint: 'Same flag as the last one, but for npm.',
      check: oneOf('npm -v'),
      run: function () { return [{ c: 't-out', t: '11.6.2' }]; }
    },
    {
      task: function () { return 'Install the exact package versions listed in package-lock.json, starting from a clean slate.'; },
      answer: function () { return 'npm ci'; },
      hint: 'The two letters after npm stand for "clean install."',
      check: oneOf('npm ci'),
      wrong: { 'npm install': 'npm install works, but it can change package-lock.json. This task wants the clean install that matches package-lock.json exactly.', 'npm i': 'npm i is npm install, which can change package-lock.json. This task wants the clean install.' },
      run: function () {
        return [
          { c: 't-out', t: 'added 68 packages, and audited 69 packages in 3s' },
          { c: 't-out', t: 'found 0 vulnerabilities' }
        ];
      }
    },
    {
      task: function () { return 'Run the project\'s "start" script to launch your server.'; },
      answer: function () { return 'npm start'; },
      hint: 'npm, a space, then the name of the script.',
      check: oneOf('npm start', 'npm run start'),
      run: function (st) {
        return [
          { c: 't-muted', t: '> ' + st.repo + '@1.0.0 start' },
          { c: 't-muted', t: '> node server.js' },
          { c: 't-out', t: 'Server running at http://localhost:3000' },
          { c: 't-note', t: '(You pressed Ctrl+C to stop the server.)' }
        ];
      }
    },
    {
      task: function () { return 'Run the "dev" script, which starts the server in watch mode so it restarts every time you save.'; },
      answer: function () { return 'npm run dev'; },
      hint: 'Only start can skip the word run. Every other script needs npm run, then the script name.',
      check: oneOf('npm run dev'),
      wrong: { 'npm dev': 'npm only lets you skip the word run for start. For any other script, type npm run before the script name.' },
      run: function (st) {
        return [
          { c: 't-muted', t: '> ' + st.repo + '@1.0.0 dev' },
          { c: 't-muted', t: '> node --watch server.js' },
          { c: 't-out', t: 'Server running at http://localhost:3000' },
          { c: 't-note', t: '(You pressed Ctrl+C to stop the server.)' }
        ];
      }
    },
    {
      task: function () { return 'Make a new folder named <code>public</code> to hold your lesson pages.'; },
      answer: function () { return 'mkdir public'; },
      hint: 'The command is short for "make directory."',
      check: oneOf('mkdir public'),
      run: function (st) { addDir(st, 'public'); return []; }
    },
    {
      task: function () { return 'You added a page to public and edited server.js. Before you commit, see which files changed.'; },
      answer: function () { return 'git status'; },
      hint: 'git, then a word that means "current condition."',
      check: oneOf('git status'),
      run: function () {
        return [
          { c: 't-out', t: 'On branch main' },
          { c: 't-out', t: 'Changes not staged for commit:' },
          { c: 't-err', t: '        modified:   server.js' },
          { c: 't-out', t: 'Untracked files:' },
          { c: 't-err', t: '        public/' }
        ];
      }
    },
    {
      task: function () { return 'Stage every change in the repository (new, edited, and deleted files) for your next commit.'; },
      answer: function () { return 'git add -A'; },
      hint: 'git add, then the flag that means "all." It is a capital letter.',
      check: oneOf('git add -A'),
      wrong: {
        'git add .': 'Close! git add . stages changes in the current folder and below. This course uses git add -A, which stages every change in the whole repository.',
        'git add --all': 'That is the long form, and it works. For this quiz, use the short flag you practiced in Part 1.'
      },
      run: function () { return []; }
    },
    {
      task: function () { return 'Save the staged changes as a snapshot, with a short message in quotes that describes what you did.'; },
      answer: function () { return 'git commit -m "Add public folder"'; },
      hint: 'git commit, the flag for "message," then your message inside quotes.',
      check: function (cmd) {
        var m = /^git commit -m (?:"([^"]*\S[^"]*)"|'([^']*\S[^']*)')$/.exec(cmd);
        return m ? { msg: m[1] || m[2] } : false;
      },
      diagnose: function (cmd) {
        if (/^git commit -m [^"']/.test(cmd)) return 'Put your message inside quotes, like git commit -m "Add public folder"';
        if (cmd === 'git commit' || cmd === 'git commit -m') return 'Add -m and a message in quotes. Without a message, git opens a text editor and waits.';
        if (/^git commit -m ("\s*"|'\s*')$/.test(cmd)) return 'Your message is empty. Describe what you changed.';
        return null;
      },
      run: function (st, res) {
        return [
          { c: 't-out', t: '[main 3f2c9a1] ' + res.msg.trim() },
          { c: 't-out', t: ' 2 files changed, 41 insertions(+), 2 deletions(-)' }
        ];
      }
    },
    {
      task: function () { return 'Send your new commit up to GitHub.'; },
      answer: function () { return 'git push'; },
      hint: 'Two words. The opposite of pull.',
      check: oneOf('git push', 'git push origin main'),
      run: function (st) {
        return [
          { c: 't-out', t: 'To ' + st.repoUrl },
          { c: 't-out', t: '   a1b2c3d..3f2c9a1  main -> main' }
        ];
      }
    },
    {
      task: function () { return 'Label this commit with the tag <code>module-11</code> so your instructor can find this version.'; },
      answer: function () { return 'git tag module-11'; },
      hint: 'git tag, then the tag name.',
      check: oneOf('git tag module-11'),
      run: function () { return []; }
    },
    {
      task: function () { return 'Your tag only exists on your computer so far. Send the <code>module-11</code> tag up to GitHub.'; },
      answer: function () { return 'git push origin module-11'; },
      hint: 'git push, then the remote name (origin), then the tag name.',
      check: oneOf('git push origin module-11', 'git push origin --tags'),
      wrong: {
        'git push': 'Plain git push sends commits, but not tags. Name the remote (origin) and the tag.',
        'git push module-11': 'Name the remote first: git push, then origin, then the tag.'
      },
      run: function (st) {
        return [
          { c: 't-out', t: 'To ' + st.repoUrl },
          { c: 't-out', t: ' * [new tag]         module-11 -> module-11' }
        ];
      }
    },
    {
      task: function () { return 'Lab 11 is pushed and tagged. Go back up one folder level to the projects folder.'; },
      answer: function () { return 'cd ..'; },
      hint: 'cd, a space, then two dots.',
      check: function (cmd) { return cdTarget(cmd) === '..'; },
      wrong: { 'cd..': 'Put a space between cd and the two dots.', 'cd projects': 'You are inside your Lab 11 folder, and projects is one level up. Go up one level instead.' },
      run: function (st) { st.cwd.pop(); return []; }
    },
    {
      task: function () { return 'Move into your <code>weather-app</code> folder to look back at your React project.'; },
      answer: function () { return 'cd weather-app'; },
      hint: 'cd, a space, then the folder name.',
      check: cdInto(function () { return 'weather-app'; }),
      run: function (st) { st.cwd.push('weather-app'); return [{ c: 't-note', t: 'Nice work. That is every command in the quiz.' }]; }
    }
  ];

  var TOTAL1 = MATCH.length;
  var TOTAL2 = TASKS.length;
  var GRAND = TOTAL1 + TOTAL2;

  /* ---------- Helpers ---------- */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function h(tag, attrs) {
    var el = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        var v = attrs[k];
        if (v === null || v === undefined || v === false) return;
        if (k === 'class') el.className = v;
        else if (k === 'html') el.innerHTML = v;
        else if (k.slice(0, 2) === 'on' && typeof v === 'function') el.addEventListener(k.slice(2), v);
        else if (v === true) el.setAttribute(k, '');
        else el.setAttribute(k, v);
      });
    }
    for (var i = 2; i < arguments.length; i++) append(el, arguments[i]);
    return el;
  }
  function append(el, c) {
    if (c === null || c === undefined || c === false) return;
    if (Array.isArray(c)) { c.forEach(function (x) { append(el, x); }); return; }
    el.appendChild(typeof c === 'object' ? c : document.createTextNode(String(c)));
  }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (ch) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]; }); }
  function shuffle(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  function announce(msg) {
    var s = $('#sr-status');
    s.textContent = '';
    setTimeout(function () { s.textContent = msg; }, 30);
  }
  function smooth() { return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'; }
  function loadName() { try { return localStorage.getItem(NAME_KEY) || ''; } catch (e) { return ''; } }
  function storeName(v) { try { localStorage.setItem(NAME_KEY, v); } catch (e) { /* storage unavailable */ } }
  function pct(a, b) { return Math.round((a / b) * 100); }
  function byId(id) { for (var i = 0; i < MATCH.length; i++) if (MATCH[i].id === id) return MATCH[i]; return null; }

  /* ---------- Verification code (FNV-1a, 64-bit, base 36) ---------- */
  function normName(name) { return String(name).trim().replace(/\s+/g, ' ').toLowerCase(); }
  function makeCode(name, p1, p2, ts) {
    var str = [normName(name), String(Number(p1)), String(Number(p2)), String(ts).trim(), SECRET].join('|');
    var bytes = new TextEncoder().encode(str);
    var hash = BigInt('0xcbf29ce484222325');
    var prime = BigInt('0x100000001b3');
    var mask = BigInt('0xffffffffffffffff');
    for (var i = 0; i < bytes.length; i++) {
      hash = hash ^ BigInt(bytes[i]);
      hash = (hash * prime) & mask;
    }
    var s = hash.toString(36).toUpperCase();
    while (s.length < 8) s = '0' + s;
    return s.slice(-8);
  }
  function stamp(d) {
    function p(n) { return (n < 10 ? '0' : '') + n; }
    return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()) + ' ' + p(d.getHours()) + ':' + p(d.getMinutes());
  }

  /* ---------- State ---------- */
  var S = {
    view: 'p1',
    best1: null,
    best2: null,
    p1: null,
    p2: null,
    saved: null,
    name: loadName()
  };

  function newP1() {
    return { tray: shuffle(MATCH.map(function (m) { return m.id; })), order: shuffle(MATCH.map(function (m) { return m.id; })), placed: {}, first: {}, sel: null, wrongSlot: null, msg: null, done: false, score: null };
  }
  function newP2() {
    return {
      idx: 0, cwd: [], repo: 'node-lab-11', repoUrl: 'https://github.com/your-username/node-lab-11.git',
      fs: { '': ['Documents', 'projects'], 'projects': ['weather-app'] },
      first: {}, misses: 0, log: [], history: [], hpos: 0, done: false, score: null, fb: null
    };
  }
  function cwdKey(st) { return st.cwd.join('/'); }
  function kids(st) { return (st.fs[cwdKey(st)] || []).slice().sort(function (a, b) { return a.localeCompare(b); }); }
  function addDir(st, name) {
    var k = cwdKey(st);
    st.fs[k] = st.fs[k] || [];
    if (st.fs[k].indexOf(name) === -1) st.fs[k].push(name);
    var child = k ? k + '/' + name : name;
    st.fs[child] = st.fs[child] || [];
  }
  function promptStr(st) { return 'student:~' + (st.cwd.length ? '/' + st.cwd.join('/') : '') + '$'; }

  /* ---------- Progress steps ---------- */
  function renderSteps() {
    var nav = $('#steps');
    var steps = [
      { v: 'p1', label: 'Part 1: Match', done: S.best1 !== null, open: true },
      { v: 'p2', label: 'Part 2: Type', done: S.best2 !== null, open: S.best1 !== null },
      { v: 'results', label: 'Submit', done: !!S.saved, open: S.best1 !== null && S.best2 !== null }
    ];
    nav.replaceChildren(h('ol', null, steps.map(function (s) {
      return h('li', null, h('button', {
        type: 'button', class: 'step-btn', disabled: !s.open,
        'aria-current': S.view === s.v ? 'step' : null,
        onclick: function () { go(s.v); }
      }, s.done ? h('span', { class: 'done-mark', 'aria-hidden': 'true' }, '✓ ') : null, s.label, s.done ? h('span', { class: 'sr-only' }, ' (finished)') : null, !s.open ? h('span', { class: 'sr-only' }, ' (locked until you finish the part before it)') : null));
    })));
  }

  function go(view, fresh) {
    S.view = view;
    if (view === 'p1' && (!S.p1 || fresh)) S.p1 = newP1();
    if (view === 'p2' && (!S.p2 || fresh)) S.p2 = newP2();
    render();
    var main = $('#main');
    main.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: smooth() });
  }
  function render() {
    renderSteps();
    if (S.view === 'p1') renderP1();
    else if (S.view === 'p2') renderP2();
    else renderResults();
  }

  /* ---------- Part 1: matching ---------- */
  function renderP1(focusKey) {
    var p = S.p1;
    var app = $('#app');
    var matchedCount = Object.keys(p.placed).length;

    var intro = h('section', { class: 'card', 'aria-labelledby': 'p1-title' },
      h('div', { class: 'match-head' },
        h('h2', { id: 'p1-title' }, 'Part 1: Match the command'),
        h('span', { class: 'pill' }, matchedCount + ' of ' + TOTAL1 + ' matched')),
      h('ol', { class: 'how' },
        h('li', null, 'Drag a command from the tray at the bottom of the screen onto the description of what it does.'),
        h('li', null, 'No mouse? Select a command button, then select the "Place here" button under a description.'),
        h('li', null, 'Only your first try for each command counts toward your score. Keep going until every command is matched.')));

    var defs = h('div', { class: 'defs', role: 'list', 'aria-label': 'Command descriptions' }, p.order.map(function (id) {
      var m = byId(id);
      var placed = p.placed[id];
      var cls = 'def-card' + (placed ? ' matched' : '') + (p.wrongSlot === id ? ' wrong' : '');
      var slot;
      if (placed) {
        slot = h('div', { class: 'locked' }, h('span', { 'aria-hidden': 'true' }, '✓ '), m.cmd, h('span', { class: 'sr-only' }, ' matched'));
      } else {
        var selCmd = p.sel ? byId(p.sel).cmd : null;
        slot = h('button', {
          type: 'button', class: 'zone' + (p.sel ? ' ready' : ''), 'data-slot': id, 'data-key': 'zone-' + id,
          'aria-label': (selCmd ? 'Place ' + selCmd + ' here: ' : 'Place here: ') + m.def,
          onclick: function () { if (p.sel) place(p.sel, id, true); else { setMsg('info', 'Select or drag a command from the tray first.'); renderP1(); } }
        }, p.sel ? 'Place here' : 'Drop a command here');
      }
      return h('div', { class: cls, 'data-slot': id, role: 'listitem' }, h('p', { class: 'def' }, m.def), slot);
    }));

    var fb = h('p', { class: 'feedback' + (p.msg ? ' ' + p.msg.kind : ''), 'data-key': 'p1-fb' }, p.msg ? p.msg.text : '');

    var trayBody;
    if (p.done) {
      trayBody = h('div', null,
        h('p', null, h('strong', null, 'Part 1 complete. '), p.score + ' of ' + TOTAL1 + ' matched on the first try.'),
        h('div', { class: 'btn-row' },
          h('button', { type: 'button', class: 'btn', 'data-key': 'to-p2', onclick: function () { go('p2', !S.p2 || S.p2.done); } }, S.best2 === null ? 'Start Part 2: Type the commands' : 'Go to Part 2'),
          h('button', { type: 'button', class: 'btn btn-ghost', onclick: function () { go('p1', true); } }, 'Replay Part 1')));
    } else {
      trayBody = h('ul', { class: 'chips', 'aria-label': 'Commands left to match' }, p.tray.map(function (id) {
        var m = byId(id);
        var chip = h('button', {
          type: 'button', class: 'chip', 'data-cmd': id, 'data-key': 'chip-' + id,
          'aria-pressed': p.sel === id ? 'true' : 'false'
        }, m.cmd);
        chip.addEventListener('click', function () {
          if (chip._suppress) { chip._suppress = false; return; }
          p.sel = p.sel === id ? null : id;
          p.msg = p.sel ? { kind: 'info', text: 'Selected ' + m.cmd + '. Now choose the description it matches.' } : null;
          announce(p.sel ? 'Selected ' + m.cmd + '. Now choose Place here under the matching description.' : 'Selection cleared.');
          renderP1('chip-' + id);
        });
        enableDrag(chip, id);
        return h('li', null, chip);
      }));
    }
    var tray = h('section', { class: 'tray', 'aria-labelledby': 'tray-title' },
      h('h3', { id: 'tray-title' }, p.done ? 'All matched' : 'Commands (' + p.tray.length + ' left)'),
      fb, h('div', { class: 'tray-scroll' }, trayBody));

    app.replaceChildren(intro, defs, tray);
    if (focusKey) { var f = $('[data-key="' + focusKey + '"]'); if (f) f.focus({ preventScroll: true }); }
  }

  function setMsg(kind, text) { S.p1.msg = { kind: kind, text: text }; }

  function place(cmdId, slotId, viaKeyboard) {
    var p = S.p1;
    if (p.placed[slotId] || p.tray.indexOf(cmdId) === -1) return;
    var m = byId(cmdId);
    var correct = cmdId === slotId;
    if (p.first[cmdId] === undefined) p.first[cmdId] = correct;
    p.sel = null;
    if (correct) {
      p.placed[slotId] = cmdId;
      p.tray = p.tray.filter(function (x) { return x !== cmdId; });
      p.wrongSlot = null;
      setMsg('ok', '✓ Correct: ' + m.cmd + ' matches "' + m.def + '"');
      announce('Correct. ' + m.cmd + ' matched. ' + p.tray.length + ' commands left.');
      if (!p.tray.length) finishP1();
    } else {
      p.wrongSlot = slotId;
      setMsg('no', '✗ Not that one. ' + m.cmd + ' went back to the tray. Try a different description.');
      announce('Not a match. ' + m.cmd + ' went back to the tray.');
      setTimeout(function () {
        if (S.p1 !== p || p.wrongSlot !== slotId) return;
        p.wrongSlot = null;
        var card = document.querySelector('.def-card[data-slot="' + slotId + '"]');
        if (card) card.classList.remove('wrong');
      }, 1400);
    }
    var nextKey = null;
    if (p.done) nextKey = 'to-p2';
    else if (viaKeyboard) nextKey = correct ? (p.tray[0] ? 'chip-' + p.tray[0] : null) : 'chip-' + cmdId;
    renderP1(nextKey);
  }

  function finishP1() {
    var p = S.p1;
    p.done = true;
    p.score = MATCH.filter(function (m) { return p.first[m.id] === true; }).length;
    S.best1 = S.best1 === null ? p.score : Math.max(S.best1, p.score);
    setMsg('ok', '✓ Part 1 complete: ' + p.score + ' of ' + TOTAL1 + ' on the first try.');
    announce('Part 1 complete. ' + p.score + ' of ' + TOTAL1 + ' matched on the first try.');
    renderSteps();
  }

  /* Pointer drag that works for mouse, pen, and touch. A short tap falls through to click. */
  function enableDrag(chip, id) {
    var start = null, ghost = null, hoverEl = null;
    chip.addEventListener('pointerdown', function (e) {
      if (e.button !== 0) return;
      start = { x: e.clientX, y: e.clientY, pid: e.pointerId };
    });
    chip.addEventListener('pointermove', function (e) {
      if (!start || e.pointerId !== start.pid) return;
      if (!ghost) {
        if (Math.abs(e.clientX - start.x) + Math.abs(e.clientY - start.y) < 6) return;
        try { chip.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
        var r = chip.getBoundingClientRect();
        ghost = chip.cloneNode(true);
        ghost.classList.add('ghost');
        ghost.removeAttribute('data-key');
        ghost.setAttribute('aria-hidden', 'true');
        ghost.style.width = r.width + 'px';
        ghost._dx = start.x - r.left; ghost._dy = start.y - r.top;
        document.body.appendChild(ghost);
        chip.classList.add('dragging');
      }
      e.preventDefault();
      ghost.style.left = (e.clientX - ghost._dx) + 'px';
      ghost.style.top = (e.clientY - ghost._dy) + 'px';
      var under = document.elementFromPoint(e.clientX, e.clientY);
      var card = under && under.closest ? under.closest('.def-card[data-slot]') : null;
      if (card && S.p1.placed[card.getAttribute('data-slot')]) card = null;
      if (hoverEl !== card) {
        if (hoverEl) hoverEl.classList.remove('hover');
        if (card) card.classList.add('hover');
        hoverEl = card;
      }
      autoScroll(e.clientY);
    });
    function end(e, cancelled) {
      if (!start || (e && e.pointerId !== start.pid)) return;
      var wasDrag = !!ghost;
      if (ghost) { ghost.remove(); ghost = null; }
      chip.classList.remove('dragging');
      var target = hoverEl;
      if (hoverEl) { hoverEl.classList.remove('hover'); hoverEl = null; }
      start = null;
      if (wasDrag) {
        chip._suppress = true;
        setTimeout(function () { chip._suppress = false; }, 0);
        if (!cancelled && target) place(id, target.getAttribute('data-slot'), false);
      }
    }
    chip.addEventListener('pointerup', function (e) { end(e, false); });
    chip.addEventListener('pointercancel', function (e) { end(e, true); });
  }
  function autoScroll(y) {
    var edge = 70, vh = window.innerHeight;
    if (y < edge) window.scrollBy(0, -12);
    else if (y > vh - edge - 140) window.scrollBy(0, 12);
  }

  /* ---------- Part 2: typing terminal ---------- */
  function renderP2() {
    var p = S.p2;
    var app = $('#app');

    var intro = h('section', { class: 'card', 'aria-labelledby': 'p2-title' },
      h('div', { class: 'match-head' },
        h('h2', { id: 'p2-title' }, 'Part 2: Type the command'),
        h('span', { class: 'pill', 'data-key': 'p2-count' }, '')),
      h('ol', { class: 'how' },
        h('li', null, 'Read the task, type the command in the practice terminal, and press Enter.'),
        h('li', null, 'The terminal remembers which folder you are in, just like a real one. Watch the prompt change when you use cd.'),
        h('li', null, 'Capital letters matter. Only your first try for each task counts toward your score. After two misses, the answer appears so you can type it and keep going.'),
        h('li', null, 'Press the up arrow to bring back a command you already typed.')));

    var task = h('section', { class: 'card card-sun task-card', 'aria-live': 'polite', 'data-key': 'task' });
    var fb = h('p', { class: 'feedback', 'data-key': 'p2-fb' });
    var log = h('ul', { class: 'term-log', role: 'log', 'aria-label': 'Terminal output', 'data-key': 'log' });
    var input = h('input', {
      id: 'term-input', class: 'term-input', type: 'text', autocomplete: 'off', autocapitalize: 'off',
      autocorrect: 'off', spellcheck: 'false', 'aria-describedby': 'term-help', 'data-key': 'term-input'
    });
    var label = h('label', { for: 'term-input', 'data-key': 'prompt' });
    var body = h('div', { class: 'term-body', 'data-key': 'term-body' }, log, h('div', { class: 'term-line' }, label, input));
    body.addEventListener('click', function (e) { if (e.target === body || e.target === log) input.focus(); });
    var term = h('section', { class: 'term', 'aria-label': 'Practice terminal' },
      h('div', { class: 'term-bar', 'aria-hidden': 'true' }, h('span', { class: 'dots' }, h('i'), h('i'), h('i')), 'bash: practice terminal'),
      body);
    var help = h('p', { id: 'term-help', class: 'help' }, 'Type a command and press Enter.');
    var after = h('div', { 'data-key': 'p2-after' });

    app.replaceChildren(intro, task, fb, term, help, after);
    input.addEventListener('keydown', onTermKey);
    p.log.forEach(function (l) { log.appendChild(logLine(l)); });
    updateP2();
    if (!p.done) input.focus({ preventScroll: true });
  }

  function logLine(l) {
    if (l.prompt !== undefined) return h('li', null, h('span', { class: 't-prompt' }, l.prompt + ' '), h('span', { class: 't-out' }, l.t));
    return h('li', { class: l.c }, l.t);
  }
  function pushLog(l) {
    S.p2.log.push(l);
    var log = $('[data-key="log"]');
    if (log) log.appendChild(logLine(l));
  }

  function updateP2() {
    var p = S.p2;
    var count = $('[data-key="p2-count"]');
    count.textContent = (p.done ? TOTAL2 : p.idx) + ' of ' + TOTAL2 + ' done';
    $('[data-key="prompt"]').textContent = promptStr(p);
    var task = $('[data-key="task"]');
    var input = $('[data-key="term-input"]');
    var after = $('[data-key="p2-after"]');
    if (p.done) {
      task.replaceChildren(h('p', { class: 'task-num' }, 'Part 2 complete'),
        h('p', { class: 'task-text' }, p.score + ' of ' + TOTAL2 + ' typed correctly on the first try.'));
      input.disabled = true;
      after.replaceChildren(h('div', { class: 'btn-row' },
        h('button', { type: 'button', class: 'btn', 'data-key': 'to-results', onclick: function () { go('results'); } }, 'Go to Submit'),
        h('button', { type: 'button', class: 'btn btn-ghost', onclick: function () { go('p2', true); } }, 'Replay Part 2')));
    } else {
      var t = TASKS[p.idx];
      var parts = [h('p', { class: 'task-num' }, 'Task ' + (p.idx + 1) + ' of ' + TOTAL2), h('p', { class: 'task-text', html: t.task(p) })];
      task.replaceChildren.apply(task, parts);
      input.disabled = false;
      after.replaceChildren();
    }
    var fb = $('[data-key="p2-fb"]');
    fb.className = 'feedback' + (p.fb ? ' ' + p.fb.kind : '');
    fb.innerHTML = p.fb ? p.fb.html : '';
    var body = $('[data-key="term-body"]');
    body.scrollTop = body.scrollHeight;
  }

  function onTermKey(e) {
    var p = S.p2;
    var input = e.target;
    if (e.key === 'ArrowUp') {
      if (!p.history.length) return;
      e.preventDefault();
      p.hpos = Math.max(0, p.hpos - 1);
      input.value = p.history[p.hpos] || '';
      return;
    }
    if (e.key === 'ArrowDown') {
      if (!p.history.length) return;
      e.preventDefault();
      p.hpos = Math.min(p.history.length, p.hpos + 1);
      input.value = p.history[p.hpos] || '';
      return;
    }
    if (e.key !== 'Enter' || p.done) return;
    e.preventDefault();
    var raw = input.value;
    input.value = '';
    submitCommand(raw);
  }

  function submitCommand(raw) {
    var p = S.p2;
    var cmd = raw.trim().replace(/\s+/g, ' ');
    pushLog({ prompt: promptStr(p), t: raw.trim() });
    if (!cmd) { updateP2(); return; }
    p.history.push(raw.trim());
    p.hpos = p.history.length;
    if (cmd === 'clear') {
      p.log = [];
      $('[data-key="log"]').replaceChildren();
      updateP2();
      return;
    }

    var t = TASKS[p.idx];
    var res = t.check(cmd, p);
    if (res) {
      if (p.first[p.idx] === undefined) p.first[p.idx] = true;
      var out = t.run(p, res) || [];
      out.forEach(pushLog);
      var firstTry = p.first[p.idx] === true;
      p.fb = { kind: 'ok', html: '✓ Correct' + (firstTry ? ' on the first try.' : '.') + ' <code>' + esc(cmd) + '</code>' };
      announce('Correct. ' + out.map(function (o) { return o.t; }).join('. '));
      p.idx++;
      p.misses = 0;
      if (p.idx >= TOTAL2) finishP2();
    } else {
      if (p.first[p.idx] === undefined) p.first[p.idx] = false;
      p.misses++;
      var err = simulateError(cmd, p);
      if (err) pushLog({ c: 't-err', t: err });
      var why = diagnose(cmd, t, p);
      var html = '✗ ' + esc(why || 'Not quite. That command does not do what the task asks.');
      if (p.misses === 1) html += ' Hint: ' + esc(t.hint);
      else html += ' Type this to keep going: <code>' + esc(t.answer(p)) + '</code>';
      p.fb = { kind: 'no', html: html };
      announce((why || 'Not quite.') + (p.misses === 1 ? ' Hint: ' + t.hint : ' Type this to keep going: ' + t.answer(p)));
    }
    updateP2();
  }

  function simulateError(cmd, p) {
    var w = cmd.split(' ')[0];
    if (KNOWN.indexOf(w) === -1) return w + ': command not found';
    var t = cdTarget(cmd);
    if (t && t !== '..' && kids(p).indexOf(t) === -1) return 'bash: cd: ' + t + ': No such file or directory';
    return null;
  }

  function diagnose(cmd, t, p) {
    if (t.wrong && t.wrong[cmd]) return t.wrong[cmd];
    if (t.diagnose) { var d = t.diagnose(cmd, p); if (d) return d; }
    var expect = t.answer(p);
    if (/^npn\b/i.test(cmd)) return 'Check the spelling: the tool is npm (Node Package Manager).';
    if (cmd.toLowerCase() === expect.toLowerCase() || (t.check(cmd.toLowerCase(), p) && cmd !== cmd.toLowerCase())) return 'Check your capital letters. The terminal treats uppercase and lowercase as different' + (/ -[A-Za-z]/.test(cmd) ? ', so -A and -a are not the same flag.' : ', so Projects and projects are not the same folder.');
    if (cmd.toLowerCase() === 'git add -a') return 'Check your capital letters. The "all" flag is a capital A: -A.';
    if (/^git clone /.test(cmd) && !/^git clone https:\/\//.test(cmd)) return 'git clone needs the full link to the repository, starting with https://github.com/';
    if (/^git clone https:\/\//.test(cmd) && !/^git clone https:\/\/github\.com\//.test(cmd)) return 'Use the GitHub link for your repository, which starts with https://github.com/';
    if (/^cd\.\./.test(cmd)) return 'Put a space between cd and the two dots.';
    var target = cdTarget(cmd);
    if (target && target !== '..' && kids(p).indexOf(target) === -1) return 'There is no folder named ' + target + ' here. Folder names must match exactly.';
    var w = cmd.split(' ')[0];
    if (KNOWN.indexOf(w) === -1) return 'Your terminal does not know a command named ' + w + '. Check the spelling.';
    return null;
  }

  function finishP2() {
    var p = S.p2;
    p.done = true;
    p.score = TASKS.filter(function (x, i) { return p.first[i] === true; }).length;
    S.best2 = S.best2 === null ? p.score : Math.max(S.best2, p.score);
    p.fb = { kind: 'ok', html: '✓ Part 2 complete: ' + p.score + ' of ' + TOTAL2 + ' on the first try.' };
    renderSteps();
    setTimeout(function () { var b = $('[data-key="to-results"]'); if (b) b.focus({ preventScroll: true }); }, 50);
  }

  /* ---------- Results and Submit ---------- */
  function renderResults() {
    var app = $('#app');
    var p1 = S.best1, p2 = S.best2;
    var sum = p1 + p2;
    var input = h('input', { id: 'name-input', type: 'text', autocomplete: 'name', maxlength: '60', required: true, 'aria-describedby': 'name-help', value: S.name });
    var submit = h('button', { type: 'button', class: 'btn', id: 'submit-btn', disabled: !S.name.trim(), onclick: submitScore }, 'Submit my score');
    input.addEventListener('input', function () { S.name = input.value; storeName(S.name); submit.disabled = !S.name.trim(); });
    input.addEventListener('keydown', function (e) { if (e.key === 'Enter' && !submit.disabled) submitScore(); });

    var saved = null;
    if (S.saved) {
      saved = h('div', { class: 'saved', 'data-key': 'saved-box', tabindex: '-1' },
        h('p', null, h('strong', null, h('span', { 'aria-hidden': 'true' }, '✓ '), 'Score image saved. '), 'It downloaded as ' + S.saved.fname + '.'),
        h('p', null, 'Score on the image: ', h('strong', null, S.saved.pct + '%')),
        h('p', null, 'Verification code: ', h('span', { class: 'code-big' }, S.saved.code)),
        h('p', null, 'Saved: ' + S.saved.ts),
        h('p', { class: 'help' }, 'Did the download not start? Right-click the image below (or press and hold on a phone) and save it.'),
        h('img', { src: S.saved.url, alt: 'Terminal Quiz score for ' + S.saved.name + ': ' + S.saved.pct + ' percent correct on the first try, Part 1 ' + S.saved.p1 + ' of ' + TOTAL1 + ', Part 2 ' + S.saved.p2 + ' of ' + TOTAL2 + ', verification code ' + S.saved.code + '.' }));
    }

    app.replaceChildren(
      h('section', { class: 'card', 'aria-labelledby': 'res-title' },
        h('h2', { id: 'res-title' }, 'Submit your score'),
        h('p', { class: 'big-pct' }, pct(sum, GRAND) + '%'),
        h('p', null, 'correct on the first try (' + sum + ' of ' + GRAND + ')'),
        h('table', { class: 'score-table' },
          h('caption', { class: 'sr-only' }, 'Your best first-try score for each part'),
          h('thead', null, h('tr', null, h('th', { scope: 'col' }, 'Part'), h('th', { scope: 'col' }, 'Best first-try score'))),
          h('tbody', null,
            h('tr', null, h('td', null, 'Part 1: Match the command'), h('td', null, p1 + ' of ' + TOTAL1)),
            h('tr', null, h('td', null, 'Part 2: Type the command'), h('td', null, p2 + ' of ' + TOTAL2))),
          h('tfoot', null, h('tr', null, h('th', { scope: 'row' }, 'Total'), h('td', null, sum + ' of ' + GRAND + ' (' + pct(sum, GRAND) + '%)')))),
        sum === GRAND
          ? h('p', null, h('strong', null, 'Perfect score!'))
          : h('p', null, 'Want a higher score? Replay either part as many times as you like. Your best score for each part is kept until you reload the page.'),
        h('div', { class: 'btn-row' },
          h('button', { type: 'button', class: 'btn btn-ghost', onclick: function () { go('p1', true); } }, 'Replay Part 1'),
          h('button', { type: 'button', class: 'btn btn-ghost', onclick: function () { go('p2', true); } }, 'Replay Part 2'))),
      h('section', { class: 'card card-sun', 'aria-labelledby': 'sub-title' },
        h('h2', { id: 'sub-title' }, 'Save and upload'),
        h('ol', { class: 'how' },
          h('li', null, 'Type your name as it appears in Canvas.'),
          h('li', null, 'Select "Submit my score." A score image downloads to your computer.'),
          h('li', null, 'Upload the image to the ' + MODULE_LABEL + ' Show What You Know assignment in Canvas. You can come back, play again, and upload a new image any time.')),
        h('div', { class: 'field' },
          h('label', { for: 'name-input' }, 'Your name (required)'),
          input,
          h('p', { id: 'name-help', class: 'help' }, 'The Submit button turns on when you enter a name.')),
        h('div', { class: 'btn-row' }, submit),
        saved));
  }

  function safeName(name) {
    var s = name.normalize ? name.normalize('NFKD').replace(/[̀-ͯ]/g, '') : name;
    s = s.replace(/[^A-Za-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    return s || 'Student';
  }

  function submitScore() {
    var name = S.name.trim().replace(/\s+/g, ' ');
    if (!name) { announce('Type your name first.'); return; }
    var p1 = S.best1, p2 = S.best2;
    var ts = stamp(new Date());
    var code = makeCode(name, p1, p2, ts);
    var percent = pct(p1 + p2, GRAND);
    var canvas = drawCert(name, p1, p2, percent, ts, code);
    var fname = 'Module11-TerminalQuiz-' + safeName(name) + '.png';
    S.saved = { name: name, p1: p1, p2: p2, pct: percent, code: code, ts: ts, fname: fname, url: canvas.toDataURL('image/png') };
    if (canvas.toBlob) canvas.toBlob(function (blob) { download(URL.createObjectURL(blob), fname, true); }, 'image/png');
    else download(S.saved.url, fname, false);
    render();
    var box = $('[data-key="saved-box"]');
    if (box) { box.focus({ preventScroll: true }); box.scrollIntoView({ behavior: smooth(), block: 'center' }); }
    announce('Saved. Your score image is downloading. Your verification code is ' + code.split('').join(' ') + '.');
  }
  function download(url, fname, revoke) {
    var a = h('a', { href: url, download: fname, style: 'display:none' });
    document.body.appendChild(a);
    a.click();
    a.remove();
    if (revoke) setTimeout(function () { URL.revokeObjectURL(url); }, 5000);
  }
  function roundRect(g, x, y, w, ht, r) {
    g.beginPath();
    g.moveTo(x + r, y);
    g.arcTo(x + w, y, x + w, y + ht, r);
    g.arcTo(x + w, y + ht, x, y + ht, r);
    g.arcTo(x, y + ht, x, y, r);
    g.arcTo(x, y, x + w, y, r);
    g.closePath();
  }
  function drawCert(name, p1, p2, percent, ts, code) {
    var W = 1200, H = 675;
    var c = document.createElement('canvas');
    c.width = W; c.height = H;
    var g = c.getContext('2d');
    var F = '"Segoe UI", system-ui, -apple-system, Roboto, Arial, sans-serif';
    var M = 'Consolas, "Cascadia Mono", Menlo, monospace';

    g.fillStyle = '#eef5fc'; g.fillRect(0, 0, W, H);
    roundRect(g, 36, 36, W - 72, H - 72, 24);
    g.fillStyle = '#ffffff'; g.fill();
    g.lineWidth = 2; g.strokeStyle = '#c6d7ea'; g.stroke();
    g.save(); roundRect(g, 36, 36, W - 72, H - 72, 24); g.clip();
    g.fillStyle = '#1a64b7'; g.fillRect(36, 36, W - 72, 112);
    g.fillStyle = '#ffd23f'; g.fillRect(36, 148, W - 72, 10);
    g.restore();

    g.textBaseline = 'alphabetic'; g.textAlign = 'left';
    g.fillStyle = '#ffffff'; g.font = '700 22px ' + F;
    g.fillText('APC 440 ' + MODULE_LABEL + ': Show What You Know', 80, 82);
    g.font = '800 44px ' + M;
    g.fillStyle = '#fff3a0'; g.fillText('>_', 80, 132);
    g.fillStyle = '#ffffff'; g.fillText('Terminal Quiz', 148, 132);

    g.fillStyle = '#45566a'; g.font = '400 22px ' + F;
    g.fillText('Completed by', 80, 214);
    var fs = 44;
    g.font = '700 ' + fs + 'px ' + F;
    while (g.measureText(name).width > 640 && fs > 22) { fs -= 2; g.font = '700 ' + fs + 'px ' + F; }
    g.fillStyle = '#16212d';
    g.fillText(name, 80, 264, 640);

    g.strokeStyle = '#c6d7ea'; g.lineWidth = 2;
    g.beginPath(); g.moveTo(80, 292); g.lineTo(720, 292); g.stroke();
    g.fillStyle = '#16212d'; g.font = '600 24px ' + F;
    g.fillText('Part 1: Match the command', 80, 340);
    g.fillText('Part 2: Type the command', 80, 386);
    g.textAlign = 'right'; g.font = '700 24px ' + F;
    g.fillText(p1 + ' of ' + TOTAL1, 720, 340);
    g.fillText(p2 + ' of ' + TOTAL2, 720, 386);
    g.beginPath(); g.moveTo(80, 414); g.lineTo(720, 414); g.stroke();
    g.textAlign = 'left'; g.font = '800 26px ' + F;
    g.fillText('Total: ' + (p1 + p2) + ' of ' + GRAND + ' correct on the first try', 80, 458);

    // Score badge
    g.fillStyle = '#e3eefa'; g.strokeStyle = '#1a64b7'; g.lineWidth = 6;
    g.beginPath(); g.arc(960, 330, 120, 0, Math.PI * 2); g.fill(); g.stroke();
    g.fillStyle = '#124d8f'; g.textAlign = 'center';
    g.font = '800 76px ' + F; g.fillText(percent + '%', 960, 350);
    g.font = '600 20px ' + F; g.fillStyle = '#16212d'; g.fillText('first-try score', 960, 390);

    // Little terminal
    roundRect(g, 80, 494, 520, 104, 14);
    g.fillStyle = '#0d1117'; g.fill();
    g.textAlign = 'left'; g.font = '700 21px ' + M;
    g.fillStyle = '#7ee787'; g.fillText('student:~/projects$', 102, 534);
    g.fillStyle = '#e6edf3'; g.fillText('git push origin module-11', 102, 568);
    g.fillStyle = '#a3adb9'; g.font = '400 17px ' + M; g.fillText(' * [new tag]  module-11 -> module-11', 102, 590);

    g.textAlign = 'right';
    g.fillStyle = '#45566a'; g.font = '400 21px ' + F;
    g.fillText('Saved: ' + ts, 1116, 530);
    g.fillStyle = '#16212d'; g.font = '700 21px ' + F;
    g.fillText('Verification code', 1116, 564);
    g.font = '700 34px ' + M;
    g.fillText(code, 1116, 602);
    return c;
  }

  /* ---------- Instructor check page (?verify) ---------- */
  function renderVerify() {
    document.title = 'Instructor Check: Terminal Quiz';
    $('#steps').remove();
    var result = h('p', { id: 'verify-result', class: 'result', role: 'status', 'aria-live': 'polite' });
    function field(id, label, attrs, help) {
      var a = { id: id, name: id, required: true };
      Object.keys(attrs || {}).forEach(function (k) { a[k] = attrs[k]; });
      return h('div', { class: 'field' }, h('label', { for: id }, label), h('input', a), help ? h('p', { class: 'help' }, help) : null);
    }
    var form = h('form', { class: 'card', novalidate: true },
      h('h2', null, 'Check a score image'),
      h('p', null, 'Type the details exactly as they appear on the student\'s image.'),
      field('v-name', 'Student name', { type: 'text', autocomplete: 'off' }, 'Capital letters and extra spaces do not matter.'),
      h('div', { class: 'verify-grid' },
        field('v-p1', 'Part 1 score (0 to ' + TOTAL1 + ')', { type: 'number', inputmode: 'numeric', min: '0', max: String(TOTAL1), step: '1' }),
        field('v-p2', 'Part 2 score (0 to ' + TOTAL2 + ')', { type: 'number', inputmode: 'numeric', min: '0', max: String(TOTAL2), step: '1' })),
      field('v-ts', 'Date and time', { type: 'text', autocomplete: 'off', placeholder: '2027-03-15 17:45' }, 'The part after "Saved:" on the image, like 2027-03-15 17:45.'),
      field('v-code', 'Verification code', { type: 'text', autocomplete: 'off', maxlength: '8', spellcheck: 'false' }),
      h('div', { class: 'btn-row' }, h('button', { type: 'submit', class: 'btn' }, 'Check code')),
      result);
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = $('#v-name').value, ts = $('#v-ts').value, code = $('#v-code').value.trim().toUpperCase();
      var a = $('#v-p1').value.trim(), b = $('#v-p2').value.trim();
      var bad = !name.trim() || !ts.trim() || !code || !/^\d+$/.test(a) || !/^\d+$/.test(b) || Number(a) > TOTAL1 || Number(b) > TOTAL2;
      if (bad) {
        result.className = 'result warn';
        result.textContent = 'Fill in every field. Each score is a whole number from 0 to that part\'s total.';
        return;
      }
      var fold = function (s) { return s.replace(/O/g, '0').replace(/[IL]/g, '1'); };
      var match = fold(makeCode(name, Number(a), Number(b), ts)) === fold(code);
      result.className = 'result ' + (match ? 'ok' : 'no');
      result.textContent = match
        ? '✓ Code matches. Score: ' + pct(Number(a) + Number(b), GRAND) + '%'
        : '✗ Code does not match';
    });
    $('#page-title').textContent = 'Terminal Quiz: Instructor Check';
    $('#app').replaceChildren(form, h('p', null, h('a', { href: location.pathname }, 'Back to the quiz')));
  }

  /* ---------- Start ---------- */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && S.view === 'p1' && S.p1 && S.p1.sel) {
      var id = S.p1.sel;
      S.p1.sel = null; S.p1.msg = null;
      announce('Selection cleared.');
      renderP1('chip-' + id);
    }
  });

  if (/(^|[?&])verify(=|&|$)/.test(location.search.slice(1))) {
    renderVerify();
  } else {
    S.p1 = newP1();
    render();
  }
})();

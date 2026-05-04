// ===========================
//  LETHE — game.js
//  게임 로직 전용 파일
//  data.js 로드 후 실행됩니다
// ===========================

// ── 게임 상태 ────────────────────────────────────────
const S = {
  room: 1,
  timer: 1800,          // 초 단위 (1800 = 30분)
  iv: null,
  start: 0,
  inv: [],
  solved: { locker: false, computer: false, cabinet: false, exit: false },
  seen: new Set(),
  npPuz: null,
  npInput: '',
  npDigits: 4,
}

// ── 유틸 ────────────────────────────────────────────
const $ = id => document.getElementById(id)
const has = id => S.inv.includes(id)

// ── UI 헬퍼 ─────────────────────────────────────────
function say(txt, lbl = '// SYSTEM') {
  $('dlg').querySelector('.d-lbl').textContent = lbl
  $('dtxt').textContent = txt
}

function markFound(elId) {
  const el = document.getElementById(elId)
  if (el) { el.classList.remove('undiscovered'); el.classList.add('found') }
}

// ── 인벤토리 ─────────────────────────────────────────
function addItem(id) {
  if (has(id)) return
  S.inv.push(id)
  renderInv()
}

function renderInv() {
  const el = $('invlist')
  if (!S.inv.length) { el.innerHTML = '<div class="inv-empty">아이템 없음</div>'; return }
  el.innerHTML = S.inv.map(id => {
    const it = ITEMS[id]
    return `<div class="ii" onclick="viewItem('${id}')">
      <div class="ii-ico">${it.ico}</div>
      <div><div class="ii-n">${it.name}</div><div class="ii-d">${it.desc}</div></div>
    </div>`
  }).join('')
}

function viewItem(id) {
  openM('// ' + ITEMS[id].name, ITEMS[id].html)
}

// ── 모달 ─────────────────────────────────────────────
function openM(ttl, body) {
  $('mttl').textContent = ttl
  $('mbody').innerHTML = body
  $('mbg').classList.add('on')
}

function closeM() {
  $('mbg').classList.remove('on')
  S.npPuz = null
  S.npInput = ''
}

function bgClose(e) {
  if (e.target === $('mbg')) closeM()
}

// ── 숫자 패드 ────────────────────────────────────────
function openNP(puzzleId) {
  const p = PUZZLE_UI[puzzleId]
  S.npPuz = puzzleId
  S.npInput = ''
  S.npDigits = p.digits
  const blanks = '_'.repeat(p.digits)
  const numBtns = [1,2,3,4,5,6,7,8,9].map(n =>
    `<button class="nb" onclick="npIn('${n}')">${n}</button>`
  ).join('')
  openM(p.title, `
    <div style="font-size:13px;color:var(--td);margin-bottom:14px">${p.desc}</div>
    <div class="np">
      <div class="npd" id="npd">${blanks}</div>
      <div class="npg">
        ${numBtns}
        <button class="nb nb-del" onclick="npDel()">⌫</button>
        <button class="nb" onclick="npIn('0')">0</button>
        <button class="nb nb-ok" onclick="npOk()">확인</button>
      </div>
      <div class="npm" id="npm"></div>
    </div>
  `)
}

function npIn(n) {
  if (S.npInput.length >= S.npDigits) return
  S.npInput += n
  const d = $('npd')
  if (d) d.textContent = S.npInput + '_'.repeat(S.npDigits - S.npInput.length)
}

function npDel() {
  S.npInput = S.npInput.slice(0, -1)
  const d = $('npd')
  if (d) d.textContent = S.npInput + '_'.repeat(S.npDigits - S.npInput.length)
}

function npOk() {
  const m = $('npm')
  if (S.npInput === CODES[S.npPuz]) {
    if (m) { m.textContent = '✓ 잠금 해제'; m.className = 'npm npm-ok' }
    S.solved[S.npPuz] = true
    const pid = S.npPuz
    setTimeout(() => { closeM(); onSolved(pid) }, 700)
  } else {
    if (m) { m.textContent = '✗ 잘못된 코드'; m.className = 'npm npm-e' }
    S.npInput = ''
    setTimeout(() => {
      const d = $('npd')
      if (d) d.textContent = '_'.repeat(S.npDigits)
      if (m) m.textContent = ''
    }, 900)
  }
}

// ── 퍼즐 해결 콜백 ──────────────────────────────────
function onSolved(id) {
  if (id === 'locker') {
    addItem('key'); addItem('form')
    $('locker-lbl').textContent = '사물함 [열림]'
    say('사물함이 열렸다! 사무실 열쇠와 낡은 문서를 발견했다.', '// 발견')
  }
  if (id === 'computer') {
    $('comp-lbl').textContent = '컴퓨터 [켜짐]'
    say('컴퓨터가 켜졌다. 이수현이 남긴 영상 메시지가 있다.', '// 접속')
    setTimeout(() => showVideo(), 400)
  }
  if (id === 'cabinet') {
    addItem('card'); addItem('vfile')
    $('cab-lbl').textContent = '캐비닛 [열림]'
    say('캐비닛이 열렸다! 실험실 출입증과 중요한 파일을 발견했다.', '// 발견')
  }
  if (id === 'exit') {
    clearInterval(S.iv)
    const elapsed = Math.floor((Date.now() - S.start) / 1000)
    const mm = String(Math.floor(elapsed / 60)).padStart(2, '0')
    const ss = String(elapsed % 60).padStart(2, '0')
    $('eclr').textContent = '클리어 타임: ' + mm + ':' + ss
    $('pfill').style.width = '100%'
    setTimeout(() => $('end').classList.add('on'), 900)
  }
}

// ── 이수현 영상 ──────────────────────────────────────
function showVideo() {
  openM(VIDEO_CONTENT.title, VIDEO_CONTENT.html)
  say(VIDEO_CONTENT.log, VIDEO_CONTENT.logLabel)
}

// ── 오브젝트 상호작용 ────────────────────────────────
function act(room, id) {

  // ── ROOM 1: 격리 병동 ──────────────────────────────
  if (room === 1) {
    if (id === 'wb') {
      if (S.seen.has('wb')) { say(INTERACT.wb.revisit, INTERACT.wb.logLabel); return }
      S.seen.add('wb'); markFound('o-wb')
      openM(INTERACT.wb.title, INTERACT.wb.modal)
      say(INTERACT.wb.log, INTERACT.wb.logLabel)
    }
    if (id === 'bed') {
      if (S.seen.has('bed')) { say(INTERACT.bed.revisit, INTERACT.bed.logLabel); return }
      S.seen.add('bed'); markFound('o-bed')
      openM(INTERACT.bed.title, INTERACT.bed.modal)
      say(INTERACT.bed.log, INTERACT.bed.logLabel)
    }
    if (id === 'idband') {
      if (S.seen.has('idband')) { say(INTERACT.idband.revisit, INTERACT.idband.logLabel); return }
      S.seen.add('idband'); markFound('o-idband')
      openM(INTERACT.idband.title, INTERACT.idband.modal)
      say(INTERACT.idband.log, INTERACT.idband.logLabel)
    }
    if (id === 'locker') {
      if (S.solved.locker) {
        openM(INTERACT.lockerOpen.title, INTERACT.lockerOpen.modal)
        say(INTERACT.lockerOpen.log, INTERACT.lockerOpen.logLabel)
        return
      }
      openNP('locker')
    }
    if (id === 'door1') {
      if (!has('key')) { say('문이 잠겨 있다. 사물함에서 열쇠를 찾아야 한다.', '// 사무실 문'); return }
      goRoom(2)
    }
  }

  // ── ROOM 2: 연구원 사무실 ──────────────────────────
  if (room === 2) {
    if (id === 'journal') {
      if (S.seen.has('journal')) { say(INTERACT.journal.revisit, INTERACT.journal.logLabel); return }
      S.seen.add('journal'); markFound('o-journal')
      openM(INTERACT.journal.title, INTERACT.journal.modal)
      say(INTERACT.journal.log, INTERACT.journal.logLabel)
    }
    if (id === 'sticky') {
      if (S.seen.has('sticky')) { say(INTERACT.sticky.revisit, INTERACT.sticky.logLabel); return }
      S.seen.add('sticky'); markFound('o-sticky')
      openM(INTERACT.sticky.title, INTERACT.sticky.modal)
      say(INTERACT.sticky.log, INTERACT.sticky.logLabel)
    }
    if (id === 'desk') {
      say('어지럽게 뒤집힌 책상. 연구 일지와 포스트잇이 있다.', '// 책상')
    }
    if (id === 'computer') {
      if (S.solved.computer) { setTimeout(() => showVideo(), 200); return }
      if (!S.seen.has('journal') && !S.seen.has('sticky')) {
        say('컴퓨터가 잠겨 있다. 먼저 주변 단서를 찾아보자.', '// 컴퓨터'); return
      }
      openNP('computer')
    }
    if (id === 'cabinet') {
      if (S.solved.cabinet) { say('캐비닛은 이미 열려 있다.', '// 캐비닛'); return }
      if (!S.solved.computer) { say('캐비닛이 잠겨 있다. 컴퓨터에서 이수현의 메시지를 먼저 확인하자.', '// 캐비닛'); return }
      openNP('cabinet')
    }
    if (id === 'door2') {
      if (!has('card')) { say('실험실 문에 카드 리더기가 있다. 출입증이 필요하다.', '// 실험실 문'); return }
      goRoom(3)
    }
  }

  // ── ROOM 3: 실험실 ────────────────────────────────
  if (room === 3) {
    if (id === 'profiles') {
      if (S.seen.has('profiles')) { say(INTERACT.profiles.revisit, INTERACT.profiles.logLabel); return }
      S.seen.add('profiles'); markFound('o-profiles')
      openM(INTERACT.profiles.title, INTERACT.profiles.modal)
      say(INTERACT.profiles.log, INTERACT.profiles.logLabel)
    }
    if (id === 'scanner') {
      if (S.seen.has('scanner')) { say(INTERACT.scanner.revisit, INTERACT.scanner.logLabel); return }
      S.seen.add('scanner'); markFound('o-scanner')
      openM(INTERACT.scanner.title, INTERACT.scanner.modal)
      say(INTERACT.scanner.log, INTERACT.scanner.logLabel)
    }
    if (id === 'filedesk') {
      if (!has('vfile')) { say('피험자 파일들. 캐비닛에서 최동혁의 파일을 먼저 가져와야 한다.', '// 파일 책상'); return }
      markFound('o-filedesk')
      openM(INTERACT.filedesk.title, INTERACT.filedesk.modal)
      say(INTERACT.filedesk.log, INTERACT.filedesk.logLabel)
    }
    if (id === 'exit') {
      if (!has('vfile')) { say('출구에 4자리 도어락. 최동혁의 파일에서 코드를 찾아야 한다.', '// 출구'); return }
      openNP('exit')
    }
  }
}

// ── 방 이동 ──────────────────────────────────────────
function goRoom(n) {
  document.querySelectorAll('.room').forEach(r => r.classList.remove('on'))
  $('r' + n).classList.add('on')
  S.room = n
  $('rlbl').textContent = ROOM_NAMES[n]
  $('pfill').style.width = { 1: 5, 2: 38, 3: 72 }[n] + '%'
  if (n === 1) {
    $('locker-lbl').textContent = S.solved.locker ? '사물함 [열림]' : '사물함 [잠김]'
    if (has('key')) { $('door1-lbl').textContent = '사무실 문 [→]'; $('dg1').style.display = 'block' }
  }
  if (n === 2) {
    $('comp-lbl').textContent = S.solved.computer ? '컴퓨터 [켜짐]' : '컴퓨터 [잠김]'
    $('cab-lbl').textContent = S.solved.cabinet ? '캐비닛 [열림]' : '캐비닛 [잠김]'
    if (has('card')) { $('door2-lbl').textContent = '실험실 문 [→]'; $('dg2').style.display = 'block' }
  }
  say(ROOM_ENTER[n], '// ' + ROOM_NAMES[n])
}

// ── 타이머 ──────────────────────────────────────────
function startTimer() {
  S.start = Date.now()
  S.iv = setInterval(() => {
    S.timer--
    const m = Math.floor(S.timer / 60)
    const s = S.timer % 60
    $('timer').textContent = String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0')
    if (S.timer <= 300) $('timer').classList.add('danger')
    if (S.timer <= 0) { clearInterval(S.iv); $('go').classList.add('on') }
  }, 1000)
}

// ── 게임 시작 ────────────────────────────────────────
function startGame() {
  $('intro').style.display = 'none'
  $('game').classList.add('on')
  goRoom(1)
  startTimer()
}

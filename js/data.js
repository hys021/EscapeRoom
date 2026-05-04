// ===========================
//  LETHE — data.js
//  게임 콘텐츠 전용 파일
//  스토리·퍼즐 수정은 여기서만!
// ===========================

// ── 퍼즐 정답 코드 ──────────────────────────────────
// 변경하려면 이 값들만 수정하세요
const CODES = {
  locker:   '4729',   // 격리병동 사물함 — 직원번호
  computer: '0917',   // 연구원 사무실 컴퓨터 — 사고 날짜 (09월 17일)
  cabinet:  '083',    // 연구원 사무실 캐비닛 — 피험자 번호
  exit:     '1205',   // 실험실 출구 — 최동혁 생일 (12월 05일)
}

// ── 방 입장 텍스트 ──────────────────────────────────
const ROOM_ENTER = {
  1: '형광등이 깜빡이는 좁은 방. 손목의 ID 밴드가 낯설다. 탈출구를 찾아야 한다.',
  2: '어지럽게 뒤집힌 책상들. 누군가 서둘러 떠난 것 같다. 단서를 찾아라.',
  3: '중앙에 거대한 장치. 벽면을 가득 채운 얼굴 사진들... 그 중 하나가 눈에 들어온다.',
}

const ROOM_NAMES = {
  1: 'ROOM 01 — 격리 병동',
  2: 'ROOM 02 — 연구원 사무실',
  3: 'ROOM 03 — 실험실',
}

// ── 인벤토리 아이템 ──────────────────────────────────
const ITEMS = {
  key: {
    ico: '🔑',
    name: '사무실 열쇠',
    desc: '낡은 열쇠',
    html: `<div class="doc">
      <div class="doc-ttl">// 사무실 열쇠</div>
      녹이 슨 열쇠. 키홀더에 <span class="dhl">"R-02"</span>라고 적혀 있다.<br><br>
      <span class="ddim">사무실 문을 열 수 있을 것 같다.</span>
    </div>`,
  },
  form: {
    ico: '📄',
    name: '임상 동의서',
    desc: '피험자 동의서',
    html: `<div class="doc">
      <div class="doc-ttl">// 므네모 연구소 — 임상 피험자 동의서</div>
      본인 <span class="dhl">김민준</span>은 자의로 기억 삭제 시술에 동의합니다.<br><br>
      시술 일시: 2029.03.19 &nbsp; 담당: 이수현<br><br>
      <span class="drd">직책: 프로젝트 레테 연구원</span><br><br>
      <span class="ddim">피험자란에 내 이름이 있는데 직책이 "연구원"이다. 이상하다.</span>
    </div>`,
  },
  card: {
    ico: '💳',
    name: '실험실 출입증',
    desc: '이수현의 출입카드',
    html: `<div class="doc">
      <div class="doc-ttl">// 실험실 출입증</div>
      므네모 연구소 — 실험실<br><br>
      소유자: <span class="dhl">이수현 (수석 연구원)</span><br>
      발급일: 2028.08.01 / 유효기간: 무제한<br><br>
      <span class="ddim">이수현이 일부러 남겨놓은 것 같다. 실험실 문을 열 수 있을 것 같다.</span>
    </div>`,
  },
  vfile: {
    ico: '🗂️',
    name: '피험자 파일',
    desc: '피험자 #083 기록',
    html: `<div class="doc">
      <div class="doc-ttl">// 피험자 #083 — 기밀 기록</div>
      이름: <span class="dhl">최동혁</span><br>
      생년월일: <span class="dhl">1993년 12월 5일</span><br>
      나이: 31세 / 진단: PTSD<br><br>
      시술 날짜: 2028.09.17<br>
      결과: <span class="drd">이상 반응 발생 — 피험자 사망</span><br><br>
      출구 코드 힌트: <span style="color:var(--yel);font-size:13px">12월 5일 = <span class="dhl">1205</span></span><br><br>
      <span class="ddim">이수현이 이 날짜를 출구 코드로 설정했다고 했다.</span>
    </div>`,
  },
}

// ── 오브젝트 상호작용 텍스트 ────────────────────────
// 각 방·오브젝트의 모달 콘텐츠와 다이얼로그 메시지
const INTERACT = {
  // ROOM 1 ─────────────────────────────────────────
  wb: {
    title: '// 화이트보드',
    modal: `<div class="doc">
      <div class="doc-ttl">// 화이트보드 메모</div>
      낡은 마커로 쓰인 문장:<br><br>
      <span class="dhl" style="font-size:14px">
        "기억을 잃었다고 해서,<br>당신이 한 일이 사라지는 건 아닙니다."
      </span><br><br>
      <span class="ddim">— 프로젝트 레테 수석 연구원, 이수현</span>
    </div>`,
    log: '화이트보드에 이수현이 남긴 메모가 있다.',
    logLabel: '// 화이트보드',
    revisit: '"기억을 잃었다고 해서, 당신이 한 일이 사라지는 건 아닙니다." — 이수현',
  },
  bed: {
    title: '// 침대 매트리스 아래',
    modal: `<div class="doc">
      <div class="doc-ttl">// 접힌 쪽지</div>
      <span class="dhl">"잊지 마. 사물함 비밀번호 = 직원번호"</span><br><br>
      <span class="ddim">ID 밴드에서 직원번호를 찾아야 한다.</span>
    </div>`,
    log: '매트리스 밑에서 쪽지 발견! 직원번호를 찾아야 한다.',
    logLabel: '// 침대',
    revisit: '쪽지: "사물함 비밀번호 = 직원번호". ID 밴드를 확인하자.',
  },
  idband: {
    title: '// ID 밴드',
    modal: `<div class="doc" style="border-color:#1a3080">
      <div class="doc-ttl" style="color:#4a9eff">// 므네모 연구소 ID 밴드</div>
      이름: <span class="dhl">김민준</span><br>
      직책: 연구원<br>
      <span style="color:var(--yel)">직원번호: 4729</span><br>
      부서: 프로젝트 레테팀<br><br>
      <span class="ddim">피험자 밴드가 아니다. 연구원 신분증이다.<br>
      사물함 비밀번호는 직원번호 <span style="color:var(--yel)">4729</span>.</span>
    </div>`,
    log: 'ID 밴드에서 직원번호를 발견했다! 직원번호: 4729',
    logLabel: '// 발견!',
    revisit: 'ID 밴드: 이름 김민준, 직원번호 4729',
  },
  lockerOpen: {
    title: '// 사물함 [열린 상태]',
    modal: `<div class="doc">
      <div class="doc-ttl">// 사물함 내부</div>
      사물함이 열려 있다. 이미 아이템을 획득했다.<br><br>
      🔑 사무실 열쇠 — 획득<br>
      📄 임상 동의서 — 획득<br><br>
      <span class="ddim">인벤토리에서 확인할 수 있습니다.</span>
    </div>`,
    log: '사물함은 이미 열려 있다.',
    logLabel: '// 사물함',
  },

  // ROOM 2 ─────────────────────────────────────────
  journal: {
    title: '// 이수현의 연구 일지',
    modal: `<div class="doc" style="border-color:#3a3000">
      <div class="doc-ttl" style="color:var(--yel)">// 이수현 연구 일지 (발췌)</div>
      <span class="ddim">2028.07.15</span><br>
      "프로젝트 레테는 PTSD 환자들의 트라우마 기억을 지워 치료하는 기술이었다."<br><br>
      <span class="ddim">2028.09.10</span><br>
      "회사가 이 기술을 군사·상업 목적으로 팔려 한다. 나는 반대했지만 막을 수 없었다."<br><br>
      <span class="dhl">2028.09.17</span><br>
      <span class="dhl">"오늘 일어난 일을 절대 잊어선 안 된다.
      컴퓨터 비밀번호를 사고 날짜로 바꿔뒀다. <span style="color:var(--yel)">0917</span>."</span><br><br>
      <span class="ddim">2028.09.18 — 이후 기록 없음.</span>
    </div>`,
    log: '연구 일지에서 단서 발견! 컴퓨터 비밀번호: 0917',
    logLabel: '// 발견!',
    revisit: '연구 일지 단서: 컴퓨터 비밀번호 = 사고 날짜 0917',
  },
  sticky: {
    title: '// 포스트잇',
    modal: `<div class="doc" style="background:#1a1800;border-color:#5a5000">
      <div class="doc-ttl" style="color:var(--yel)">// 포스트잇</div>
      <span class="dhl">"비번은 그 날짜로 바꿔뒀음 — 연구 일지 참고."</span><br><br>
      <span class="ddim">연구 일지를 먼저 읽어봐야 한다.</span>
    </div>`,
    log: '포스트잇 힌트: 연구 일지를 찾아야 한다.',
    logLabel: '// 포스트잇',
    revisit: '포스트잇: "비번은 그 날짜로. 연구 일지 참고."',
  },

  // ROOM 3 ─────────────────────────────────────────
  profiles: {
    title: '// 연구원 프로필 사진',
    modal: `<div class="doc" style="border-color:#15153a">
      <div class="doc-ttl" style="color:#9060ff">// 프로젝트 레테 — 연구팀</div>
      벽면 가득 프로필 사진들.<br><br>
      한 사진이 눈에 들어온다.<br><br>
      <span class="dhl" style="font-size:15px">김민준 — 프로젝트 레테 연구원</span><br><br>
      내 얼굴이다.<br><br>
      <span class="drd">나는 피험자가 아니었다. 연구원이었다.</span><br><br>
      <span class="ddim">기억을 지운 건 나 자신이었다는 건가.</span>
    </div>`,
    log: '충격적이다. 나는 피험자가 아니라 연구원이었다!',
    logLabel: '// 반전',
    revisit: '내 프로필 사진: 김민준 — 연구원. 나는 피험자가 아니었다.',
  },
  scanner: {
    title: '// 뇌파 측정 장치',
    modal: `<div class="doc" style="border-color:#1a1a40">
      <div class="doc-ttl" style="color:#9060ff">// 기억 선택적 삭제 시스템</div>
      거대한 장치가 중앙에 있다. 전원이 꺼져 있지만 희미하게 깜빡인다.<br><br>
      의자에 여러 명이 앉은 흔적이 있다.<br><br>
      라벨: <span class="dhl">"프로젝트 레테 — 기억 삭제 시스템 v2.1"</span><br><br>
      <span class="ddim">이 장치로 우리 자신의 기억도 지웠다. 스스로 이 방에 들어와, 스스로 문을 잠근 뒤.</span>
    </div>`,
    log: '기억 삭제 장치. 우리는 스스로 기억을 지웠다.',
    logLabel: '// 진실',
    revisit: '기억 삭제 장치. 우리 자신의 기억을 지우는 데도 사용됐다.',
  },
  filedesk: {
    title: '// 최동혁 파일 재확인',
    modal: `<div class="doc" style="border-color:#3a2010">
      <div class="doc-ttl" style="color:#ff8050">// 최동혁 — 생년월일</div>
      이름: 최동혁<br>
      생년월일: <span class="dhl">1993년 12월 5일</span><br><br>
      출구 코드: <span style="color:var(--yel);font-size:18px"><span class="dhl">1205</span></span><br><br>
      <span class="ddim">이수현이 최동혁의 생일을 출구 코드로 설정했다.</span>
    </div>`,
    log: '출구 코드는 최동혁의 생일! 12월 5일 → 1205',
    logLabel: '// 핵심 단서!',
  },
}

// ── 이수현 영상 메시지 ──────────────────────────────
const VIDEO_CONTENT = {
  title: '// 이수현 — 영상 메시지',
  html: `<div class="vf">
    <div class="vasc">
      ╔══════════════════════╗<br>
      ║  이수현  수석연구원  ║<br>
      ║  2028.09.18  기밀     ║<br>
      ╚══════════════════════╝
    </div>
  </div>
  <div class="doc">
    <div class="doc-ttl">// 영상 내용</div>
    "이 영상을 보고 있다면, 어느 정도 기억을 되찾고 있다는 뜻입니다.<br><br>
    당신은 피험자가 아니에요. <span class="dhl">당신도 연구팀이었습니다.</span><br><br>
    2028년 9월 17일, 피험자 <span class="dhl">#083 최동혁</span>에게 과다 시술이 이루어졌고, 그는 사망했습니다.<br><br>
    팀원들은 죄책감을 견디지 못해 스스로 기억을 지우기로 했어요.
    이 연구소에 들어와 스스로 문을 잠근 거예요.<br><br>
    캐비닛 코드는 피험자 번호 <span class="dhl" style="font-size:15px">0-8-3</span>입니다.<br><br>
    실험실에 가세요. 출구 코드는 최동혁의 파일 안에 있어요."
  </div>`,
  log: '이수현의 영상을 시청했다. 캐비닛 코드: 083.',
  logLabel: '// 핵심 단서',
}

// ── 퍼즐 잠금 UI 텍스트 ─────────────────────────────
const PUZZLE_UI = {
  locker:   { title: '// 사물함 — 4자리 코드',       desc: '직원번호를 알고 있다면 입력하세요. (ID 밴드 참고)', digits: 4 },
  computer: { title: '// 컴퓨터 — 4자리 비밀번호',   desc: '연구 일지에서 힌트를 찾았다면 입력하세요.',          digits: 4 },
  cabinet:  { title: '// 캐비닛 — 3자리 코드',       desc: '이수현의 영상에서 코드를 들었다면 입력하세요.',      digits: 3 },
  exit:     { title: '// 출구 도어락 — 4자리 코드',   desc: '최동혁의 생년월일에서 코드를 찾아야 한다. (월일 형식)', digits: 4 },
}

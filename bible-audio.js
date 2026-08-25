/**
 * 灵粮行旅 - 圣经逐节同步高亮、有声朗读与点读机引擎
 * 文件名: bible-audio.js
 */

(function (global) {
  let versesList = []; // 当前章节的经文列表 [{ verse: 1, text: "..." }]
  let currentVerseIndex = 0; // 当前正在朗读的节索引 (0-based)
  let isPlaying = false;
  let isPaused = false;
  let currentRate = 1.0;
  let selectedVoice = null;
  let synth = window.speechSynthesis || null;
  let activeUtterance = null;
  let autoScroll = true;

  // 66卷圣经书卷元数据
  const BOOK_DATA = {
    "创世记": 1, "出埃及记": 2, "利未记": 3, "民数记": 4, "申命记": 5,
    "约书亚记": 6, "士师记": 7, "路得记": 8, "撒母耳记上": 9, "撒母耳记下": 10,
    "列王纪上": 11, "列王纪下": 12, "历代志上": 13, "历代志下": 14, "以斯拉记": 15,
    "尼希米记": 16, "以斯帖记": 17, "约伯记": 18, "诗篇": 19, "箴言": 20,
    "传道书": 21, "雅歌": 22, "以赛亚书": 23, "耶利米书": 24, "耶利米哀歌": 25,
    "以西结书": 26, "但以理书": 27, "何西阿书": 28, "约珥书": 29, "阿摩司书": 30,
    "俄巴底亚书": 31, "约拿书": 32, "弥迦书": 33, "那鸿书": 34, "哈巴谷书": 35,
    "西番雅书": 36, "哈该书": 37, "撒迦利亚书": 38, "玛拉基书": 39, "马太福音": 40,
    "马可福音": 41, "路加福音": 42, "约翰福音": 43, "使徒行传": 44, "罗马书": 45,
    "哥林多前书": 46, "哥林多后书": 47, "加拉太书": 48, "以弗所书": 49, "腓立比书": 50,
    "歌罗西书": 51, "帖撒罗尼迦前书": 52, "帖撒罗尼迦后书": 53, "提摩太前书": 54, "提摩太后书": 55,
    "提多书": 56, "腓利门书": 57, "希伯来书": 58, "雅各书": 59, "彼得前书": 60,
    "彼得后书": 61, "约翰一书": 62, "约翰二书": 63, "约翰三书": 64, "犹大书": 65,
    "启示录": 66
  };

  function initStyle() {
    if (document.getElementById('bible-audio-style-v3')) return;
    const style = document.createElement('style');
    style.id = 'bible-audio-style-v3';
    style.innerHTML = `
      /* 逐节高亮动画与聚光灯效果 */
      .verse-p {
        transition: all 0.25s ease;
        padding: 6px 10px;
        border-radius: 10px;
        cursor: pointer;
        position: relative;
      }
      .verse-p:hover {
        background: rgba(245, 158, 11, 0.08);
      }
      .verse-p.reading-active {
        background: #fef3c7 !important;
        color: #78350f !important;
        font-weight: 700;
        box-shadow: 0 2px 12px rgba(245, 158, 11, 0.2);
        transform: scale(1.01);
      }
      .verse-p.reading-active .verse-num {
        color: #b45309 !important;
        font-size: 13px !important;
      }

      /* 底部常驻悬浮播放控制条 */
      .bible-audio-bar {
        position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%);
        width: 92%; max-width: 640px; background: rgba(255, 255, 255, 0.98);
        backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
        border: 1.5px solid #cbd5e1; border-radius: 20px; padding: 10px 18px;
        box-shadow: 0 16px 36px rgba(0,0,0,0.16); z-index: 99999;
        display: none; flex-direction: column; gap: 8px; animation: slideBarUp 0.22s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .bible-audio-bar.active { display: flex !important; }
      @keyframes slideBarUp { from { transform: translate(-50%, 30px); opacity: 0; } to { transform: translate(-50%, 0); opacity: 1; } }

      .audio-bar-row-top { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
      .audio-bar-title { font-size: 13.5px; font-weight: 800; color: #1e293b; display: flex; align-items: center; gap: 6px; }
      .audio-bar-badge { font-size: 11px; padding: 2px 8px; border-radius: 12px; background: #dcfce7; color: #15803d; font-weight: 700; }
      
      .audio-bar-controls { display: flex; align-items: center; gap: 8px; }
      .audio-btn-action {
        width: 34px; height: 34px; border-radius: 50%; background: #f1f5f9; color: #334155;
        display: flex; align-items: center; justify-content: center; font-size: 13px; cursor: pointer; border: none;
        transition: all 0.15s;
      }
      .audio-btn-action:hover { background: #e2e8f0; transform: scale(1.08); }
      .audio-btn-main { width: 38px; height: 38px; background: #d97706; color: #fff; font-size: 16px; }
      .audio-btn-main:hover { background: #b45309; }

      .audio-bar-row-bottom { display: flex; align-items: center; justify-content: space-between; gap: 10px; font-size: 11.5px; color: #64748b; }
      .audio-select-small {
        border: 1px solid #cbd5e1; background: #f8fafc; border-radius: 8px; font-size: 11px;
        padding: 3px 6px; outline: none; cursor: pointer; color: #475569; font-weight: 700;
      }
    `;
    document.head.appendChild(style);
  }

  function initPlayerBar() {
    initStyle();
    if (document.getElementById('bibleAudioBar')) return;

    const bar = document.createElement('div');
    bar.id = 'bibleAudioBar';
    bar.className = 'bible-audio-bar';
    bar.innerHTML = `
      <div class="audio-bar-row-top">
        <div class="audio-bar-title">
          <span id="audioCurBookText">创世记 第 1 章</span>
          <span class="audio-bar-badge" id="audioCurVerseBadge">第 1 节</span>
        </div>
        <div class="audio-bar-controls">
          <button class="audio-btn-action" title="上一节" onclick="BibleAudio.prevVerse()">⏮</button>
          <button class="audio-btn-action audio-btn-main" id="audioPlayToggleBtn" title="播放/暂停" onclick="BibleAudio.toggle()">▶</button>
          <button class="audio-btn-action" title="下一节" onclick="BibleAudio.nextVerse()">⏭</button>
          <button class="audio-btn-action" style="font-weight:800; font-size:11px; border-radius:8px;" id="audioRateBtn" onclick="BibleAudio.cycleRate()">1.0x</button>
          <button class="audio-btn-action" style="color:#94a3b8;" title="关闭伴读" onclick="BibleAudio.stop()">✕</button>
        </div>
      </div>
      <div class="audio-bar-row-bottom">
        <div style="display:flex; align-items:center; gap:6px;">
          <span>🎙️ 朗读音色:</span>
          <select id="audioVoiceSelect" class="audio-select-small" onchange="BibleAudio.changeVoice(this.value)">
            <option value="">默认普通话男声/女声</option>
          </select>
        </div>
        <div style="display:flex; align-items:center; gap:6px;">
          <label style="cursor:pointer; display:flex; align-items:center; gap:4px;">
            <input type="checkbox" id="audioAutoScrollCheck" checked onchange="BibleAudio.toggleAutoScroll(this.checked)"> 字幕跟随滚屏
          </label>
        </div>
      </div>
    `;
    document.body.appendChild(bar);
    loadVoices();
  }

  function loadVoices() {
    if (!synth) return;
    const update = () => {
      const voices = synth.getVoices().filter(v => v.lang.includes('zh') || v.lang.includes('cmn') || v.lang.includes('CN') || v.lang.includes('TW'));
      const select = document.getElementById('audioVoiceSelect');
      if (select && voices.length > 0) {
        select.innerHTML = voices.map((v, i) => `
          <option value="${v.name}">${v.name.replace(/Microsoft|Google|Apple/g, '').trim()} (${v.lang})</option>
        `).join('');
        selectedVoice = voices[0];
      }
    };
    update();
    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = update;
    }
  }

  // 绑定当前经文数据源
  function setVerses(bookName, chapterNum, list) {
    initPlayerBar();
    versesList = list || [];
    currentVerseIndex = 0;
    document.getElementById('audioCurBookText').innerText = `${bookName} 第 ${chapterNum} 章`;
  }

  // 播放单节经文并触发字幕高亮与滚屏
  function speakVerse(index) {
    if (!synth || versesList.length === 0) return;
    if (index < 0 || index >= versesList.length) {
      // 读完本章
      stop();
      if (typeof window.toggleCurrentChapterDone === 'function') {
        if (confirm("🎉 本章经文已全部伴读完毕，是否立即点亮打卡？")) {
          window.toggleCurrentChapterDone();
        }
      }
      return;
    }

    currentVerseIndex = index;
    const currentItem = versesList[index];

    // 更新界面状态与高亮
    highlightVerse(currentItem.verse);
    document.getElementById('audioCurVerseBadge').innerText = `第 ${currentItem.verse} 节 / 共 ${versesList.length} 节`;

    // 构造语音对象
    synth.cancel(); // 停止上一段
    const textToSpeak = `第${currentItem.verse}节。${currentItem.text.replace(/^[0-9\s:：]+/, '')}`;
    activeUtterance = new SpeechSynthesisUtterance(textToSpeak);
    activeUtterance.lang = 'zh-CN';
    activeUtterance.rate = currentRate;

    if (selectedVoice) {
      activeUtterance.voice = selectedVoice;
    }

    activeUtterance.onend = function () {
      if (isPlaying && !isPaused) {
        speakVerse(currentVerseIndex + 1); // 自动连续播放下一节
      }
    };

    activeUtterance.onerror = function (e) {
      if (isPlaying && !isPaused) {
        setTimeout(() => speakVerse(currentVerseIndex + 1), 200);
      }
    };

    synth.speak(activeUtterance);
    updateBarPlayState(true);
  }

  // 精准高亮对应经文段落并平滑滚动
  function highlightVerse(verseNum) {
    const allVerses = document.querySelectorAll('.verse-p');
    allVerses.forEach(el => el.classList.remove('reading-active'));

    const targetEl = document.querySelector(`.verse-p[data-verse="${verseNum}"]`);
    if (targetEl) {
      targetEl.classList.add('reading-active');
      if (autoScroll) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }

  function start(index = 0) {
    initPlayerBar();
    document.getElementById('bibleAudioBar').classList.add('active');
    isPlaying = true;
    isPaused = false;
    speakVerse(index);
  }

  function toggle() {
    if (!isPlaying) {
      start(currentVerseIndex);
      return;
    }
    if (isPaused) {
      synth.resume();
      isPaused = false;
      updateBarPlayState(true);
    } else {
      synth.pause();
      isPaused = true;
      updateBarPlayState(false);
    }
  }

  function stop() {
    if (synth) synth.cancel();
    isPlaying = false;
    isPaused = false;
    updateBarPlayState(false);
    const allVerses = document.querySelectorAll('.verse-p');
    allVerses.forEach(el => el.classList.remove('reading-active'));
    const bar = document.getElementById('bibleAudioBar');
    if (bar) bar.classList.remove('active');
  }

  function nextVerse() {
    if (currentVerseIndex < versesList.length - 1) {
      speakVerse(currentVerseIndex + 1);
    }
  }

  function prevVerse() {
    if (currentVerseIndex > 0) {
      speakVerse(currentVerseIndex - 1);
    }
  }

  function playFromVerse(verseNum) {
    const idx = versesList.findIndex(item => Number(item.verse) === Number(verseNum));
    if (idx !== -1) {
      start(idx);
    }
  }

  const RATES = [1.0, 1.25, 1.5, 0.8];
  let rateIdx = 0;
  function cycleRate() {
    rateIdx = (rateIdx + 1) % RATES.length;
    currentRate = RATES[rateIdx];
    document.getElementById('audioRateBtn').innerText = `${currentRate}x`;
    if (isPlaying && !isPaused) {
      speakVerse(currentVerseIndex);
    }
  }

  function changeVoice(voiceName) {
    if (!synth) return;
    const voices = synth.getVoices();
    const v = voices.find(item => item.name === voiceName);
    if (v) {
      selectedVoice = v;
      if (isPlaying && !isPaused) {
        speakVerse(currentVerseIndex);
      }
    }
  }

  function toggleAutoScroll(enabled) {
    autoScroll = enabled;
  }

  function updateBarPlayState(playing) {
    const btn = document.getElementById('audioPlayToggleBtn');
    const headerBtn = document.getElementById('btnTtsRead');
    if (btn) btn.innerHTML = playing ? "⏸" : "▶";
    if (headerBtn) headerBtn.innerText = playing ? "⏸ 伴读中" : "🔊 朗读";
  }

  global.BibleAudio = {
    setVerses,
    start,
    toggle,
    stop,
    nextVerse,
    prevVerse,
    playFromVerse,
    cycleRate,
    changeVoice,
    toggleAutoScroll
  };
})(window);

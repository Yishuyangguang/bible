/**
 * 灵粮行旅 - 专业圣经多版本有声朗读与播放器模块
 * 文件名: bible-audio.js
 */

(function (global) {
  const BOOK_META = {
    "创世记": { id: 1, pinyin: "csj", code: "GEN", en: "01_Genesis" },
    "出埃及记": { id: 2, pinyin: "cajj", code: "EXO", en: "02_Exodus" },
    "利未记": { id: 3, pinyin: "lwj", code: "LEV", en: "03_Leviticus" },
    "民数记": { id: 4, pinyin: "msj", code: "NUM", en: "04_Numbers" },
    "申命记": { id: 5, pinyin: "smj", code: "DEU", en: "05_Deuteronomy" },
    "约书亚记": { id: 6, pinyin: "ysyj", code: "JOS", en: "06_Joshua" },
    "士师记": { id: 7, pinyin: "ssj", code: "JDG", en: "07_Judges" },
    "路得记": { id: 8, pinyin: "ldj", code: "RUT", en: "08_Ruth" },
    "撒母耳记上": { id: 9, pinyin: "smejs", code: "1SA", en: "09_1Samuel" },
    "撒母耳记下": { id: 10, pinyin: "smejx", code: "2SA", en: "10_2Samuel" },
    "列王纪上": { id: 11, pinyin: "lwjs", code: "1KI", en: "11_1Kings" },
    "列王纪下": { id: 12, pinyin: "lwjx", code: "2KI", en: "12_2Kings" },
    "历代志上": { id: 13, pinyin: "ldzs", code: "1CH", en: "13_1Chronicles" },
    "历代志下": { id: 14, pinyin: "ldzx", code: "2CH", en: "14_2Chronicles" },
    "以斯拉记": { id: 15, pinyin: "yslj", code: "EZR", en: "15_Ezra" },
    "尼希米记": { id: 16, pinyin: "nxmj", code: "NEH", en: "16_Nehemiah" },
    "以斯帖记": { id: 17, pinyin: "ystj", code: "EST", en: "17_Esther" },
    "约伯记": { id: 18, pinyin: "ybj", code: "JOB", en: "18_Job" },
    "诗篇": { id: 19, pinyin: "sp", code: "PSA", en: "19_Psalms" },
    "箴言": { id: 20, pinyin: "zy", code: "PRO", en: "20_Proverbs" },
    "传道书": { id: 21, pinyin: "cds", code: "ECC", en: "21_Ecclesiastes" },
    "雅歌": { id: 22, pinyin: "yg", code: "SNG", en: "22_SongofSongs" },
    "以赛亚书": { id: 23, pinyin: "ysys", code: "ISA", en: "23_Isaiah" },
    "耶利米书": { id: 24, pinyin: "ylms", code: "JER", en: "24_Jeremiah" },
    "耶利米哀歌": { id: 25, pinyin: "ylmag", code: "LAM", en: "25_Lamentations" },
    "以西结书": { id: 26, pinyin: "yxjs", code: "EZK", en: "26_Ezekiel" },
    "但以理书": { id: 27, pinyin: "dyls", code: "DAN", en: "27_Daniel" },
    "何西阿书": { id: 28, pinyin: "hxas", code: "HOS", en: "28_Hosea" },
    "约珥书": { id: 29, pinyin: "yes", code: "JOL", en: "29_Joel" },
    "阿摩司书": { id: 30, pinyin: "amss", code: "AMO", en: "30_Amos" },
    "俄巴底亚书": { id: 31, pinyin: "ebdys", code: "OBA", en: "31_Obadiah" },
    "约拿书": { id: 32, pinyin: "yns", code: "JON", en: "32_Jonah" },
    "弥迦书": { id: 33, pinyin: "mjs", code: "MIC", en: "33_Micah" },
    "那鸿书": { id: 34, pinyin: "nhs", code: "NAM", en: "34_Nahum" },
    "哈巴谷书": { id: 35, pinyin: "hbgs", code: "HAB", en: "35_Habakkuk" },
    "西番雅书": { id: 36, pinyin: "xfys", code: "ZEP", en: "36_Zephaniah" },
    "哈该书": { id: 37, pinyin: "hgs", code: "HAG", en: "37_Haggai" },
    "撒迦利亚书": { id: 38, pinyin: "sjlys", code: "ZEC", en: "38_Zechariah" },
    "玛拉基书": { id: 39, pinyin: "mljs", code: "MAL", en: "39_Malachi" },
    "马太福音": { id: 40, pinyin: "mtfy", code: "MAT", en: "40_Matthew" },
    "马可福音": { id: 41, pinyin: "mkfy", code: "MRK", en: "41_Mark" },
    "路加福音": { id: 42, pinyin: "ljfy", code: "LUK", en: "42_Luke" },
    "约翰福音": { id: 43, pinyin: "yhfy", code: "JHN", en: "43_John" },
    "使徒行传": { id: 44, pinyin: "stxz", code: "ACT", en: "44_Acts" },
    "罗马书": { id: 45, pinyin: "lms", code: "ROM", en: "45_Romans" },
    "哥林多前书": { id: 46, pinyin: "gldqs", code: "1CO", en: "46_1Corinthians" },
    "哥林多后书": { id: 47, pinyin: "gldhs", code: "2CO", en: "47_2Corinthians" },
    "加拉太书": { id: 48, pinyin: "jlts", code: "GAL", en: "48_Galatians" },
    "以弗所书": { id: 49, pinyin: "yfss", code: "EPH", en: "49_Ephesians" },
    "腓立比书": { id: 50, pinyin: "flbs", code: "PHP", en: "50_Philippians" },
    "歌罗西书": { id: 51, pinyin: "glxs", code: "COL", en: "51_Colossians" },
    "帖撒罗尼迦前书": { id: 52, pinyin: "tslnjqs", code: "1TH", en: "52_1Thessalonians" },
    "帖撒罗尼迦后书": { id: 53, pinyin: "tslnjhs", code: "2TH", en: "53_2Thessalonians" },
    "提摩太前书": { id: 54, pinyin: "tmtqs", code: "1TI", en: "54_1Timothy" },
    "提摩太后书": { id: 55, pinyin: "tmths", code: "2TI", en: "55_2Timothy" },
    "提多书": { id: 56, pinyin: "tds", code: "TIT", en: "56_Titus" },
    "腓利门书": { id: 57, pinyin: "flms", code: "PHM", en: "57_Philemon" },
    "希伯来书": { id: 58, pinyin: "xbls", code: "HEB", en: "58_Hebrews" },
    "雅各书": { id: 59, pinyin: "ygs", code: "JAS", en: "59_James" },
    "彼得前书": { id: 60, pinyin: "bdqs", code: "1PE", en: "60_1Peter" },
    "彼得后书": { id: 61, pinyin: "bdhs", code: "2PE", en: "61_2Peter" },
    "约翰一书": { id: 62, pinyin: "yhys", code: "1JN", en: "62_1John" },
    "约翰二书": { id: 63, pinyin: "yhes", code: "2JN", en: "63_2John" },
    "约翰三书": { id: 64, pinyin: "yhss", code: "3JN", en: "64_3John" },
    "犹大书": { id: 65, pinyin: "yds", code: "JUD", en: "65_Jude" },
    "启示录": { id: 66, pinyin: "qsl", code: "REV", en: "66_Revelation" }
  };

  const VERSION_INFO = {
    "drama": { name: "华语戏剧圣经版", badge: "🎭 角色配乐", desc: "男女角色分角配音、全情管弦乐伴奏，犹如身临圣经现场" },
    "panshi": { name: "磐石聆听有声版", badge: "🎙️ 专业播音", desc: "国家级播音员深情朗诵，字正腔圆、庄严宁静" },
    "standard": { name: "经典和合本原版", badge: "📖 传统诵读", desc: "经典和合本传统男声诵读，无背景音乐，清澈专注" },
    "tts": { name: "设备智能语音朗读", badge: "🗣️ AI 朗读", desc: "调用手机/电脑内置原生语音引擎，100% 离线可用" }
  };

  let audioEl = null;
  let currentBook = "创世记";
  let currentChapter = 1;
  let currentVersion = "drama";
  let isSeeking = false;
  let ttsUtterance = null;
  let isTtsRunning = false;

  function getAudioUrls(version, bookName, chapterNum) {
    const meta = BOOK_META[bookName] || { id: 1, pinyin: "csj", code: "GEN", en: "01_Genesis" };
    const b2 = String(meta.id).padStart(2, '0');
    const ch3 = String(chapterNum).padStart(3, '0');
    const ch2 = String(chapterNum).padStart(2, '0');

    if (version === "drama") {
      return [
        `https://audio.audiotreasure.com/chinesedrama/${b2}_${meta.code}_${ch3}.mp3`,
        `https://raw.githubusercontent.com/faithcomesbyhearing/cmn-drama/main/${b2}_${ch3}.mp3`
      ];
    } else if (version === "panshi") {
      return [
        `https://media.wordproject.org/audio/cmn/${b2}/${chapterNum}.mp3`,
        `https://audio.cclw.net/bible/cuv/${meta.pinyin}/${chapterNum}.mp3`
      ];
    } else {
      return [
        `https://media.wordproject.org/audio/cmn/${b2}/${chapterNum}.mp3`,
        `https://audio.audiotreasure.com/mp3/Mandarin/${meta.en}/${meta.en}_${ch2}.mp3`
      ];
    }
  }

  function initUI() {
    if (document.getElementById('bibleAudioModal')) return;

    const style = document.createElement('style');
    style.id = 'bible-audio-style-v2';
    style.innerHTML = `
      .audio-modal-backdrop {
        position: fixed; inset: 0; background: rgba(15, 23, 42, 0.48); backdrop-filter: blur(8px);
        display: none; align-items: center; justify-content: center; z-index: 5000; padding: 16px;
      }
      .audio-modal-backdrop.active { display: flex !important; }
      .audio-modal-win {
        background: #ffffff; border-radius: 24px; width: 100%; max-width: 460px;
        box-shadow: 0 20px 40px rgba(0,0,0,0.18); overflow: hidden; animation: audioPop 0.2s ease-out;
      }
      @keyframes audioPop { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      .audio-modal-header {
        padding: 16px 20px; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center;
      }
      .audio-version-list {
        padding: 16px 20px; display: flex; flex-direction: column; gap: 10px;
      }
      .audio-ver-card {
        padding: 14px 16px; border-radius: 14px; background: #f8fafc; border: 1.5px solid #e2e8f0;
        cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: space-between;
      }
      .audio-ver-card:hover {
        background: #eef7f2; border-color: #a7f3d0; transform: translateY(-1px);
      }
      .audio-ver-card.active {
        background: #fffbeb; border-color: #f59e0b; box-shadow: 0 4px 12px rgba(245,158,11,0.12);
      }
      .audio-ver-title { font-size: 14px; font-weight: 800; color: #1e293b; display: flex; align-items: center; gap: 6px; }
      .audio-ver-badge { font-size: 10.5px; padding: 2px 7px; border-radius: 6px; background: #fef3c7; color: #b45309; font-weight: 700; }
      .audio-ver-desc { font-size: 11.5px; color: #64748b; margin-top: 4px; line-height: 1.4; }
      
      /* 浮动迷你播放器 */
      .audio-float-player {
        position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%);
        width: 92%; max-width: 580px; background: rgba(255, 255, 255, 0.98);
        backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
        border: 1.5px solid #cbd5e1; border-radius: 20px; padding: 12px 18px;
        box-shadow: 0 16px 36px rgba(0,0,0,0.16); z-index: 4000;
        display: none; flex-direction: column; gap: 8px; animation: slideUp 0.25s ease-out;
      }
      .audio-float-player.active { display: flex !important; }
      @keyframes slideUp { from { transform: translate(-50%, 20px); opacity: 0; } to { transform: translate(-50%, 0); opacity: 1; } }
      .player-top { display: flex; align-items: center; justify-content: space-between; }
      .player-info { display: flex; flex-direction: column; }
      .player-title { font-size: 13.5px; font-weight: 800; color: #1e293b; }
      .player-status { font-size: 11px; color: #059669; font-weight: 700; }
      .player-controls { display: flex; align-items: center; gap: 8px; }
      .player-btn {
        width: 34px; height: 34px; border-radius: 50%; background: #f1f5f9; color: #334155;
        display: flex; align-items: center; justify-content: center; font-size: 13px; cursor: pointer; border: none;
      }
      .player-btn:hover { background: #e2e8f0; }
      .player-btn-main { width: 38px; height: 38px; background: #d97706; color: #fff; font-size: 16px; }
      .player-btn-main:hover { background: #b45309; }
      .player-progress-box { display: flex; align-items: center; gap: 8px; width: 100%; }
      .player-time { font-size: 11px; color: #94a3b8; font-weight: 700; min-width: 34px; }
      .player-range {
        flex: 1; height: 5px; -webkit-appearance: none; appearance: none; background: #e2e8f0; border-radius: 5px; outline: none; cursor: pointer;
      }
      .player-range::-webkit-slider-thumb {
        -webkit-appearance: none; appearance: none; width: 12px; height: 12px; border-radius: 50%; background: #d97706; cursor: pointer;
      }
    `;
    document.head.appendChild(style);

    // 弹窗 HTML
    const modal = document.createElement('div');
    modal.id = 'bibleAudioModal';
    modal.className = 'audio-modal-backdrop';
    modal.onclick = closeVersionSelector;
    modal.innerHTML = `
      <div class="audio-modal-win" onclick="event.stopPropagation()">
        <div class="audio-modal-header">
          <span style="font-size:15px; font-weight:800; color:#1e293b;" id="audioModalTitle">🎧 选择有声朗读版本</span>
          <button onclick="BibleAudio.closeVersionSelector()" style="font-size:18px; color:#94a3b8; border:none; background:none; cursor:pointer;">✕</button>
        </div>
        <div class="audio-version-list" id="audioVersionList"></div>
      </div>
    `;
    document.body.appendChild(modal);

    // 浮动播放器 HTML
    const floatPlayer = document.createElement('div');
    floatPlayer.id = 'bibleFloatPlayer';
    floatPlayer.className = 'audio-float-player';
    floatPlayer.innerHTML = `
      <div class="player-top">
        <div class="player-info">
          <div class="player-title" id="fpTitle">创世记 第 1 章</div>
          <div class="player-status" id="fpStatus">戏剧圣经版 · 正在播放</div>
        </div>
        <div class="player-controls">
          <button class="player-btn" title="后退15秒" onclick="BibleAudio.seekRelative(-15)">⏪</button>
          <button class="player-btn player-btn-main" id="fpPlayBtn" onclick="BibleAudio.toggle()">▶</button>
          <button class="player-btn" title="前进15秒" onclick="BibleAudio.seekRelative(15)">⏩</button>
          <button class="player-btn" style="border-radius:8px; font-weight:800; font-size:11px;" id="fpSpeedBtn" onclick="BibleAudio.cycleSpeed()">1.0x</button>
          <button class="player-btn" title="更换版本" onclick="BibleAudio.showVersionSelector()">🔄</button>
          <button class="player-btn" style="color:#94a3b8;" title="关闭播放器" onclick="BibleAudio.stop()">✕</button>
        </div>
      </div>
      <div class="player-progress-box">
        <span class="player-time" id="fpCurTime">00:00</span>
        <input type="range" class="player-range" id="fpRange" min="0" max="100" value="0" step="0.1" />
        <span class="player-time" id="fpDuration">00:00</span>
      </div>
    `;
    document.body.appendChild(floatPlayer);

    audioEl = new Audio();
    audioEl.preload = "metadata";

    audioEl.addEventListener('timeupdate', () => {
      if (!isSeeking && audioEl.duration) {
        const cur = audioEl.currentTime;
        const dur = audioEl.duration;
        document.getElementById('fpRange').value = (cur / dur) * 100;
        document.getElementById('fpCurTime').innerText = formatTime(cur);
      }
    });

    audioEl.addEventListener('loadedmetadata', () => {
      document.getElementById('fpDuration').innerText = formatTime(audioEl.duration);
    });

    audioEl.addEventListener('play', () => updatePlayUI(true));
    audioEl.addEventListener('pause', () => updatePlayUI(false));
    audioEl.addEventListener('ended', () => {
      updatePlayUI(false);
      document.getElementById('fpRange').value = 0;
      document.getElementById('fpCurTime').innerText = "00:00";
    });

    audioEl.addEventListener('error', () => {
      console.warn('Audio URL stream failed, falling back to TTS...');
      playTTS();
    });

    const range = document.getElementById('fpRange');
    range.addEventListener('input', () => { isSeeking = true; });
    range.addEventListener('change', () => {
      if (audioEl.duration) {
        audioEl.currentTime = (range.value / 100) * audioEl.duration;
      }
      isSeeking = false;
    });
  }

  function formatTime(s) {
    if (isNaN(s) || s === Infinity) return "00:00";
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = Math.floor(s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  }

  function updatePlayUI(isPlaying) {
    const btn = document.getElementById('fpPlayBtn');
    const headerBtn = document.getElementById('btnTtsRead');
    if (btn) btn.innerHTML = isPlaying ? "⏸" : "▶";
    if (headerBtn) headerBtn.innerText = isPlaying ? "⏸ 暂停" : "🔊 朗读";
  }

  function showVersionSelector(book, ch) {
    initUI();
    if (book) currentBook = book;
    if (ch) currentChapter = ch;

    document.getElementById('audioModalTitle').innerText = `🎧 ${currentBook} 第 ${currentChapter} 章 · 朗读版本`;
    const container = document.getElementById('audioVersionList');

    container.innerHTML = Object.keys(VERSION_INFO).map(verKey => {
      const v = VERSION_INFO[verKey];
      const isCur = (verKey === currentVersion);
      return `
        <div class="audio-ver-card ${isCur ? 'active' : ''}" onclick="BibleAudio.selectVersion('${verKey}')">
          <div>
            <div class="audio-ver-title">
              <span>${v.name}</span>
              <span class="audio-ver-badge">${v.badge}</span>
            </div>
            <div class="audio-ver-desc">${v.desc}</div>
          </div>
          <span style="font-size:16px; color:#d97706;">${isCur ? '✓' : '➔'}</span>
        </div>
      `;
    }).join('');

    document.getElementById('bibleAudioModal').classList.add('active');
  }

  function closeVersionSelector() {
    const modal = document.getElementById('bibleAudioModal');
    if (modal) modal.classList.remove('active');
  }

  function selectVersion(verKey) {
    currentVersion = verKey;
    closeVersionSelector();
    playCurrent();
  }

  function playCurrent() {
    initUI();
    stopTTS();

    document.getElementById('fpTitle').innerText = `${currentBook} 第 ${currentChapter} 章`;
    document.getElementById('fpStatus').innerText = `${VERSION_INFO[currentVersion].name} · 正在播放`;
    document.getElementById('bibleFloatPlayer').classList.add('active');

    if (currentVersion === "tts") {
      playTTS();
      return;
    }

    const urls = getAudioUrls(currentVersion, currentBook, currentChapter);
    audioEl.src = urls[0];
    audioEl.load();
    audioEl.play().catch(() => {
      if (urls[1]) {
        audioEl.src = urls[1];
        audioEl.load();
        audioEl.play().catch(playTTS);
      } else {
        playTTS();
      }
    });
  }

  function playTTS() {
    if (!('speechSynthesis' in window)) {
      alert("当前设备不支持语音朗读");
      return;
    }
    const textBody = document.getElementById('readerVersesBody')?.innerText || `${currentBook}第${currentChapter}章`;
    ttsUtterance = new SpeechSynthesisUtterance(textBody);
    ttsUtterance.lang = 'zh-CN';
    ttsUtterance.rate = 0.95;
    ttsUtterance.onend = () => updatePlayUI(false);
    
    window.speechSynthesis.speak(ttsUtterance);
    isTtsRunning = true;
    updatePlayUI(true);
    document.getElementById('fpStatus').innerText = "设备智能语音 · 正在朗读";
  }

  function stopTTS() {
    if ('speechSynthesis' in window && isTtsRunning) {
      window.speechSynthesis.cancel();
      isTtsRunning = false;
    }
  }

  function toggle() {
    if (isTtsRunning) {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        updatePlayUI(true);
      } else {
        window.speechSynthesis.pause();
        updatePlayUI(false);
      }
      return;
    }
    if (!audioEl.src) {
      playCurrent();
      return;
    }
    if (audioEl.paused) {
      audioEl.play();
    } else {
      audioEl.pause();
    }
  }

  function stop() {
    if (audioEl) {
      audioEl.pause();
      audioEl.currentTime = 0;
    }
    stopTTS();
    updatePlayUI(false);
    const fp = document.getElementById('bibleFloatPlayer');
    if (fp) fp.classList.remove('active');
  }

  function seekRelative(delta) {
    if (audioEl && audioEl.duration) {
      let t = audioEl.currentTime + delta;
      if (t < 0) t = 0;
      if (t > audioEl.duration) t = audioEl.duration;
      audioEl.currentTime = t;
    }
  }

  const SPEEDS = [1.0, 1.25, 1.5, 0.75];
  let spdIdx = 0;
  function cycleSpeed() {
    spdIdx = (spdIdx + 1) % SPEEDS.length;
    const s = SPEEDS[spdIdx];
    if (audioEl) audioEl.playbackRate = s;
    if (ttsUtterance) ttsUtterance.rate = s;
    const btn = document.getElementById('fpSpeedBtn');
    if (btn) btn.innerText = `${s}x`;
  }

  global.BibleAudio = {
    showVersionSelector,
    closeVersionSelector,
    selectVersion,
    toggle,
    stop,
    seekRelative,
    cycleSpeed,
    playCurrent
  };
})(window);

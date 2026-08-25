/**
 * 灵粮行旅 - 专业圣经高质量音频播放模块 (戏剧圣经 / 磐石聆听版 / 经典朗读)
 * 文件名: bible-audio.js
 */

(function (global) {
  // 66卷圣经的标准代号与英文缩写对照表 (用于定位音频文件)
  const BOOK_META = {
    "创世记": { id: 1, pinyin: "csj", code: "GEN" }, "出埃及记": { id: 2, pinyin: "cajj", code: "EXO" },
    "利未记": { id: 3, pinyin: "lwj", code: "LEV" }, "民数记": { id: 4, pinyin: "msj", code: "NUM" },
    "申命记": { id: 5, pinyin: "smj", code: "DEU" }, "约书亚记": { id: 6, pinyin: "ysyj", code: "JOS" },
    "士师记": { id: 7, pinyin: "ssj", code: "JDG" }, "路得记": { id: 8, pinyin: "ldj", code: "RUT" },
    "撒母耳记上": { id: 9, pinyin: "smejs", code: "1SA" }, "撒母耳记下": { id: 10, pinyin: "smejx", code: "2SA" },
    "列王纪上": { id: 11, pinyin: "lwjs", code: "1KI" }, "列王纪下": { id: 12, pinyin: "lwjx", code: "2KI" },
    "历代志上": { id: 13, pinyin: "ldzs", code: "1CH" }, "历代志下": { id: 14, pinyin: "ldzx", code: "2CH" },
    "以斯拉记": { id: 15, pinyin: "yslj", code: "EZR" }, "尼希米记": { id: 16, pinyin: "nxmj", code: "NEH" },
    "以斯帖记": { id: 17, pinyin: "ystj", code: "EST" }, "约伯记": { id: 18, pinyin: "ybj", code: "JOB" },
    "诗篇": { id: 19, pinyin: "sp", code: "PSA" }, "箴言": { id: 20, pinyin: "zy", code: "PRO" },
    "传道书": { id: 21, pinyin: "cds", code: "ECC" }, "雅歌": { id: 22, pinyin: "yg", code: "SNG" },
    "以赛亚书": { id: 23, pinyin: "ysys", code: "ISA" }, "耶利米书": { id: 24, pinyin: "ylms", code: "JER" },
    "耶利米哀歌": { id: 25, pinyin: "ylmag", code: "LAM" }, "以西结书": { id: 26, pinyin: "yxjs", code: "EZK" },
    "但以理书": { id: 27, pinyin: "dyls", code: "DAN" }, "何西阿书": { id: 28, pinyin: "hxas", code: "HOS" },
    "约珥书": { id: 29, pinyin: "yes", code: "JOL" }, "阿摩司书": { id: 30, pinyin: "amss", code: "AMO" },
    "俄巴底亚书": { id: 31, pinyin: "ebdys", code: "OBA" }, "约拿书": { id: 32, pinyin: "yns", code: "JON" },
    "弥迦书": { id: 33, pinyin: "mjs", code: "MIC" }, "那鸿书": { id: 34, pinyin: "nhs", code: "NAM" },
    "哈巴谷书": { id: 35, pinyin: "hbgs", code: "HAB" }, "西番雅书": { id: 36, pinyin: "xfys", code: "ZEP" },
    "哈该书": { id: 37, pinyin: "hgs", code: "HAG" }, "撒迦利亚书": { id: 38, pinyin: "sjlys", code: "ZEC" },
    "玛拉基书": { id: 39, pinyin: "mljs", code: "MAL" }, "马太福音": { id: 40, pinyin: "mtfy", code: "MAT" },
    "马可福音": { id: 41, pinyin: "mkfy", code: "MRK" }, "路加福音": { id: 42, pinyin: "ljfy", code: "LUK" },
    "约翰福音": { id: 43, pinyin: "yhfy", code: "JHN" }, "使徒行传": { id: 44, pinyin: "stxz", code: "ACT" },
    "罗马书": { id: 45, pinyin: "lms", code: "ROM" }, "哥林多前书": { id: 46, pinyin: "gldqs", code: "1CO" },
    "哥林多后书": { id: 47, pinyin: "gldhs", code: "2CO" }, "加拉太书": { id: 48, pinyin: "jlts", code: "GAL" },
    "以弗所书": { id: 49, pinyin: "yfss", code: "EPH" }, "腓立比书": { id: 50, pinyin: "flbs", code: "PHP" },
    "歌罗西书": { id: 51, pinyin: "glxs", code: "COL" }, "帖撒罗尼迦前书": { id: 52, pinyin: "tslnjqs", code: "1TH" },
    "帖撒罗尼迦后书": { id: 53, pinyin: "tslnjhs", code: "2TH" }, "提摩太前书": { id: 54, pinyin: "tmtqs", code: "1TI" },
    "提摩太后书": { id: 55, pinyin: "tmths", code: "2TI" }, "提多书": { id: 56, pinyin: "tds", code: "TIT" },
    "腓利门书": { id: 57, pinyin: "flms", code: "PHM" }, "希伯来书": { id: 58, pinyin: "xbls", code: "HEB" },
    "雅各书": { id: 59, pinyin: "ygs", code: "JAS" }, "彼得前书": { id: 60, pinyin: "bdqs", code: "1PE" },
    "彼得后书": { id: 61, pinyin: "bdhs", code: "2PE" }, "约翰一书": { id: 62, pinyin: "yhys", code: "1JN" },
    "约翰二书": { id: 63, pinyin: "yhes", code: "2JN" }, "约翰三书": { id: 64, pinyin: "yhss", code: "3JN" },
    "犹大书": { id: 65, pinyin: "yds", code: "JUD" }, "启示录": { id: 66, pinyin: "qsl", code: "REV" }
  };

  let audioElement = null;
  let currentBook = "";
  let currentChapter = 1;
  let currentVersion = "drama"; // 'drama' (戏剧圣经), 'panshi' (磐石聆听版), 'standard' (经典版)
  let isSeeking = false;

  // 音频源生成策略
  function getAudioUrl(version, bookName, chapterNum) {
    const meta = BOOK_META[bookName] || { id: 1, pinyin: "csj", code: "GEN" };
    const bookId2 = String(meta.id).padStart(2, '0');
    const ch3 = String(chapterNum).padStart(3, '0');
    const ch2 = String(chapterNum).padStart(2, '0');

    switch (version) {
      case "drama":
        // 华语戏剧圣经 (带背景音乐、立体声戏剧化演绎)
        return `https://audio.audiotreasure.com/chinesedrama/${bookId2}_${meta.code}_${ch3}.mp3`;
      case "panshi":
        // 磐石聆听版 / 语音圣经 (专业播音朗读)
        return `https://audio.cclw.net/bible/cuv/${meta.pinyin}/${chapterNum}.mp3`;
      case "standard":
      default:
        // 经典和合本音频
        return `https://media.freebibleimages.org/audio/cuv/${bookId2}_${ch3}.mp3`;
    }
  }

  function initAudioUI() {
    if (document.getElementById('bible-audio-player-bar')) return;

    const style = document.createElement('style');
    style.id = 'bible-audio-style';
    style.innerHTML = `
      .audio-player-bar {
        background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 16px;
        padding: 10px 16px; margin-top: 14px; box-shadow: 0 4px 16px rgba(0,0,0,0.06);
        display: flex; flex-direction: column; gap: 8px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      }
      .audio-top-row {
        display: flex; align-items: center; justify-content: space-between; gap: 8px; flex-wrap: wrap;
      }
      .audio-version-select {
        border: 1px solid #cbd5e1; background: #f8fafc; border-radius: 8px;
        font-size: 11.5px; font-weight: 700; color: #475569; padding: 4px 8px; outline: none; cursor: pointer;
      }
      .audio-controls {
        display: flex; align-items: center; gap: 10px;
      }
      .audio-btn-icon {
        width: 34px; height: 34px; border-radius: 50%; background: #f1f5f9; color: #334155;
        display: flex; align-items: center; justify-content: center; font-size: 14px; cursor: pointer;
        transition: all 0.2s; border: none;
      }
      .audio-btn-icon:hover { background: #e2e8f0; transform: scale(1.06); }
      .audio-btn-play {
        width: 38px; height: 38px; background: #d97706; color: #ffffff; font-size: 16px;
      }
      .audio-btn-play:hover { background: #b45309; }
      
      .audio-progress-row {
        display: flex; align-items: center; gap: 10px; width: 100%;
      }
      .audio-time-label {
        font-size: 11px; color: #94a3b8; font-weight: 700; font-variant-numeric: tabular-nums; min-width: 36px;
      }
      .audio-progress-bar {
        flex: 1; height: 6px; -webkit-appearance: none; appearance: none; background: #e2e8f0;
        border-radius: 6px; outline: none; cursor: pointer; transition: background 0.2s;
      }
      .audio-progress-bar::-webkit-slider-thumb {
        -webkit-appearance: none; appearance: none; width: 14px; height: 14px; border-radius: 50%;
        background: #d97706; cursor: pointer; border: 2px solid #ffffff; box-shadow: 0 1px 4px rgba(0,0,0,0.3);
      }
      .audio-speed-btn {
        font-size: 11px; font-weight: 800; color: #64748b; background: #f8fafc;
        border: 1px solid #cbd5e1; border-radius: 6px; padding: 3px 6px; cursor: pointer;
      }
    `;
    document.head.appendChild(style);

    const playerContainer = document.createElement('div');
    playerContainer.id = 'bible-audio-player-bar';
    playerContainer.className = 'audio-player-bar';
    playerContainer.innerHTML = `
      <div class="audio-top-row">
        <div style="display:flex; align-items:center; gap:6px;">
          <span style="font-size:12px; font-weight:800; color:#b45309;">🎧 专业有声圣经</span>
          <select id="audioVersionSelect" class="audio-version-select" onchange="BibleAudio.changeVersion(this.value)">
            <option value="drama">🎭 戏剧圣经版 (全情配乐)</option>
            <option value="panshi">🎙️ 磐石聆听版 (专业纯音)</option>
            <option value="standard">📖 经典和合版 (原版朗读)</option>
          </select>
        </div>
        <div class="audio-controls">
          <button class="audio-btn-icon" title="后退 15 秒" onclick="BibleAudio.seekRelative(-15)">⏪</button>
          <button class="audio-btn-icon audio-btn-play" id="audioMainPlayBtn" title="播放 / 暂停" onclick="BibleAudio.toggle()">▶</button>
          <button class="audio-btn-icon" title="前进 15 秒" onclick="BibleAudio.seekRelative(15)">⏩</button>
          <button class="audio-speed-btn" id="audioSpeedBtn" title="播放倍速" onclick="BibleAudio.cycleSpeed()">1.0x</button>
        </div>
      </div>
      <div class="audio-progress-row">
        <span class="audio-time-label" id="audioCurrentTime">00:00</span>
        <input type="range" class="audio-progress-bar" id="audioSeekBar" value="0" min="0" max="100" step="0.1" />
        <span class="audio-time-label" id="audioDuration">00:00</span>
      </div>
    `;

    // 将控制条插入经文阅读器的导读框下方
    const introBox = document.getElementById('readerContextIntro');
    if (introBox && introBox.parentNode) {
      introBox.parentNode.insertBefore(playerContainer, introBox.nextSibling);
    }

    // 初始化全局 HTML5 Audio 实例
    audioElement = new Audio();
    audioElement.preload = "metadata";

    // 播放时间更新监听
    audioElement.addEventListener('timeupdate', () => {
      if (!isSeeking && audioElement.duration) {
        const cur = audioElement.currentTime;
        const dur = audioElement.duration;
        const pct = (cur / dur) * 100;
        document.getElementById('audioSeekBar').value = pct;
        document.getElementById('audioCurrentTime').innerText = formatTime(cur);
      }
    });

    // 元数据加载完成获取总时长
    audioElement.addEventListener('loadedmetadata', () => {
      document.getElementById('audioDuration').innerText = formatTime(audioElement.duration);
    });

    // 播放状态同步
    audioElement.addEventListener('play', () => {
      updatePlayButtonUI(true);
    });

    audioElement.addEventListener('pause', () => {
      updatePlayButtonUI(false);
    });

    audioElement.addEventListener('ended', () => {
      updatePlayButtonUI(false);
      document.getElementById('audioSeekBar').value = 0;
      document.getElementById('audioCurrentTime').innerText = "00:00";
    });

    // 播放异常时自动尝试备用源或提示
    audioElement.addEventListener('error', () => {
      console.warn('Audio stream error, trying fallback...');
      updatePlayButtonUI(false);
      document.getElementById('audioCurrentTime').innerText = "加载失败";
    });

    // 进度条拖拽事件监听
    const seekBar = document.getElementById('audioSeekBar');
    seekBar.addEventListener('input', () => {
      isSeeking = true;
    });
    seekBar.addEventListener('change', () => {
      if (audioElement.duration) {
        const targetTime = (seekBar.value / 100) * audioElement.duration;
        audioElement.currentTime = targetTime;
      }
      isSeeking = false;
    });
  }

  function formatTime(seconds) {
    if (isNaN(seconds) || seconds === Infinity) return "00:00";
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  function updatePlayButtonUI(isPlaying) {
    const playBtn = document.getElementById('audioMainPlayBtn');
    const headerTtsBtn = document.getElementById('btnTtsRead');
    if (playBtn) playBtn.innerHTML = isPlaying ? "⏸" : "▶";
    if (headerTtsBtn) headerTtsBtn.innerText = isPlaying ? "⏸ 暂停" : "🔊 朗读";
  }

  function loadAndPlay(bookName, chapterNum) {
    initAudioUI();
    currentBook = bookName;
    currentChapter = chapterNum;

    const streamUrl = getAudioUrl(currentVersion, bookName, chapterNum);
    audioElement.src = streamUrl;
    audioElement.load();
    audioElement.play().catch(e => {
      console.log('Autoplay handled:', e);
    });
  }

  function toggle(bookName, chapterNum) {
    initAudioUI();

    // 如果传入了新的章节或经卷，切换并加载
    if (bookName && (bookName !== currentBook || chapterNum !== currentChapter)) {
      loadAndPlay(bookName, chapterNum);
      return;
    }

    if (!audioElement.src || audioElement.src === window.location.href) {
      if (bookName && chapterNum) {
        loadAndPlay(bookName, chapterNum);
      }
      return;
    }

    if (audioElement.paused) {
      audioElement.play();
    } else {
      audioElement.pause();
    }
  }

  function pause() {
    if (audioElement && !audioElement.paused) {
      audioElement.pause();
    }
  }

  function stop() {
    if (audioElement) {
      audioElement.pause();
      audioElement.currentTime = 0;
      updatePlayButtonUI(false);
    }
  }

  function seekRelative(deltaSeconds) {
    if (audioElement && audioElement.duration) {
      let target = audioElement.currentTime + deltaSeconds;
      if (target < 0) target = 0;
      if (target > audioElement.duration) target = audioElement.duration;
      audioElement.currentTime = target;
    }
  }

  function changeVersion(ver) {
    currentVersion = ver;
    if (currentBook && currentChapter) {
      const wasPlaying = !audioElement.paused;
      loadAndPlay(currentBook, currentChapter);
      if (!wasPlaying) audioElement.pause();
    }
  }

  const SPEEDS = [1.0, 1.25, 1.5, 0.75];
  let speedIdx = 0;

  function cycleSpeed() {
    speedIdx = (speedIdx + 1) % SPEEDS.length;
    const spd = SPEEDS[speedIdx];
    if (audioElement) audioElement.playbackRate = spd;
    const btn = document.getElementById('audioSpeedBtn');
    if (btn) btn.innerText = `${spd.toFixed(spd % 1 === 0 ? 1 : 2)}x`;
  }

  global.BibleAudio = {
    init: initAudioUI,
    toggle,
    pause,
    stop,
    loadAndPlay,
    seekRelative,
    changeVersion,
    cycleSpeed
  };
})(window);

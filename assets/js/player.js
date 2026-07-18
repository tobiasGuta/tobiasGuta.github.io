// --- YOUTUBE PERSISTENT MUSIC PLAYER ---
window.addEventListener('beforeunload', () => {
  if (window.ytPlayer && typeof window.ytPlayer.getCurrentTime === 'function') {
    sessionStorage.setItem('yt-time', window.ytPlayer.getCurrentTime());
    sessionStorage.setItem('yt-muted', window.ytPlayer.isMuted());
    const state = window.ytPlayer.getPlayerState();
    if (sessionStorage.getItem('yt-state') === '2' && state !== 1) {
      sessionStorage.setItem('yt-state', '2');
    } else {
      sessionStorage.setItem('yt-state', state);
    }
  }
});

window.ytPlayer = null;
let youtubeApiPromise = null;
let playerCreationPromise = null;

function loadYouTubeApi() {
  if (window.YT && typeof window.YT.Player === 'function') {
    return Promise.resolve();
  }

  if (youtubeApiPromise) return youtubeApiPromise;

  youtubeApiPromise = new Promise((resolve, reject) => {
    window.onYouTubeIframeAPIReady = resolve;

    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    tag.async = true;
    tag.onerror = () => {
      youtubeApiPromise = null;
      reject(new Error('Unable to load the YouTube player API.'));
    };
    document.head.appendChild(tag);
  });

  return youtubeApiPromise;
}

function setMuteButtonState(muteBtn, isMuted) {
  if (!muteBtn) return;
  muteBtn.innerText = isMuted ? '🔇' : '🔊';
  muteBtn.setAttribute('aria-label', isMuted ? 'Unmute music' : 'Mute music');
}

function setPlayButtonState(playBtn, isPlaying) {
  if (!playBtn) return;
  playBtn.removeAttribute('data-player-state');
  playBtn.disabled = false;
  playBtn.innerText = isPlaying ? '⏸' : '▶';
  playBtn.setAttribute('aria-label', isPlaying ? 'Pause music' : 'Play music');
}

function savePlayerState(state) {
  sessionStorage.setItem('yt-state', String(state));
}

function createYouTubePlayer() {
  if (playerCreationPromise) return playerCreationPromise;

  playerCreationPromise = loadYouTubeApi().then(() => new Promise((resolve, reject) => {
    const savedTime = parseFloat(sessionStorage.getItem('yt-time') || '0');
    let isMuted = sessionStorage.getItem('yt-muted') === 'true';
    if (sessionStorage.getItem('yt-muted') === null) {
      isMuted = true;
    }

    window.ytPlayer = new YT.Player('yt-player', {
      height: '1',
      width: '1',
      videoId: 'I_izvAbhExY', // Orbital - Halcyon On and On (Hackers OST)
      host: 'https://www.youtube.com',
      playerVars: {
        autoplay: 1,
        start: Math.floor(savedTime),
        enablejsapi: 1,
        origin: window.location.origin
      },
      events: {
        onReady: (e) => {
          e.target.setVolume(40);
          const muteBtn = document.getElementById('yt-mute');

          if (isMuted) {
            e.target.mute();
            setMuteButtonState(muteBtn, true);
          } else {
            e.target.unMute();
            setMuteButtonState(muteBtn, false);
          }

          muteBtn.disabled = false;
          e.target.playVideo();
          setPlayButtonState(document.getElementById('yt-playpause'), true);
          resolve(window.ytPlayer);
        },
        onStateChange: (e) => {
          if (e.data === YT.PlayerState.PLAYING) {
            savePlayerState(e.data);
            setPlayButtonState(document.getElementById('yt-playpause'), true);
          } else if (e.data === YT.PlayerState.PAUSED) {
            savePlayerState(e.data);
            setPlayButtonState(document.getElementById('yt-playpause'), false);
          }
        },
        onError: () => {
          reject(new Error('Unable to initialize the YouTube player.'));
        }
      }
    });
  }));

  return playerCreationPromise;
}

document.addEventListener('DOMContentLoaded', () => {
  const playBtn = document.getElementById('yt-playpause');
  const muteBtn = document.getElementById('yt-mute');
  const closeBtn = document.getElementById('yt-close');
  const wrap = document.getElementById('yt-player-wrap');

  if (playBtn && muteBtn && closeBtn && wrap) {
    muteBtn.disabled = true;

    playBtn.addEventListener('click', async () => {
      if (!window.ytPlayer || typeof window.ytPlayer.getPlayerState !== 'function') {
        playBtn.disabled = true;
        playBtn.dataset.playerState = 'loading';
        playBtn.innerText = '[ LOADING SOUNDTRACK ]';

        try {
          await createYouTubePlayer();
        } catch (error) {
          playerCreationPromise = null;
          playBtn.disabled = false;
          playBtn.dataset.playerState = 'idle';
          playBtn.innerText = '[ RETRY SOUNDTRACK ]';
          playBtn.setAttribute('aria-label', 'Retry loading soundtrack');
          console.error(error.message);
        }
        return;
      }

      const state = window.ytPlayer.getPlayerState();
      if (state === YT.PlayerState.PLAYING) {
        window.ytPlayer.pauseVideo();
        savePlayerState(YT.PlayerState.PAUSED);
        setPlayButtonState(playBtn, false);
      } else {
        window.ytPlayer.playVideo();
        savePlayerState(YT.PlayerState.PLAYING);
        setPlayButtonState(playBtn, true);
      }
    });

    muteBtn.addEventListener('click', () => {
      if (!window.ytPlayer || typeof window.ytPlayer.isMuted !== 'function') return;
      if (window.ytPlayer.isMuted()) {
        window.ytPlayer.unMute();
        window.ytPlayer.setVolume(40);
        setMuteButtonState(muteBtn, false);
        sessionStorage.setItem('yt-muted', 'false');
      } else {
        window.ytPlayer.mute();
        setMuteButtonState(muteBtn, true);
        sessionStorage.setItem('yt-muted', 'true');
      }
    });

    closeBtn.addEventListener('click', () => {
      if (window.ytPlayer) {
        window.ytPlayer.pauseVideo();
      }
      wrap.style.display = 'none';
      savePlayerState('2');
    });
  }
});

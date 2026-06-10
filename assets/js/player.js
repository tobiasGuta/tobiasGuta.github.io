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

var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
document.head.appendChild(tag);

window.ytPlayer = null;

function setMuteButtonState(muteBtn, isMuted) {
  if (!muteBtn) return;
  muteBtn.innerText = isMuted ? '🔇' : '🔊';
  muteBtn.setAttribute('aria-label', isMuted ? 'Unmute music' : 'Mute music');
}

function setPlayButtonState(playBtn, isPlaying) {
  if (!playBtn) return;
  playBtn.innerText = isPlaying ? '⏸' : '▶';
  playBtn.setAttribute('aria-label', isPlaying ? 'Pause music' : 'Play music');
}

function savePlayerState(state) {
  sessionStorage.setItem('yt-state', String(state));
}

window.onYouTubeIframeAPIReady = function() {
  const savedTime = parseFloat(sessionStorage.getItem('yt-time') || '0');
  let isMuted = sessionStorage.getItem('yt-muted') === 'true';
  if (sessionStorage.getItem('yt-muted') === null) {
    isMuted = true; // start muted by default to allow autoplay
  }
  const savedState = sessionStorage.getItem('yt-state');
  const shouldPlay = savedState !== '2';
  
  window.ytPlayer = new YT.Player('yt-player', {
    height: '1', 
    width: '1',
    videoId: 'I_izvAbhExY', // Orbital - Halcyon On and On (Hackers OST)
    host: 'https://www.youtube.com',
    playerVars: { 
      autoplay: shouldPlay ? 1 : 0,
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
          if (shouldPlay) {
            e.target.playVideo(); // plays silently - autoplay allowed when muted
          }
          setMuteButtonState(muteBtn, true);
        } else {
          e.target.unMute();
          setMuteButtonState(muteBtn, false);
        }
        
        setPlayButtonState(document.getElementById('yt-playpause'), shouldPlay);
      },
      onStateChange: (e) => {
        if (e.data === YT.PlayerState.PLAYING) {
          savePlayerState(e.data);
          setPlayButtonState(document.getElementById('yt-playpause'), true);
        } else if (e.data === YT.PlayerState.PAUSED) {
          savePlayerState(e.data);
          setPlayButtonState(document.getElementById('yt-playpause'), false);
        }
      }
    }
  });
};

document.addEventListener('DOMContentLoaded', () => {
  const playBtn = document.getElementById('yt-playpause');
  const muteBtn = document.getElementById('yt-mute');
  const closeBtn = document.getElementById('yt-close');
  const wrap = document.getElementById('yt-player-wrap');

  if (playBtn && muteBtn && closeBtn && wrap) {
    setPlayButtonState(playBtn, sessionStorage.getItem('yt-state') !== '2');

    playBtn.addEventListener('click', () => {
      if (!window.ytPlayer || typeof window.ytPlayer.getPlayerState !== 'function') return;
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

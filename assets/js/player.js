// --- YOUTUBE PERSISTENT MUSIC PLAYER ---
window.addEventListener('beforeunload', () => {
  if (window.ytPlayer && typeof window.ytPlayer.getCurrentTime === 'function') {
    sessionStorage.setItem('yt-time', window.ytPlayer.getCurrentTime());
    sessionStorage.setItem('yt-muted', window.ytPlayer.isMuted());
    const state = window.ytPlayer.getPlayerState();
    sessionStorage.setItem('yt-state', state);
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

window.onYouTubeIframeAPIReady = function() {
  const savedTime = parseFloat(sessionStorage.getItem('yt-time') || '0');
  let isMuted = sessionStorage.getItem('yt-muted') === 'true';
  if (sessionStorage.getItem('yt-muted') === null) {
    isMuted = true; // start muted by default to allow autoplay
  }
  const savedState = sessionStorage.getItem('yt-state');
  
  window.ytPlayer = new YT.Player('yt-player', {
    height: '1', 
    width: '1',
    videoId: 'I_izvAbhExY', // Orbital - Halcyon On and On (Hackers OST)
    host: 'https://www.youtube.com',
    playerVars: { 
      autoplay: (savedState === '2') ? 0 : 1, // 2 is paused
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
          e.target.playVideo(); // plays silently - autoplay allowed when muted
          setMuteButtonState(muteBtn, true);
        } else {
          e.target.unMute();
          setMuteButtonState(muteBtn, false);
        }
        
        document.getElementById('yt-playpause').innerText = '+';
      },
      onStateChange: (e) => {
        if (e.data === YT.PlayerState.PLAYING) {
          document.getElementById('yt-playpause').innerText = '+';
        } else if (e.data === YT.PlayerState.PAUSED) {
          document.getElementById('yt-playpause').innerText = '+';
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
    playBtn.addEventListener('click', () => {
      if (!window.ytPlayer || typeof window.ytPlayer.getPlayerState !== 'function') return;
      const state = window.ytPlayer.getPlayerState();
      if (state === YT.PlayerState.PLAYING) {
        window.ytPlayer.pauseVideo();
      } else {
        window.ytPlayer.playVideo();
      }
    });

    muteBtn.addEventListener('click', () => {
      if (!window.ytPlayer || typeof window.ytPlayer.isMuted !== 'function') return;
      if (window.ytPlayer.isMuted()) {
        window.ytPlayer.unMute();
        window.ytPlayer.setVolume(40);
        window.ytPlayer.playVideo(); // Make absolutely sure it's playing
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
      sessionStorage.setItem('yt-state', '2'); // save paused state
    });
  }
});

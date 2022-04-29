const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const cd = $('.cd');
const player = $('.player');
const heading = $('header h2');

const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const progress = $('#progress');

const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playList = $('.playlist');
const PLAYER_STORAGE_KEY = 'f8';
const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},

  songs: [
    {
      name: 'Kẹo Bông Gòn',
      singer: 'H2K, TRUNKY',
      path: './assets/music/vietnamese/Keo Bong Gon - H2k_ TRUNKY.mp3',
      image:
        'https://photo-resize-zmp3.zadn.vn/w94_r1x1_webp/cover/d/e/9/1/de91f9c8b08e1fb4b35e2b64e1c2ed15.jpg',
    },
    {
      name: 'Váy Cưới (Lofi Version)',
      singer: 'Trung Tự, Rain, BFF',
      path: './assets/music/vietnamese/VayCuoi-TrungTu-4861460.mp3',
      image:
        'https://photo-resize-zmp3.zadn.vn/w94_r1x1_webp/cover/d/f/d/c/dfdc847c99d1f7b549d01528188aa1ed.jpg',
    },
    {
      name: 'Yêu Là Cưới',
      singer: 'Phát Hồ, X2X',
      path: './assets/music/vietnamese/Yeu La Cuoi - Phat Ho.mp3',
      image:
        'https://photo-resize-zmp3.zadn.vn/w240_r1x1_webp/cover/4/9/d/a/49da6a1d6cf13a42e77bc3a945d9dd6b.jpg',
    },
    {
      name: 'Màu Nước Mắt',
      singer: 'Nguyễn Trần Trung Quân',
      path: './assets/music/vietnamese/Mau Nuoc Mat - Nguyen Tran Trung Quan.mp3',
      image:
        'https://photo-resize-zmp3.zadn.vn/w240_r1x1_webp/cover/8/f/5/0/8f50e5afbf4daa6d062019bc36f3ab1a.jpg',
    },
    {
      name: 'Con Nợ Mẹ',
      singer: 'Trịnh Đình Quang',
      path: './assets/music/vietnamese/Con No Me - Trinh Dinh Quang.mp3',
      image:
        'https://photo-resize-zmp3.zadn.vn/w240_r1x1_webp/covers/6/2/62e328be3f61e35c88ab08b4ac8f888a_1418987645.jpg',
    },
    {
      name: '3 1 0 7',
      singer: 'Duongg - Nâu',
      path: './assets/music/vietnamese/3 1 0 7 - W_n_ Duongg_ Nau.mp3',
      image:
        'https://photo-resize-zmp3.zadn.vn/w94_r1x1_webp/cover/3/d/c/a/3dcae4d98f98fd4df205a66d240fb1f8.jpg',
    },
    {
      name: 'Ghé Qua',
      singer: 'Dick x Tofu x PC',
      path: './assets/music/vietnamese/Ghe Qua - Dick_ Tofu_ PC.mp3',
      image: 'https://photo-zmp3.zadn.vn/audio_default.png',
    },
    {
      name: 'Về Với Anh Đi',
      singer: 'Andiez',
      path: './assets/music/vietnamese/Ve Voi Anh Di - Andiez.mp3',
      image:
        'https://photo-resize-zmp3.zadn.vn/w240_r1x1_webp/avatars/9/e/3/b/9e3bfb0a08a3d09e337957170905fd58.jpg',
    },
    {
      name: 'Lưu Số Em Đi',
      singer: 'Huỳnh Văn, Vũ Phụng Tiên',
      path: './assets/music/vietnamese/Luu So Em Di Dai Meo Remix_ - Huynh Van_.mp3',
      image:
        'https://phot o-resize-zmp3.zadn.vn/w240_r1x1_webp/cover/7/9/7/f/797fe66f5ed44a33e2ceca3fb63464c8.jpg',
    },
    {
      name: 'Cưa Là Đổ',
      singer: 'Phát Hồ, X2X',
      path: './assets/music/vietnamese/Cua La Do - Phat Ho_ X2X.mp3',
      image:
        'https://photo-resize-zmp3.zadn.vn/w240_r1x1_webp/cover/1/7/d/f/17df138d6b0c38c8a07ee502a49573cd.jpg',
    },
  ],
  setConfig: function (key, value) {
    // console.log(value);
    this.config[key] = value;

    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
  },
  render: function () {
    const htmls = this.songs.map((song, index) => {
      //   console.log(song);
      return `
        <div class="song ${
          index === this.currentIndex ? 'active' : ''
        }" data-index = '${index}'>
        <div class="thumb"
                    style="background-image: url('${song.image}')">
                </div>
        <div class="body">
            <h3 class="title">${song.name}</h3>
            <p class="author">${song.singer}</p>
        </div>
        <div class="option">
            <i class="fas fa-ellipsis-h"></i>
        </div>
    </div>
        `;
    });
    // console.log(htmls);
    playList.innerHTML = htmls.join('');
  },

  defineProperties: function () {
    return Object.defineProperty(this, 'currentSong', {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },

  handleEvent: function () {
    const _this = this;
    const cdWidth = cd.offsetWidth;

    //xu ly cd quay
    const cdThumbAnimate = cdThumb.animate(
      {
        transform: 'rotate(360deg)',
      },
      { duration: 10000, iterations: Infinity }
    );
    cdThumbAnimate.pause();

    // xu li phong to thu nho cd
    document.onscroll = function () {
      const scrollTop = window.scrollY;
      const newCdWidth = cdWidth - scrollTop;

      cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
      cd.style.opacity = newCdWidth / cdWidth;
    };

    // xu li khi play

    playBtn.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();

        player;
      } else {
        audio.play();
      }
    };

    //khi dc play
    audio.onplay = function () {
      _this.isPlaying = true;
      player.classList.add('playing');
      cdThumbAnimate.play();
    };

    //khi dc pause
    audio.onpause = function () {
      _this.isPlaying = false;
      player.classList.remove('playing');
      cdThumbAnimate.pause();
    };
    //khi tien do bai hat thay doi
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercent = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );
        progress.value = progressPercent;
        // console.log(audio.currentTime);
      }
    };

    //xu ly khi tua
    progress.onchange = function (e) {
      const seekTime = (e.target.value * audio.duration) / 100;
      audio.currentTime = seekTime;
    };

    //xu li khi next
    nextBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.nextSong();
      }

      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    };
    //xu li khi prev song
    prevBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.prevSong();
      }

      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    };
    randomBtn.onclick = function () {
      _this.isRandom = !_this.isRandom;
      _this.setConfig('isRandom', _this.isRandom);
      randomBtn.classList.toggle('active', _this.isRandom);
    };

    repeatBtn.onclick = function () {
      _this.isRepeat = !_this.isRepeat;
      _this.setConfig('isRepeat', _this.isRepeat);
      repeatBtn.classList.toggle('active', _this.isRepeat);
    };

    //xu li khi ended
    audio.onended = function () {
      if (_this.isRepeat) {
        audio.play();
      } else {
        nextBtn.click();
      }
    };
    //lang nghe hanh vi click vao playlist
    playList.onclick = function (e) {
      const songNode = e.target.closest('.song:not(.active');
      // console.log(e.target);
      if (songNode || e.target.closest('.option')) {
        //xu li khi click song
        if (songNode) {
          _this.currentIndex = Number(songNode.getAttribute('data-index'));
          _this.loadCurrentSong();
          _this.render();
          audio.play();
        }
        //xu li khi click song option
        if (e.target.closest('.option')) {
          //
        }
      }
    };
  },
  scrollToActiveSong: function () {
    setTimeout(() => {
      $('.song.active').scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }, 300);
  },
  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;
    console.log(heading, cdThumb, audio);
  },
  loadConfig: function () {
    this.isRandom = this.config.isRandom;
    this.isRepeat = this.config.isRepeat;
  },
  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },
  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },
  playRandomSong: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (newIndex === this.currentIndex);
    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },
  start: function () {
    this.loadConfig();
    this.defineProperties();
    this.handleEvent();
    this.loadCurrentSong();
    this.render();
    randomBtn.classList.toggle('active', this.isRandom);
    repeatBtn.classList.toggle('active', this.isRepeat);
  },
};

app.start();

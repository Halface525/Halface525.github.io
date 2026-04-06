// 音乐播放器
const MusicPlayer = {
    // 播放列表 - 请在这里添加你的音乐
    playlist: [
        { title: '你离开了南京，从此没有人和我说话', artist: '李志', src: 'audio/01-nanjing.mp3' },
        { title: '黑色信封', artist: '李志', src: 'audio/02-heixinfeng.mp3' },
        { title: '董卓瑶', artist: '李志', src: 'audio/03-dongzhuoyao.mp3' },
        { title: '青春', artist: '李志', src: 'audio/04-qingchun.mp3' },
        { title: '关于郑州的记忆', artist: '李志', src: 'audio/05-zhengzhou.mp3' },
        { title: '定西', artist: '李志', src: 'audio/06-dingxi.mp3' },
        { title: '春末的南方城市', artist: '李志', src: 'audio/07-chunmo.mp3' },
        { title: '下雨', artist: '李志', src: 'audio/08-xiayu.mp3' },
        { title: '天空之城', artist: '李志', src: 'audio/09-tiankongzhicheng.mp3' },
        { title: '山阴路的夏天', artist: '李志', src: 'audio/10-shanyinlu.mp3' },
        { title: '杭州', artist: '李志', src: 'audio/11-hangzhou.mp3' },
        { title: '这个世界会好吗', artist: '李志', src: 'audio/12-zhegeshijie.mp3' },
        { title: '青春无处安放', artist: '赵雷', src: 'audio/13-qingchunwuchuanfang.mp3' },
        { title: '和你在一起', artist: '李志', src: 'audio/14-henizaiyiqi.mp3' },
        { title: '热河', artist: '李志', src: 'audio/15-rehe.mp3' }
    ],
    
    currentIndex: 0,
    playMode: 'list', // 'list' | 'single' | 'random'
    sound: null,
    isPlaying: false,
    volume: 0.5,
    isMuted: false,
    volumeBeforeMute: 0.5,
    progressInterval: null,
    
    // 初始化
    init() {
        this.loadPreference();
        this.renderPlaylist();
        this.updateUI();
        this.bindEvents();
        
        // 播放器功能已暂时禁用
        // 如需恢复音乐播放，取消下面注释：
        // if (this.playlist.length > 0) {
        //     this.play(0);
        // }
    },
    
    // 绑定事件
    bindEvents() {
        // 键盘快捷键
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && e.target.tagName !== 'INPUT') {
                e.preventDefault();
                this.toggle();
            }
        });
        
        // 页面可见性变化
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && this.isPlaying) {
                // 页面隐藏时可以选择暂停或继续播放
                // this.pause();
            }
        });
    },
    
    // 播放指定歌曲
    play(index = this.currentIndex) {
        if (this.playlist.length === 0) {
            console.log('播放列表为空');
            return;
        }
        
        this.currentIndex = index;
        const song = this.playlist[index];
        
        if (this.sound) {
            this.sound.stop();
        }
        
        this.sound = new Howl({
            src: [song.src],
            html5: true,
            volume: this.volume,
            onload: () => {
                this.updateUI();
            },
            onplay: () => {
                this.isPlaying = true;
                this.updateUI();
                this.startProgressUpdate();
            },
            onpause: () => {
                this.isPlaying = false;
                this.updateUI();
            },
            onend: () => {
                this.onSongEnd();
            },
            onloaderror: (id, err) => {
                console.error('加载失败:', err);
                // 自动播放下一首
                setTimeout(() => this.next(), 1000);
            },
            onplayerror: (id, err) => {
                console.error('播放失败:', err);
                this.sound.once('unlock', () => {
                    this.sound.play();
                });
            }
        });
        
        this.sound.play();
    },
    
    // 暂停
    pause() {
        if (this.sound) {
            this.sound.pause();
        }
    },
    
    // 播放/暂停切换
    toggle() {
        if (this.isPlaying) {
            this.pause();
        } else {
            if (!this.sound) {
                this.play();
            } else {
                this.sound.play();
            }
        }
    },
    
    // 下一首
    next() {
        if (this.playlist.length === 0) return;
        
        let nextIndex;
        if (this.playMode === 'random') {
            nextIndex = Math.floor(Math.random() * this.playlist.length);
        } else {
            nextIndex = (this.currentIndex + 1) % this.playlist.length;
        }
        this.play(nextIndex);
    },
    
    // 上一首
    prev() {
        if (this.playlist.length === 0) return;
        
        let prevIndex = (this.currentIndex - 1 + this.playlist.length) % this.playlist.length;
        this.play(prevIndex);
    },
    
    // 歌曲结束处理
    onSongEnd() {
        if (this.playMode === 'single') {
            this.play(this.currentIndex);
        } else {
            this.next();
        }
    },
    
    // 设置音量
    setVolume(val) {
        this.volume = parseFloat(val);
        if (this.sound) {
            this.sound.volume(this.volume);
        }
        // 如果调整音量，取消静音
        if (this.isMuted && this.volume > 0) {
            this.isMuted = false;
            this.updateUI();
        }
        localStorage.setItem('musicVolume', this.volume);
    },
    
    // 切换静音
    toggleMute() {
        if (this.isMuted) {
            // 取消静音，恢复之前的音量
            this.isMuted = false;
            this.volume = this.volumeBeforeMute || 0.5;
        } else {
            // 静音，保存当前音量
            this.isMuted = true;
            this.volumeBeforeMute = this.volume;
            this.volume = 0;
        }
        
        // 应用音量
        if (this.sound) {
            this.sound.volume(this.volume);
        }
        
        // 更新音量滑块
        const volumeSlider = document.getElementById('music-volume');
        if (volumeSlider) {
            volumeSlider.value = this.volume;
        }
        
        this.updateUI();
        localStorage.setItem('musicVolume', this.volumeBeforeMute);
    },
    
    // 设置播放模式
    setMode(mode) {
        this.playMode = mode;
        localStorage.setItem('musicMode', mode);
        this.updateUI();
    },
    
    // 切换播放模式
    toggleMode() {
        const modes = ['list', 'single', 'random'];
        const currentIndex = modes.indexOf(this.playMode);
        const nextMode = modes[(currentIndex + 1) % modes.length];
        this.setMode(nextMode);
    },
    
    // 跳转到指定时间
    seek(percent) {
        if (this.sound && this.sound.state() === 'loaded') {
            const duration = this.sound.duration();
            this.sound.seek(duration * percent);
            this.updateProgress(percent);
        }
    },
    
    // 开始更新进度
    startProgressUpdate() {
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
        }
        
        this.progressInterval = setInterval(() => {
            if (this.sound && this.isPlaying) {
                const seek = this.sound.seek();
                const duration = this.sound.duration();
                if (duration > 0) {
                    const percent = seek / duration;
                    this.updateProgress(percent);
                }
            }
        }, 500);
    },
    
    // 停止进度更新
    stopProgressUpdate() {
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
            this.progressInterval = null;
        }
    },
    
    // 更新进度条
    updateProgress(percent) {
        const progressBar = document.getElementById('music-progress');
        const currentTimeEl = document.getElementById('music-current');
        const totalTimeEl = document.getElementById('music-total');
        
        if (progressBar) {
            progressBar.style.width = `${percent * 100}%`;
        }
        
        if (this.sound) {
            if (currentTimeEl) {
                currentTimeEl.textContent = this.formatTime(this.sound.seek());
            }
            if (totalTimeEl) {
                totalTimeEl.textContent = this.formatTime(this.sound.duration());
            }
        }
    },
    
    // 格式化时间
    formatTime(secs) {
        if (isNaN(secs) || secs === Infinity) return '0:00';
        const minutes = Math.floor(secs / 60);
        const seconds = Math.floor(secs % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    },
    
    // 渲染播放列表
    renderPlaylist() {
        const container = document.getElementById('music-playlist');
        if (!container) return;
        
        if (this.playlist.length === 0) {
            container.innerHTML = '<div class="music-empty">暂无音乐<br>请将音乐文件放入 audio 文件夹</div>';
            return;
        }
        
        container.innerHTML = this.playlist.map((song, index) => `
            <div class="music-item ${index === this.currentIndex ? 'active' : ''}" 
                 onclick="MusicPlayer.play(${index})">
                <span class="music-number">${index + 1}</span>
                <div class="music-info">
                    <div class="music-title">${song.title}</div>
                    <div class="music-artist">${song.artist}</div>
                </div>
                ${index === this.currentIndex && this.isPlaying ? '<span class="music-playing">♪</span>' : ''}
            </div>
        `).join('');
    },
    
    // 更新UI
    updateUI() {
        const song = this.playlist[this.currentIndex] || { title: '未播放', artist: '-' };
        
        // 更新歌曲信息
        const titleEl = document.getElementById('music-title');
        const artistEl = document.getElementById('music-artist');
        if (titleEl) titleEl.textContent = song.title;
        if (artistEl) artistEl.textContent = song.artist;
        
        // 更新播放按钮
        const playBtn = document.getElementById('music-play-btn');
        if (playBtn) {
            playBtn.innerHTML = this.isPlaying ? '<i class="fas fa-pause"></i>' : '<i class="fas fa-play"></i>';
        }
        
        // 更新模式按钮
        const modeBtn = document.getElementById('music-mode-btn');
        if (modeBtn) {
            const modeIcons = { 
                list: '<i class="fas fa-repeat"></i>', 
                single: '<i class="fas fa-1"></i>', 
                random: '<i class="fas fa-shuffle"></i>' 
            };
            const modeTitles = { list: '列表循环', single: '单曲循环', random: '随机播放' };
            modeBtn.innerHTML = modeIcons[this.playMode];
            modeBtn.title = modeTitles[this.playMode];
        }
        
        // 更新播放器状态类
        const player = document.getElementById('music-player');
        if (player) {
            player.classList.toggle('playing', this.isPlaying);
        }
        
        // 更新音量图标
        const volumeIcon = document.getElementById('music-volume-icon');
        if (volumeIcon) {
            if (this.isMuted || this.volume === 0) {
                volumeIcon.className = 'fas fa-volume-xmark';
            } else if (this.volume < 0.5) {
                volumeIcon.className = 'fas fa-volume-low';
            } else {
                volumeIcon.className = 'fas fa-volume-high';
            }
        }
        
        // 重新渲染播放列表
        this.renderPlaylist();
    },
    
    // 加载用户偏好
    loadPreference() {
        this.volume = parseFloat(localStorage.getItem('musicVolume')) || 0.5;
        this.playMode = localStorage.getItem('musicMode') || 'list';
        
        // 设置音量滑块
        const volumeSlider = document.getElementById('music-volume');
        if (volumeSlider) {
            volumeSlider.value = this.volume;
        }
    },
    
    // 切换播放器显示/隐藏
    togglePlayer() {
        // 播放器功能已暂时禁用
        alert('音乐播放器功能暂时关闭，正在寻找版权合规的音乐资源...');
        return;
        
        // 如需恢复，取消上面代码并启用下面：
        // const player = document.getElementById('music-player');
        // if (player) {
        //     player.classList.toggle('minimized');
        // }
    }
};

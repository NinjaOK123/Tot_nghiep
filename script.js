/* ==========================================================================
   MINECRAFT GRADUATION JAVASCRIPT LOGIC (script.js)
   ========================================================================== */

// --- HỆ THỐNG ÂM THANH (WEB AUDIO API SYNTHESIZER) ---
class AudioManager {
    constructor() {
        this.ctx = null;
        this.masterVolume = null;
        this.isMuted = false;
        this.isMusicEnabled = false;
        this.musicInterval = null;
        this.musicTempo = 140; // BPM
        this.musicStep = 0;
        
        // Giai điệu hoài niệm phong cách Minecraft (Sweden/Wet Hands)
        // Định dạng nốt: [Tên nốt, Độ dài ô nhịp]
        this.melody = [
            ['G4', 2], ['B4', 2], ['D5', 2], ['G5', 2],
            ['F#5', 2], ['D5', 2], ['B4', 2], ['G4', 2],
            ['A4', 2], ['C5', 2], ['E5', 2], ['A5', 2],
            ['G5', 2], ['E5', 2], ['C5', 2], ['A4', 2],
            ['B4', 2], ['D5', 2], ['F#5', 2], ['B5', 2],
            ['A5', 2], ['F#5', 2], ['D5', 2], ['B4', 2],
            ['C5', 2], ['E5', 2], ['G5', 2], ['C6', 2],
            ['B5', 2], ['G5', 2], ['E5', 2], ['C5', 2]
        ];
        
        // Tần số các nốt nhạc cơ bản
        this.noteFreqs = {
            'G4': 392.00, 'A4': 440.00, 'B4': 493.88, 'C5': 523.25,
            'D5': 587.33, 'E5': 659.25, 'F#5': 698.46, 'G5': 783.99,
            'A5': 880.00, 'B5': 987.77, 'C6': 1046.50
        };
    }

    init() {
        if (this.ctx) return;
        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            this.masterVolume = this.ctx.createGain();
            this.masterVolume.gain.value = 0.3; // Âm lượng tổng vừa phải
            this.masterVolume.connect(this.ctx.destination);
        } catch (e) {
            console.error("Trình duyệt không hỗ trợ Web Audio API:", e);
        }
    }

    toggleMute() {
        this.init();
        this.isMuted = !this.isMuted;
        if (this.masterVolume) {
            this.masterVolume.gain.value = this.isMuted ? 0 : 0.3;
        }
        return this.isMuted;
    }

    toggleMusic() {
        this.init();
        this.isMusicEnabled = !this.isMusicEnabled;
        if (this.isMusicEnabled) {
            this.startMusic();
        } else {
            this.stopMusic();
        }
        return this.isMusicEnabled;
    }

    // Âm click nút bấm (Gỗ)
    playClick() {
        this.init();
        if (this.isMuted || !this.ctx) return;

        let osc = this.ctx.createOscillator();
        let gain = this.ctx.createGain();
        
        osc.connect(gain);
        gain.connect(this.masterVolume);
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(120, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.08);
        
        gain.gain.setValueAtTime(0.5, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);
        
        osc.start();
        osc.stop(this.ctx.currentTime + 0.09);
    }

    // Âm ném ngọc Ender (Tiếng vút gió)
    playThrow() {
        this.init();
        if (this.isMuted || !this.ctx) return;

        let osc = this.ctx.createOscillator();
        let gain = this.ctx.createGain();
        
        osc.connect(gain);
        gain.connect(this.masterVolume);
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.15);
        
        gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);
        
        osc.start();
        osc.stop(this.ctx.currentTime + 0.16);
    }

    // Âm rồng nhận sát thương (Hơi trầm, rè)
    playHit() {
        this.init();
        if (this.isMuted || !this.ctx) return;

        let osc = this.ctx.createOscillator();
        let gain = this.ctx.createGain();
        
        osc.connect(gain);
        gain.connect(this.masterVolume);
        
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(90, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(20, this.ctx.currentTime + 0.2);
        
        gain.gain.setValueAtTime(0.6, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);
        
        // Thêm bộ lọc tần số thấp để âm thanh nặng hơn
        let filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(300, this.ctx.currentTime);
        
        osc.disconnect(gain);
        osc.connect(filter);
        filter.connect(gain);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.26);
    }

    // Âm rồng nổ tung (Nhiều tiếng nổ nhỏ dồn dập)
    playExplosion() {
        this.init();
        if (this.isMuted || !this.ctx) return;

        let duration = 1.8;
        let bufferSize = this.ctx.sampleRate * duration;
        let buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        let data = buffer.getChannelData(0);
        
        // Tạo tiếng ồn trắng (White noise)
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        
        let noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        
        let filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, this.ctx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + duration);
        
        let gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.8, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.4, this.ctx.currentTime + 0.3);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);
        
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterVolume);
        
        noise.start();
        noise.stop(this.ctx.currentTime + duration);

        // Phát thêm một vài tiếng tạch tạch nhỏ
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                if (this.isMuted) return;
                this.playHit();
            }, i * 300);
        }
    }

    // Âm Level Up (chime dâng cao kinh điển)
    playLevelUp() {
        this.init();
        if (this.isMuted || !this.ctx) return;

        let notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, index) => {
            setTimeout(() => {
                if (this.isMuted || !this.ctx) return;
                let osc = this.ctx.createOscillator();
                let gain = this.ctx.createGain();
                
                osc.connect(gain);
                gain.connect(this.masterVolume);
                
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
                
                gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.4);
                
                osc.start();
                osc.stop(this.ctx.currentTime + 0.45);
            }, index * 100);
        });
    }

    // Phát nhạc nền hoài niệm (Chiptune Synthesizer)
    startMusic() {
        this.stopMusic();
        this.init();
        if (!this.ctx) return;

        const playStep = () => {
            if (!this.isMusicEnabled || this.isMuted) return;
            
            let noteInfo = this.melody[this.musicStep];
            let noteName = noteInfo[0];
            let noteDuration = noteInfo[1];
            let freq = this.noteFreqs[noteName];
            
            if (freq) {
                // Tạo tiếng nhạc ấm áp
                let osc = this.ctx.createOscillator();
                let oscSub = this.ctx.createOscillator(); // Thêm một bè trầm nhẹ bên dưới
                let gain = this.ctx.createGain();
                let filter = this.ctx.createBiquadFilter();
                
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
                
                oscSub.type = 'sine';
                oscSub.frequency.setValueAtTime(freq / 2, this.ctx.currentTime);
                
                filter.type = 'lowpass';
                filter.frequency.setValueAtTime(1000, this.ctx.currentTime);
                
                gain.gain.setValueAtTime(0.08, this.ctx.currentTime); // Nhỏ hơn âm thanh game
                gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + (noteDuration * 0.7));
                
                osc.connect(filter);
                oscSub.connect(filter);
                filter.connect(gain);
                gain.connect(this.masterVolume);
                
                osc.start();
                oscSub.start();
                osc.stop(this.ctx.currentTime + noteDuration);
                oscSub.stop(this.ctx.currentTime + noteDuration);
            }
            
            this.musicStep = (this.musicStep + 1) % this.melody.length;
            
            // Lên lịch nốt tiếp theo
            let delayMs = (60 / this.musicTempo) * 1000 * noteDuration;
            this.musicInterval = setTimeout(playStep, delayMs);
        };
        
        playStep();
    }

    stopMusic() {
        if (this.musicInterval) {
            clearTimeout(this.musicInterval);
            this.musicInterval = null;
        }
    }
}

const audio = new AudioManager();


// --- QUẢN LÝ CHUYỂN MÀN HÌNH (STATE MACHINE) ---
const screens = {
    MENU: document.getElementById('screen-menu'),
    BATTLE: document.getElementById('screen-battle'),
    POEM: document.getElementById('screen-end-poem'),
    CERTIFICATE: document.getElementById('screen-certificate'),
    MULTIPLAYER: document.getElementById('screen-multiplayer')
};

let currentScreen = 'MENU';

function transitionTo(targetScreen) {
    audio.playClick();
    const portal = document.getElementById('portal-overlay');
    
    // Hiện lớp phủ cổng End Portal
    portal.classList.remove('hidden');
    
    setTimeout(() => {
        // Ẩn tất cả màn hình
        Object.values(screens).forEach(screen => {
            screen.classList.remove('active');
            screen.classList.add('hidden');
        });
        
        // Hiện màn hình mục tiêu
        screens[targetScreen].classList.remove('hidden');
        screens[targetScreen].classList.add('active');
        
        currentScreen = targetScreen;
        
        // Khởi động các logic màn hình cụ thể
        if (targetScreen === 'BATTLE') {
            startBattleGame();
        } else if (targetScreen === 'POEM') {
            startEndPoem();
        } else if (targetScreen === 'CERTIFICATE') {
            startFireworks();
        } else if (targetScreen === 'MULTIPLAYER') {
            loadWishes();
        }
    }, 1000); // Đợi hiệu ứng xoáy cổng hoạt động

    setTimeout(() => {
        portal.classList.add('hidden');
    }, 1800);
}


// --- LẬP TRÌNH CANVAS TRẬN ĐẤU BOSS (ENDER DRAGON) ---
let battleGame = {
    canvas: null,
    ctx: null,
    animationId: null,
    dragon: null,
    steve: null,
    pearls: [],
    particles: [],
    fireballs: [],
    health: 100,
    maxHealth: 100,
    isPlaying: false,
    victory: false,
    victoryTimer: 0
};

// Định nghĩa màu sắc khối
const PIXEL_SIZE = 4;

function startBattleGame() {
    battleGame.canvas = document.getElementById('battle-canvas');
    battleGame.ctx = battleGame.canvas.getContext('2d');
    
    // Scale canvas theo kích thước màn hình thực
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Khởi tạo thực thể
    battleGame.health = 100;
    battleGame.victory = false;
    battleGame.victoryTimer = 0;
    battleGame.pearls = [];
    battleGame.particles = [];
    battleGame.fireballs = [];
    
    // Steve cử nhân
    battleGame.steve = {
        x: 80,
        y: battleGame.canvas.height - 110,
        width: 16 * PIXEL_SIZE,
        height: 24 * PIXEL_SIZE,
        swing: 0,
        isSwinging: false,
        flashRed: 0
    };
    
    // Rồng Ender Dragon
    battleGame.dragon = {
        x: battleGame.canvas.width - 250,
        y: 120,
        targetY: 120,
        width: 48 * PIXEL_SIZE,
        height: 32 * PIXEL_SIZE,
        wingPhase: 0,
        angle: 0,
        flashRed: 0,
        shootCooldown: 100
    };
    
    battleGame.isPlaying = true;
    updateBossBar();
    
    // Lắng nghe sự kiện click chuột để ném ngọc Ender
    battleGame.canvas.removeEventListener('click', handleBattleClick);
    battleGame.canvas.addEventListener('click', handleBattleClick);
    
    gameLoop();
}

function resizeCanvas() {
    if (!battleGame.canvas) return;
    battleGame.canvas.width = window.innerWidth;
    battleGame.canvas.height = window.innerHeight;
    if (battleGame.steve) {
        battleGame.steve.y = battleGame.canvas.height - 110;
    }
}

function handleBattleClick(e) {
    if (!battleGame.isPlaying || battleGame.victory) return;
    
    // Tọa độ đích
    const rect = battleGame.canvas.getBoundingClientRect();
    const targetX = e.clientX - rect.left;
    const targetY = e.clientY - rect.top;
    
    // Steve vung tay ném ngọc
    battleGame.steve.isSwinging = true;
    battleGame.steve.swing = 10;
    audio.playThrow();
    
    // Tạo ngọc Ender
    const startX = battleGame.steve.x + battleGame.steve.width;
    const startY = battleGame.steve.y + 20;
    const angle = Math.atan2(targetY - startY, targetX - startX);
    
    battleGame.pearls.push({
        x: startX,
        y: startY,
        vx: Math.cos(angle) * 14,
        vy: Math.sin(angle) * 14,
        size: 2 * PIXEL_SIZE
    });
}

function updateBossBar() {
    const bar = document.getElementById('boss-health-current');
    if (bar) {
        bar.style.width = `${battleGame.health}%`;
    }
}

// Hàm vẽ đối tượng dạng Pixel Art bằng Canvas
function drawPixelRect(ctx, x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(Math.floor(x), Math.floor(y), Math.floor(w), Math.floor(h));
}

function gameLoop() {
    if (!battleGame.isPlaying) return;
    
    updateGame();
    drawGame();
    
    battleGame.animationId = requestAnimationFrame(gameLoop);
}

function updateGame() {
    // 1. Cập nhật Steve
    if (battleGame.steve.isSwinging) {
        battleGame.steve.swing--;
        if (battleGame.steve.swing <= 0) {
            battleGame.steve.isSwinging = false;
        }
    }
    if (battleGame.steve.flashRed > 0) battleGame.steve.flashRed--;

    // 2. Cập nhật Rồng Ender
    if (!battleGame.victory) {
        battleGame.dragon.angle += 0.03;
        // Rồng bay hình sin
        battleGame.dragon.y = 120 + Math.sin(battleGame.dragon.angle) * 60;
        battleGame.dragon.x = (battleGame.canvas.width / 2) + Math.cos(battleGame.dragon.angle * 0.5) * (battleGame.canvas.width / 3);
        battleGame.dragon.wingPhase += 0.15;
        
        if (battleGame.dragon.flashRed > 0) battleGame.dragon.flashRed--;
        
        // Rồng bắn cầu lửa
        battleGame.dragon.shootCooldown--;
        if (battleGame.dragon.shootCooldown <= 0) {
            shootFireball();
            battleGame.dragon.shootCooldown = 80 + Math.random() * 60;
        }
    } else {
        // Hoạt ảnh rồng nổ khi thắng
        battleGame.victoryTimer++;
        battleGame.dragon.x += (Math.random() - 0.5) * 8;
        battleGame.dragon.y += (Math.random() - 0.5) * 8;
        
        // Tạo tia sáng nổ
        if (battleGame.victoryTimer % 3 === 0) {
            createExplosionParticles(battleGame.dragon.x + battleGame.dragon.width/2, battleGame.dragon.y + battleGame.dragon.height/2);
        }
        
        if (battleGame.victoryTimer > 120) {
            battleGame.isPlaying = false;
            cancelAnimationFrame(battleGame.animationId);
            transitionTo('POEM');
            return;
        }
    }

    // 3. Cập nhật Ngọc Ender (Ngọc bay)
    for (let i = battleGame.pearls.length - 1; i >= 0; i--) {
        let p = battleGame.pearls[i];
        p.x += p.vx;
        p.y += p.vy;
        
        // Tạo hạt khói xanh lá (trail)
        if (Math.random() < 0.4) {
            battleGame.particles.push({
                x: p.x,
                y: p.y,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                color: '#55ff55',
                life: 15,
                maxLife: 15,
                size: PIXEL_SIZE
            });
        }
        
        // Va chạm với Rồng
        if (!battleGame.victory && 
            p.x > battleGame.dragon.x && p.x < battleGame.dragon.x + battleGame.dragon.width &&
            p.y > battleGame.dragon.y && p.y < battleGame.dragon.y + battleGame.dragon.height) {
            
            // Gây sát thương
            battleGame.health -= 5;
            if (battleGame.health <= 0) {
                battleGame.health = 0;
                battleGame.victory = true;
                audio.playExplosion();
            } else {
                audio.playHit();
            }
            
            battleGame.dragon.flashRed = 10;
            updateBossBar();
            
            // Hạt vỡ ngọc
            for (let k = 0; k < 12; k++) {
                battleGame.particles.push({
                    x: p.x,
                    y: p.y,
                    vx: (Math.random() - 0.5) * 6,
                    vy: (Math.random() - 0.5) * 6,
                    color: '#ff55ff',
                    life: 25,
                    maxLife: 25,
                    size: PIXEL_SIZE
                });
            }
            
            battleGame.pearls.splice(i, 1);
            continue;
        }
        
        // Ra ngoài màn hình thì xóa
        if (p.x < 0 || p.x > battleGame.canvas.width || p.y < 0 || p.y > battleGame.canvas.height) {
            battleGame.pearls.splice(i, 1);
        }
    }

    // 4. Cập nhật Cầu lửa của Rồng
    for (let i = battleGame.fireballs.length - 1; i >= 0; i--) {
        let f = battleGame.fireballs[i];
        f.x += f.vx;
        f.y += f.vy;
        
        // Hạt lửa tím
        if (Math.random() < 0.6) {
            battleGame.particles.push({
                x: f.x,
                y: f.y,
                vx: (Math.random() - 0.5) * 3,
                vy: (Math.random() - 0.5) * 3,
                color: '#df00ff',
                life: 12,
                maxLife: 12,
                size: PIXEL_SIZE * 1.5
            });
        }
        
        // Va chạm với Steve
        if (f.x > battleGame.steve.x && f.x < battleGame.steve.x + battleGame.steve.width &&
            f.y > battleGame.steve.y && f.y < battleGame.steve.y + battleGame.steve.height) {
            
            battleGame.steve.flashRed = 8;
            audio.playHit();
            
            // Xóa cầu lửa
            battleGame.fireballs.splice(i, 1);
            continue;
        }
        
        if (f.y > battleGame.canvas.height) {
            battleGame.fireballs.splice(i, 1);
        }
    }

    // 5. Cập nhật Hạt (Particles)
    for (let i = battleGame.particles.length - 1; i >= 0; i--) {
        let pt = battleGame.particles[i];
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.life--;
        if (pt.life <= 0) {
            battleGame.particles.splice(i, 1);
        }
    }
}

function shootFireball() {
    const startX = battleGame.dragon.x + 10;
    const startY = battleGame.dragon.y + 40;
    const targetX = battleGame.steve.x + battleGame.steve.width/2;
    const targetY = battleGame.steve.y + battleGame.steve.height/2;
    
    const angle = Math.atan2(targetY - startY, targetX - startX);
    battleGame.fireballs.push({
        x: startX,
        y: startY,
        vx: Math.cos(angle) * 7,
        vy: Math.sin(angle) * 7,
        size: 3 * PIXEL_SIZE
    });
}

function createExplosionParticles(x, y) {
    for (let i = 0; i < 15; i++) {
        battleGame.particles.push({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 14,
            vy: (Math.random() - 0.5) * 14,
            color: Math.random() < 0.5 ? '#ff55ff' : '#ffffff',
            life: 30 + Math.random() * 20,
            maxLife: 50,
            size: (1 + Math.random() * 3) * PIXEL_SIZE
        });
    }
}

function drawGame() {
    const ctx = battleGame.ctx;
    const w = battleGame.canvas.width;
    const h = battleGame.canvas.height;
    
    // Xóa màn hình vẽ
    ctx.fillStyle = '#0b0412';
    ctx.fillRect(0, 0, w, h);
    
    // Vẽ tháp obsidian (Bối cảnh The End)
    ctx.fillStyle = '#06010a';
    ctx.fillRect(w * 0.2, h - 300, 80, 300);
    ctx.fillRect(w * 0.7, h - 450, 110, 450);
    
    // Cột hồi máu ngọc Ender
    drawPixelRect(ctx, w * 0.2 + 30, h - 320, 20, 20, '#ff55ff');
    drawPixelRect(ctx, w * 0.7 + 45, h - 470, 20, 20, '#ff55ff');
    
    // Vẽ mặt đất (End Stone)
    ctx.fillStyle = '#1e1c12';
    ctx.fillRect(0, h - 50, w, 50);
    ctx.fillStyle = '#2c291b';
    ctx.fillRect(0, h - 50, w, 8); // Viền cỏ ender
    
    // Vẽ Steve
    const s = battleGame.steve;
    ctx.save();
    if (s.flashRed > 0) {
        ctx.filter = 'brightness(0.6) sepia(1) hue-rotate(-50deg) saturate(5)'; // Lớp phủ đỏ khi trúng đòn
    }
    
    // Đầu của Steve + Mũ cử nhân
    drawPixelRect(ctx, s.x + 4*PIXEL_SIZE, s.y, 8*PIXEL_SIZE, 8*PIXEL_SIZE, '#d0a080'); // Mặt
    drawPixelRect(ctx, s.x + 4*PIXEL_SIZE, s.y, 8*PIXEL_SIZE, 2*PIXEL_SIZE, '#503020'); // Tóc
    
    // Mũ cử nhân
    drawPixelRect(ctx, s.x + 2*PIXEL_SIZE, s.y - 3*PIXEL_SIZE, 12*PIXEL_SIZE, 2*PIXEL_SIZE, '#151515'); // Tấm phẳng mũ
    drawPixelRect(ctx, s.x + 5*PIXEL_SIZE, s.y - 1*PIXEL_SIZE, 6*PIXEL_SIZE, 1*PIXEL_SIZE, '#151515'); // Chân mũ
    drawPixelRect(ctx, s.x + 13*PIXEL_SIZE, s.y - 2*PIXEL_SIZE, 1*PIXEL_SIZE, 4*PIXEL_SIZE, '#ffff55'); // Tua rua vàng
    
    // Thân Steve (Áo xanh cyan hoặc Áo cử nhân cử hành tốt nghiệp)
    let bodyColor = skinType === 'dark' ? '#111111' : '#00a8a8'; // Áo thun cyan hoặc áo tốt nghiệp đen
    drawPixelRect(ctx, s.x + 4*PIXEL_SIZE, s.y + 8*PIXEL_SIZE, 8*PIXEL_SIZE, 10*PIXEL_SIZE, bodyColor);
    
    if (skinType === 'dark') {
        // Cổ áo viền đỏ cử nhân
        drawPixelRect(ctx, s.x + 7*PIXEL_SIZE, s.y + 8*PIXEL_SIZE, 2*PIXEL_SIZE, 6*PIXEL_SIZE, '#ff2222');
    }

    // Tay Steve
    let armSwingOffset = s.isSwinging ? -8 * PIXEL_SIZE : 0;
    drawPixelRect(ctx, s.x + 1*PIXEL_SIZE, s.y + 8*PIXEL_SIZE, 3*PIXEL_SIZE, 8*PIXEL_SIZE, '#d0a080'); // Tay trái
    drawPixelRect(ctx, s.x + 12*PIXEL_SIZE, s.y + 8*PIXEL_SIZE + armSwingOffset, 3*PIXEL_SIZE, 8*PIXEL_SIZE, '#d0a080'); // Tay phải ném

    // Quần và Chân
    drawPixelRect(ctx, s.x + 4*PIXEL_SIZE, s.y + 18*PIXEL_SIZE, 8*PIXEL_SIZE, 4*PIXEL_SIZE, '#0000a8'); // Quần xanh dương
    drawPixelRect(ctx, s.x + 4*PIXEL_SIZE, s.y + 22*PIXEL_SIZE, 3*PIXEL_SIZE, 2*PIXEL_SIZE, '#4a4a4a'); // Giày trái
    drawPixelRect(ctx, s.x + 9*PIXEL_SIZE, s.y + 22*PIXEL_SIZE, 3*PIXEL_SIZE, 2*PIXEL_SIZE, '#4a4a4a'); // Giày phải
    
    ctx.restore();
    
    // Vẽ Rồng Ender Dragon
    const d = battleGame.dragon;
    if (!battleGame.victory || battleGame.victoryTimer % 4 < 2) {
        ctx.save();
        if (d.flashRed > 0) {
            ctx.filter = 'brightness(0.5) sepia(1) hue-rotate(-50deg) saturate(7)';
        }
        
        // Thân rồng (Khối hộp đen)
        drawPixelRect(ctx, d.x, d.y, d.width, d.height, '#121212');
        
        // Bụng rồng xám đen
        drawPixelRect(ctx, d.x + 4*PIXEL_SIZE, d.y + 8*PIXEL_SIZE, d.width - 8*PIXEL_SIZE, d.height - 16*PIXEL_SIZE, '#222222');
        
        // Đầu rồng
        drawPixelRect(ctx, d.x - 6*PIXEL_SIZE, d.y + 4*PIXEL_SIZE, 8*PIXEL_SIZE, 8*PIXEL_SIZE, '#121212');
        drawPixelRect(ctx, d.x - 3*PIXEL_SIZE, d.y + 6*PIXEL_SIZE, 2*PIXEL_SIZE, 2*PIXEL_SIZE, '#ff55ff'); // Mắt rồng tím phát sáng
        
        // Cánh rồng nhịp cánh lên xuống
        let wingOffset = Math.sin(d.wingPhase) * 16 * PIXEL_SIZE;
        ctx.fillStyle = '#1c1c1c';
        // Cánh trái
        ctx.fillRect(d.x + 12*PIXEL_SIZE, d.y - wingOffset, 10*PIXEL_SIZE, wingOffset > 0 ? wingOffset : 2*PIXEL_SIZE);
        // Cánh phải
        ctx.fillRect(d.x + 26*PIXEL_SIZE, d.y - wingOffset, 10*PIXEL_SIZE, wingOffset > 0 ? wingOffset : 2*PIXEL_SIZE);
        
        // Đuôi rồng
        drawPixelRect(ctx, d.x + d.width, d.y + 12*PIXEL_SIZE, 12*PIXEL_SIZE, 4*PIXEL_SIZE, '#121212');
        
        ctx.restore();
    }
    
    // Vẽ Ngọc Ender (projectile)
    battleGame.pearls.forEach(p => {
        drawPixelRect(ctx, p.x, p.y, p.size, p.size, '#55ff55');
        drawPixelRect(ctx, p.x + 2, p.y + 2, p.size - 4, p.size - 4, '#ffffff'); // Lõi trắng
    });
    
    // Vẽ Cầu lửa của Rồng
    battleGame.fireballs.forEach(f => {
        drawPixelRect(ctx, f.x, f.y, f.size, f.size, '#ff00ff');
        drawPixelRect(ctx, f.x + 2, f.y + 2, f.size - 4, f.size - 4, '#ffffff');
    });
    
    // Vẽ Hạt (Particles)
    battleGame.particles.forEach(pt => {
        let opacity = pt.life / pt.maxLife;
        ctx.fillStyle = pt.color;
        ctx.globalAlpha = opacity;
        ctx.fillRect(pt.x, pt.y, pt.size, pt.size);
    });
    ctx.globalAlpha = 1.0; // Reset alpha
    
    // Vẽ các luồng sáng khi rồng nổ tung
    if (battleGame.victory) {
        ctx.save();
        let centerX = d.x + d.width / 2;
        let centerY = d.y + d.height / 2;
        for (let i = 0; i < 24; i++) {
            let angle = (i / 24) * Math.PI * 2 + (battleGame.victoryTimer * 0.05);
            let length = (battleGame.victoryTimer * 6) + Math.random() * 50;
            ctx.strokeStyle = i % 2 === 0 ? '#ff55ff' : '#ffffff';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(centerX + Math.cos(angle) * length, centerY + Math.sin(angle) * length);
            ctx.stroke();
        }
        ctx.restore();
    }
}


// --- LẬP TRÌNH BÀI THƠ "THE END POEM" ---
let poemInterval = null;

const poemTexts = [
    { type: 'meta', text: '🎓 11.07.2026 | Graduation Day' },
    { type: 'meta', text: '🏆 Goal Reached! The End... Again...' },
    { type: 'player', text: 'Tôi thấy một người chơi.' },
    { type: 'narrator', text: 'Người chơi nào?' },
    { type: 'player', text: 'Trần Nguyễn Minh Thiên. Cậu ấy vừa vượt qua thử thách cuối cùng.' },
    { type: 'narrator', text: 'Tuyệt vời. Cậu ấy đã hoàn thành 4 năm tại Đại học An Giang (AGU).' },
    { type: 'player', text: 'Tôi nhớ những ngày cậu ấy thức trắng đêm chạy deadline. Những lỗi bug khiến chương trình không thể biên dịch.' },
    { type: 'narrator', text: 'Nhưng cậu ấy đã không bỏ cuộc. Đúng chứ?' },
    { type: 'player', text: 'Đúng vậy. Mỗi lỗi sai là một khối đá xây nên kinh nghiệm. Cậu ấy đã chế tạo được chiếc Cúp Công nghệ Thông tin cho riêng mình.' },
    { type: 'narrator', text: 'Hôm nay, ngày 11/07/2026, cậu ấy chính thức nhận bằng Cử nhân.' },
    { type: 'player', text: 'Giống như đánh bại Ender Dragon, dòng chữ "The End..." hiện lên.' },
    { type: 'narrator', text: 'Nhưng đó chưa bao giờ là kết thúc thực sự.' },
    { type: 'highlight', text: 'Đó chỉ là sự khởi đầu của một cuộc phiêu lưu mới.' },
    { type: 'player', text: 'Cảm ơn gia đình đã luôn là giáp trụ bảo vệ.' },
    { type: 'narrator', text: 'Cảm ơn thầy cô đã trao những cuốn sách bí kíp ma thuật truyền thụ tri thức.' },
    { type: 'player', text: 'Cảm ơn bạn bè đã lập tổ đội (party) cùng vượt qua các phụ bản giảng đường đáng nhớ.' },
    { type: 'highlight', text: 'Đặc biệt, cảm ơn bản thân vì đã luôn kiên trì đến cuối cùng.' },
    { type: 'narrator', text: 'Từ hôm nay, cậu ấy không còn là sinh viên nữa.' },
    { type: 'player', text: 'Một chương đã đóng lại. Một thế giới mới đang được tạo (Generating World...)' },
    { type: 'highlight', text: 'Goal Reached. Loading the next adventure...' }
];

function startEndPoem() {
    const container = document.getElementById('poem-content');
    container.innerHTML = '';
    
    // Tạo cấu trúc HTML cho chữ cuộn
    poemTexts.forEach(item => {
        const p = document.createElement('p');
        p.className = item.type + '-msg';
        p.textContent = item.text;
        container.appendChild(p);
    });
    
    // Tự động cuộn chữ bằng JS để kiểm soát chính xác tốc độ và kết thúc
    let currentY = window.innerHeight;
    container.style.transform = `translateY(${currentY}px)`;
    
    if (poemInterval) clearInterval(poemInterval);
    
    const scrollSpeed = 1.2; // Tốc độ cuộn chữ
    
    function scrollPoem() {
        if (currentScreen !== 'POEM') return;
        
        currentY -= scrollSpeed;
        container.style.transform = `translateY(${currentY}px)`;
        
        // Kiểm tra xem đã cuộn hết chữ chưa
        const rect = container.getBoundingClientRect();
        if (rect.bottom < 0) {
            clearInterval(poemInterval);
            transitionTo('CERTIFICATE');
        } else {
            requestAnimationFrame(scrollPoem);
        }
    }
    
    requestAnimationFrame(scrollPoem);
}


// --- HIỆU ỨNG PHÁO HOA ĂN MỪNG TỐT NGHIỆP ---
let fireworksGame = {
    canvas: null,
    ctx: null,
    list: [],
    particles: [],
    animationId: null,
    active: false
};

function startFireworks() {
    fireworksGame.canvas = document.getElementById('fireworks-canvas');
    fireworksGame.ctx = fireworksGame.canvas.getContext('2d');
    fireworksGame.list = [];
    fireworksGame.particles = [];
    fireworksGame.active = true;
    
    // Chơi nhạc mừng tốt nghiệp (Level Up chime)
    audio.playLevelUp();
    
    resizeFireworksCanvas();
    window.addEventListener('resize', resizeFireworksCanvas);
    
    fireworksLoop();
}

function resizeFireworksCanvas() {
    if (!fireworksGame.canvas) return;
    fireworksGame.canvas.width = window.innerWidth;
    fireworksGame.canvas.height = window.innerHeight;
}

class Firework {
    constructor(x, targetY) {
        this.x = x;
        this.y = window.innerHeight;
        this.targetY = targetY;
        this.vy = -8 - Math.random() * 5;
        this.color = `hsl(${Math.random() * 360}, 100%, 60%)`;
        this.exploded = false;
    }
    update() {
        this.y += this.vy;
        if (this.y <= this.targetY) {
            this.exploded = true;
            createFireworkExplosion(this.x, this.y, this.color);
        }
    }
    draw(ctx) {
        drawPixelRect(ctx, this.x, this.y, 4, 12, this.color);
    }
}

function createFireworkExplosion(x, y, color) {
    audio.playClick(); // Âm nổ nhỏ giả lập chiptune
    for (let i = 0; i < 40; i++) {
        let angle = Math.random() * Math.PI * 2;
        let speed = 1 + Math.random() * 6;
        fireworksGame.particles.push({
            x: x,
            y: y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            color: color,
            alpha: 1.0,
            decay: 0.015 + Math.random() * 0.02,
            size: 3 + Math.random() * 3
        });
    }
}

function fireworksLoop() {
    if (!fireworksGame.active) return;
    
    const ctx = fireworksGame.ctx;
    const w = fireworksGame.canvas.width;
    const h = fireworksGame.canvas.height;
    
    // Xóa nhạt để tạo đuôi sáng
    ctx.fillStyle = 'rgba(11, 5, 20, 0.2)';
    ctx.fillRect(0, 0, w, h);
    
    // Tạo pháo hoa ngẫu nhiên
    if (Math.random() < 0.05 && fireworksGame.list.length < 5) {
        let randomX = 100 + Math.random() * (w - 200);
        let randomTargetY = 100 + Math.random() * (h/2 - 50);
        fireworksGame.list.push(new Firework(randomX, randomTargetY));
    }
    
    // Cập nhật và vẽ pháo hoa
    for (let i = fireworksGame.list.length - 1; i >= 0; i--) {
        let f = fireworksGame.list[i];
        f.update();
        if (f.exploded) {
            fireworksGame.list.splice(i, 1);
        } else {
            f.draw(ctx);
        }
    }
    
    // Cập nhật và vẽ các hạt nổ
    for (let i = fireworksGame.particles.length - 1; i >= 0; i--) {
        let p = fireworksGame.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.05; // Trọng lực kéo hạt rơi xuống nhẹ
        p.alpha -= p.decay;
        
        if (p.alpha <= 0) {
            fireworksGame.particles.splice(i, 1);
            continue;
        }
        
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fillRect(p.x, p.y, p.size, p.size);
    }
    ctx.globalAlpha = 1.0;
    
    fireworksGame.animationId = requestAnimationFrame(fireworksLoop);
}

function stopFireworks() {
    fireworksGame.active = false;
    cancelAnimationFrame(fireworksGame.animationId);
}


// --- HỆ THỐNG LƯU BÚT (MULTIPLAYER GUESTBOOK) ---
const defaultWishes = [
    { name: "Gia đình ❤️", message: "Chúc mừng con trai đã hoàn thành xuất sắc chặng đường! Cả nhà luôn tự hào về con!", date: "11/07/2026" },
    { name: "Thầy Cô AGU 🎓", message: "Chúc mừng Thiên tốt nghiệp loại Xuất Sắc. Chúc em tiến xa trên con đường CNTT nhé!", date: "11/07/2026" },
    { name: "Steve & Alex 🤝", message: "Tuyệt vời lắm người bạn đồng hành! Adventure is out there, go find it!", date: "11/07/2026" }
];

function loadWishes() {
    const wishesList = document.getElementById('wishes-list');
    wishesList.innerHTML = '';
    
    let wishes = localStorage.getItem('mc_wishes');
    if (!wishes) {
        wishes = defaultWishes;
        localStorage.setItem('mc_wishes', JSON.stringify(wishes));
    } else {
        wishes = JSON.parse(wishes);
    }
    
    // Sắp xếp lời chúc mới nhất lên đầu
    wishes.slice().reverse().forEach(wish => {
        const sign = document.createElement('div');
        sign.className = 'mc-wood-sign-display';
        sign.innerHTML = `
            <div class="sign-display-name">${escapeHTML(wish.name)}</div>
            <div class="sign-display-message">"${escapeHTML(wish.message)}"</div>
            <div class="sign-display-date">${wish.date}</div>
        `;
        wishesList.appendChild(sign);
    });
}

function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}

// Bấm gửi lưu bút
document.getElementById('btn-submit-wish').addEventListener('click', () => {
    const nameInput = document.getElementById('guestbook-name');
    const msgInput = document.getElementById('guestbook-message');
    
    const name = nameInput.value.trim();
    const message = msgInput.value.trim();
    
    if (!name || !message) {
        alert("Vui lòng nhập tên và lời chúc nhé!");
        return;
    }
    
    audio.playClick();
    
    const today = new Date();
    const dateStr = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;
    
    const newWish = { name, message, date: dateStr };
    
    let wishes = JSON.parse(localStorage.getItem('mc_wishes')) || defaultWishes;
    wishes.push(newWish);
    localStorage.setItem('mc_wishes', JSON.stringify(wishes));
    
    // Reset form
    nameInput.value = '';
    msgInput.value = '';
    
    // Tải lại danh sách lời chúc
    loadWishes();
});


// --- KHỞI TẠO & CÁC LỰA CHỌN PHỤ ---
let skinType = 'dark'; // 'dark' (cử nhân) hoặc 'classic' (áo thun xanh lá/xanh cyan)

const splashTexts = [
    "Goal Reached!",
    "Class of 2026!",
    "AGU IT Bachelor!",
    "The End... Again!",
    "Next Adventure Loading...",
    "Đại Học An Giang!",
    "Trần Nguyễn Minh Thiên!",
    "0 lỗi biên dịch!",
    "11.07.2026!"
];

// Random splash text khi vào web
document.getElementById('splash-text').textContent = splashTexts[Math.floor(Math.random() * splashTexts.length)];

// Cài đặt nút bấm các màn hình
document.getElementById('btn-singleplayer').addEventListener('click', () => {
    transitionTo('BATTLE');
});

document.getElementById('btn-multiplayer').addEventListener('click', () => {
    transitionTo('MULTIPLAYER');
});

document.getElementById('btn-back-menu').addEventListener('click', () => {
    transitionTo('MENU');
});

document.getElementById('btn-go-guestbook').addEventListener('click', () => {
    stopFireworks();
    transitionTo('MULTIPLAYER');
});

document.getElementById('btn-replay').addEventListener('click', () => {
    stopFireworks();
    transitionTo('MENU');
});

document.getElementById('btn-skip-poem').addEventListener('click', () => {
    transitionTo('CERTIFICATE');
});

// Sự kiện phím ESC để bỏ qua bài thơ
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && currentScreen === 'POEM') {
        transitionTo('CERTIFICATE');
    }
});

// Điều khiển âm thanh (Nút loa ở góc màn hình)
const audioToggleBtn = document.getElementById('btn-audio-toggle');
const audioIcon = document.getElementById('audio-icon');

audioToggleBtn.addEventListener('click', () => {
    const isMuted = audio.toggleMute();
    audioIcon.textContent = isMuted ? '🔇' : '🔈';
    audio.playClick();
});

// Tùy chọn game (Options Modal)
const optionsModal = document.getElementById('options-modal');
const btnOptions = document.getElementById('btn-options');
const btnCloseOptions = document.getElementById('btn-close-options');

btnOptions.addEventListener('click', () => {
    audio.playClick();
    optionsModal.classList.remove('hidden');
});

btnCloseOptions.addEventListener('click', () => {
    audio.playClick();
    optionsModal.classList.add('hidden');
});

// Tắt/bật âm thanh trong Options
const btnToggleSoundOpt = document.getElementById('btn-toggle-sound-opt');
btnToggleSoundOpt.addEventListener('click', () => {
    const isMuted = audio.toggleMute();
    btnToggleSoundOpt.querySelector('.btn-text').textContent = isMuted ? "Âm Thanh: TẮT" : "Âm Thanh: BẬT";
    audioIcon.textContent = isMuted ? '🔇' : '🔈';
    audio.playClick();
});

// Tắt/bật nhạc nền trong Options
const btnToggleMusicOpt = document.getElementById('btn-toggle-music-opt');
btnToggleMusicOpt.addEventListener('click', () => {
    const isMusic = audio.toggleMusic();
    btnToggleMusicOpt.querySelector('.btn-text').textContent = isMusic ? "Nhạc Nền: BẬT" : "Nhạc Nền: TẮT";
    audio.playClick();
});

// Thay đổi Skin của Steve
const btnToggleSkin = document.getElementById('btn-toggle-skin');
btnToggleSkin.addEventListener('click', () => {
    audio.playClick();
    if (skinType === 'dark') {
        skinType = 'classic';
        btnToggleSkin.querySelector('.btn-text').textContent = "Skin: Steve Classic";
    } else {
        skinType = 'dark';
        btnToggleSkin.querySelector('.btn-text').textContent = "Skin: Cử Nhân Mũ Đen";
    }
});

// Bấm nút Thoát Game
document.getElementById('btn-quit').addEventListener('click', () => {
    audio.playClick();
    alert("Minecraft: Không thể thoát khỏi cuộc đời thực! Hãy click 'Singleplayer' để khám phá cuộc hành trình tiếp theo!");
});

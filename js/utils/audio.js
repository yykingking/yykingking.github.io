/**
 * 音频管理器
 * 负责音效和语音的播放
 */

class AudioManager {
    static instance = null;
    
    constructor() {
        if (AudioManager.instance) {
            return AudioManager.instance;
        }
        
        this.audioContext = null;
        this.sounds = new Map();
        this.isEnabled = true;
        this.volume = 0.7;
        
        this.initAudioContext();
        this.createSounds();
        
        AudioManager.instance = this;
    }

    /**
     * 初始化音频上下文
     */
    initAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (error) {
            console.warn('无法初始化音频上下文:', error);
        }
    }

    /**
     * 创建音效
     */
    createSounds() {
        // 音效配置
        const soundConfigs = {
            'welcome': { frequency: 440, duration: 0.3, type: 'sine' },
            'click': { frequency: 800, duration: 0.1, type: 'square' },
            'correct': { frequency: 523, duration: 0.5, type: 'sine' },
            'wrong': { frequency: 200, duration: 0.3, type: 'sawtooth' },
            'star-collect': { frequency: 659, duration: 0.4, type: 'sine' },
            'level-up': { frequency: 784, duration: 0.8, type: 'sine' },
            'module-enter': { frequency: 349, duration: 0.3, type: 'triangle' },
            'audio-on': { frequency: 523, duration: 0.2, type: 'sine' },
            'success': { frequency: 587, duration: 0.6, type: 'sine' },
            'number-pop': { frequency: 440, duration: 0.2, type: 'triangle' }
        };

        // 为每个音效创建音频缓冲
        Object.entries(soundConfigs).forEach(([name, config]) => {
            this.sounds.set(name, config);
        });
    }

    /**
     * 播放音效
     */
    static playSound(soundType) {
        const instance = AudioManager.getInstance();
        instance.play(soundType);
    }

    /**
     * 播放音效实例方法
     */
    play(soundType) {
        if (!this.isEnabled || !this.audioContext) {
            return;
        }

        const soundConfig = this.sounds.get(soundType);
        if (!soundConfig) {
            console.warn(`未找到音效: ${soundType}`);
            return;
        }

        try {
            this.playTone(soundConfig);
        } catch (error) {
            console.error('播放音效失败:', error);
        }
    }

    /**
     * 播放音调
     */
    playTone(config) {
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.type = config.type;
        oscillator.frequency.setValueAtTime(config.frequency, this.audioContext.currentTime);

        // 设置音量包络
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(this.volume, this.audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + config.duration);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + config.duration);
    }

    /**
     * 播放成功音效序列
     */
    playSuccessSequence() {
        if (!this.isEnabled) return;

        const notes = [523, 659, 784]; // C, E, G
        notes.forEach((frequency, index) => {
            setTimeout(() => {
                this.playTone({
                    frequency,
                    duration: 0.3,
                    type: 'sine'
                });
            }, index * 150);
        });
    }

    /**
     * 播放错误音效
     */
    playErrorSound() {
        if (!this.isEnabled) return;

        // 播放下降音调
        setTimeout(() => {
            this.playTone({ frequency: 300, duration: 0.2, type: 'sawtooth' });
        }, 0);
        setTimeout(() => {
            this.playTone({ frequency: 200, duration: 0.3, type: 'sawtooth' });
        }, 200);
    }

    /**
     * 播放数字音效
     */
    playNumberSound(number) {
        if (!this.isEnabled) return;

        // 根据数字播放不同频率
        const baseFrequency = 440;
        const frequency = baseFrequency + (number * 20);
        
        this.playTone({
            frequency,
            duration: 0.4,
            type: 'sine'
        });
    }

    /**
     * 语音播放（使用Web Speech API）
     */
    speak(text, options = {}) {
        if (!this.isEnabled || !window.speechSynthesis) {
            return;
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = options.lang || 'zh-CN';
        utterance.rate = options.rate || 0.8;
        utterance.pitch = options.pitch || 1.2;
        utterance.volume = options.volume || this.volume;

        window.speechSynthesis.speak(utterance);
    }

    /**
     * 读数字
     */
    speakNumber(number) {
        const numberTexts = {
            0: '零', 1: '一', 2: '二', 3: '三', 4: '四',
            5: '五', 6: '六', 7: '七', 8: '八', 9: '九',
            10: '十', 11: '十一', 12: '十二', 13: '十三', 14: '十四',
            15: '十五', 16: '十六', 17: '十七', 18: '十八', 19: '十九',
            20: '二十'
        };

        const text = numberTexts[number] || number.toString();
        this.speak(text);
    }

    /**
     * 读加法算式
     */
    speakAddition(a, b, result) {
        const text = `${this.getNumberText(a)} 加 ${this.getNumberText(b)} 等于 ${this.getNumberText(result)}`;
        this.speak(text);
    }

    /**
     * 读减法算式
     */
    speakSubtraction(a, b, result) {
        const text = `${this.getNumberText(a)} 减 ${this.getNumberText(b)} 等于 ${this.getNumberText(result)}`;
        this.speak(text);
    }

    /**
     * 获取数字的中文读音
     */
    getNumberText(number) {
        const texts = {
            0: '零', 1: '一', 2: '二', 3: '三', 4: '四',
            5: '五', 6: '六', 7: '七', 8: '八', 9: '九', 10: '十'
        };
        return texts[number] || number.toString();
    }

    /**
     * 设置音量
     */
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
    }

    /**
     * 启用/禁用音效
     */
    setEnabled(enabled) {
        this.isEnabled = enabled;
        if (!enabled && window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }
    }

    /**
     * 获取单例实例
     */
    static getInstance() {
        if (!AudioManager.instance) {
            AudioManager.instance = new AudioManager();
        }
        return AudioManager.instance;
    }

    /**
     * 停止所有音效
     */
    stopAll() {
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }
    }
}

// 全局导出
window.AudioManager = AudioManager; 
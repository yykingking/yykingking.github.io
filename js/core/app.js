/**
 * 小小数学家 - 核心应用类
 * 负责应用的整体状态管理和模块切换
 */

class MathApp {
    constructor() {
        this.currentModule = null;
        this.userLevel = 1;
        this.totalStars = 0;
        this.audioEnabled = true;
        this.modules = {};
        this.screens = {};
        this.isLoading = true;
        
        // 初始化屏幕引用
        this.initScreens();
        
        // 绑定事件
        this.bindEvents();
        
        // 加载用户数据
        this.loadUserData();
        
        // 开始加载流程
        this.startLoading();
    }

    /**
     * 初始化屏幕引用
     */
    initScreens() {
        this.screens = {
            loading: document.getElementById('loading-screen'),
            mainMenu: document.getElementById('main-menu'),
            moduleContainer: document.getElementById('module-container'),
            parentCenter: document.getElementById('parent-center')
        };
    }

    /**
     * 绑定事件监听器
     */
    bindEvents() {
        // 主菜单导航按钮
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const moduleType = e.currentTarget.dataset.module;
                this.loadModule(moduleType);
            });
        });

        // 返回按钮
        document.getElementById('back-btn').addEventListener('click', () => {
            this.showMainMenu();
        });

        // 家长中心按钮
        document.getElementById('parent-btn').addEventListener('click', () => {
            this.showParentCenter();
        });

        // 家长中心返回按钮
        document.getElementById('parent-back-btn').addEventListener('click', () => {
            this.showMainMenu();
        });

        // 音效控制
        document.getElementById('audio-toggle').addEventListener('click', () => {
            this.toggleAudio();
        });

        // 键盘快捷键
        document.addEventListener('keydown', (e) => {
            this.handleKeydown(e);
        });
    }

    /**
     * 开始加载流程
     */
    startLoading() {
        // 模拟加载过程
        setTimeout(() => {
            this.finishLoading();
        }, 3000);
    }

    /**
     * 完成加载
     */
    finishLoading() {
        this.isLoading = false;
        this.showScreen('mainMenu');
        this.playSound('welcome');
    }

    /**
     * 显示指定屏幕
     */
    showScreen(screenName) {
        // 隐藏所有屏幕
        Object.values(this.screens).forEach(screen => {
            screen.classList.add('hidden');
        });

        // 显示目标屏幕
        if (this.screens[screenName]) {
            this.screens[screenName].classList.remove('hidden');
            this.screens[screenName].classList.add('animate-fade-in');
        }
    }

    /**
     * 显示主菜单
     */
    showMainMenu() {
        this.currentModule = null;
        this.showScreen('mainMenu');
        this.updateUserInfo();
    }

    /**
     * 显示家长中心
     */
    showParentCenter() {
        this.showScreen('parentCenter');
        if (this.modules.parent) {
            this.modules.parent.render();
        }
    }

    /**
     * 加载学习模块
     */
    async loadModule(moduleType) {
        try {
            // 显示加载状态
            this.showLoadingModule();

            // 检查模块是否已存在
            if (!this.modules[moduleType]) {
                await this.createModule(moduleType);
            }

            // 设置当前模块
            this.currentModule = moduleType;

            // 显示模块容器
            this.showScreen('moduleContainer');

            // 渲染模块内容
            await this.renderModule(moduleType);

            // 播放进入音效
            this.playSound('module-enter');

        } catch (error) {
            console.error('加载模块失败:', error);
            this.showToast('模块加载失败，请重试', 'error');
            this.showMainMenu();
        }
    }

    /**
     * 创建模块实例
     */
    async createModule(moduleType) {
        const moduleClasses = {
            'numbers': NumbersModule,
            'arithmetic': ArithmeticModule,
            'shapes': ShapesModule,
            'comparison': ComparisonModule,
            'games': GamesModule,
            'achievements': AchievementsModule,
            'parent': ParentModule
        };

        const ModuleClass = moduleClasses[moduleType];
        if (ModuleClass) {
            this.modules[moduleType] = new ModuleClass(this);
        } else {
            throw new Error(`未知的模块类型: ${moduleType}`);
        }
    }

    /**
     * 渲染模块内容
     */
    async renderModule(moduleType) {
        const module = this.modules[moduleType];
        if (module && module.render) {
            // 更新模块标题
            this.updateModuleTitle(moduleType);
            
            // 渲染模块内容
            await module.render();
            
            // 更新进度条
            this.updateModuleProgress(moduleType);
        }
    }

    /**
     * 更新模块标题
     */
    updateModuleTitle(moduleType) {
        const titles = {
            'numbers': '数字认知',
            'arithmetic': '加减法运算',
            'shapes': '图形认知',
            'comparison': '比较概念',
            'games': '趣味游戏',
            'achievements': '成就中心'
        };

        const titleElement = document.getElementById('module-title');
        if (titleElement && titles[moduleType]) {
            titleElement.textContent = titles[moduleType];
        }
    }

    /**
     * 更新模块进度
     */
    updateModuleProgress(moduleType) {
        const module = this.modules[moduleType];
        if (module && module.getProgress) {
            const progress = module.getProgress();
            this.setProgress(progress.current, progress.total);
        }
    }

    /**
     * 设置进度条
     */
    setProgress(current, total) {
        const progressFill = document.getElementById('progress-fill');
        const progressText = document.getElementById('progress-text');
        
        if (progressFill && progressText) {
            const percentage = total > 0 ? (current / total) * 100 : 0;
            progressFill.style.width = `${percentage}%`;
            progressText.textContent = `${current}/${total}`;
        }
    }

    /**
     * 显示模块加载状态
     */
    showLoadingModule() {
        const moduleContent = document.getElementById('module-content');
        if (moduleContent) {
            moduleContent.innerHTML = `
                <div class="loading-module">
                    <div class="loading-spinner animate-rotate">⚙️</div>
                    <p>正在加载学习内容...</p>
                </div>
            `;
        }
    }

    /**
     * 更新用户信息显示
     */
    updateUserInfo() {
        const starsElement = document.getElementById('total-stars');
        const levelElement = document.getElementById('user-level');
        
        if (starsElement) {
            starsElement.textContent = this.totalStars;
        }
        
        if (levelElement) {
            levelElement.textContent = this.userLevel;
        }
    }

    /**
     * 加载用户数据
     */
    loadUserData() {
        try {
            if (typeof StorageManager === 'undefined' || !StorageManager.getUserData) {
                console.warn('StorageManager 不可用，使用默认数据');
                this.totalStars = 0;
                this.userLevel = 1;
                this.audioEnabled = true;
                return;
            }
            
            const userData = StorageManager.getUserData();
            if (userData) {
                this.totalStars = userData.stars || 0;
                this.userLevel = userData.level || 1;
                this.audioEnabled = userData.settings?.audioEnabled !== false;
            }
        } catch (error) {
            console.error('加载用户数据失败:', error);
            // 使用默认值
            this.totalStars = 0;
            this.userLevel = 1;
            this.audioEnabled = true;
        }
        
        this.updateAudioButton();
    }

    /**
     * 保存用户数据
     */
    saveUserData() {
        try {
            if (typeof StorageManager === 'undefined' || !StorageManager.saveUserData) {
                console.warn('StorageManager 不可用，无法保存数据');
                return;
            }
            
            const userData = StorageManager.getUserData();
            userData.stars = this.totalStars;
            userData.level = this.userLevel;
            userData.settings.audioEnabled = this.audioEnabled;
            userData.lastLogin = new Date().toISOString();
            
            StorageManager.saveUserData(userData);
        } catch (error) {
            console.error('保存用户数据失败:', error);
        }
    }

    /**
     * 添加星星奖励
     */
    addStars(amount) {
        this.totalStars += amount;
        this.checkLevelUp();
        this.updateUserInfo();
        this.saveUserData();
        
        // 播放奖励音效
        this.playSound('star-collect');
        
        // 显示星星收集动画
        this.showStarAnimation(amount);
    }

    /**
     * 检查升级
     */
    checkLevelUp() {
        const starsNeeded = this.userLevel * 10;
        if (this.totalStars >= starsNeeded) {
            this.userLevel++;
            this.showLevelUpAnimation();
            this.playSound('level-up');
            this.showToast(`恭喜升级！现在是 ${this.userLevel} 级！`, 'success');
        }
    }

    /**
     * 显示星星收集动画
     */
    showStarAnimation(amount) {
        for (let i = 0; i < amount; i++) {
            setTimeout(() => {
                this.createStarParticle();
            }, i * 100);
        }
    }

    /**
     * 创建星星粒子
     */
    createStarParticle() {
        const star = document.createElement('div');
        star.textContent = '⭐';
        star.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            font-size: 2rem;
            pointer-events: none;
            z-index: 9999;
        `;
        star.classList.add('star-collect');
        
        document.body.appendChild(star);
        
        setTimeout(() => {
            star.remove();
        }, 1000);
    }

    /**
     * 显示升级动画
     */
    showLevelUpAnimation() {
        const levelBadge = document.querySelector('.level-badge');
        if (levelBadge) {
            levelBadge.classList.add('level-up');
            setTimeout(() => {
                levelBadge.classList.remove('level-up');
            }, 1000);
        }
    }

    /**
     * 切换音效
     */
    toggleAudio() {
        this.audioEnabled = !this.audioEnabled;
        this.updateAudioButton();
        this.saveUserData();
        
        if (this.audioEnabled) {
            this.playSound('audio-on');
        }
    }

    /**
     * 更新音效按钮
     */
    updateAudioButton() {
        const audioBtn = document.getElementById('audio-toggle');
        if (audioBtn) {
            audioBtn.textContent = this.audioEnabled ? '🔊' : '🔇';
            audioBtn.classList.toggle('muted', !this.audioEnabled);
        }
    }

    /**
     * 播放音效
     */
    playSound(soundType) {
        if (this.audioEnabled && window.AudioManager) {
            AudioManager.playSound(soundType);
        }
    }

    /**
     * 显示提示消息
     */
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type} animate-slide-in-right`;
        toast.textContent = message;
        
        const container = document.getElementById('toast-container');
        if (container) {
            container.appendChild(toast);
            
            // 自动移除
            setTimeout(() => {
                toast.classList.add('animate-fade-out');
                setTimeout(() => {
                    toast.remove();
                }, 300);
            }, 3000);
        }
    }

    /**
     * 处理键盘事件
     */
    handleKeydown(event) {
        // ESC键返回主菜单
        if (event.key === 'Escape' && this.currentModule) {
            this.showMainMenu();
        }
        
        // 空格键切换音效
        if (event.key === ' ' && !event.target.matches('input, textarea')) {
            event.preventDefault();
            this.toggleAudio();
        }
    }

    /**
     * 获取当前模块
     */
    getCurrentModule() {
        return this.modules[this.currentModule];
    }

    /**
     * 重置应用状态
     */
    reset() {
        this.currentModule = null;
        this.showMainMenu();
    }
}

// 导出应用类
window.MathApp = MathApp; 
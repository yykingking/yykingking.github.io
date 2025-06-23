/**
 * 数字认知模块
 * 帮助一年级学生学习数字1-20
 */

class NumbersModule {
    constructor(app) {
        this.app = app;
        this.currentNumber = 1;
        this.maxNumber = 20;
        this.progress = { current: 0, total: 20 };
        this.currentExercise = 'recognition';
        
        this.loadProgress();
    }

    /**
     * 渲染模块内容
     */
    async render() {
        const container = document.getElementById('module-content');
        if (!container) return;

        container.innerHTML = `
            <div class="numbers-module">
                <!-- 练习类型选择 -->
                <div class="exercise-selector">
                    <h3>选择练习类型</h3>
                    <div class="exercise-buttons">
                        <button class="exercise-btn active" data-exercise="recognition">
                            <span class="exercise-icon">🔍</span>
                            <h4>数字识别</h4>
                            <p>认识数字形状</p>
                        </button>
                        <button class="exercise-btn" data-exercise="counting">
                            <span class="exercise-icon">🔢</span>
                            <h4>数量对应</h4>
                            <p>数字与数量</p>
                        </button>
                    </div>
                </div>

                <!-- 数字选择 -->
                <div class="number-selector">
                    <h3>选择数字 (1-${this.maxNumber})</h3>
                    <div class="number-grid">
                        ${this.generateNumberGrid()}
                    </div>
                </div>

                <!-- 练习内容区域 -->
                <div class="exercise-content">
                    <div id="exercise-area">
                        ${this.getExerciseContent()}
                    </div>
                </div>
            </div>
        `;

        this.bindEvents();
    }

    /**
     * 生成数字网格
     */
    generateNumberGrid() {
        let html = '';
        for (let i = 1; i <= this.maxNumber; i++) {
            const isSelected = i === this.currentNumber ? 'selected' : '';
            html += `<button class="number-btn ${isSelected}" data-number="${i}">${i}</button>`;
        }
        return html;
    }

    /**
     * 获取练习内容
     */
    getExerciseContent() {
        if (this.currentExercise === 'recognition') {
            return this.getRecognitionContent();
        } else if (this.currentExercise === 'counting') {
            return this.getCountingContent();
        }
        return '';
    }

    /**
     * 数字识别内容
     */
    getRecognitionContent() {
        return `
            <div class="recognition-exercise">
                <div class="number-display">
                    <div class="big-number animate-number-pop">${this.currentNumber}</div>
                    <div class="number-info">
                        <p class="number-name">数字 "${this.currentNumber}"</p>
                        <button class="speak-btn" id="speak-number">🔊 听发音</button>
                    </div>
                </div>

                <div class="find-number-game">
                    <h4>找数字游戏</h4>
                    <p>在下面找出数字 ${this.currentNumber}</p>
                    <div class="number-search">
                        ${this.generateSearchNumbers()}
                    </div>
                </div>

                <div class="navigation">
                    <button class="nav-btn prev-btn" ${this.currentNumber <= 1 ? 'disabled' : ''}>← 上一个</button>
                    <button class="nav-btn next-btn" ${this.currentNumber >= this.maxNumber ? 'disabled' : ''}>下一个 →</button>
                </div>
            </div>
        `;
    }

    /**
     * 数量对应内容
     */
    getCountingContent() {
        return `
            <div class="counting-exercise">
                <div class="counting-display">
                    <h3>数字 ${this.currentNumber} 对应的数量</h3>
                    <div class="objects-display">
                        ${this.generateCountingObjects()}
                    </div>
                </div>

                <div class="counting-question">
                    <h4>数一数有几个？</h4>
                    <div class="counting-options">
                        ${this.generateCountingOptions()}
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * 生成搜索数字
     */
    generateSearchNumbers() {
        const numbers = [];
        const target = this.currentNumber;
        
        // 添加目标数字
        numbers.push(target, target);
        
        // 添加干扰数字
        for (let i = 0; i < 10; i++) {
            let num;
            do {
                num = Math.floor(Math.random() * this.maxNumber) + 1;
            } while (num === target);
            numbers.push(num);
        }
        
        // 打乱顺序
        numbers.sort(() => Math.random() - 0.5);
        
        return numbers.map(num => `
            <button class="search-number ${num === target ? 'target' : ''}" data-number="${num}">
                ${num}
            </button>
        `).join('');
    }

    /**
     * 生成计数物品
     */
    generateCountingObjects() {
        const objects = ['🍎', '⭐', '🎈', '🌸', '🎾'];
        const selectedObject = objects[this.currentNumber % objects.length];
        let html = '';

        for (let i = 0; i < this.currentNumber; i++) {
            html += `<span class="counting-object animate-scale animate-delay-${(i % 4) + 1}">${selectedObject}</span>`;
        }

        return html;
    }

    /**
     * 生成计数选项
     */
    generateCountingOptions() {
        const options = [this.currentNumber];
        
        // 添加错误选项
        for (let i = 0; i < 3; i++) {
            let wrong;
            do {
                wrong = Math.max(1, this.currentNumber + Math.floor(Math.random() * 6) - 3);
            } while (options.includes(wrong) || wrong > this.maxNumber);
            options.push(wrong);
        }
        
        // 打乱顺序
        options.sort(() => Math.random() - 0.5);
        
        return options.map(num => `
            <button class="counting-option" data-answer="${num}">${num}</button>
        `).join('');
    }

    /**
     * 绑定事件
     */
    bindEvents() {
        // 练习类型切换
        document.querySelectorAll('.exercise-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchExercise(e.currentTarget.dataset.exercise);
            });
        });

        // 数字选择
        document.querySelectorAll('.number-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectNumber(parseInt(e.currentTarget.dataset.number));
            });
        });

        // 发音按钮
        document.getElementById('speak-number')?.addEventListener('click', () => {
            AudioManager.getInstance().speakNumber(this.currentNumber);
        });

        // 导航按钮
        document.querySelector('.prev-btn')?.addEventListener('click', () => {
            if (this.currentNumber > 1) {
                this.selectNumber(this.currentNumber - 1);
            }
        });

        document.querySelector('.next-btn')?.addEventListener('click', () => {
            if (this.currentNumber < this.maxNumber) {
                this.selectNumber(this.currentNumber + 1);
            }
        });

        // 搜索游戏
        document.querySelectorAll('.search-number').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleSearchClick(e.target);
            });
        });

        // 计数游戏
        document.querySelectorAll('.counting-option').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleCountingClick(e.target);
            });
        });
    }

    /**
     * 切换练习类型
     */
    switchExercise(exerciseType) {
        this.currentExercise = exerciseType;
        
        // 更新按钮状态
        document.querySelectorAll('.exercise-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.exercise === exerciseType);
        });

        // 重新渲染练习内容
        const exerciseArea = document.getElementById('exercise-area');
        exerciseArea.innerHTML = this.getExerciseContent();
        
        // 重新绑定事件
        this.bindEvents();
        
        this.app.playSound('click');
        this.saveProgress();
    }

    /**
     * 选择数字
     */
    selectNumber(number) {
        this.currentNumber = number;
        
        // 更新数字按钮状态
        document.querySelectorAll('.number-btn').forEach(btn => {
            btn.classList.toggle('selected', parseInt(btn.dataset.number) === number);
        });

        // 重新渲染练习内容
        const exerciseArea = document.getElementById('exercise-area');
        exerciseArea.innerHTML = this.getExerciseContent();
        
        // 重新绑定事件
        this.bindEvents();

        this.app.playSound('number-pop');
        
        // 延迟读数字
        setTimeout(() => {
            AudioManager.getInstance().speakNumber(number);
        }, 300);

        this.saveProgress();
    }

    /**
     * 处理搜索点击
     */
    handleSearchClick(button) {
        const number = parseInt(button.dataset.number);
        
        if (number === this.currentNumber) {
            button.classList.add('correct', 'animate-correct');
            button.textContent = '✓';
            this.app.playSound('correct');
            this.app.addStars(1);
            
            // 检查是否全部找到
            const remaining = document.querySelectorAll('.search-number.target:not(.correct)');
            if (remaining.length === 0) {
                setTimeout(() => {
                    this.app.showToast('太棒了！全部找到了！', 'success');
                }, 500);
            }
        } else {
            button.classList.add('wrong', 'animate-shake');
            this.app.playSound('wrong');
            
            setTimeout(() => {
                button.classList.remove('wrong', 'animate-shake');
            }, 600);
        }
        
        button.disabled = true;
    }

    /**
     * 处理计数点击
     */
    handleCountingClick(button) {
        const answer = parseInt(button.dataset.answer);
        
        if (answer === this.currentNumber) {
            button.classList.add('correct');
            this.app.playSound('correct');
            this.app.addStars(2);
            this.app.showToast('答对了！', 'success');
            
            // 禁用所有选项
            document.querySelectorAll('.counting-option').forEach(btn => {
                btn.disabled = true;
            });
        } else {
            button.classList.add('wrong', 'animate-shake');
            this.app.playSound('wrong');
            
            setTimeout(() => {
                button.classList.remove('wrong', 'animate-shake');
            }, 600);
        }
    }

    /**
     * 获取进度
     */
    getProgress() {
        // 简单的进度计算：基于当前数字
        this.progress.current = Math.min(this.currentNumber, this.maxNumber);
        return this.progress;
    }

    /**
     * 加载进度
     */
    loadProgress() {
        try {
            if (typeof StorageManager !== 'undefined' && StorageManager.getModuleProgress) {
                const saved = StorageManager.getModuleProgress('numbers');
                if (saved) {
                    this.currentNumber = saved.currentNumber || 1;
                    this.currentExercise = saved.currentExercise || 'recognition';
                    this.progress = saved.progress || this.progress;
                }
            }
        } catch (error) {
            console.warn('加载数字进度失败:', error);
        }
    }

    /**
     * 保存进度
     */
    saveProgress() {
        try {
            if (typeof StorageManager !== 'undefined' && StorageManager.updateModuleProgress) {
                const progress = this.getProgress();
                StorageManager.updateModuleProgress('numbers', progress.current, progress.total);
            }
        } catch (error) {
            console.warn('保存数字进度失败:', error);
        }
    }
}

// 导出
window.NumbersModule = NumbersModule; 
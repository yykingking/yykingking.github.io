/**
 * 加减法运算模块
 * 帮助一年级学生学习10以内加减法
 */

class ArithmeticModule {
    constructor(app) {
        this.app = app;
        this.operationType = 'addition'; // addition, subtraction
        this.currentProblem = null;
        this.correctAnswers = 0;
        this.totalProblems = 0;
        this.progress = { current: 0, total: 20 };
        
        this.loadProgress();
    }

    /**
     * 渲染模块内容
     */
    async render() {
        const container = document.getElementById('module-content');
        if (!container) return;

        container.innerHTML = `
            <div class="arithmetic-module">
                <div class="operation-selector">
                    <h3>选择运算类型</h3>
                    <div class="operation-buttons">
                        <button class="operation-btn ${this.operationType === 'addition' ? 'active' : ''}" 
                                data-operation="addition">
                            ➕ 加法
                        </button>
                        <button class="operation-btn ${this.operationType === 'subtraction' ? 'active' : ''}" 
                                data-operation="subtraction">
                            ➖ 减法
                        </button>
                    </div>
                </div>

                <div class="practice-area" id="practice-area">
                    ${this.generateProblem()}
                </div>

                <div class="statistics">
                    <div class="stat-item">
                        <span>正确: <span id="correct-count">${this.correctAnswers}</span></span>
                    </div>
                    <div class="stat-item">
                        <span>总数: <span id="total-count">${this.totalProblems}</span></span>
                    </div>
                </div>
            </div>
        `;

        this.bindEvents();
    }

    /**
     * 生成算术题
     */
    generateProblem() {
        let a, b, result, operator;

        if (this.operationType === 'addition') {
            a = Math.floor(Math.random() * 5) + 1;
            b = Math.floor(Math.random() * (10 - a)) + 1;
            result = a + b;
            operator = '+';
        } else {
            a = Math.floor(Math.random() * 8) + 2;
            b = Math.floor(Math.random() * a) + 1;
            result = a - b;
            operator = '-';
        }

        this.currentProblem = { a, b, result, operator };

        return `
            <div class="math-problem">
                <div class="equation">
                    <span class="number">${a}</span>
                    <span class="operator">${operator}</span>
                    <span class="number">${b}</span>
                    <span class="equals">=</span>
                    <span class="result">?</span>
                </div>

                <div class="answer-options">
                    ${this.generateAnswerOptions(result)}
                </div>

                <div class="controls">
                    <button id="new-problem">下一题</button>
                    <button id="speak-problem">🔊 读题</button>
                </div>
            </div>
        `;
    }

    /**
     * 生成答案选项
     */
    generateAnswerOptions(correctAnswer) {
        const options = [correctAnswer];
        
        for (let i = 0; i < 3; i++) {
            let wrongAnswer;
            do {
                wrongAnswer = Math.max(0, correctAnswer + Math.floor(Math.random() * 6) - 3);
            } while (options.includes(wrongAnswer));
            options.push(wrongAnswer);
        }

        options.sort(() => Math.random() - 0.5);

        return options.map(option => `
            <button class="answer-option" data-answer="${option}">
                ${option}
            </button>
        `).join('');
    }

    /**
     * 绑定事件
     */
    bindEvents() {
        // 操作类型切换
        document.querySelectorAll('.operation-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchOperation(e.currentTarget.dataset.operation);
            });
        });

        // 答案选项
        document.querySelectorAll('.answer-option').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleAnswer(parseInt(e.target.dataset.answer), e.target);
            });
        });

        // 控制按钮
        document.getElementById('new-problem')?.addEventListener('click', () => {
            this.generateNewProblem();
        });

        document.getElementById('speak-problem')?.addEventListener('click', () => {
            this.speakProblem();
        });
    }

    /**
     * 切换运算类型
     */
    switchOperation(operation) {
        this.operationType = operation;
        
        document.querySelectorAll('.operation-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.operation === operation);
        });

        this.generateNewProblem();
        this.app.playSound('click');
        this.saveProgress();
    }

    /**
     * 生成新题目
     */
    generateNewProblem() {
        const practiceArea = document.getElementById('practice-area');
        if (practiceArea) {
            practiceArea.innerHTML = this.generateProblem();
            this.bindEvents();
        }
    }

    /**
     * 处理答案
     */
    handleAnswer(answer, button) {
        this.totalProblems++;
        const isCorrect = answer === this.currentProblem.result;

        if (isCorrect) {
            this.correctAnswers++;
            button.classList.add('correct');
            this.app.playSound('correct');
            this.app.addStars(2);
            this.app.showToast('答对了！', 'success');
        } else {
            button.classList.add('wrong', 'animate-shake');
            this.app.playSound('wrong');
            setTimeout(() => {
                button.classList.remove('wrong', 'animate-shake');
            }, 600);
        }

        this.updateStatistics();
        this.saveProgress();

        // 禁用所有按钮
        document.querySelectorAll('.answer-option').forEach(btn => {
            btn.disabled = true;
        });

        // 显示正确答案
        document.querySelector('.result').textContent = this.currentProblem.result;

        // 延迟生成新题
        setTimeout(() => {
            this.generateNewProblem();
        }, 2000);
    }

    /**
     * 读题
     */
    speakProblem() {
        if (!this.currentProblem) return;

        const { a, b, operator } = this.currentProblem;
        const audioManager = AudioManager.getInstance();

        if (operator === '+') {
            audioManager.speakAddition(a, b, a + b);
        } else {
            audioManager.speakSubtraction(a, b, a - b);
        }
    }

    /**
     * 更新统计
     */
    updateStatistics() {
        document.getElementById('correct-count').textContent = this.correctAnswers;
        document.getElementById('total-count').textContent = this.totalProblems;
    }

    /**
     * 获取进度
     */
    getProgress() {
        this.progress.current = Math.min(this.totalProblems, this.progress.total);
        return this.progress;
    }

    /**
     * 加载进度
     */
    loadProgress() {
        try {
            if (typeof StorageManager !== 'undefined' && StorageManager.getModuleProgress) {
                const saved = StorageManager.getModuleProgress('arithmetic');
                if (saved) {
                    this.operationType = saved.operationType || 'addition';
                    this.correctAnswers = saved.correctAnswers || 0;
                    this.totalProblems = saved.totalProblems || 0;
                    this.progress = saved.progress || this.progress;
                }
            }
        } catch (error) {
            console.warn('加载算术进度失败:', error);
        }
    }

    /**
     * 保存进度
     */
    saveProgress() {
        try {
            if (typeof StorageManager !== 'undefined' && StorageManager.updateModuleProgress) {
                const progress = this.getProgress();
                StorageManager.updateModuleProgress('arithmetic', progress.current, progress.total);
            }
        } catch (error) {
            console.warn('保存算术进度失败:', error);
        }
    }
}

// 导出
window.ArithmeticModule = ArithmeticModule; 
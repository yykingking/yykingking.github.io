/**
 * 图形认知模块
 * 帮助学生认识基本图形
 */

class ShapesModule {
    constructor(app) {
        this.app = app;
        this.shapes = [
            { name: '圆形', icon: '🔵', color: '#2196F3' },
            { name: '三角形', icon: '🔺', color: '#FF9800' },
            { name: '正方形', icon: '🟦', color: '#4CAF50' },
            { name: '长方形', icon: '▬', color: '#9C27B0' }
        ];
        this.currentShape = 0;
        this.progress = { current: 0, total: 4 };
        
        this.loadProgress();
    }

    async render() {
        const container = document.getElementById('module-content');
        if (!container) return;

        container.innerHTML = `
            <div class="shapes-module">
                <div class="shape-selector">
                    <h3>选择图形</h3>
                    <div class="shape-buttons">
                        ${this.shapes.map((shape, index) => `
                            <button class="shape-btn ${index === this.currentShape ? 'active' : ''}" 
                                    data-shape="${index}">
                                <span class="shape-icon">${shape.icon}</span>
                                <span class="shape-name">${shape.name}</span>
                            </button>
                        `).join('')}
                    </div>
                </div>

                <div class="shape-display">
                    ${this.getShapeContent()}
                </div>

                <div class="shape-game">
                    <h3>找图形游戏</h3>
                    <p>找出所有的 ${this.shapes[this.currentShape].name}</p>
                    <div class="game-area">
                        ${this.generateShapeGame()}
                    </div>
                </div>
            </div>
        `;

        this.bindEvents();
    }

    getShapeContent() {
        const shape = this.shapes[this.currentShape];
        return `
            <div class="shape-info">
                <div class="big-shape" style="color: ${shape.color};">
                    ${shape.icon}
                </div>
                <h2>${shape.name}</h2>
                <button class="speak-shape">🔊 听发音</button>
                <div class="shape-features">
                    ${this.getShapeFeatures(this.currentShape)}
                </div>
            </div>
        `;
    }

    getShapeFeatures(shapeIndex) {
        const features = [
            ['没有角', '是圆的'],
            ['有三个角', '有三条边'],
            ['有四个角', '四条边一样长'],
            ['有四个角', '对边一样长']
        ];
        
        return features[shapeIndex].map(feature => 
            `<div class="feature">${feature}</div>`
        ).join('');
    }

    generateShapeGame() {
        const targetShape = this.shapes[this.currentShape];
        const allShapes = [...this.shapes];
        const gameShapes = [];
        
        // 添加目标图形
        for (let i = 0; i < 3; i++) {
            gameShapes.push({ ...targetShape, isTarget: true });
        }
        
        // 添加干扰图形
        for (let i = 0; i < 6; i++) {
            const randomShape = allShapes[Math.floor(Math.random() * allShapes.length)];
            gameShapes.push({ ...randomShape, isTarget: randomShape.name === targetShape.name });
        }
        
        // 打乱顺序
        gameShapes.sort(() => Math.random() - 0.5);
        
        return gameShapes.map((shape, index) => `
            <button class="game-shape ${shape.isTarget ? 'target' : ''}" 
                    data-correct="${shape.isTarget}" 
                    data-index="${index}">
                ${shape.icon}
            </button>
        `).join('');
    }

    bindEvents() {
        // 图形选择
        document.querySelectorAll('.shape-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectShape(parseInt(e.currentTarget.dataset.shape));
            });
        });

        // 发音按钮
        document.querySelector('.speak-shape')?.addEventListener('click', () => {
            const shape = this.shapes[this.currentShape];
            AudioManager.getInstance().speak(shape.name);
        });

        // 游戏图形点击
        document.querySelectorAll('.game-shape').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleShapeClick(e.target);
            });
        });
    }

    selectShape(shapeIndex) {
        this.currentShape = shapeIndex;
        
        // 更新按钮状态
        document.querySelectorAll('.shape-btn').forEach((btn, index) => {
            btn.classList.toggle('active', index === shapeIndex);
        });

        // 更新显示内容
        document.querySelector('.shape-display').innerHTML = this.getShapeContent();
        document.querySelector('.game-area').innerHTML = this.generateShapeGame();
        
        // 重新绑定事件
        this.bindEvents();
        
        this.app.playSound('click');
        this.saveProgress();
    }

    handleShapeClick(button) {
        const isCorrect = button.dataset.correct === 'true';
        
        if (isCorrect) {
            button.classList.add('correct');
            button.textContent = '✓';
            this.app.playSound('correct');
            this.app.addStars(1);
        } else {
            button.classList.add('wrong', 'animate-shake');
            this.app.playSound('wrong');
            setTimeout(() => {
                button.classList.remove('wrong', 'animate-shake');
            }, 600);
        }
        
        button.disabled = true;
    }

    getProgress() {
        this.progress.current = this.currentShape + 1;
        return this.progress;
    }

    loadProgress() {
        try {
            if (typeof StorageManager !== 'undefined' && StorageManager.getModuleProgress) {
                const saved = StorageManager.getModuleProgress('shapes');
                if (saved) {
                    this.currentShape = saved.currentShape || 0;
                    this.progress = saved.progress || this.progress;
                }
            }
        } catch (error) {
            console.warn('加载图形进度失败:', error);
        }
    }

    saveProgress() {
        const progressData = {
            currentShape: this.currentShape,
            progress: this.getProgress()
        };
        
        StorageManager.saveModuleProgress('shapes', progressData);
    }
}

window.ShapesModule = ShapesModule; 
/**
 * 比较概念模块
 * 帮助学生学习大小、多少、长短等比较概念
 */

class ComparisonModule {
    constructor(app) {
        this.app = app;
        this.comparisonTypes = [
            { name: '大小比较', icon: '📏', type: 'size' },
            { name: '多少比较', icon: '🔢', type: 'quantity' },
            { name: '长短比较', icon: '📐', type: 'length' },
            { name: '高矮比较', icon: '📊', type: 'height' }
        ];
        this.currentType = 0;
        this.progress = { current: 0, total: 4 };
        
        this.loadProgress();
    }

    async render() {
        const container = document.getElementById('module-content');
        if (!container) return;

        container.innerHTML = `
            <div class="comparison-module">
                <div class="type-selector">
                    <h3>选择比较类型</h3>
                    <div class="type-buttons">
                        ${this.comparisonTypes.map((type, index) => `
                            <button class="type-btn ${index === this.currentType ? 'active' : ''}" 
                                    data-type="${index}">
                                <span class="type-icon">${type.icon}</span>
                                <span class="type-name">${type.name}</span>
                            </button>
                        `).join('')}
                    </div>
                </div>

                <div class="comparison-display">
                    ${this.getComparisonContent()}
                </div>

                <div class="comparison-game">
                    <h3>比较游戏</h3>
                    <div id="game-area">
                        ${this.generateComparisonGame()}
                    </div>
                </div>
            </div>
        `;

        this.bindEvents();
    }

    getComparisonContent() {
        const type = this.comparisonTypes[this.currentType];
        return `
            <div class="comparison-demo">
                <h3>${type.name}</h3>
                <div class="demo-area">
                    ${this.generateDemo(type.type)}
                </div>
                <button class="speak-comparison">🔊 听说明</button>
            </div>
        `;
    }

    generateDemo(comparisonType) {
        switch (comparisonType) {
            case 'size':
                return `
                    <div class="size-demo">
                        <div class="item large">🐘</div>
                        <div class="comparison-word">大</div>
                        <div class="item small">🐭</div>
                        <div class="comparison-word">小</div>
                    </div>
                `;
            case 'quantity':
                return `
                    <div class="quantity-demo">
                        <div class="group">
                            <div class="items">🍎🍎🍎🍎🍎</div>
                            <div class="label">多</div>
                        </div>
                        <div class="group">
                            <div class="items">🍎🍎</div>
                            <div class="label">少</div>
                        </div>
                    </div>
                `;
            case 'length':
                return `
                    <div class="length-demo">
                        <div class="line long"></div>
                        <div class="label">长</div>
                        <div class="line short"></div>
                        <div class="label">短</div>
                    </div>
                `;
            case 'height':
                return `
                    <div class="height-demo">
                        <div class="tower tall">🏢</div>
                        <div class="label">高</div>
                        <div class="tower short">🏠</div>
                        <div class="label">矮</div>
                    </div>
                `;
            default:
                return '';
        }
    }

    generateComparisonGame() {
        const type = this.comparisonTypes[this.currentType].type;
        
        switch (type) {
            case 'size':
                return this.generateSizeGame();
            case 'quantity':
                return this.generateQuantityGame();
            case 'length':
                return this.generateLengthGame();
            case 'height':
                return this.generateHeightGame();
            default:
                return '';
        }
    }

    generateSizeGame() {
        const items = ['🐘', '🐭', '🐶', '🐱'];
        const sizes = ['large', 'small', 'medium', 'small'];
        
        return `
            <div class="size-game">
                <p>点击最大的动物：</p>
                <div class="game-items">
                    ${items.map((item, index) => `
                        <button class="game-item ${sizes[index]}" 
                                data-size="${sizes[index]}" 
                                data-correct="${sizes[index] === 'large'}">
                            ${item}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
    }

    generateQuantityGame() {
        const groups = [
            { items: '🍎🍎🍎🍎🍎', count: 5 },
            { items: '🍎🍎', count: 2 },
            { items: '🍎🍎🍎', count: 3 },
            { items: '🍎', count: 1 }
        ];
        
        const maxCount = Math.max(...groups.map(g => g.count));
        
        return `
            <div class="quantity-game">
                <p>点击数量最多的一组：</p>
                <div class="game-groups">
                    ${groups.map((group, index) => `
                        <button class="game-group" 
                                data-count="${group.count}" 
                                data-correct="${group.count === maxCount}">
                            <div class="group-items">${group.items}</div>
                            <div class="group-count">${group.count}个</div>
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
    }

    generateLengthGame() {
        const lengths = [
            { width: '200px', label: '长', isLongest: true },
            { width: '100px', label: '短', isLongest: false },
            { width: '150px', label: '中', isLongest: false },
            { width: '80px', label: '很短', isLongest: false }
        ];
        
        return `
            <div class="length-game">
                <p>点击最长的线：</p>
                <div class="game-lines">
                    ${lengths.map((length, index) => `
                        <button class="game-line" data-correct="${length.isLongest}">
                            <div class="line" style="width: ${length.width}; height: 10px; background: #4CAF50;"></div>
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
    }

    generateHeightGame() {
        const heights = [
            { height: '100px', emoji: '🏢', isTallest: true },
            { height: '60px', emoji: '🏠', isTallest: false },
            { height: '80px', emoji: '🏪', isTallest: false },
            { height: '40px', emoji: '⛺', isTallest: false }
        ];
        
        return `
            <div class="height-game">
                <p>点击最高的建筑：</p>
                <div class="game-buildings">
                    ${heights.map((building, index) => `
                        <button class="game-building" data-correct="${building.isTallest}">
                            <div style="height: ${building.height}; display: flex; align-items: end; font-size: 2rem;">
                                ${building.emoji}
                            </div>
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
    }

    bindEvents() {
        // 类型选择
        document.querySelectorAll('.type-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectType(parseInt(e.currentTarget.dataset.type));
            });
        });

        // 发音按钮
        document.querySelector('.speak-comparison')?.addEventListener('click', () => {
            this.speakComparison();
        });

        // 游戏项目点击
        document.querySelectorAll('[data-correct]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleGameClick(e.currentTarget);
            });
        });
    }

    selectType(typeIndex) {
        this.currentType = typeIndex;
        
        // 更新按钮状态
        document.querySelectorAll('.type-btn').forEach((btn, index) => {
            btn.classList.toggle('active', index === typeIndex);
        });

        // 更新显示内容
        document.querySelector('.comparison-display').innerHTML = this.getComparisonContent();
        document.querySelector('#game-area').innerHTML = this.generateComparisonGame();
        
        // 重新绑定事件
        this.bindEvents();
        
        this.app.playSound('click');
        this.saveProgress();
    }

    speakComparison() {
        const type = this.comparisonTypes[this.currentType];
        const explanations = {
            'size': '大小比较：大象很大，老鼠很小',
            'quantity': '多少比较：这一组有很多，那一组有很少',
            'length': '长短比较：这条线很长，那条线很短',
            'height': '高矮比较：大楼很高，房子比较矮'
        };
        
        const text = explanations[type.type] || type.name;
        AudioManager.getInstance().speak(text);
    }

    handleGameClick(button) {
        const isCorrect = button.dataset.correct === 'true';
        
        if (isCorrect) {
            button.classList.add('correct');
            this.app.playSound('correct');
            this.app.addStars(2);
            this.app.showToast('答对了！', 'success');
            
            // 禁用所有按钮
            document.querySelectorAll('[data-correct]').forEach(btn => {
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

    getProgress() {
        this.progress.current = this.currentType + 1;
        return this.progress;
    }

    loadProgress() {
        try { if (typeof StorageManager !== 'undefined' && StorageManager.getModuleProgress) { const saved = StorageManager.getModuleProgress('comparison');
        if (saved) {
            this.currentType = saved.currentType || 0;
            this.progress = saved.progress || this.progress;
        }
    }

    saveProgress() {
        const progressData = {
            currentType: this.currentType,
            progress: this.getProgress()
        };
        
        StorageManager.saveModuleProgress('comparison', progressData);
    }
}

window.ComparisonModule = ComparisonModule; 
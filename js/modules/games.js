/**
 * 趣味游戏模块
 * 各种寓教于乐的数学游戏
 */

class GamesModule {
    constructor(app) {
        this.app = app;
        this.games = [
            { name: '数字连连看', type: 'number-match', icon: '🔗' },
            { name: '小商店', type: 'shop', icon: '🏪' },
            { name: '图形拼拼乐', type: 'shape-puzzle', icon: '🧩' },
            { name: '比较大作战', type: 'comparison-battle', icon: '⚔️' }
        ];
        this.currentGame = 0;
        this.gameState = {};
        this.progress = { current: 0, total: 4 };
        
        this.loadProgress();
    }

    async render() {
        const container = document.getElementById('module-content');
        if (!container) return;

        container.innerHTML = `
            <div class="games-module">
                <div class="game-selector">
                    <h3>选择游戏</h3>
                    <div class="game-buttons">
                        ${this.games.map((game, index) => `
                            <button class="game-btn ${index === this.currentGame ? 'active' : ''}" 
                                    data-game="${index}">
                                <span class="game-icon">${game.icon}</span>
                                <span class="game-name">${game.name}</span>
                            </button>
                        `).join('')}
                    </div>
                </div>

                <div class="game-area" id="game-area">
                    ${this.renderCurrentGame()}
                </div>
            </div>
        `;

        this.bindEvents();
    }

    renderCurrentGame() {
        const game = this.games[this.currentGame];
        
        switch (game.type) {
            case 'number-match':
                return this.renderNumberMatchGame();
            case 'shop':
                return this.renderShopGame();
            case 'shape-puzzle':
                return this.renderShapePuzzleGame();
            case 'comparison-battle':
                return this.renderComparisonBattleGame();
            default:
                return '<p>游戏加载中...</p>';
        }
    }

    renderNumberMatchGame() {
        // 生成配对数字
        const numbers = [1, 2, 3, 4, 5];
        const cards = [];
        
        numbers.forEach(num => {
            cards.push({ type: 'number', value: num, id: `num-${num}` });
            cards.push({ type: 'dots', value: num, id: `dots-${num}` });
        });
        
        // 打乱顺序
        cards.sort(() => Math.random() - 0.5);
        
        return `
            <div class="number-match-game">
                <h3>数字连连看</h3>
                <p>找到数字和对应数量的点点</p>
                <div class="match-grid">
                    ${cards.map(card => `
                        <button class="match-card" 
                                data-type="${card.type}" 
                                data-value="${card.value}"
                                data-id="${card.id}">
                            ${card.type === 'number' ? card.value : '•'.repeat(card.value)}
                        </button>
                    `).join('')}
                </div>
                <div class="game-status">
                    <span>已配对: <span id="matched-count">0</span>/5</span>
                </div>
            </div>
        `;
    }

    renderShopGame() {
        const items = [
            { name: '苹果', price: 2, emoji: '🍎' },
            { name: '香蕉', price: 1, emoji: '🍌' },
            { name: '橙子', price: 3, emoji: '🍊' },
            { name: '西瓜', price: 5, emoji: '🍉' }
        ];
        
        return `
            <div class="shop-game">
                <h3>小商店</h3>
                <p>你有10元钱，买东西练习加减法</p>
                
                <div class="wallet">
                    <span>💰 余额: <span id="money">10</span>元</span>
                </div>
                
                <div class="shop-items">
                    ${items.map(item => `
                        <div class="shop-item">
                            <div class="item-display">
                                <div class="item-emoji">${item.emoji}</div>
                                <div class="item-name">${item.name}</div>
                                <div class="item-price">${item.price}元</div>
                            </div>
                            <button class="buy-btn" data-price="${item.price}" data-name="${item.name}">
                                购买
                            </button>
                        </div>
                    `).join('')}
                </div>
                
                <div class="cart">
                    <h4>购物车</h4>
                    <div id="cart-items">空</div>
                    <button id="reset-shop">重新开始</button>
                </div>
            </div>
        `;
    }

    renderShapePuzzleGame() {
        const shapes = ['🔵', '🔺', '🟦', '🟫'];
        const pattern = [0, 1, 2, 0, 1, 2]; // 模式序列
        
        return `
            <div class="shape-puzzle-game">
                <h3>图形拼拼乐</h3>
                <p>按照模式继续排列图形</p>
                
                <div class="pattern-display">
                    <h4>模式：</h4>
                    <div class="pattern">
                        ${pattern.map(shapeIndex => `
                            <span class="pattern-shape">${shapes[shapeIndex]}</span>
                        `).join('')}
                        <span class="pattern-shape question">?</span>
                    </div>
                </div>
                
                <div class="shape-options">
                    <h4>选择下一个图形：</h4>
                    ${shapes.map((shape, index) => `
                        <button class="shape-option" data-shape="${index}">
                            ${shape}
                        </button>
                    `).join('')}
                </div>
                
                <div class="puzzle-score">
                    <span>正确: <span id="puzzle-score">0</span></span>
                </div>
            </div>
        `;
    }

    renderComparisonBattleGame() {
        const generateBattle = () => {
            const a = Math.floor(Math.random() * 10) + 1;
            const b = Math.floor(Math.random() * 10) + 1;
            return { a, b };
        };
        
        const battle = generateBattle();
        
        return `
            <div class="comparison-battle-game">
                <h3>比较大作战</h3>
                <p>选择正确的比较符号</p>
                
                <div class="battle-arena">
                    <div class="battle-number left">${battle.a}</div>
                    <div class="battle-operators">
                        <button class="operator-btn" data-operator=">" data-correct="${battle.a > battle.b}">></button>
                        <button class="operator-btn" data-operator="=" data-correct="${battle.a === battle.b}">=</button>
                        <button class="operator-btn" data-operator="<" data-correct="${battle.a < battle.b}"><</button>
                    </div>
                    <div class="battle-number right">${battle.b}</div>
                </div>
                
                <div class="battle-score">
                    <span>得分: <span id="battle-score">0</span></span>
                    <button id="next-battle">下一轮</button>
                </div>
            </div>
        `;
    }

    bindEvents() {
        // 游戏选择
        document.querySelectorAll('.game-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectGame(parseInt(e.currentTarget.dataset.game));
            });
        });

        // 数字连连看事件
        this.bindNumberMatchEvents();
        
        // 小商店事件
        this.bindShopEvents();
        
        // 图形拼拼乐事件
        this.bindShapePuzzleEvents();
        
        // 比较大作战事件
        this.bindComparisonBattleEvents();
    }

    bindNumberMatchEvents() {
        const cards = document.querySelectorAll('.match-card');
        let selectedCard = null;
        let matchedPairs = 0;
        
        cards.forEach(card => {
            card.addEventListener('click', (e) => {
                const clickedCard = e.target;
                
                if (clickedCard.classList.contains('matched') || clickedCard.classList.contains('selected')) {
                    return;
                }
                
                if (!selectedCard) {
                    selectedCard = clickedCard;
                    clickedCard.classList.add('selected');
                } else {
                    const value1 = parseInt(selectedCard.dataset.value);
                    const value2 = parseInt(clickedCard.dataset.value);
                    
                    if (value1 === value2 && selectedCard.dataset.type !== clickedCard.dataset.type) {
                        // 配对成功
                        selectedCard.classList.add('matched');
                        clickedCard.classList.add('matched');
                        matchedPairs++;
                        
                        this.app.playSound('correct');
                        this.app.addStars(1);
                        
                        document.getElementById('matched-count').textContent = matchedPairs;
                        
                        if (matchedPairs === 5) {
                            setTimeout(() => {
                                this.app.showToast('恭喜完成！', 'success');
                            }, 500);
                        }
                    } else {
                        // 配对失败
                        this.app.playSound('wrong');
                        setTimeout(() => {
                            selectedCard.classList.remove('selected');
                        }, 1000);
                    }
                    
                    selectedCard = null;
                }
            });
        });
    }

    bindShopEvents() {
        let money = 10;
        const cartItems = [];
        
        document.querySelectorAll('.buy-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const price = parseInt(e.target.dataset.price);
                const name = e.target.dataset.name;
                
                if (money >= price) {
                    money -= price;
                    cartItems.push({ name, price });
                    
                    document.getElementById('money').textContent = money;
                    this.updateCart(cartItems);
                    
                    this.app.playSound('correct');
                    this.app.addStars(1);
                } else {
                    this.app.playSound('wrong');
                    this.app.showToast('钱不够了！', 'error');
                }
            });
        });
        
        document.getElementById('reset-shop')?.addEventListener('click', () => {
            money = 10;
            cartItems.length = 0;
            document.getElementById('money').textContent = money;
            this.updateCart(cartItems);
        });
    }

    updateCart(cartItems) {
        const cartContainer = document.getElementById('cart-items');
        if (cartItems.length === 0) {
            cartContainer.textContent = '空';
        } else {
            cartContainer.innerHTML = cartItems.map(item => 
                `<div>${item.name} - ${item.price}元</div>`
            ).join('');
        }
    }

    bindShapePuzzleEvents() {
        const pattern = [0, 1, 2]; // 简化模式
        let currentIndex = 0;
        let score = 0;
        
        document.querySelectorAll('.shape-option').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const selectedShape = parseInt(e.target.dataset.shape);
                const correctShape = pattern[currentIndex % pattern.length];
                
                if (selectedShape === correctShape) {
                    score++;
                    currentIndex++;
                    this.app.playSound('correct');
                    this.app.addStars(1);
                    document.getElementById('puzzle-score').textContent = score;
                } else {
                    this.app.playSound('wrong');
                }
            });
        });
    }

    bindComparisonBattleEvents() {
        let score = 0;
        
        document.querySelectorAll('.operator-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const isCorrect = e.target.dataset.correct === 'true';
                
                if (isCorrect) {
                    score++;
                    this.app.playSound('correct');
                    this.app.addStars(2);
                    document.getElementById('battle-score').textContent = score;
                    
                    // 禁用所有按钮
                    document.querySelectorAll('.operator-btn').forEach(b => b.disabled = true);
                } else {
                    this.app.playSound('wrong');
                }
            });
        });
        
        document.getElementById('next-battle')?.addEventListener('click', () => {
            // 重新渲染游戏
            const gameArea = document.getElementById('game-area');
            gameArea.innerHTML = this.renderCurrentGame();
            this.bindEvents();
        });
    }

    selectGame(gameIndex) {
        this.currentGame = gameIndex;
        
        // 更新按钮状态
        document.querySelectorAll('.game-btn').forEach((btn, index) => {
            btn.classList.toggle('active', index === gameIndex);
        });

        // 重新渲染游戏
        const gameArea = document.getElementById('game-area');
        gameArea.innerHTML = this.renderCurrentGame();
        
        // 重新绑定事件
        this.bindEvents();
        
        this.app.playSound('click');
        this.saveProgress();
    }

    getProgress() {
        this.progress.current = this.currentGame + 1;
        return this.progress;
    }

    loadProgress() {
        try {
            if (typeof StorageManager !== 'undefined' && StorageManager.getModuleProgress) {
                const saved = StorageManager.getModuleProgress('games');
                if (saved) {
                    this.currentGame = saved.currentGame || 0;
                    this.gameState = saved.gameState || {};
                    this.progress = saved.progress || this.progress;
                }
            }
        } catch (error) {
            console.warn('加载游戏进度失败:', error);
        }
    }

    saveProgress() {
        try {
            if (typeof StorageManager !== 'undefined' && StorageManager.updateModuleProgress) {
                const progressData = {
                    currentGame: this.currentGame,
                    gameState: this.gameState,
                    progress: this.getProgress()
                };
                
                StorageManager.updateModuleProgress('games', this.currentGame + 1, this.games.length);
            }
        } catch (error) {
            console.warn('保存游戏进度失败:', error);
        }
    }
}

window.GamesModule = GamesModule; 
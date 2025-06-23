/**
 * 成就系统模块
 * 展示学习成果和激励机制
 */

class AchievementsModule {
    constructor(app) {
        this.app = app;
        this.achievements = [
            { id: 'first_star', name: '第一颗星', description: '获得第一颗星星', icon: '⭐', unlocked: false },
            { id: 'number_master', name: '数字达人', description: '完成所有数字认知', icon: '🔢', unlocked: false },
            { id: 'math_wizard', name: '算术小能手', description: '正确完成50道题', icon: '🧙‍♂️', unlocked: false },
            { id: 'shape_expert', name: '图形专家', description: '认识所有基本图形', icon: '🔺', unlocked: false },
            { id: 'game_champion', name: '游戏冠军', description: '完成所有趣味游戏', icon: '🏆', unlocked: false },
            { id: 'star_collector', name: '星星收集者', description: '收集100颗星星', icon: '🌟', unlocked: false }
        ];
        this.badges = [];
        this.milestones = [];
        
        this.loadAchievements();
        this.checkAchievements();
    }

    async render() {
        const container = document.getElementById('module-content');
        if (!container) return;

        container.innerHTML = `
            <div class="achievements-module">
                <div class="achievement-summary">
                    <h3>学习成果</h3>
                    <div class="summary-stats">
                        <div class="stat-card">
                            <div class="stat-icon">⭐</div>
                            <div class="stat-info">
                                <div class="stat-number">${this.app.totalStars}</div>
                                <div class="stat-label">获得星星</div>
                            </div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-icon">🎖️</div>
                            <div class="stat-info">
                                <div class="stat-number">${this.getUnlockedCount()}</div>
                                <div class="stat-label">解锁成就</div>
                            </div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-icon">📊</div>
                            <div class="stat-info">
                                <div class="stat-number">Lv.${this.app.userLevel}</div>
                                <div class="stat-label">当前等级</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="achievements-grid">
                    <h3>成就徽章</h3>
                    <div class="achievements-list">
                        ${this.achievements.map(achievement => `
                            <div class="achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}">
                                <div class="achievement-icon">${achievement.icon}</div>
                                <div class="achievement-info">
                                    <h4 class="achievement-name">${achievement.name}</h4>
                                    <p class="achievement-desc">${achievement.description}</p>
                                    <div class="achievement-status">
                                        ${achievement.unlocked ? 
                                            '<span class="status-unlocked">✅ 已解锁</span>' : 
                                            '<span class="status-locked">🔒 未解锁</span>'
                                        }
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="progress-tracking">
                    <h3>学习进度</h3>
                    <div class="progress-modules">
                        ${this.renderModuleProgress()}
                    </div>
                </div>

                <div class="recent-activities">
                    <h3>最近活动</h3>
                    <div class="activity-list">
                        ${this.renderRecentActivities()}
                    </div>
                </div>

                <div class="achievement-actions">
                    <button id="export-progress" class="action-btn">📊 导出学习报告</button>
                    <button id="share-achievement" class="action-btn">📤 分享成就</button>
                </div>
            </div>
        `;

        this.bindEvents();
    }

    renderModuleProgress() {
        const modules = ['numbers', 'arithmetic', 'shapes', 'comparison', 'games'];
        const moduleNames = {
            'numbers': '数字认知',
            'arithmetic': '加减法',
            'shapes': '图形认知', 
            'comparison': '比较概念',
            'games': '趣味游戏'
        };

        return modules.map(module => {
            const progress = StorageManager.getModuleProgress(module);
            const progressPercent = progress ? 
                Math.round((progress.progress?.current || 0) / (progress.progress?.total || 1) * 100) : 0;
            
            return `
                <div class="module-progress">
                    <div class="module-name">${moduleNames[module]}</div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progressPercent}%"></div>
                    </div>
                    <div class="progress-text">${progressPercent}%</div>
                </div>
            `;
        }).join('');
    }

    renderRecentActivities() {
        // 简化版本，显示一些示例活动
        const activities = [
            { time: '刚刚', activity: '完成数字认知练习', reward: '+2 ⭐' },
            { time: '5分钟前', activity: '答对加法题目', reward: '+1 ⭐' },
            { time: '10分钟前', activity: '识别了所有图形', reward: '+3 ⭐' },
            { time: '15分钟前', activity: '开始学习session', reward: '' }
        ];

        return activities.map(activity => `
            <div class="activity-item">
                <div class="activity-time">${activity.time}</div>
                <div class="activity-text">${activity.activity}</div>
                <div class="activity-reward">${activity.reward}</div>
            </div>
        `).join('');
    }

    bindEvents() {
        // 导出进度
        document.getElementById('export-progress')?.addEventListener('click', () => {
            this.exportProgress();
        });

        // 分享成就
        document.getElementById('share-achievement')?.addEventListener('click', () => {
            this.shareAchievement();
        });

        // 成就卡片点击音效
        document.querySelectorAll('.achievement-card').forEach(card => {
            card.addEventListener('click', () => {
                if (card.classList.contains('unlocked')) {
                    this.app.playSound('success');
                } else {
                    this.app.playSound('click');
                }
            });
        });
    }

    checkAchievements() {
        const userData = StorageManager.getUserData();
        if (!userData) return;

        // 检查第一颗星
        if (userData.totalStars >= 1) {
            this.unlockAchievement('first_star');
        }

        // 检查星星收集者
        if (userData.totalStars >= 100) {
            this.unlockAchievement('star_collector');
        }

        // 检查算术小能手
        const arithmeticProgress = StorageManager.getModuleProgress('arithmetic');
        if (arithmeticProgress && arithmeticProgress.totalProblems >= 50) {
            this.unlockAchievement('math_wizard');
        }

        // 检查数字达人
        const numbersProgress = StorageManager.getModuleProgress('numbers');
        if (numbersProgress && numbersProgress.currentNumber >= 20) {
            this.unlockAchievement('number_master');
        }

        // 检查图形专家
        const shapesProgress = StorageManager.getModuleProgress('shapes');
        if (shapesProgress && shapesProgress.currentShape >= 3) {
            this.unlockAchievement('shape_expert');
        }

        // 检查游戏冠军
        const gamesProgress = StorageManager.getModuleProgress('games');
        if (gamesProgress && gamesProgress.currentGame >= 3) {
            this.unlockAchievement('game_champion');
        }

        this.saveAchievements();
    }

    unlockAchievement(achievementId) {
        const achievement = this.achievements.find(a => a.id === achievementId);
        if (achievement && !achievement.unlocked) {
            achievement.unlocked = true;
            
            // 显示解锁动画和通知
            this.showAchievementUnlock(achievement);
            
            // 奖励星星
            this.app.addStars(5);
        }
    }

    showAchievementUnlock(achievement) {
        // 创建解锁通知
        const notification = document.createElement('div');
        notification.className = 'achievement-unlock-notification';
        notification.innerHTML = `
            <div class="unlock-content">
                <div class="unlock-icon">${achievement.icon}</div>
                <div class="unlock-text">
                    <h3>成就解锁！</h3>
                    <p>${achievement.name}</p>
                    <small>${achievement.description}</small>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // 播放解锁音效
        this.app.playSound('level-up');
        
        // 3秒后移除通知
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    getUnlockedCount() {
        return this.achievements.filter(a => a.unlocked).length;
    }

    exportProgress() {
        const userData = StorageManager.getUserData();
        const progressData = StorageManager.getAllProgress();
        
        const report = {
            用户等级: userData?.userLevel || 1,
            总星星数: userData?.totalStars || 0,
            解锁成就: this.getUnlockedCount(),
            学习模块进度: progressData,
            导出时间: new Date().toLocaleString()
        };

        // 创建下载链接
        const dataStr = JSON.stringify(report, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `小小数学家_学习报告_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
        
        this.app.showToast('学习报告已导出', 'success');
    }

    shareAchievement() {
        const unlockedCount = this.getUnlockedCount();
        const shareText = `我在小小数学家应用中获得了${this.app.totalStars}颗星星，解锁了${unlockedCount}个成就！当前等级Lv.${this.app.userLevel}。`;
        
        if (navigator.share) {
            navigator.share({
                title: '小小数学家 - 我的成就',
                text: shareText,
                url: window.location.href
            }).catch(err => {
                console.log('分享失败:', err);
                this.fallbackShare(shareText);
            });
        } else {
            this.fallbackShare(shareText);
        }
    }

    fallbackShare(text) {
        // 复制到剪贴板
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                this.app.showToast('成就信息已复制到剪贴板', 'success');
            });
        } else {
            // 降级方案
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.app.showToast('成就信息已复制到剪贴板', 'success');
        }
    }

    getProgress() {
        return {
            current: this.getUnlockedCount(),
            total: this.achievements.length
        };
    }

    loadAchievements() {
        try { if (typeof StorageManager !== 'undefined' && StorageManager.getModuleProgress) { const saved = StorageManager.getModuleProgress('achievements');
        if (saved && saved.achievements) {
            // 合并保存的成就状态
            saved.achievements.forEach(savedAchievement => {
                const achievement = this.achievements.find(a => a.id === savedAchievement.id);
                if (achievement) {
                    achievement.unlocked = savedAchievement.unlocked;
                }
            });
        }
    }

    saveAchievements() {
        const progressData = {
            achievements: this.achievements,
            progress: this.getProgress()
        };
        
        StorageManager.saveModuleProgress('achievements', progressData);
    }
}

window.AchievementsModule = AchievementsModule; 
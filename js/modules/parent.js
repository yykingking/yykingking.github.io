/**
 * 家长中心模块
 * 提供家长监控和管理功能
 */
class ParentModule {
    constructor() {
        this.userData = null;
        this.reports = [];
        this.isAuthenticated = false;
        this.parentPassword = '123456'; // 简单的家长密码
    }

    /**
     * 初始化家长中心
     */
    init() {
        this.userData = StorageManager.getUserData();
        this.bindEvents();
        this.generateReports();
    }

    /**
     * 绑定事件
     */
    bindEvents() {
        const parentBtn = document.getElementById('parent-btn');
        const parentBackBtn = document.getElementById('parent-back-btn');

        if (parentBtn) {
            parentBtn.addEventListener('click', () => this.showParentCenter());
        }

        if (parentBackBtn) {
            parentBackBtn.addEventListener('click', () => this.hideParentCenter());
        }
    }

    /**
     * 显示家长中心
     */
    async showParentCenter() {
        if (!this.isAuthenticated) {
            const password = prompt('请输入家长密码:');
            if (password !== this.parentPassword) {
                alert('密码错误！');
                return;
            }
            this.isAuthenticated = true;
        }

        // 隐藏主菜单
        const mainMenu = document.getElementById('main-menu');
        if (mainMenu) {
            mainMenu.classList.add('hidden');
        }

        // 显示家长中心
        const parentCenter = document.getElementById('parent-center');
        if (parentCenter) {
            parentCenter.classList.remove('hidden');
            this.renderParentContent();
        }
    }

    /**
     * 隐藏家长中心
     */
    hideParentCenter() {
        const parentCenter = document.getElementById('parent-center');
        const mainMenu = document.getElementById('main-menu');

        if (parentCenter) {
            parentCenter.classList.add('hidden');
        }

        if (mainMenu) {
            mainMenu.classList.remove('hidden');
        }
    }

    /**
     * 渲染家长中心内容
     */
    renderParentContent() {
        const content = document.getElementById('parent-content');
        if (!content) return;

        this.userData = StorageManager.getUserData();
        this.generateReports();

        content.innerHTML = `
            <div class="parent-dashboard">
                <!-- 学习概览 -->
                <div class="overview-section">
                    <h3>学习概览</h3>
                    <div class="overview-cards">
                        <div class="overview-card">
                            <div class="card-icon">⭐</div>
                            <div class="card-info">
                                <h4>获得星星</h4>
                                <p class="card-value">${this.userData.stars}</p>
                            </div>
                        </div>
                        <div class="overview-card">
                            <div class="card-icon">📊</div>
                            <div class="card-info">
                                <h4>当前等级</h4>
                                <p class="card-value">Lv.${this.userData.level}</p>
                            </div>
                        </div>
                        <div class="overview-card">
                            <div class="card-icon">🏆</div>
                            <div class="card-info">
                                <h4>成就数量</h4>
                                <p class="card-value">${this.userData.achievements.length}</p>
                            </div>
                        </div>
                        <div class="overview-card">
                            <div class="card-icon">⏰</div>
                            <div class="card-info">
                                <h4>学习时长</h4>
                                <p class="card-value">${Math.round(this.userData.totalPlayTime / 60)}分钟</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 学习进度 -->
                <div class="progress-section">
                    <h3>学习进度</h3>
                    <div class="progress-modules">
                        ${this.renderProgressModules()}
                    </div>
                </div>

                <!-- 学习报告 -->
                <div class="report-section">
                    <h3>学习报告</h3>
                    <div class="report-tabs">
                        <button class="tab-btn active" data-tab="weekly">本周</button>
                        <button class="tab-btn" data-tab="monthly">本月</button>
                        <button class="tab-btn" data-tab="overall">总览</button>
                    </div>
                    <div class="report-content" id="report-content">
                        ${this.renderWeeklyReport()}
                    </div>
                </div>

                <!-- 设置管理 -->
                <div class="settings-section">
                    <h3>设置管理</h3>
                    <div class="settings-options">
                        <div class="setting-item">
                            <label>
                                <input type="checkbox" ${this.userData.settings.audioEnabled ? 'checked' : ''} 
                                       onchange="parentModule.updateSetting('audioEnabled', this.checked)">
                                启用音效
                            </label>
                        </div>
                        <div class="setting-item">
                            <label>
                                难度设置:
                                <select onchange="parentModule.updateSetting('difficulty', this.value)">
                                    <option value="easy" ${this.userData.settings.difficulty === 'easy' ? 'selected' : ''}>简单</option>
                                    <option value="normal" ${this.userData.settings.difficulty === 'normal' ? 'selected' : ''}>普通</option>
                                    <option value="hard" ${this.userData.settings.difficulty === 'hard' ? 'selected' : ''}>困难</option>
                                </select>
                            </label>
                        </div>
                        <div class="setting-item">
                            <button onclick="parentModule.exportData()" class="export-btn">导出学习数据</button>
                            <button onclick="parentModule.clearData()" class="clear-btn">清除所有数据</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.bindTabEvents();
    }

    /**
     * 渲染进度模块
     */
    renderProgressModules() {
        const modules = [
            { key: 'numbers', name: '数字认知', icon: '🔢' },
            { key: 'arithmetic', name: '加减法', icon: '➕' },
            { key: 'shapes', name: '图形认知', icon: '🔺' },
            { key: 'comparison', name: '比较概念', icon: '⚖️' },
            { key: 'games', name: '趣味游戏', icon: '🎮' }
        ];

        return modules.map(module => {
            const progress = this.userData.progress[module.key];
            const percentage = progress.total > 0 ? Math.round((progress.completed / progress.total) * 100) : 0;
            
            return `
                <div class="progress-module">
                    <div class="module-header">
                        <span class="module-icon">${module.icon}</span>
                        <span class="module-name">${module.name}</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${percentage}%"></div>
                    </div>
                    <div class="progress-text">${progress.completed}/${progress.total} (${percentage}%)</div>
                </div>
            `;
        }).join('');
    }

    /**
     * 渲染周报告
     */
    renderWeeklyReport() {
        const weeklyData = this.generateWeeklyData();
        
        return `
            <div class="weekly-report">
                <div class="report-chart">
                    <h4>本周学习活动</h4>
                    <div class="chart-container">
                        ${this.renderSimpleChart(weeklyData)}
                    </div>
                </div>
                <div class="report-summary">
                    <h4>本周总结</h4>
                    <ul>
                        <li>学习天数: ${weeklyData.activeDays}天</li>
                        <li>完成练习: ${weeklyData.completedExercises}题</li>
                        <li>获得星星: ${weeklyData.starsEarned}颗</li>
                        <li>正确率: ${weeklyData.accuracy}%</li>
                    </ul>
                </div>
            </div>
        `;
    }

    /**
     * 渲染简单图表
     */
    renderSimpleChart(data) {
        const days = ['一', '二', '三', '四', '五', '六', '日'];
        const maxValue = Math.max(...data.dailyActivity);
        
        return `
            <div class="simple-chart">
                ${days.map((day, index) => {
                    const height = maxValue > 0 ? (data.dailyActivity[index] / maxValue) * 100 : 0;
                    return `
                        <div class="chart-bar">
                            <div class="bar" style="height: ${height}%"></div>
                            <div class="bar-label">${day}</div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    /**
     * 生成周数据
     */
    generateWeeklyData() {
        // 模拟数据，实际应用中应该从真实的学习记录中获取
        return {
            activeDays: 5,
            completedExercises: 42,
            starsEarned: 15,
            accuracy: 87,
            dailyActivity: [8, 12, 6, 15, 9, 3, 7] // 每天的活动量
        };
    }

    /**
     * 绑定标签页事件
     */
    bindTabEvents() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const reportContent = document.getElementById('report-content');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // 移除所有活动状态
                tabBtns.forEach(b => b.classList.remove('active'));
                // 添加当前活动状态
                btn.classList.add('active');

                const tab = btn.dataset.tab;
                switch (tab) {
                    case 'weekly':
                        reportContent.innerHTML = this.renderWeeklyReport();
                        break;
                    case 'monthly':
                        reportContent.innerHTML = this.renderMonthlyReport();
                        break;
                    case 'overall':
                        reportContent.innerHTML = this.renderOverallReport();
                        break;
                }
            });
        });
    }

    /**
     * 渲染月报告
     */
    renderMonthlyReport() {
        return `
            <div class="monthly-report">
                <h4>本月学习统计</h4>
                <p>本月总共学习了 ${Math.round(this.userData.totalPlayTime / 60)} 分钟</p>
                <p>完成了 ${this.userData.achievements.length} 个成就</p>
                <p>获得了 ${this.userData.stars} 颗星星</p>
            </div>
        `;
    }

    /**
     * 渲染总览报告
     */
    renderOverallReport() {
        const totalProgress = Object.values(this.userData.progress)
            .reduce((sum, p) => sum + p.completed, 0);
        const totalExercises = Object.values(this.userData.progress)
            .reduce((sum, p) => sum + p.total, 0);

        return `
            <div class="overall-report">
                <h4>总体学习情况</h4>
                <div class="overall-stats">
                    <div class="stat-item">
                        <span class="stat-label">总进度:</span>
                        <span class="stat-value">${totalExercises > 0 ? Math.round((totalProgress / totalExercises) * 100) : 0}%</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">完成练习:</span>
                        <span class="stat-value">${totalProgress}/${totalExercises}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">当前等级:</span>
                        <span class="stat-value">Lv.${this.userData.level}</span>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * 更新设置
     */
    updateSetting(key, value) {
        StorageManager.updateSettings({ [key]: value });
        this.userData = StorageManager.getUserData();
    }

    /**
     * 导出数据
     */
    exportData() {
        const data = StorageManager.exportData();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'math_learning_data.json';
        a.click();
        URL.revokeObjectURL(url);
    }

    /**
     * 清除数据
     */
    clearData() {
        if (confirm('确定要清除所有学习数据吗？此操作不可恢复！')) {
            StorageManager.clearAllData();
            alert('数据已清除！');
            this.hideParentCenter();
        }
    }

    /**
     * 生成报告
     */
    generateReports() {
        // 这里可以生成更详细的学习报告
        this.reports = [
            {
                type: 'progress',
                title: '学习进度报告',
                data: this.userData.progress
            },
            {
                type: 'achievements',
                title: '成就报告',
                data: this.userData.achievements
            }
        ];
    }
}

// 创建全局实例
window.parentModule = new ParentModule(); 
/**
 * 本地存储管理器
 * 负责用户数据的存储和读取
 */
class StorageManager {
    constructor() {
        this.prefix = 'mathApp_';
        this.defaultUserData = {
            stars: 0,
            level: 1,
            achievements: [],
            progress: {
                numbers: { completed: 0, total: 20 },
                arithmetic: { completed: 0, total: 20 },
                shapes: { completed: 0, total: 10 },
                comparison: { completed: 0, total: 15 },
                games: { completed: 0, total: 12 }
            },
            settings: {
                audioEnabled: true,
                difficulty: 'normal'
            },
            lastLogin: null,
            totalPlayTime: 0
        };
    }

    /**
     * 获取用户数据
     */
    getUserData() {
        try {
            const data = localStorage.getItem(this.prefix + 'userData');
            if (data) {
                const userData = JSON.parse(data);
                // 合并默认数据，确保新字段存在
                return this.mergeWithDefaults(userData);
            }
            return this.defaultUserData;
        } catch (error) {
            console.error('获取用户数据失败:', error);
            return this.defaultUserData;
        }
    }

    /**
     * 保存用户数据
     */
    saveUserData(userData) {
        try {
            localStorage.setItem(this.prefix + 'userData', JSON.stringify(userData));
            return true;
        } catch (error) {
            console.error('保存用户数据失败:', error);
            return false;
        }
    }

    /**
     * 获取模块进度
     */
    getModuleProgress(moduleName) {
        const userData = this.getUserData();
        return userData.progress[moduleName] || { completed: 0, total: 0 };
    }

    /**
     * 更新模块进度
     */
    updateModuleProgress(moduleName, completed, total) {
        const userData = this.getUserData();
        userData.progress[moduleName] = { completed, total };
        this.saveUserData(userData);
    }

    /**
     * 添加星星
     */
    addStars(count) {
        const userData = this.getUserData();
        userData.stars += count;
        this.saveUserData(userData);
        return userData.stars;
    }

    /**
     * 添加成就
     */
    addAchievement(achievementId) {
        const userData = this.getUserData();
        if (!userData.achievements.includes(achievementId)) {
            userData.achievements.push(achievementId);
            this.saveUserData(userData);
            return true;
        }
        return false;
    }

    /**
     * 更新设置
     */
    updateSettings(newSettings) {
        const userData = this.getUserData();
        userData.settings = { ...userData.settings, ...newSettings };
        this.saveUserData(userData);
    }

    /**
     * 合并默认数据
     */
    mergeWithDefaults(userData) {
        const merged = { ...this.defaultUserData };
        
        // 递归合并对象
        for (const key in userData) {
            if (typeof userData[key] === 'object' && userData[key] !== null && !Array.isArray(userData[key])) {
                merged[key] = { ...merged[key], ...userData[key] };
            } else {
                merged[key] = userData[key];
            }
        }
        
        return merged;
    }

    /**
     * 清除所有数据
     */
    clearAllData() {
        try {
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.startsWith(this.prefix)) {
                    localStorage.removeItem(key);
                }
            });
            return true;
        } catch (error) {
            console.error('清除数据失败:', error);
            return false;
        }
    }

    /**
     * 导出数据
     */
    exportData() {
        return this.getUserData();
    }

    /**
     * 导入数据
     */
    importData(data) {
        try {
            const validatedData = this.mergeWithDefaults(data);
            return this.saveUserData(validatedData);
        } catch (error) {
            console.error('导入数据失败:', error);
            return false;
        }
    }

    /**
     * 检查本地存储是否可用
     */
    static isAvailable() {
        try {
            const test = 'localStorage_test';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (error) {
            return false;
        }
    }
}

// 创建全局实例
window.StorageManager = new StorageManager();

// 添加安全调用函数
window.StorageManager.safeCall = function(methodName, ...args) {
    try {
        if (typeof this[methodName] === 'function') {
            return this[methodName](...args);
        } else {
            console.warn(`StorageManager.${methodName} 方法不存在`);
            return null;
        }
    } catch (error) {
        console.error(`调用 StorageManager.${methodName} 失败:`, error);
        return null;
    }
}; 
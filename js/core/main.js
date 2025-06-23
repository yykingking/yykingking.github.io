/**
 * 小小数学家 - 主入口文件
 * 应用启动和初始化
 */

// 等待DOM完全加载
document.addEventListener('DOMContentLoaded', () => {
    // 检查必要的API支持
    checkBrowserSupport();
    
    // 初始化应用
    initializeApp();
});

/**
 * 检查浏览器支持
 */
function checkBrowserSupport() {
    const features = {
        localStorage: typeof Storage !== 'undefined',
        audioContext: !!(window.AudioContext || window.webkitAudioContext),
        speechSynthesis: 'speechSynthesis' in window
    };

    console.log('浏览器功能支持:', features);

    // 如果不支持本地存储，显示警告
    if (!features.localStorage) {
        console.warn('浏览器不支持本地存储，数据无法保存');
    }

    // 如果不支持音频，禁用音效
    if (!features.audioContext) {
        console.warn('浏览器不支持Web Audio API，音效可能无法正常工作');
    }

    // 如果不支持语音合成，禁用语音功能
    if (!features.speechSynthesis) {
        console.warn('浏览器不支持语音合成，语音功能将被禁用');
    }
}

/**
 * 初始化应用
 */
function initializeApp() {
    try {
        // 确保 StorageManager 已经初始化
        if (typeof window.StorageManager === 'undefined') {
            console.error('StorageManager 未初始化');
            setTimeout(initializeApp, 100); // 延迟重试
            return;
        }
        
        // 创建应用实例
        window.mathApp = new MathApp();
        
        // 添加全局错误处理
        setupErrorHandling();
        
        // 添加性能监控
        setupPerformanceMonitoring();
        
        console.log('小小数学家应用初始化成功');
        
    } catch (error) {
        console.error('应用初始化失败:', error);
        showFallbackUI();
    }
}

/**
 * 设置错误处理
 */
function setupErrorHandling() {
    // 全局错误捕获
    window.addEventListener('error', (event) => {
        console.error('全局错误:', event.error);
        
        // 如果是关键错误，显示友好提示
        if (event.error && event.error.stack) {
            showErrorMessage('应用遇到了问题，请刷新页面重试');
        }
    });

    // Promise 错误捕获
    window.addEventListener('unhandledrejection', (event) => {
        console.error('未处理的Promise错误:', event.reason);
        event.preventDefault();
    });
}

/**
 * 设置性能监控
 */
function setupPerformanceMonitoring() {
    // 监控页面加载性能
    if ('performance' in window) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                if (perfData) {
                    console.log('页面加载性能:', {
                        总加载时间: Math.round(perfData.loadEventEnd - perfData.fetchStart),
                        DOM加载时间: Math.round(perfData.domContentLoadedEventEnd - perfData.fetchStart),
                        首次渲染: Math.round(perfData.responseEnd - perfData.fetchStart)
                    });
                }
            }, 0);
        });
    }
}

/**
 * 显示错误消息
 */
function showErrorMessage(message) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #f44336;
        color: white;
        padding: 20px;
        border-radius: 8px;
        z-index: 10000;
        text-align: center;
        font-family: -apple-system, BlinkMacSystemFont, sans-serif;
    `;
    errorDiv.innerHTML = `
        <h3>😕 出错了</h3>
        <p>${message}</p>
        <button onclick="location.reload()" style="
            background: white;
            color: #f44336;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            margin-top: 10px;
            cursor: pointer;
        ">刷新页面</button>
    `;
    document.body.appendChild(errorDiv);
}

/**
 * 显示降级UI
 */
function showFallbackUI() {
    const fallbackHTML = `
        <div style="
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            padding: 20px;
            text-align: center;
            font-family: -apple-system, BlinkMacSystemFont, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        ">
            <div style="
                background: rgba(255,255,255,0.1);
                padding: 40px;
                border-radius: 16px;
                backdrop-filter: blur(10px);
            ">
                <h1 style="font-size: 3rem; margin-bottom: 1rem;">🧮</h1>
                <h2 style="margin-bottom: 1rem;">小小数学家</h2>
                <p style="margin-bottom: 2rem; opacity: 0.9;">
                    应用正在初始化中，请稍候...
                </p>
                <button onclick="location.reload()" style="
                    background: #4CAF50;
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 8px;
                    font-size: 1rem;
                    cursor: pointer;
                    transition: background 0.3s ease;
                " onmouseover="this.style.background='#45a049'" 
                   onmouseout="this.style.background='#4CAF50'">
                    重新加载
                </button>
            </div>
        </div>
    `;
    
    document.body.innerHTML = fallbackHTML;
}

// 导出一些有用的工具函数
window.MathAppUtils = {
    /**
     * 安全地执行函数
     */
    safeExecute: function(fn, fallback = null) {
        try {
            return fn();
        } catch (error) {
            console.error('函数执行失败:', error);
            return fallback;
        }
    },

    /**
     * 延迟执行
     */
    delay: function(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    /**
     * 生成随机数
     */
    random: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    /**
     * 打乱数组
     */
    shuffle: function(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    },

    /**
     * 格式化时间
     */
    formatTime: function(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
};

console.log('小小数学家 - 主入口文件已加载'); 
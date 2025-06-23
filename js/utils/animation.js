/**
 * 动画工具类
 * 提供各种动画效果的JavaScript控制
 */
class AnimationManager {
    constructor() {
        this.activeAnimations = new Map();
        this.animationQueue = [];
    }

    /**
     * 添加动画类
     */
    addClass(element, className, duration = null) {
        if (typeof element === 'string') {
            element = document.querySelector(element);
        }
        
        if (!element) return Promise.resolve();

        return new Promise((resolve) => {
            element.classList.add(className);
            
            if (duration) {
                setTimeout(() => {
                    element.classList.remove(className);
                    resolve();
                }, duration);
            } else {
                // 监听动画结束事件
                const handleAnimationEnd = () => {
                    element.removeEventListener('animationend', handleAnimationEnd);
                    element.classList.remove(className);
                    resolve();
                };
                element.addEventListener('animationend', handleAnimationEnd);
            }
        });
    }

    /**
     * 移除动画类
     */
    removeClass(element, className) {
        if (typeof element === 'string') {
            element = document.querySelector(element);
        }
        
        if (element) {
            element.classList.remove(className);
        }
    }

    /**
     * 淡入动画
     */
    fadeIn(element, duration = 500) {
        if (typeof element === 'string') {
            element = document.querySelector(element);
        }
        
        if (!element) return Promise.resolve();

        return new Promise((resolve) => {
            element.style.opacity = '0';
            element.style.display = 'block';
            element.style.transition = `opacity ${duration}ms ease`;
            
            requestAnimationFrame(() => {
                element.style.opacity = '1';
                setTimeout(resolve, duration);
            });
        });
    }

    /**
     * 淡出动画
     */
    fadeOut(element, duration = 500) {
        if (typeof element === 'string') {
            element = document.querySelector(element);
        }
        
        if (!element) return Promise.resolve();

        return new Promise((resolve) => {
            element.style.transition = `opacity ${duration}ms ease`;
            element.style.opacity = '0';
            
            setTimeout(() => {
                element.style.display = 'none';
                resolve();
            }, duration);
        });
    }

    /**
     * 滑入动画
     */
    slideIn(element, direction = 'left', duration = 500) {
        if (typeof element === 'string') {
            element = document.querySelector(element);
        }
        
        if (!element) return Promise.resolve();

        const transforms = {
            left: 'translateX(-100%)',
            right: 'translateX(100%)',
            up: 'translateY(-100%)',
            down: 'translateY(100%)'
        };

        return new Promise((resolve) => {
            element.style.transform = transforms[direction];
            element.style.transition = `transform ${duration}ms ease`;
            element.style.display = 'block';
            
            requestAnimationFrame(() => {
                element.style.transform = 'translate(0, 0)';
                setTimeout(resolve, duration);
            });
        });
    }

    /**
     * 缩放动画
     */
    scale(element, fromScale = 0, toScale = 1, duration = 300) {
        if (typeof element === 'string') {
            element = document.querySelector(element);
        }
        
        if (!element) return Promise.resolve();

        return new Promise((resolve) => {
            element.style.transform = `scale(${fromScale})`;
            element.style.transition = `transform ${duration}ms ease`;
            element.style.display = 'block';
            
            requestAnimationFrame(() => {
                element.style.transform = `scale(${toScale})`;
                setTimeout(resolve, duration);
            });
        });
    }

    /**
     * 震动动画
     */
    shake(element, intensity = 10, duration = 500) {
        if (typeof element === 'string') {
            element = document.querySelector(element);
        }
        
        if (!element) return Promise.resolve();

        return new Promise((resolve) => {
            const originalTransform = element.style.transform;
            const startTime = Date.now();
            
            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = elapsed / duration;
                
                if (progress < 1) {
                    const offset = Math.sin(progress * Math.PI * 8) * intensity * (1 - progress);
                    element.style.transform = `${originalTransform} translateX(${offset}px)`;
                    requestAnimationFrame(animate);
                } else {
                    element.style.transform = originalTransform;
                    resolve();
                }
            };
            
            animate();
        });
    }

    /**
     * 弹跳动画
     */
    bounce(element, height = 20, duration = 600) {
        if (typeof element === 'string') {
            element = document.querySelector(element);
        }
        
        if (!element) return Promise.resolve();

        return new Promise((resolve) => {
            const originalTransform = element.style.transform;
            const startTime = Date.now();
            
            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = elapsed / duration;
                
                if (progress < 1) {
                    const bounceHeight = Math.abs(Math.sin(progress * Math.PI * 2)) * height * (1 - progress);
                    element.style.transform = `${originalTransform} translateY(-${bounceHeight}px)`;
                    requestAnimationFrame(animate);
                } else {
                    element.style.transform = originalTransform;
                    resolve();
                }
            };
            
            animate();
        });
    }

    /**
     * 脉冲动画
     */
    pulse(element, minScale = 1, maxScale = 1.1, duration = 1000) {
        if (typeof element === 'string') {
            element = document.querySelector(element);
        }
        
        if (!element) return Promise.resolve();

        const animationId = Date.now();
        this.activeAnimations.set(element, animationId);

        const animate = () => {
            if (this.activeAnimations.get(element) !== animationId) {
                return; // 动画已被取消
            }

            const time = Date.now() / duration;
            const scale = minScale + (maxScale - minScale) * (Math.sin(time * Math.PI * 2) + 1) / 2;
            element.style.transform = `scale(${scale})`;
            
            requestAnimationFrame(animate);
        };
        
        animate();
        
        return {
            stop: () => {
                this.activeAnimations.delete(element);
                element.style.transform = `scale(${minScale})`;
            }
        };
    }

    /**
     * 旋转动画
     */
    rotate(element, degrees = 360, duration = 1000) {
        if (typeof element === 'string') {
            element = document.querySelector(element);
        }
        
        if (!element) return Promise.resolve();

        return new Promise((resolve) => {
            element.style.transition = `transform ${duration}ms ease`;
            element.style.transform = `rotate(${degrees}deg)`;
            
            setTimeout(() => {
                element.style.transform = 'rotate(0deg)';
                resolve();
            }, duration);
        });
    }

    /**
     * 数字计数动画
     */
    countUp(element, from = 0, to = 100, duration = 1000) {
        if (typeof element === 'string') {
            element = document.querySelector(element);
        }
        
        if (!element) return Promise.resolve();

        return new Promise((resolve) => {
            const startTime = Date.now();
            const difference = to - from;
            
            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const current = from + difference * this.easeOutCubic(progress);
                
                element.textContent = Math.round(current);
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    resolve();
                }
            };
            
            animate();
        });
    }

    /**
     * 进度条动画
     */
    progressBar(element, from = 0, to = 100, duration = 1000) {
        if (typeof element === 'string') {
            element = document.querySelector(element);
        }
        
        if (!element) return Promise.resolve();

        return new Promise((resolve) => {
            const startTime = Date.now();
            const difference = to - from;
            
            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const current = from + difference * this.easeOutCubic(progress);
                
                element.style.width = `${current}%`;
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    resolve();
                }
            };
            
            animate();
        });
    }

    /**
     * 停止所有动画
     */
    stopAll() {
        this.activeAnimations.clear();
    }

    /**
     * 缓动函数
     */
    easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    /**
     * 创建粒子效果
     */
    createParticles(container, count = 20, type = 'star') {
        if (typeof container === 'string') {
            container = document.querySelector(container);
        }
        
        if (!container) return;

        const particles = [];
        const symbols = {
            star: '⭐',
            heart: '❤️',
            sparkle: '✨',
            circle: '●'
        };

        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.textContent = symbols[type] || symbols.star;
            particle.style.position = 'absolute';
            particle.style.pointerEvents = 'none';
            particle.style.fontSize = Math.random() * 20 + 10 + 'px';
            particle.style.left = Math.random() * container.offsetWidth + 'px';
            particle.style.top = Math.random() * container.offsetHeight + 'px';
            particle.style.opacity = '0';
            particle.style.transition = 'all 2s ease-out';
            
            container.appendChild(particle);
            particles.push(particle);
            
            // 动画
            requestAnimationFrame(() => {
                particle.style.opacity = '1';
                particle.style.transform = `translateY(-${Math.random() * 100 + 50}px) scale(${Math.random() + 0.5})`;
                
                setTimeout(() => {
                    particle.style.opacity = '0';
                    setTimeout(() => {
                        if (particle.parentNode) {
                            particle.parentNode.removeChild(particle);
                        }
                    }, 500);
                }, 1500);
            });
        }
    }
}

// 创建全局实例
window.AnimationManager = new AnimationManager(); 
// ===== UTILITY FUNCTIONS =====

const Utils = {
  // DOM Utilities
  createElement(tag, className = '', content = '') {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (content) element.innerHTML = content;
    return element;
  },

  addClass(element, className) {
    if (element && className) {
      element.classList.add(className);
    }
  },

  removeClass(element, className) {
    if (element && className) {
      element.classList.remove(className);
    }
  },

  toggleClass(element, className) {
    if (element && className) {
      element.classList.toggle(className);
    }
  },

  // Animation Utilities
  fadeIn(element, duration = 300) {
    if (!element) return;
    
    element.style.opacity = '0';
    element.style.display = 'block';
    
    let opacity = 0;
    const timer = setInterval(() => {
      opacity += 50 / duration;
      if (opacity >= 1) {
        clearInterval(timer);
        opacity = 1;
      }
      element.style.opacity = opacity;
    }, 50);
  },

  fadeOut(element, duration = 300) {
    if (!element) return;
    
    let opacity = 1;
    const timer = setInterval(() => {
      opacity -= 50 / duration;
      if (opacity <= 0) {
        clearInterval(timer);
        element.style.display = 'none';
        opacity = 0;
      }
      element.style.opacity = opacity;
    }, 50);
  },

  slideDown(element, duration = 300) {
    if (!element) return;
    
    element.style.display = 'block';
    element.style.height = '0px';
    element.style.overflow = 'hidden';
    
    const targetHeight = element.scrollHeight;
    let height = 0;
    const timer = setInterval(() => {
      height += targetHeight / (duration / 50);
      if (height >= targetHeight) {
        clearInterval(timer);
        element.style.height = 'auto';
        element.style.overflow = 'visible';
      } else {
        element.style.height = height + 'px';
      }
    }, 50);
  },

  slideUp(element, duration = 300) {
    if (!element) return;
    
    const targetHeight = element.scrollHeight;
    let height = targetHeight;
    element.style.overflow = 'hidden';
    
    const timer = setInterval(() => {
      height -= targetHeight / (duration / 50);
      if (height <= 0) {
        clearInterval(timer);
        element.style.display = 'none';
        element.style.height = 'auto';
        element.style.overflow = 'visible';
      } else {
        element.style.height = height + 'px';
      }
    }, 50);
  },

  // Data Formatting
  formatNumber(num) {
    if (typeof num !== 'number') return num;
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  },

  formatCurrency(amount, currency = 'USD', locale = 'en-US') {
    if (typeof amount !== 'number') return amount;
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency
    }).format(amount);
  },

  formatDate(date, options = {}) {
    if (!date) return '';
    const defaultOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      ...options
    };
    return new Intl.DateTimeFormat('en-US', defaultOptions).format(new Date(date));
  },

  formatTime(date, options = {}) {
    if (!date) return '';
    const defaultOptions = {
      hour: '2-digit',
      minute: '2-digit',
      ...options
    };
    return new Intl.DateTimeFormat('en-US', defaultOptions).format(new Date(date));
  },

  formatDateTime(date, options = {}) {
    if (!date) return '';
    const defaultOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      ...options
    };
    return new Intl.DateTimeFormat('en-US', defaultOptions).format(new Date(date));
  },

  // Time Utilities
  timeAgo(date) {
    if (!date) return '';
    
    const now = new Date();
    const diffMs = now - new Date(date);
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSeconds < 60) return 'just now';
    if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    
    return this.formatDate(date);
  },

  // Performance Utilities
  debounce(func, wait, immediate = false) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        timeout = null;
        if (!immediate) func(...args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func(...args);
    };
  },

  throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  // Storage Utilities
  storage: {
    set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (e) {
        console.warn('LocalStorage not available:', e);
        return false;
      }
    },

    get(key, defaultValue = null) {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
      } catch (e) {
        console.warn('Error reading from localStorage:', e);
        return defaultValue;
      }
    },

    remove(key) {
      try {
        localStorage.removeItem(key);
        return true;
      } catch (e) {
        console.warn('Error removing from localStorage:', e);
        return false;
      }
    },

    clear() {
      try {
        localStorage.clear();
        return true;
      } catch (e) {
        console.warn('Error clearing localStorage:', e);
        return false;
      }
    }
  },

  // URL Utilities
  getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  },

  setQueryParam(param, value) {
    const url = new URL(window.location);
    url.searchParams.set(param, value);
    window.history.pushState({}, '', url);
  },

  removeQueryParam(param) {
    const url = new URL(window.location);
    url.searchParams.delete(param);
    window.history.pushState({}, '', url);
  },

  // Validation Utilities
  validate: {
    email(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    },

    phone(phone) {
      const re = /^\+?[\d\s\-\(\)]+$/;
      return re.test(phone) && phone.replace(/\D/g, '').length >= 10;
    },

    url(url) {
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    },

    required(value) {
      return value !== null && value !== undefined && value !== '';
    },

    minLength(value, min) {
      return value && value.length >= min;
    },

    maxLength(value, max) {
      return !value || value.length <= max;
    },

    numeric(value) {
      return !isNaN(value) && !isNaN(parseFloat(value));
    },

    integer(value) {
      return Number.isInteger(Number(value));
    },

    positive(value) {
      return Number(value) > 0;
    }
  },

  // Array Utilities
  uniqueBy(array, key) {
    const seen = new Set();
    return array.filter(item => {
      const value = typeof key === 'function' ? key(item) : item[key];
      if (seen.has(value)) return false;
      seen.add(value);
      return true;
    });
  },

  groupBy(array, key) {
    return array.reduce((groups, item) => {
      const value = typeof key === 'function' ? key(item) : item[key];
      groups[value] = groups[value] || [];
      groups[value].push(item);
      return groups;
    }, {});
  },

  sortBy(array, key, direction = 'asc') {
    return [...array].sort((a, b) => {
      const aVal = typeof key === 'function' ? key(a) : a[key];
      const bVal = typeof key === 'function' ? key(b) : b[key];
      
      if (aVal < bVal) return direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  },

  // Object Utilities
  deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime());
    if (obj instanceof Array) return obj.map(item => this.deepClone(item));
    if (typeof obj === 'object') {
      const clonedObj = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          clonedObj[key] = this.deepClone(obj[key]);
        }
      }
      return clonedObj;
    }
  },

  merge(target, ...sources) {
    if (!sources.length) return target;
    const source = sources.shift();

    if (this.isObject(target) && this.isObject(source)) {
      for (const key in source) {
        if (this.isObject(source[key])) {
          if (!target[key]) Object.assign(target, { [key]: {} });
          this.merge(target[key], source[key]);
        } else {
          Object.assign(target, { [key]: source[key] });
        }
      }
    }

    return this.merge(target, ...sources);
  },

  isObject(item) {
    return item && typeof item === 'object' && !Array.isArray(item);
  },

  // String Utilities
  capitalize(str) {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  },

  slugify(str) {
    if (!str) return str;
    return str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  },

  truncate(str, length = 100, ending = '...') {
    if (!str || str.length <= length) return str;
    return str.substring(0, length - ending.length) + ending;
  },

  // Random Utilities
  randomId() {
    return Math.random().toString(36).substr(2, 9);
  },

  randomColor() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
  },

  randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  // Device Detection
  device: {
    isMobile() {
      return window.innerWidth <= 768;
    },

    isTablet() {
      return window.innerWidth > 768 && window.innerWidth <= 1024;
    },

    isDesktop() {
      return window.innerWidth > 1024;
    },

    isTouchDevice() {
      return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }
  },

  // Event Utilities
  emit(eventName, data = {}) {
    const event = new CustomEvent(eventName, { detail: data });
    document.dispatchEvent(event);
  },

  on(eventName, callback) {
    document.addEventListener(eventName, callback);
  },

  off(eventName, callback) {
    document.removeEventListener(eventName, callback);
  }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Utils;
} else {
  window.Utils = Utils;
} 
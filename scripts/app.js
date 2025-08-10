// ===== MAIN APPLICATION CONTROLLER =====

class AdminApp {
  constructor() {
    this.navigationController = null;
    this.dashboardController = null;
    this.init();
  }

  init() {
    // Show loading screen
    this.showLoadingScreen();
    
    // Initialize components after a short delay to show loading
    setTimeout(() => {
      this.initializeComponents();
      this.bindEvents();
      this.hideLoadingScreen();
    }, 1500);
  }

  showLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
      loadingScreen.style.display = 'flex';
    }
  }

  hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    const app = document.getElementById('app');
    
    if (loadingScreen && app) {
      loadingScreen.classList.add('loaded');
      app.style.opacity = '1';
      
      // Remove loading screen after animation
      setTimeout(() => {
        loadingScreen.style.display = 'none';
      }, 500);
    }
  }

  initializeComponents() {
    // Initialize navigation controller
    this.navigationController = new NavigationController();
    
    // Expose navigation controller globally for external pages
    window.navigationController = this.navigationController;
    
    // Initialize dashboard controller
    this.dashboardController = new DashboardController();
    
    // Initialize sidebar
    this.initSidebar();
    
    // Initialize theme
    this.initTheme();
    
    // Initialize dropdowns
    this.initDropdowns();
    
    // Initialize search
    this.initSearch();
    
    // Initialize navigation
    this.initNavigation();

    // Initialize dashboard charts
    this.initDashboardCharts();
    
    // Add event listener for page loaded to reinitialize dropdowns
    document.addEventListener('pageLoaded', () => {
      console.log('📄 Page loaded, reinitializing dropdowns...');
      // Small delay to ensure DOM is fully updated
      setTimeout(() => {
        this.initDropdowns();
      }, 100);
    });
  }

  initSidebar() {
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');

    if (sidebarToggle) {
      sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
      });
    }

    if (mobileMenuToggle) {
      mobileMenuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('mobile-open');
      });
    }

    // Close sidebar on mobile when clicking outside
    document.addEventListener('click', (e) => {
      if (window.innerWidth <= 768) {
        if (!sidebar.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
          sidebar.classList.remove('mobile-open');
        }
      }
    });
  }

  initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    
    // Get saved theme or default to light
    const savedTheme = localStorage.getItem('admin-theme') || 'light';
    this.setTheme(savedTheme);

    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        const currentTheme = body.classList.contains('theme-dark') ? 'dark' : 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
      });
    }
  }

  setTheme(theme) {
    const body = document.body;
    const themeToggle = document.getElementById('themeToggle');
    
    body.className = body.className.replace(/theme-\w+/, '');
    body.classList.add(`theme-${theme}`);
    
    if (themeToggle) {
      const icon = themeToggle.querySelector('i');
      if (icon) {
        icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
      }
    }
    
    localStorage.setItem('admin-theme', theme);
  }

  initDropdowns() {
    // Remove any existing dropdown listeners to prevent duplicates
    this.cleanupDropdowns();
    
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
      const trigger = dropdown.querySelector('[data-dropdown]');
      const menu = dropdown.querySelector('.dropdown-menu');
      
      if (trigger && menu) {
        // Store original click handler to avoid duplicates
        if (!trigger._dropdownHandler) {
          trigger._dropdownHandler = (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('🔽 Dropdown clicked:', dropdown.className);
            
            // Check if this dropdown is currently active
            const isActive = dropdown.classList.contains('active');
            
            // Close all dropdowns first
            this.closeAllDropdowns();
            
            // If it wasn't active, open this one
            if (!isActive) {
              dropdown.classList.add('active');
              console.log('✅ Dropdown opened');
            } else {
              console.log('❌ Dropdown closed');
            }
          };
          
          trigger.addEventListener('click', trigger._dropdownHandler);
        }
      }
    });

    // Global click handler to close dropdowns
    if (!document._globalDropdownHandler) {
      document._globalDropdownHandler = (e) => {
        // Don't close if clicking inside a dropdown
        if (e.target.closest('.dropdown')) {
          return;
        }
        
        this.closeAllDropdowns();
      };
      
      document.addEventListener('click', document._globalDropdownHandler);
    }
    
    console.log('🎯 Dropdowns initialized:', dropdowns.length);
  }

  closeAllDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
      dropdown.classList.remove('active');
    });
  }

  cleanupDropdowns() {
    // Remove existing listeners to prevent duplicates
    const triggers = document.querySelectorAll('[data-dropdown]');
    triggers.forEach(trigger => {
      if (trigger._dropdownHandler) {
        trigger.removeEventListener('click', trigger._dropdownHandler);
        delete trigger._dropdownHandler;
      }
    });
    
    if (document._globalDropdownHandler) {
      document.removeEventListener('click', document._globalDropdownHandler);
      delete document._globalDropdownHandler;
    }
  }

  initSearch() {
    const searchInput = document.querySelector('.search-input');
    
    if (searchInput) {
      // Add keyboard shortcut (Cmd+K / Ctrl+K)
      document.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
          e.preventDefault();
          searchInput.focus();
        }
      });

      // Add search functionality
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        this.performSearch(query);
      });
    }
  }

  performSearch(query) {
    // Simple search implementation
    if (query.length < 2) return;
    
    console.log('Searching for:', query);
    // In a real app, this would make an API call
  }

  initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
      const link = item.querySelector('.nav-link');
      if (link) {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          
          // Remove active class from all items
          navItems.forEach(navItem => {
            navItem.classList.remove('active');
          });
          
          // Add active class to clicked item
          item.classList.add('active');
          
          // Load page content using NavigationController
          const page = item.dataset.page;
          if (page && this.navigationController) {
            this.navigationController.loadPage(page);
            this.updateBreadcrumb(page);
          }
        });
      }
    });
  }

  updateBreadcrumb(pageName) {
    const breadcrumbActive = document.querySelector('.breadcrumb-item.active');
    if (breadcrumbActive) {
      const pageNames = {
        'dashboard': 'Dashboard',
        'users': 'User Management',
        'categories': 'Category Management', 
        'products': 'Product Management',
        'orders': 'Order Management',
        'packages': 'Service Packages',
        'payments': 'Payment Management',
        'ai-operations': 'AI Operations',
        'system-config': 'System Configuration',
        'ui-content': 'UI & Content',
        'policies': 'Policy Management',
        'complaints': 'Complaint Management'
      };
      
      breadcrumbActive.textContent = pageNames[pageName] || pageName;
    }
  }

  initDashboardCharts() {
    // Initialize chart animations
    this.animateCharts();
    this.animateStatCards();
  }

  animateCharts() {
    // Animate chart bars
    const chartBars = document.querySelectorAll('.chart-bar');
    chartBars.forEach((bar, index) => {
      setTimeout(() => {
        bar.style.transform = 'scaleY(1)';
        bar.style.opacity = '1';
      }, index * 100);
    });

    // Animate mini charts
    const miniCharts = document.querySelectorAll('.mini-chart');
    miniCharts.forEach(chart => {
      chart.style.opacity = '1';
    });
  }

  animateStatCards() {
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach((card, index) => {
      setTimeout(() => {
        card.style.transform = 'translateY(0)';
        card.style.opacity = '1';
      }, index * 150);
    });
  }

  bindEvents() {
    // Window resize handler
    window.addEventListener('resize', () => {
      this.handleResize();
    });

    // Page visibility change
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        console.log('Page hidden');
      } else {
        console.log('Page visible');
      }
    });

    // Listen for page loaded events
    document.addEventListener('pageLoaded', (e) => {
      const { pageName } = e.detail;
      console.log(`Page loaded: ${pageName}`);
      
      // Re-initialize dropdowns for new content
      setTimeout(() => {
        this.initDropdowns();
      }, 100);
    });
  }

  handleResize() {
    const sidebar = document.getElementById('sidebar');
    if (window.innerWidth > 768) {
      sidebar.classList.remove('mobile-open');
    }
  }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.adminApp = new AdminApp();
  console.log('Admin Panel initialized');
}); 
// ===== DASHBOARD CONTROLLER =====

class DashboardController {
  constructor() {
    this.chartUpdateInterval = null;
    this.activityUpdateInterval = null;
    this.init();
  }

  init() {
    this.bindEvents();
    this.initChartInteractions();
    this.startRealTimeUpdates();
  }

  bindEvents() {
    // Listen for dashboard page loads
    Utils.on('pageLoaded', (e) => {
      if (e.detail.pageName === 'dashboard') {
        this.onDashboardLoad();
      }
    });

    // Chart tab switching
    document.addEventListener('click', (e) => {
      const tabBtn = e.target.closest('.tab-btn');
      if (tabBtn) {
        this.handleTabSwitch(tabBtn);
      }
    });

    // Stat card menu interactions
    document.addEventListener('click', (e) => {
      const menuBtn = e.target.closest('.menu-btn');
      if (menuBtn) {
        this.handleStatMenu(e);
      }
    });

    // Chart interactions
    document.addEventListener('click', (e) => {
      const chartBar = e.target.closest('.chart-bar');
      if (chartBar) {
        this.handleChartBarClick(chartBar);
      }
    });
  }

  onDashboardLoad() {
    // Re-animate elements when dashboard loads
    setTimeout(() => {
      this.animateStatCards();
      this.animateChartBars();
      this.animateActivityItems();
    }, 100);
  }

  animateStatCards() {
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach((card, index) => {
      card.style.transform = 'translateY(20px)';
      card.style.opacity = '0';
      
      setTimeout(() => {
        card.style.transition = 'all 0.6s ease-out';
        card.style.transform = 'translateY(0)';
        card.style.opacity = '1';
      }, index * 150);
    });
  }

  animateChartBars() {
    const chartBars = document.querySelectorAll('.chart-bar');
    chartBars.forEach((bar, index) => {
      bar.style.transform = 'scaleY(0)';
      bar.style.transformOrigin = 'bottom';
      
      setTimeout(() => {
        bar.style.transition = 'transform 0.8s ease-out';
        bar.style.transform = 'scaleY(1)';
      }, 500 + (index * 100));
    });
  }

  animateActivityItems() {
    const activityItems = document.querySelectorAll('.activity-item');
    activityItems.forEach((item, index) => {
      item.style.transform = 'translateX(-20px)';
      item.style.opacity = '0';
      
      setTimeout(() => {
        item.style.transition = 'all 0.4s ease-out';
        item.style.transform = 'translateX(0)';
        item.style.opacity = '1';
      }, 800 + (index * 100));
    });
  }

  initChartInteractions() {
    // Add hover effects to chart bars
    const chartBars = document.querySelectorAll('.chart-bar');
    chartBars.forEach(bar => {
      bar.addEventListener('mouseenter', (e) => {
        this.showChartTooltip(e.target, e);
      });
      
      bar.addEventListener('mouseleave', (e) => {
        this.hideChartTooltip();
      });
    });
  }

  showChartTooltip(bar, event) {
    // Create tooltip if it doesn't exist
    let tooltip = document.getElementById('chart-tooltip');
    if (!tooltip) {
      tooltip = Utils.createElement('div', 'chart-tooltip');
      tooltip.id = 'chart-tooltip';
      tooltip.style.cssText = `
        position: absolute;
        background: var(--color-gray-900);
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 14px;
        z-index: 1000;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.2s ease;
      `;
      document.body.appendChild(tooltip);
    }

    // Get bar data (you would get this from your data source)
    const barIndex = Array.from(bar.parentElement.children).indexOf(bar);
    const value = this.getChartValue(barIndex);
    
    tooltip.innerHTML = `
      <div style="font-weight: 600;">Day ${barIndex + 1}</div>
      <div>Revenue: ${Utils.formatCurrency(value)}</div>
    `;

    // Position tooltip
    const rect = bar.getBoundingClientRect();
    tooltip.style.left = (rect.left + rect.width / 2 - tooltip.offsetWidth / 2) + 'px';
    tooltip.style.top = (rect.top - tooltip.offsetHeight - 10) + 'px';
    tooltip.style.opacity = '1';
  }

  hideChartTooltip() {
    const tooltip = document.getElementById('chart-tooltip');
    if (tooltip) {
      tooltip.style.opacity = '0';
    }
  }

  getChartValue(index) {
    // Mock data - in real app, this would come from your data source
    const mockData = [15000, 22000, 18000, 28000, 21000, 25000, 32000, 19000, 24000, 30000];
    return mockData[index] || 0;
  }

  handleTabSwitch(clickedTab) {
    // Update active tab
    const tabContainer = clickedTab.parentElement;
    const tabs = tabContainer.querySelectorAll('.tab-btn');
    
    tabs.forEach(tab => tab.classList.remove('active'));
    clickedTab.classList.add('active');

    // Update chart data based on selected period
    const period = clickedTab.textContent.toLowerCase();
    this.updateChartData(period);

    // Show loading state
    this.showChartLoading();
    
    // Simulate data loading
    setTimeout(() => {
      this.hideChartLoading();
      this.animateChartBars();
    }, 500);
  }

  updateChartData(period) {
    // In a real app, you would fetch new data based on the period
    console.log(`Updating chart data for period: ${period}`);
    
    // Mock: Update chart bars with new heights
    const chartBars = document.querySelectorAll('.chart-bar');
    chartBars.forEach((bar, index) => {
      const newHeight = Math.random() * 90 + 10; // Random height between 10-100%
      bar.style.height = `${newHeight}%`;
    });
  }

  showChartLoading() {
    const chartContent = document.querySelector('.main-chart .chart-content');
    if (chartContent) {
      chartContent.style.opacity = '0.5';
      chartContent.style.pointerEvents = 'none';
    }
  }

  hideChartLoading() {
    const chartContent = document.querySelector('.main-chart .chart-content');
    if (chartContent) {
      chartContent.style.opacity = '1';
      chartContent.style.pointerEvents = 'auto';
    }
  }

  handleStatMenu(event) {
    event.stopPropagation();
    
    // Create dropdown menu
    const existingMenu = document.querySelector('.stat-menu-dropdown');
    if (existingMenu) {
      existingMenu.remove();
      return;
    }

    const menu = Utils.createElement('div', 'stat-menu-dropdown');
    menu.innerHTML = `
      <div class="dropdown-item" data-action="refresh">
        <i class="fas fa-sync-alt"></i>
        <span>Refresh Data</span>
      </div>
      <div class="dropdown-item" data-action="export">
        <i class="fas fa-download"></i>
        <span>Export</span>
      </div>
      <div class="dropdown-item" data-action="details">
        <i class="fas fa-chart-bar"></i>
        <span>View Details</span>
      </div>
    `;

    // Style the menu
    menu.style.cssText = `
      position: absolute;
      top: 100%;
      right: 0;
      background: white;
      border: 1px solid var(--border-primary);
      border-radius: 8px;
      box-shadow: var(--shadow-lg);
      padding: 4px 0;
      min-width: 160px;
      z-index: 1000;
    `;

    // Position relative to clicked button
    const button = event.target.closest('.menu-btn');
    const rect = button.getBoundingClientRect();
    const statCard = button.closest('.stat-card');
    
    if (statCard) {
      statCard.style.position = 'relative';
      statCard.appendChild(menu);
    }

    // Handle menu item clicks
    menu.addEventListener('click', (e) => {
      const action = e.target.closest('.dropdown-item')?.dataset.action;
      if (action) {
        this.handleStatMenuAction(action, statCard);
        menu.remove();
      }
    });

    // Close menu when clicking outside
    setTimeout(() => {
      document.addEventListener('click', function closeMenu() {
        menu.remove();
        document.removeEventListener('click', closeMenu);
      });
    }, 100);
  }

  handleStatMenuAction(action, statCard) {
    const statTitle = statCard.querySelector('.stat-title')?.textContent || 'Stat';
    
    switch (action) {
      case 'refresh':
        this.refreshStatCard(statCard);
        Toast.show(`${statTitle} data refreshed`, 'success');
        break;
      case 'export':
        this.exportStatData(statCard);
        Toast.show(`${statTitle} data exported`, 'info');
        break;
      case 'details':
        this.showStatDetails(statCard);
        break;
    }
  }

  refreshStatCard(statCard) {
    const statValue = statCard.querySelector('.stat-value');
    const statChange = statCard.querySelector('.stat-change');
    
    if (statValue) {
      // Add loading state
      statValue.style.opacity = '0.5';
      
      setTimeout(() => {
        // Simulate new data
        const currentValue = parseFloat(statValue.textContent.replace(/[^0-9.]/g, ''));
        const newValue = currentValue + (Math.random() - 0.5) * currentValue * 0.1;
        
        if (statValue.textContent.includes('$')) {
          statValue.textContent = Utils.formatCurrency(newValue);
        } else if (statValue.textContent.includes('%')) {
          statValue.textContent = newValue.toFixed(1) + '%';
        } else {
          statValue.textContent = Utils.formatNumber(Math.round(newValue));
        }
        
        statValue.style.opacity = '1';
        
        // Animate the change
        statCard.style.transform = 'scale(1.02)';
        setTimeout(() => {
          statCard.style.transform = 'scale(1)';
        }, 200);
      }, 1000);
    }
  }

  exportStatData(statCard) {
    // Mock export functionality
    const statTitle = statCard.querySelector('.stat-title')?.textContent || 'data';
    const filename = `${statTitle.toLowerCase().replace(/\s+/g, '_')}_export.csv`;
    console.log(`Exporting ${filename}`);
  }

  showStatDetails(statCard) {
    const statTitle = statCard.querySelector('.stat-title')?.textContent || 'Statistics';
    
    const modal = new Modal({
      title: `${statTitle} Details`,
      content: `
        <div style="padding: 20px;">
          <h4>Detailed Analytics for ${statTitle}</h4>
          <p>This would show detailed charts and analytics for the selected metric.</p>
          <div style="height: 200px; background: var(--bg-secondary); border-radius: 8px; margin: 20px 0; display: flex; align-items: center; justify-content: center; color: var(--text-secondary);">
            <i class="fas fa-chart-area" style="font-size: 3rem; opacity: 0.3;"></i>
          </div>
          <p><small>In a real application, this would display interactive charts and detailed breakdowns.</small></p>
        </div>
      `,
      size: 'lg'
    });
    
    modal.open();
  }

  handleChartBarClick(bar) {
    const barIndex = Array.from(bar.parentElement.children).indexOf(bar);
    const value = this.getChartValue(barIndex);
    
    Toast.show(`Day ${barIndex + 1}: ${Utils.formatCurrency(value)}`, 'info');
    
    // Animate the clicked bar
    bar.style.transform = 'scaleY(1.1) scaleX(1.05)';
    setTimeout(() => {
      bar.style.transform = 'scaleY(1) scaleX(1)';
    }, 200);
  }

  startRealTimeUpdates() {
    // Update stats every 30 seconds
    this.chartUpdateInterval = setInterval(() => {
      this.updateRealTimeData();
    }, 30000);

    // Update activity feed every 60 seconds
    this.activityUpdateInterval = setInterval(() => {
      this.updateActivityFeed();
    }, 60000);
  }

  updateRealTimeData() {
    // Simulate real-time data updates
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach(card => {
      const changeElement = card.querySelector('.stat-change span');
      if (changeElement && Math.random() > 0.7) { // 30% chance to update
        const currentChange = parseFloat(changeElement.textContent.replace(/[^0-9.-]/g, ''));
        const newChange = currentChange + (Math.random() - 0.5) * 2;
        changeElement.textContent = `${newChange > 0 ? '+' : ''}${newChange.toFixed(1)}%`;
        
        // Update the icon and color
        const changeContainer = card.querySelector('.stat-change');
        const icon = changeContainer.querySelector('i');
        if (newChange > 0) {
          changeContainer.className = 'stat-change positive';
          icon.className = 'fas fa-arrow-up';
        } else {
          changeContainer.className = 'stat-change negative';
          icon.className = 'fas fa-arrow-down';
        }
        
        // Add subtle animation
        changeContainer.style.transform = 'scale(1.1)';
        setTimeout(() => {
          changeContainer.style.transform = 'scale(1)';
        }, 300);
      }
    });
  }

  updateActivityFeed() {
    // Add new activity item to the top of the feed
    const activityList = document.querySelector('.activity-list');
    if (activityList && Math.random() > 0.5) { // 50% chance to add activity
      const activities = [
        'New user registration completed',
        'Payment processed successfully',
        'System backup completed',
        'New order received',
        'User profile updated'
      ];
      
      const randomActivity = activities[Math.floor(Math.random() * activities.length)];
      const newActivity = Utils.createElement('div', 'activity-item');
      newActivity.style.opacity = '0';
      newActivity.style.transform = 'translateX(-20px)';
      
      newActivity.innerHTML = `
        <div class="activity-avatar system">
          <i class="fas fa-cog"></i>
        </div>
        <div class="activity-content">
          <div class="activity-header">
            <h4>${randomActivity}</h4>
            <span class="activity-time">Just now</span>
          </div>
          <p class="activity-description">System generated event</p>
        </div>
        <div class="activity-status success">
          <i class="fas fa-check"></i>
        </div>
      `;
      
      activityList.insertBefore(newActivity, activityList.firstChild);
      
      // Animate in
      setTimeout(() => {
        newActivity.style.transition = 'all 0.4s ease-out';
        newActivity.style.opacity = '1';
        newActivity.style.transform = 'translateX(0)';
      }, 100);
      
      // Remove oldest items if there are too many
      const items = activityList.querySelectorAll('.activity-item');
      if (items.length > 10) {
        items[items.length - 1].remove();
      }
    }
  }

  destroy() {
    if (this.chartUpdateInterval) {
      clearInterval(this.chartUpdateInterval);
    }
    if (this.activityUpdateInterval) {
      clearInterval(this.activityUpdateInterval);
    }
  }
}

// Initialize dashboard controller
window.DashboardController = DashboardController; 
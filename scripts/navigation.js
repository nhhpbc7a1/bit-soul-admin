// ===== NAVIGATION CONTROLLER =====

class NavigationController {
  constructor() {
    this.pages = {
      dashboard: this.getDashboardContent(),
      users: this.getUsersContent(),
      'users-create': this.getUserCreateContent(),
      'users-detail': this.getUserDetailContent(),
      'users-edit': this.getUserEditContent(),
      categories: this.getCategoriesContent(),
      'categories-create': this.getCategoryCreateContent(),
      'categories-detail': this.getCategoryDetailContent(),
      'categories-edit': this.getCategoryEditContent(),
      products: this.getProductsContent(),
      'products-create': this.getProductCreateContent(),
      'products-detail': this.getProductDetailContent(),
      'products-approval': this.getProductApprovalContent(),
      'orders': this.getOrdersContent(),
      'orders-create': this.getOrderCreateContent(),
      'orders-detail': this.getOrderDetailContent(),
      packages: this.getPackagesContent(),
      'packages-create': this.getPackageCreateContent(),
      'packages-detail': this.getPackageDetailContent(),
      'packages-edit': this.getPackageEditContent(),
      payments: this.getPaymentsContent(),
      'payments-detail': this.getPaymentDetailContent(),
      'ai-operations': this.getAIOperationsContent(),
      'ai-operations-create': this.getAIOperationCreateContent(),
      'ai-operations-detail': this.getAIOperationDetailContent(),
      'system-config': this.getSystemConfigContent(),
      'ui-content': this.getUIContentContent(),
      policies: this.getPoliciesContent(),
      'policies-create': this.getPolicyCreateContent(),
      'policies-detail': this.getPolicyDetailContent(),
      'policies-edit': this.getPolicyEditContent(),
      complaints: this.getComplaintsContent(),
      'complaints-detail': this.getComplaintDetailContent(),
      'complaints-edit': this.getComplaintEditContent()
    };
    
    this.currentPage = 'dashboard';
    this.pageContainer = document.getElementById('pageContent');
  }

  // Navigation with sub-page support
  navigateTo(pageName, subPage = null, id = null) {
    let fullPageName = pageName;
    if (subPage) {
      fullPageName = `${pageName}-${subPage}`;
    }
    
    console.log(`🚀 NavigateTo called:`, { 
      pageName, 
      subPage, 
      id, 
      fullPageName 
    });
    
    this.loadPage(fullPageName, { id, parentPage: pageName });
  }

  async loadPage(pageName, options = {}) {
    console.log(`📄 LoadPage called:`, { pageName, options });
    
    if (!this.pageContainer) {
      console.warn('Page container not found');
      return;
    }

    // Add loading state
    this.showLoadingState();

    try {
      let content = '';
      
      console.log(`🔍 Checking if ${pageName} has external file:`, this.hasExternalFile(pageName));
      
      // Load content from external HTML files for certain pages
      if (this.hasExternalFile(pageName)) {
        console.log(`📁 Loading external content for: ${pageName}`);
        content = await this.loadExternalContent(pageName);
      } else {
        // Use internal content generators
        if (!this.pages[pageName]) {
          console.warn(`Page "${pageName}" not found`);
          return;
        }
        console.log(`🏠 Using internal content for: ${pageName}`);
        content = this.pages[pageName];
      }

      console.log(`✅ Content loaded successfully for: ${pageName}`);
      
      // Simulate loading delay for smooth transition
      setTimeout(() => {
        this.pageContainer.innerHTML = content;
        this.currentPage = pageName;
        this.hideLoadingState();
        
        console.log(`🎨 Page content injected for: ${pageName}`);
        
        // Initialize page-specific functionality AFTER content is injected
        this.initializePage(pageName, options);
        
        // Update page title and breadcrumb
        this.updatePageTitle(pageName);
        this.updateBreadcrumbForSubPage(pageName, options);
        
        // Trigger page loaded event
        this.triggerPageLoadedEvent(pageName);
      }, 300);
    } catch (error) {
      console.error('Failed to load page:', error);
      this.hideLoadingState();
      this.showErrorState(pageName);
    }
  }

  hasExternalFile(pageName) {
    // List of pages that have dedicated HTML files
    const externalPages = [
      'categories', 
      'categories-create',
      'categories-detail',
      'categories-edit',
      // Remove 'users' from here so it uses internal content
      'users-create',
      'users-detail', 
      'users-edit',
      'products',
      'products-create',
      'products-detail',
      'products-approval',
      'orders',
      'orders-create',
      'orders-detail',
      'ai-operations',
      'packages',
      'payments', 
      'system-config',
      'ui-content',
      'policies',
      'complaints'
    ];
    return externalPages.includes(pageName);
  }

  async loadExternalContent(pageName) {
    console.log(`📂 Loading external content for: ${pageName}`);
    
    const fileMap = {
      'categories': 'pages/categories/index.html',
      'categories-create': 'pages/categories/create.html',
      'categories-detail': 'pages/categories/detail.html',
      'categories-edit': 'pages/categories/edit.html',
      'users-create': 'pages/users/create.html',
      'users-detail': 'pages/users/detail.html',
      'users-edit': 'pages/users/edit.html',
      'products': 'pages/products/index.html',
      'products-create': 'pages/products/create.html',
      'products-detail': 'pages/products/detail.html',
      'products-approval': 'pages/products/approval.html',
      'orders': 'pages/orders/index.html',
      'orders-create': 'pages/orders/create.html',
      'orders-detail': 'pages/orders/detail.html',
      'ai-operations': 'pages/ai-operations/index.html',
      'ai-operations-create': 'pages/ai-operations/create.html',
      'ai-operations-detail': 'pages/ai-operations/detail.html',
      'packages': 'pages/packages/index.html',
      'packages-create': 'pages/packages/create.html',
      'packages-detail': 'pages/packages/detail.html',
      'packages-edit': 'pages/packages/edit.html',
      'payments': 'pages/payments/index.html',
      'payments-detail': 'pages/payments/detail.html',
      'policies': 'pages/policies/index.html',
      'policies-create': 'pages/policies/create.html',
      'policies-detail': 'pages/policies/detail.html',
      'policies-edit': 'pages/policies/edit.html',
      'complaints': 'pages/complaints/index.html'
    };

    const fileName = fileMap[pageName];
    console.log(`📂 File path: ${fileName}`);
    
    if (!fileName) {
      console.error(`❌ No file mapping found for page: ${pageName}`);
      throw new Error(`No file mapping found for page: ${pageName}`);
    }

    try {
      console.log(`🌐 Fetching: ${fileName}`);
      const response = await fetch(fileName);
      console.log(`🌐 Fetch response:`, response);
      console.log(`🌐 Response status: ${response.status}`);
      console.log(`🌐 Response ok: ${response.ok}`);
      
      if (!response.ok) {
        console.error(`❌ Failed to load ${fileName}: ${response.status}`);
        throw new Error(`Failed to load ${fileName}: ${response.status}`);
      }

      const htmlContent = await response.text();
      console.log(`📄 HTML content length: ${htmlContent.length}`);
      console.log(`📄 HTML preview: ${htmlContent.substring(0, 200)}...`);
      
      // Extract content from the main content area of the loaded HTML
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlContent, 'text/html');
      console.log(`🔍 Parsed document:`, doc);
      
      // Extract and inject CSS styles
      this.injectExternalStyles(doc, pageName);
      
      // Ensure all required CSS is loaded
      this.ensureRequiredCSS(pageName);
      
      // Get the dashboard content from the loaded file
      const dashboardContent = doc.querySelector('.dashboard-content');
      console.log(`🔍 Dashboard content found:`, !!dashboardContent);
      
      if (dashboardContent) {
        console.log(`✅ Returning dashboard content: ${dashboardContent.outerHTML.substring(0, 200)}...`);
        return dashboardContent.outerHTML;
      }
      
      // Fallback: try to get the main content
      const mainContent = doc.querySelector('.main-content');
      console.log(`🔍 Main content found:`, !!mainContent);
      
      if (mainContent) {
        // Remove header from main content to avoid duplication
        const header = mainContent.querySelector('.header');
        if (header) {
          header.remove();
        }
        
        // Remove sidebar to avoid duplication
        const sidebar = mainContent.parentElement?.querySelector('.sidebar');
        if (sidebar) {
          sidebar.remove();
        }
        
        console.log(`✅ Returning main content: ${mainContent.outerHTML.substring(0, 200)}...`);
        return mainContent.outerHTML;
      }
      
      console.log(`⚠️ No suitable content container found, returning body content`);
      return doc.body.innerHTML;
      
    } catch (error) {
      console.error(`❌ Error loading external content for ${pageName}:`, error);
      throw error;
    }
  }

  injectExternalStyles(doc, pageName) {
    // Check if styles for this page are already injected
    const existingStyleId = `external-styles-${pageName}`;
    if (document.getElementById(existingStyleId)) {
      return; // Styles already injected
    }

    // Extract embedded styles from the document
    const styleElements = doc.querySelectorAll('style');
    
    if (styleElements.length > 0) {
      // Create a combined style element
      const combinedStyle = document.createElement('style');
      combinedStyle.id = existingStyleId;
      
      let combinedCSS = '';
      styleElements.forEach(styleEl => {
        combinedCSS += styleEl.textContent + '\n';
      });
      
      combinedStyle.textContent = combinedCSS;
      document.head.appendChild(combinedStyle);
    }
    
    // Always ensure admin-styles.css is loaded for external pages
    if (!document.querySelector('link[href="admin-styles.css"]') && 
        !document.querySelector('link[href="../../admin-styles.css"]')) {
      const adminStylesLink = document.createElement('link');
      adminStylesLink.rel = 'stylesheet';
      adminStylesLink.href = 'admin-styles.css';
      adminStylesLink.id = `admin-styles-${pageName}`;
      document.head.appendChild(adminStylesLink);
      console.log(`✅ Injected admin-styles.css for ${pageName}`);
    }
    
    // Load external CSS links with corrected paths
    const linkElements = doc.querySelectorAll('link[rel="stylesheet"]');
    linkElements.forEach(link => {
      let href = link.getAttribute('href');
      if (href && !document.querySelector(`link[href="${href}"]`)) {
        // Fix relative paths from subdirectories
        if (href === 'admin-styles.css' || href === '../../admin-styles.css') {
          href = 'admin-styles.css'; // Normalize to root path
        }
        
        if (!document.querySelector(`link[href="${href}"]`)) {
          const newLink = document.createElement('link');
          newLink.rel = 'stylesheet';
          newLink.href = href;
          newLink.id = `external-link-${pageName}-${href.replace(/[^a-zA-Z0-9]/g, '_')}`;
          document.head.appendChild(newLink);
          console.log(`✅ Injected external CSS: ${href} for ${pageName}`);
        }
      }
    });
  }

  ensureRequiredCSS(pageName) {
    const requiredCSS = [
      'admin-styles.css',
      'styles/shared-pages.css',
      'styles/page-specific.css'
    ];
    
    // Add Font Awesome if not already loaded
    if (!document.querySelector('link[href*="font-awesome"]')) {
      const fontAwesome = document.createElement('link');
      fontAwesome.rel = 'stylesheet';
      fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
      fontAwesome.id = `font-awesome-${pageName}`;
      document.head.appendChild(fontAwesome);
      console.log(`✅ Injected Font Awesome for ${pageName}`);
    }
    
    // Add Google Fonts if not already loaded
    if (!document.querySelector('link[href*="fonts.googleapis.com"]')) {
      const googleFonts = document.createElement('link');
      googleFonts.rel = 'stylesheet';
      googleFonts.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap';
      googleFonts.id = `google-fonts-${pageName}`;
      document.head.appendChild(googleFonts);
      console.log(`✅ Injected Google Fonts for ${pageName}`);
    }
    
    // Ensure all required CSS files are loaded
    requiredCSS.forEach(cssFile => {
      if (!document.querySelector(`link[href="${cssFile}"]`)) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = cssFile;
        link.id = `required-css-${cssFile.replace(/[^a-zA-Z0-9]/g, '_')}-${pageName}`;
        document.head.appendChild(link);
        console.log(`✅ Ensured required CSS: ${cssFile} for ${pageName}`);
      }
    });
    
    console.log(`🎨 CSS injection complete for ${pageName}`);
  }

  showErrorState(pageName) {
    this.pageContainer.innerHTML = `
      <div class="error-state">
        <div class="error-icon">
          <i class="fas fa-exclamation-triangle"></i>
        </div>
        <h3>Failed to Load Page</h3>
        <p>Sorry, we couldn't load the ${pageName} page. Please try again.</p>
        <button class="btn btn-primary" onclick="window.adminApp.navigationController.loadPage('${pageName}')">
          <i class="fas fa-refresh"></i>
          Try Again
        </button>
      </div>
    `;
  }

  showLoadingState() {
    this.pageContainer.style.opacity = '0.5';
    this.pageContainer.style.pointerEvents = 'none';
  }

  hideLoadingState() {
    this.pageContainer.style.opacity = '1';
    this.pageContainer.style.pointerEvents = 'auto';
  }

  updatePageTitle(pageName) {
    const titles = {
      dashboard: 'Dashboard',
      users: 'User Management', 
      'users-create': 'Create New User',
      'users-detail': 'User Details',
      'users-edit': 'Edit User',
      categories: 'Category Management',
      'categories-create': 'Create New Category',
      'categories-detail': 'Category Details',
      'categories-edit': 'Edit Category',
      products: 'Product Management',
      'products-create': 'Create New Product',
      'products-detail': 'Product Details',
      'products-approval': 'Product Approval',
      'products-edit': 'Edit Product',
      orders: 'Order Management',
      'orders-create': 'Create New Order',
      'orders-detail': 'Order Details',
      'orders-edit': 'Edit Order',
      packages: 'Service Packages',
      'packages-create': 'Create New Package',
      'packages-detail': 'Package Details',
      'packages-edit': 'Edit Package',
      payments: 'Payment Management',
      'payments-detail': 'Payment Details',
      'ai-operations': 'AI Operations',
      'ai-operations-create': 'Create AI Operation',
      'ai-operations-detail': 'AI Operation Details',
      'system-config': 'System Configuration',
      'ui-content': 'UI & Content Management',
      policies: 'Policy Management',
      'policies-create': 'Create Policy',
      'policies-detail': 'Policy Details',
      'policies-edit': 'Edit Policy',
      complaints: 'Complaint Management',
      'complaints-detail': 'Complaint Details',
      'complaints-edit': 'Edit Complaint'
    };
    
    document.title = `${titles[pageName]} - Admin Panel`;
  }

  updateBreadcrumbForSubPage(pageName, options = {}) {
    const breadcrumbActive = document.querySelector('.breadcrumb-item.active');
    if (breadcrumbActive) {
      const pageNames = {
        'dashboard': 'Dashboard',
        'users': 'User Management',
        'users-create': 'Create User',
        'users-detail': 'User Details',
        'users-edit': 'Edit User',
        'categories': 'Category Management',
        'categories-create': 'Create Category',
        'categories-detail': 'Category Details', 
        'categories-edit': 'Edit Category',
        'products': 'Product Management',
        'products-create': 'Create Product',
        'products-detail': 'Product Details',
        'products-approval': 'Product Approval',
        'products-edit': 'Edit Product',
        'orders': 'Order Management',
        'orders-create': 'Create New Order',
        'orders-detail': 'Order Details',
        'packages': 'Service Packages',
        'packages-create': 'Create Package',
        'packages-detail': 'Package Details',
        'packages-edit': 'Edit Package',
        'payments': 'Payment Management',
        'payments-detail': 'Payment Details',
        'ai-operations': 'AI Operations',
        'ai-operations-create': 'Create AI Operation',
        'ai-operations-detail': 'AI Operation Details',
        'system-config': 'System Configuration',
        'ui-content': 'UI & Content',
        'policies': 'Policy Management',
        'policies-create': 'Create Policy',
        'policies-detail': 'Policy Details',
        'policies-edit': 'Edit Policy',
        'complaints': 'Complaint Management',
        'complaints-detail': 'Complaint Details',
        'complaints-edit': 'Edit Complaint'
      };
      
      breadcrumbActive.textContent = pageNames[pageName] || pageName;
    }
  }

  initializePage(pageName, options = {}) {
    // Initialize page-specific functionality
    const basePage = pageName.split('-')[0];
    
    console.log(`🔧 InitializePage called:`, { pageName, basePage, options });
    
    switch(basePage) {
      case 'dashboard':
        console.log(`📊 Initializing dashboard`);
        this.initDashboard();
        break;
      case 'users':
        console.log(`👤 Initializing users page`);
        this.initUsersPage(pageName, options);
        break;
      case 'categories':
        console.log(`📂 Initializing categories page`);
        this.initCategoriesPage(pageName, options);
        break;
      case 'products':
        console.log(`📦 Initializing products page`);
        this.initProductsPage(pageName, options);
        break;
      case 'orders':
        console.log(`🛒 Initializing orders page`);
        this.initOrdersPage(pageName, options);
        break;
      case 'packages':
        console.log(`📮 Initializing packages page`);
        this.initPackagesPage(pageName, options);
        break;
      case 'payments':
        console.log(`💳 Initializing payments page`);
        this.initPaymentsPage(pageName, options);
        break;
      case 'policies':
        console.log(`📜 Initializing policies page`);
        this.initPoliciesPage(pageName, options);
        break;
      case 'complaints':
        console.log(`📝 Initializing complaints page`);
        this.initComplaintsPage(pageName, options);
        break;
      default:
        console.log(`❓ No initialization for: ${basePage}`);
    }
  }

  initDashboard() {
    // Re-initialize dashboard animations
    setTimeout(() => {
      const statCards = document.querySelectorAll('.stat-card');
      statCards.forEach((card, index) => {
        card.style.transform = 'translateY(20px)';
        card.style.opacity = '0';
        setTimeout(() => {
          card.style.transform = 'translateY(0)';
          card.style.opacity = '1';
        }, index * 150);
      });
    }, 100);
  }

  initUsersPage(pageName, options = {}) {
    console.log(`👤 InitUsersPage called:`, { pageName, options });
    
    // Initialize users page functionality
    this.bindNavigationEvents('users');
    
    if (pageName === 'users-create') {
      this.initCreateForm('user');
    } else if (pageName === 'users-edit') {
      this.initEditForm('user', options.id);
    }
    
    console.log(`✅ Users page initialization complete`);
  }

  initCategoriesPage(pageName, options = {}) {
    console.log(`📂 InitCategoriesPage called:`, { pageName, options });
    
    // Initialize categories page functionality
    this.bindNavigationEvents('categories');
    
    if (pageName === 'categories-create') {
      this.initCreateForm('category');
    } else if (pageName === 'categories-edit') {
      this.initEditForm('category', options.id);
    }
    
    console.log(`✅ Categories page initialization complete`);
  }

  initProductsPage(pageName, options = {}) {
    this.bindNavigationEvents('products');
    if (pageName === 'products-create') {
      this.initCreateForm('product');
    } else if (pageName === 'products-approval') {
      this.initApprovalPage('product', options.id);
    }
  }

  initOrdersPage(pageName, options = {}) {
    // Initialize orders page functionality
    this.bindNavigationEvents('orders');
    if (pageName === 'orders-create') {
      this.initCreateForm('order');
    }
  }

  initPackagesPage(pageName, options = {}) {
    // Initialize packages page functionality
    this.bindNavigationEvents('packages');
    if (pageName === 'packages-create') {
      this.initCreateForm('package');
    } else if (pageName === 'packages-edit') {
      this.initEditForm('package', options.id);
    }
  }

  initPaymentsPage(pageName, options = {}) {
    // Initialize payments page functionality
    this.bindNavigationEvents('payments');
  }

  initPoliciesPage(pageName, options = {}) {
    // Initialize policies page functionality
    this.bindNavigationEvents('policies');
    if (pageName === 'policies-create') {
      this.initCreateForm('policy');
    } else if (pageName === 'policies-edit') {
      this.initEditForm('policy', options.id);
    }
  }

  initComplaintsPage(pageName, options = {}) {
    // Initialize complaints page functionality
    this.bindNavigationEvents('complaints');
    if (pageName === 'complaints-edit') {
      this.initEditForm('complaint', options.id);
    }
  }

  bindNavigationEvents(section) {
    console.log(`🔧 Binding navigation events for: ${section}`);
    
    // Remove previous event listeners to avoid duplicates
    document.removeEventListener('click', this.navigationHandler);
    
    // Debug: Check if buttons exist
    setTimeout(() => {
      const buttons = document.querySelectorAll('[data-action]');
      console.log(`🎯 Found ${buttons.length} buttons with data-action:`, buttons);
      buttons.forEach((btn, index) => {
        console.log(`Button ${index}:`, {
          action: btn.getAttribute('data-action'),
          id: btn.getAttribute('data-id'),
          text: btn.textContent.trim(),
          element: btn
        });
      });
    }, 100);
    
    // Create a bound handler to maintain context
    this.navigationHandler = (e) => {
      const btn = e.target.closest('[data-action]');
      if (!btn) return;
      
      const action = btn.getAttribute('data-action');
      const id = btn.getAttribute('data-id');
      
      console.log(`🎯 Navigation action triggered:`, { action, id, section });
      
      switch(action) {
        case 'create':
          console.log(`📝 Creating ${section}`);
          this.navigateTo(section, 'create');
          break;
        case 'view':
          console.log(`👁️ Viewing ${section} ID: ${id}`);
          this.navigateTo(section, 'detail', id);
          break;
        case 'edit':
          console.log(`✏️ Editing ${section} ID: ${id}`);
          this.navigateTo(section, 'edit', id);
          break;
        case 'review':
          console.log(`🔍 Reviewing ${section} ID: ${id}`);
          this.navigateTo(section, 'approval', id);
          break;
        case 'monitor':
          console.log(`📊 Monitoring ${section} ID: ${id}`);
          this.handleMonitor(section, id);
          break;
        case 'track':
          console.log(`🚚 Tracking ${section} ID: ${id}`);
          this.handleTrack(section, id);
          break;
        case 'commission':
          console.log(`💰 Viewing commission for ${section} ID: ${id}`);
          this.handleCommission(section, id);
          break;
        case 'mediate':
          console.log(`⚖️ Mediating dispute for ${section} ID: ${id}`);
          this.handleMediate(section, id);
          break;
        case 'suspend':
          console.log(`⏸️ Suspending ${section} ID: ${id}`);
          this.handleSuspend(section, id);
          break;
        case 'delete':
          console.log(`🗑️ Deleting ${section} ID: ${id}`);
          this.handleDelete(section, id);
          break;
        case 'back':
          console.log(`⬅️ Going back to ${section}`);
          this.navigateTo(section);
          break;
      }
    };
    
    // Bind navigation events for sub-pages
    document.addEventListener('click', this.navigationHandler);
  }

  initCreateForm(type) {
    // Initialize create form functionality
    const form = document.querySelector(`#${type}CreateForm`);
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleCreate(type, new FormData(form));
      });
    }
  }

  initEditForm(type, id) {
    // Initialize edit form functionality
    const form = document.querySelector(`#${type}EditForm`);
    if (form) {
      // Load existing data
      this.loadFormData(type, id);
      
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleUpdate(type, id, new FormData(form));
      });
    }
  }

  initApprovalPage(type, id) {
    console.log(`Initializing ${type} approval page for ID:`, id);
    
    // Initialize approval-specific functionality
    this.initApprovalActions();
    this.initApprovalChecklist();
    
    // Load product data for approval
    if (id) {
      this.loadApprovalData(type, id);
    }
  }

  initApprovalActions() {
    // Handle approval action buttons
    const handleApprovalAction = (e) => {
      const actionBtn = e.target.closest('[data-action]');
      if (!actionBtn) return;
      
      const action = actionBtn.dataset.action;
      const productId = actionBtn.dataset.id;
      
      switch(action) {
        case 'approve':
          this.handleApproval(productId);
          break;
        case 'reject':
          this.handleRejection(productId);
          break;
        case 'request-changes':
          this.handleChangeRequest(productId);
          break;
      }
    };

    // Remove existing listeners to prevent duplicates
    document.removeEventListener('click', handleApprovalAction);
    document.addEventListener('click', handleApprovalAction);
  }

  initApprovalChecklist() {
    // Handle checklist interactions
    const checkboxes = document.querySelectorAll('.checklist-item input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', () => {
        this.updateApprovalReadiness();
      });
    });
    
    // Initial check
    this.updateApprovalReadiness();
  }

  handleApproval(productId) {
    console.log('Approving product:', productId);
    const notes = document.getElementById('approvalNotes')?.value || '';
    
    if (confirm('Are you sure you want to approve this product?')) {
      // Implementation for approval logic
      console.log('Product approved with notes:', notes);
      this.showApprovalMessage('Product approved successfully!', 'success');
    }
  }

  handleRejection(productId) {
    console.log('Rejecting product:', productId);
    const notes = document.getElementById('approvalNotes')?.value || '';
    
    if (!notes.trim()) {
      alert('Please provide a reason for rejection.');
      return;
    }
    
    if (confirm('Are you sure you want to reject this product?')) {
      // Implementation for rejection logic
      console.log('Product rejected with reason:', notes);
      this.showApprovalMessage('Product rejected. Seller has been notified.', 'error');
    }
  }

  handleChangeRequest(productId) {
    console.log('Requesting changes for product:', productId);
    const notes = document.getElementById('approvalNotes')?.value || '';
    
    if (!notes.trim()) {
      alert('Please provide specific feedback about required changes.');
      return;
    }
    
    if (confirm('Send change requests to seller?')) {
      // Implementation for change request logic
      console.log('Change request sent:', notes);
      this.showApprovalMessage('Change requests sent to seller.', 'warning');
    }
  }

  updateApprovalReadiness() {
    const checkboxes = document.querySelectorAll('.checklist-item input[type="checkbox"]');
    const checkedCount = document.querySelectorAll('.checklist-item input[type="checkbox"]:checked').length;
    const approveBtn = document.querySelector('[data-action="approve"]');
    
    if (approveBtn) {
      const isReady = checkedCount === checkboxes.length;
      approveBtn.disabled = !isReady;
      approveBtn.style.opacity = isReady ? '1' : '0.6';
    }
  }

  showApprovalMessage(message, type) {
    // Create and show approval message
    const existingMessage = document.querySelector('.approval-message');
    if (existingMessage) {
      existingMessage.remove();
    }

    const messageDiv = document.createElement('div');
    messageDiv.className = `approval-message ${type}`;
    
    const iconMap = {
      'success': 'check-circle',
      'error': 'times-circle', 
      'warning': 'exclamation-circle',
      'info': 'info-circle'
    };
    
    messageDiv.innerHTML = `
      <div class="message-content">
        <i class="fas fa-${iconMap[type] || 'info-circle'}"></i>
        <span>${message}</span>
      </div>
    `;
    
    // Insert after approval banner
    const banner = document.querySelector('.approval-banner');
    if (banner) {
      banner.parentNode.insertBefore(messageDiv, banner.nextSibling);
    }
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      messageDiv.remove();
    }, 5000);
  }

  loadApprovalData(type, id) {
    console.log(`Loading ${type} data for approval:`, id);
    
    if (id) {
      // Update the page title with product ID
      const pageTitle = document.querySelector('.page-title');
      if (pageTitle) {
        pageTitle.textContent = `Product Approval - ${type.toUpperCase()} #${id}`;
      }
      
      // Update banner info with product ID
      const bannerInfo = document.querySelector('.banner-info p');
      if (bannerInfo) {
        bannerInfo.textContent = `Product ${id} is waiting for admin review. Click approve or reject below.`;
      }
      
      // Update action buttons with correct product ID
      const actionButtons = document.querySelectorAll('[data-action][data-id]');
      actionButtons.forEach(btn => {
        btn.setAttribute('data-id', id);
      });
      
      // Show notification that product is loaded
      setTimeout(() => {
        this.showApprovalMessage(`Loaded ${type} #${id} for review`, 'info');
      }, 500);
    }
    
    // In real app, this would fetch data from API and populate the form
  }

  handleCreate(type, formData) {
    // Simulate create operation
    console.log(`Creating ${type}:`, Object.fromEntries(formData));
    // Show success message and redirect
    this.showSuccessMessage(`${type} created successfully!`);
    setTimeout(() => {
      this.navigateTo(type + 's'); // Go back to list
    }, 1500);
  }

  handleUpdate(type, id, formData) {
    // Simulate update operation
    console.log(`Updating ${type} ${id}:`, Object.fromEntries(formData));
    // Show success message and redirect
    this.showSuccessMessage(`${type} updated successfully!`);
    setTimeout(() => {
      this.navigateTo(type + 's'); // Go back to list
    }, 1500);
  }

  handleDelete(type, id) {
    // Show confirmation dialog
    if (confirm(`Are you sure you want to delete this ${type}?`)) {
      console.log(`Deleting ${type} ${id}`);
      this.showSuccessMessage(`${type} deleted successfully!`);
      // Refresh current page
      location.reload();
    }
  }

  handleMonitor(type, id) {
    // Show monitoring dashboard for the item
    console.log(`Opening monitoring dashboard for ${type} ${id}`);
    this.showSuccessMessage(`Opening ${type} monitoring dashboard`);
    // In real implementation: Open monitoring modal or navigate to monitoring page
  }

  handleTrack(type, id) {
    // Show tracking information
    console.log(`Tracking ${type} ${id}`);
    this.showSuccessMessage(`Tracking information for ${type} ${id}`);
    // In real implementation: Open tracking modal with shipment details
  }

  handleCommission(type, id) {
    // Show commission breakdown
    console.log(`Viewing commission details for ${type} ${id}`);
    this.showSuccessMessage(`Commission details for ${type} ${id}`);
    // In real implementation: Open commission breakdown modal
  }

  handleMediate(type, id) {
    // Open mediation interface
    console.log(`Opening mediation for ${type} ${id}`);
    if (confirm(`Open mediation interface for this ${type}? This will notify all parties involved.`)) {
      this.showSuccessMessage(`Mediation initiated for ${type} ${id}`);
      // In real implementation: Open mediation dashboard
    }
  }

  handleSuspend(type, id) {
    // Suspend order/item
    const reason = prompt(`Please provide a reason for suspending this ${type}:`);
    if (reason && reason.trim()) {
      console.log(`Suspending ${type} ${id} - Reason: ${reason}`);
      this.showSuccessMessage(`${type} ${id} has been suspended`);
      // In real implementation: Call API to suspend item and notify parties
    } else if (reason !== null) {
      alert('Please provide a valid reason for suspension.');
    }
  }

  loadFormData(type, id) {
    // Simulate loading form data
    console.log(`Loading ${type} data for ID: ${id}`);
    // In a real app, this would fetch data from API
  }

  showSuccessMessage(message) {
    // Create and show success toast
    const toast = document.createElement('div');
    toast.className = 'toast toast-success';
    toast.innerHTML = `
      <div class="toast-content">
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
      </div>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.add('show');
    }, 100);
    
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 3000);
  }

  initCategoryTree() {
    // Add click handlers for category expansion/collapse
    const categoryToggles = document.querySelectorAll('.category-toggle');
    categoryToggles.forEach(toggle => {
      toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const categoryItem = toggle.closest('.category-tree-item');
        const subcategories = categoryItem.querySelector('.subcategories');
        
        if (subcategories) {
          subcategories.style.display = subcategories.style.display === 'none' ? 'block' : 'none';
          toggle.textContent = subcategories.style.display === 'none' ? '📁' : '📂';
        }
      });
    });
  }

  initCategoryModal() {
    // Initialize add category button
    const addCategoryBtn = document.querySelector('.btn-primary');
    const modal = document.getElementById('categoryModal');
    const closeBtn = document.querySelector('.modal-close');
    
    if (addCategoryBtn && modal) {
      addCategoryBtn.addEventListener('click', () => {
        modal.style.display = 'flex';
      });
    }
    
    if (closeBtn && modal) {
      closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
      });
    }
    
    // Close modal when clicking outside
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.style.display = 'none';
        }
      });
    }
  }

  triggerPageLoadedEvent(pageName) {
    const event = new CustomEvent('pageLoaded', {
      detail: { pageName }
    });
    document.dispatchEvent(event);
  }

  // Content generators using SubPagesContent
  getUsersContent() {
    return `
      <div class="users-page">
        <!-- Page Header -->
        <section class="page-header">
          <div class="page-header-content">
            <div class="page-header-text">
              <h1 class="page-title">User Management</h1>
              <p class="page-subtitle">Manage and monitor all users across your platform</p>
            </div>
            <div class="page-header-actions">
              <button class="btn btn-outline">
                <i class="fas fa-download"></i>
                <span>Export Users</span>
              </button>
              <button class="btn btn-primary" data-action="create">
                <i class="fas fa-plus"></i>
                <span>Add New User</span>
              </button>
            </div>
          </div>
        </section>

        <!-- User Stats -->
        <section class="stats-grid">
          <div class="stat-card users">
            <div class="stat-header">
              <div class="stat-icon">
                <i class="fas fa-users"></i>
              </div>
              <div class="stat-menu">
                <button class="menu-btn">
                  <i class="fas fa-ellipsis-h"></i>
                </button>
              </div>
            </div>
            <div class="stat-content">
              <h3 class="stat-title">Total Users</h3>
              <div class="stat-value">12,543</div>
              <div class="stat-change positive">
                <i class="fas fa-arrow-up"></i>
                <span>+15.7%</span>
                <small>vs last month</small>
              </div>
            </div>
            <div class="stat-chart">
              <div class="mini-chart users-chart"></div>
            </div>
          </div>

          <div class="stat-card orders">
            <div class="stat-header">
              <div class="stat-icon">
                <i class="fas fa-user-plus"></i>
              </div>
              <div class="stat-menu">
                <button class="menu-btn">
                  <i class="fas fa-ellipsis-h"></i>
                </button>
              </div>
            </div>
            <div class="stat-content">
              <h3 class="stat-title">New Users</h3>
              <div class="stat-value">1,247</div>
              <div class="stat-change positive">
                <i class="fas fa-arrow-up"></i>
                <span>+23.1%</span>
                <small>this month</small>
              </div>
            </div>
            <div class="stat-chart">
              <div class="mini-chart orders-chart"></div>
            </div>
          </div>

          <div class="stat-card revenue">
            <div class="stat-header">
              <div class="stat-icon">
                <i class="fas fa-user-check"></i>
              </div>
              <div class="stat-menu">
                <button class="menu-btn">
                  <i class="fas fa-ellipsis-h"></i>
                </button>
              </div>
            </div>
            <div class="stat-content">
              <h3 class="stat-title">Active Users</h3>
              <div class="stat-value">8,926</div>
              <div class="stat-change positive">
                <i class="fas fa-arrow-up"></i>
                <span>+8.4%</span>
                <small>vs last month</small>
              </div>
            </div>
            <div class="stat-chart">
              <div class="mini-chart revenue-chart"></div>
            </div>
          </div>

          <div class="stat-card conversion">
            <div class="stat-header">
              <div class="stat-icon">
                <i class="fas fa-user-times"></i>
              </div>
              <div class="stat-menu">
                <button class="menu-btn">
                  <i class="fas fa-ellipsis-h"></i>
                </button>
              </div>
            </div>
            <div class="stat-content">
              <h3 class="stat-title">Inactive Users</h3>
              <div class="stat-value">3,617</div>
              <div class="stat-change negative">
                <i class="fas fa-arrow-down"></i>
                <span>-5.2%</span>
                <small>vs last month</small>
              </div>
            </div>
            <div class="stat-chart">
              <div class="mini-chart conversion-chart"></div>
            </div>
          </div>
        </section>

        <!-- Users Table -->
        <section class="table-section">
          <div class="table-container">
            <div class="table-header">
              <div class="table-title">
                <h3>All Users</h3>
                <p>Manage user accounts and permissions</p>
              </div>
              <div class="table-filters">
                <div class="search-box">
                  <i class="fas fa-search search-icon"></i>
                  <input type="text" placeholder="Search users..." class="search-input">
                </div>
                <select class="form-select">
                  <option>All Roles</option>
                  <option>Customers</option>
                  <option>Sellers</option>
                  <option>Suppliers</option>
                  <option>Admins</option>
                </select>
              </div>
            </div>
            <div class="table-content">
              <table class="table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Last Login</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div class="user-cell">
                        <img src="https://images.unsplash.com/photo-1494790108755-2616b68b2500?w=32&h=32&fit=crop&crop=face" alt="User" class="avatar avatar-sm">
                        <div class="user-info">
                          <div class="user-name">Sarah Johnson</div>
                          <div class="user-email">sarah@example.com</div>
                        </div>
                      </div>
                    </td>
                    <td><span class="badge badge-primary">Customer</span></td>
                    <td><span class="badge badge-success">Active</span></td>
                    <td>2 hours ago</td>
                    <td>
                      <div class="action-buttons">
                        <button class="btn-icon" title="View" data-action="view" data-id="1">
                          <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-icon" title="Edit" data-action="edit" data-id="1">
                          <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon" title="Delete" data-action="delete" data-id="1">
                          <i class="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div class="user-cell">
                        <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face" alt="User" class="avatar avatar-sm">
                        <div class="user-info">
                          <div class="user-name">Mike Chen</div>
                          <div class="user-email">mike@example.com</div>
                        </div>
                      </div>
                    </td>
                    <td><span class="badge badge-warning">Seller</span></td>
                    <td><span class="badge badge-success">Active</span></td>
                    <td>1 day ago</td>
                    <td>
                      <div class="action-buttons">
                        <button class="btn-icon" title="View" data-action="view" data-id="2">
                          <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-icon" title="Edit" data-action="edit" data-id="2">
                          <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon" title="Delete" data-action="delete" data-id="2">
                          <i class="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    `;
  }

  // Sub-page content generators
  getUserCreateContent() {
    return `<div class="coming-soon"><h3>User Create</h3><p>Will load from external file: pages/users/create.html</p></div>`;
  }

  getUserDetailContent() {
    return `<div class="coming-soon"><h3>User Details</h3><p>Will load from external file: pages/users/detail.html</p></div>`;
  }

  getUserEditContent() {
    return `<div class="coming-soon"><h3>User Edit</h3><p>Will load from external file: pages/users/edit.html</p></div>`;
  }

  getCategoryCreateContent() {
    return `<div class="coming-soon"><h3>Category Create</h3><p>Coming soon...</p></div>`;
  }

  getCategoryDetailContent() {
    return `<div class="coming-soon"><h3>Category Details</h3><p>Coming soon...</p></div>`;
  }

  getCategoryEditContent() {
    return `<div class="coming-soon"><h3>Category Edit</h3><p>Coming soon...</p></div>`;
  }

  // Add all other sub-page methods as needed
  getProductCreateContent() {
    return `<div class="coming-soon"><h3>Product Create</h3><p>Coming soon...</p></div>`;
  }

  getProductDetailContent() {
    return `<div class="coming-soon"><h3>Product Details</h3><p>Coming soon...</p></div>`;
  }

  getProductApprovalContent() {
    return `<div class="coming-soon"><h3>Product Approval</h3><p>Coming soon...</p></div>`;
  }

  getOrderDetailContent() {
    return `<div class="coming-soon"><h3>Order Details</h3><p>Coming soon...</p></div>`;
  }

  getOrderCreateContent() {
    return `<div class="coming-soon"><h3>Order Create</h3><p>Coming soon...</p></div>`;
  }

  getPackageCreateContent() {
    return `<div class="coming-soon"><h3>Package Create</h3><p>Coming soon...</p></div>`;
  }

  getPackageDetailContent() {
    return `<div class="coming-soon"><h3>Package Details</h3><p>Coming soon...</p></div>`;
  }

  getPackageEditContent() {
    return `<div class="coming-soon"><h3>Package Edit</h3><p>Coming soon...</p></div>`;
  }

  getPaymentDetailContent() {
    return `<div class="coming-soon"><h3>Payment Details</h3><p>Coming soon...</p></div>`;
  }

  getAIOperationCreateContent() {
    return `<div class="coming-soon"><h3>AI Operation Create</h3><p>Coming soon...</p></div>`;
  }

  getAIOperationDetailContent() {
    return `<div class="coming-soon"><h3>AI Operation Details</h3><p>Coming soon...</p></div>`;
  }

  getPolicyCreateContent() {
    return `<div class="coming-soon"><h3>Policy Create</h3><p>Coming soon...</p></div>`;
  }

  getPolicyDetailContent() {
    return `<div class="coming-soon"><h3>Policy Details</h3><p>Coming soon...</p></div>`;
  }

  getPolicyEditContent() {
    return `<div class="coming-soon"><h3>Policy Edit</h3><p>Coming soon...</p></div>`;
  }

  getComplaintDetailContent() {
    return `<div class="coming-soon"><h3>Complaint Details</h3><p>Coming soon...</p></div>`;
  }

  getComplaintEditContent() {
    return `<div class="coming-soon"><h3>Complaint Edit</h3><p>Coming soon...</p></div>`;
  }

  // Simple content generators for main pages
  getCategoriesContent() {
    return `<div class="coming-soon"><h3>Categories will load from external file</h3></div>`;
  }

  getProductsContent() {
    return `<div class="coming-soon"><h3>Products will load from external file</h3></div>`;
  }

  getOrdersContent() {
    return `<div class="coming-soon"><h3>Orders will load from external file</h3></div>`;
  }

  getPackagesContent() {
    return `<div class="coming-soon"><h3>Packages will load from external file</h3></div>`;
  }

  getPaymentsContent() {
    return `<div class="coming-soon"><h3>Payments will load from external file</h3></div>`;
  }

  getAIOperationsContent() {
    return `<div class="coming-soon"><h3>AI Operations will load from external file</h3></div>`;
  }

  getSystemConfigContent() {
    return `<div class="coming-soon"><h3>System Config will load from external file</h3></div>`;
  }

  getUIContentContent() {
    return `<div class="coming-soon"><h3>UI Content will load from external file</h3></div>`;
  }

  getPoliciesContent() {
    return `<div class="coming-soon"><h3>Policies will load from external file</h3></div>`;
  }

  getComplaintsContent() {
    return `<div class="coming-soon"><h3>Complaints will load from external file</h3></div>`;
  }

  getDashboardContent() {
    return `
      <div class="dashboard-page">
        <!-- Welcome Section -->
        <section class="welcome-section">
          <div class="welcome-content">
            <div class="welcome-text">
              <h1 class="page-title">Good morning, John! 👋</h1>
              <p class="page-subtitle">Here's what's happening with your platform today.</p>
            </div>
            <div class="welcome-actions">
              <button class="btn btn-primary">
                <i class="fas fa-plus"></i>
                <span>Create New</span>
              </button>
              <button class="btn btn-outline">
                <i class="fas fa-download"></i>
                <span>Export Data</span>
              </button>
            </div>
          </div>
        </section>

        <!-- Stats Grid -->
        <section class="stats-grid">
          <div class="stat-card revenue">
            <div class="stat-header">
              <div class="stat-icon">
                <i class="fas fa-dollar-sign"></i>
          </div>
              <div class="stat-menu">
                <button class="menu-btn">
                  <i class="fas fa-ellipsis-h"></i>
                </button>
          </div>
          </div>
            <div class="stat-content">
              <h3 class="stat-title">Total Revenue</h3>
              <div class="stat-value">$125,430</div>
              <div class="stat-change positive">
                <i class="fas fa-arrow-up"></i>
                <span>+12.5%</span>
                <small>vs last month</small>
          </div>
          </div>
            <div class="stat-chart">
              <div class="mini-chart revenue-chart"></div>
          </div>
          </div>

          <div class="stat-card orders">
            <div class="stat-header">
              <div class="stat-icon">
                <i class="fas fa-shopping-bag"></i>
          </div>
              <div class="stat-menu">
                <button class="menu-btn">
                  <i class="fas fa-ellipsis-h"></i>
                </button>
          </div>
          </div>
            <div class="stat-content">
              <h3 class="stat-title">Total Orders</h3>
              <div class="stat-value">2,847</div>
              <div class="stat-change positive">
                <i class="fas fa-arrow-up"></i>
                <span>+8.2%</span>
                <small>vs last month</small>
          </div>
          </div>
            <div class="stat-chart">
              <div class="mini-chart orders-chart"></div>
          </div>
          </div>

          <div class="stat-card users">
            <div class="stat-header">
              <div class="stat-icon">
                <i class="fas fa-users"></i>
          </div>
              <div class="stat-menu">
                <button class="menu-btn">
                  <i class="fas fa-ellipsis-h"></i>
                </button>
          </div>
          </div>
            <div class="stat-content">
              <h3 class="stat-title">Active Users</h3>
              <div class="stat-value">12,543</div>
              <div class="stat-change positive">
                <i class="fas fa-arrow-up"></i>
                <span>+15.7%</span>
                <small>vs last month</small>
          </div>
          </div>
            <div class="stat-chart">
              <div class="mini-chart users-chart"></div>
          </div>
          </div>

          <div class="stat-card conversion">
            <div class="stat-header">
              <div class="stat-icon">
                <i class="fas fa-percentage"></i>
          </div>
              <div class="stat-menu">
                <button class="menu-btn">
                  <i class="fas fa-ellipsis-h"></i>
                </button>
          </div>
          </div>
            <div class="stat-content">
              <h3 class="stat-title">Conversion Rate</h3>
              <div class="stat-value">4.2%</div>
              <div class="stat-change negative">
                <i class="fas fa-arrow-down"></i>
                <span>-2.1%</span>
                <small>vs last month</small>
          </div>
          </div>
            <div class="stat-chart">
              <div class="mini-chart conversion-chart"></div>
          </div>
          </div>
        </section>

        <!-- Charts Section -->
        <section class="charts-section">
          <div class="chart-container main-chart">
            <div class="chart-header">
              <div class="chart-title">
                <h3>Revenue Analytics</h3>
                <p>Monthly revenue breakdown and trends</p>
          </div>
              <div class="chart-controls">
                <div class="chart-tabs">
                  <button class="tab-btn active">Daily</button>
                  <button class="tab-btn">Weekly</button>
                  <button class="tab-btn">Monthly</button>
          </div>
                <button class="chart-menu-btn">
                  <i class="fas fa-ellipsis-h"></i>
                </button>
          </div>
          </div>
            <div class="chart-content">
              <div class="chart-placeholder main-revenue-chart">
                <div class="chart-grid">
                  <div class="chart-bar" style="height: 60%"></div>
                  <div class="chart-bar" style="height: 80%"></div>
                  <div class="chart-bar" style="height: 45%"></div>
                  <div class="chart-bar" style="height: 90%"></div>
                  <div class="chart-bar" style="height: 70%"></div>
                  <div class="chart-bar" style="height: 85%"></div>
                  <div class="chart-bar" style="height: 95%"></div>
                  <div class="chart-bar" style="height: 65%"></div>
                  <div class="chart-bar" style="height: 75%"></div>
                  <div class="chart-bar" style="height: 88%"></div>
          </div>
          </div>
          </div>
          </div>

          <div class="chart-container side-chart">
            <div class="chart-header">
              <div class="chart-title">
                <h3>Traffic Sources</h3>
                <p>Where your visitors come from</p>
          </div>
          </div>
            <div class="chart-content">
              <div class="donut-chart">
                <div class="donut-center">
                  <div class="donut-value">45,210</div>
                  <div class="donut-label">Total Visits</div>
          </div>
          </div>
              <div class="chart-legend">
                <div class="legend-item">
                  <div class="legend-color organic"></div>
                  <span class="legend-label">Organic Search</span>
                  <span class="legend-value">42%</span>
          </div>
                <div class="legend-item">
                  <div class="legend-color direct"></div>
                  <span class="legend-label">Direct</span>
                  <span class="legend-value">28%</span>
          </div>
                <div class="legend-item">
                  <div class="legend-color social"></div>
                  <span class="legend-label">Social Media</span>
                  <span class="legend-value">18%</span>
          </div>
                <div class="legend-item">
                  <div class="legend-color referral"></div>
                  <span class="legend-label">Referral</span>
                  <span class="legend-value">12%</span>
          </div>
          </div>
          </div>
          </div>
        </section>

        <!-- Recent Activity -->
        <section class="recent-activity">
          <div class="section-header">
            <div class="section-title">
              <h3>Recent Activity</h3>
              <p>Latest actions and system events</p>
          </div>
            <button class="btn btn-text">View All</button>
          </div>
          <div class="activity-list">
            <div class="activity-item">
              <div class="activity-avatar">
                <img src="https://images.unsplash.com/photo-1494790108755-2616b68b2500?w=40&h=40&fit=crop&crop=face" alt="User">
          </div>
              <div class="activity-content">
                <div class="activity-header">
                  <h4>Sarah Johnson completed order #12345</h4>
                  <span class="activity-time">2 minutes ago</span>
          </div>
                <p class="activity-description">Premium package subscription for Electronics category</p>
          </div>
              <div class="activity-status success">
                <i class="fas fa-check"></i>
          </div>
          </div>

            <div class="activity-item">
              <div class="activity-avatar">
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face" alt="User">
          </div>
              <div class="activity-content">
                <div class="activity-header">
                  <h4>Mike Chen registered as new supplier</h4>
                  <span class="activity-time">15 minutes ago</span>
          </div>
                <p class="activity-description">Tech Supply Co. - Awaiting verification</p>
          </div>
              <div class="activity-status pending">
                <i class="fas fa-clock"></i>
          </div>
          </div>

            <div class="activity-item">
              <div class="activity-avatar system">
                <i class="fas fa-cog"></i>
          </div>
              <div class="activity-content">
                <div class="activity-header">
                  <h4>System backup completed successfully</h4>
                  <span class="activity-time">1 hour ago</span>
          </div>
                <p class="activity-description">Daily backup process finished - 2.4GB archived</p>
          </div>
              <div class="activity-status success">
                <i class="fas fa-check"></i>
          </div>
          </div>

            <div class="activity-item">
              <div class="activity-avatar">
                <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face" alt="User">
          </div>
              <div class="activity-content">
                <div class="activity-header">
                  <h4>Emma Davis submitted complaint #789</h4>
                  <span class="activity-time">3 hours ago</span>
          </div>
                <p class="activity-description">Delivery delay issue - Requires immediate attention</p>
          </div>
              <div class="activity-status warning">
                <i class="fas fa-exclamation-triangle"></i>
          </div>
          </div>
          </div>
        </section>
          </div>
    `;
  }
}

// Export for use in app.js
window.NavigationController = NavigationController;
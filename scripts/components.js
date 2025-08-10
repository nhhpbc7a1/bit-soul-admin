// ===== REUSABLE COMPONENTS =====

// Modal Component
class Modal {
  constructor(options = {}) {
    this.options = {
      size: 'md', // sm, md, lg, xl
      closable: true,
      backdrop: true,
      keyboard: true,
      focus: true,
      ...options
    };
    
    this.isOpen = false;
    this.element = null;
    this.backdrop = null;
    
    this.init();
  }

  init() {
    this.createElement();
    this.bindEvents();
  }

  createElement() {
    // Create modal overlay
    this.backdrop = Utils.createElement('div', 'modal-overlay');
    
    // Create modal
    this.element = Utils.createElement('div', `modal modal-${this.options.size}`);
    
    // Create modal structure
    this.element.innerHTML = `
      <div class="modal-header">
        <h3 class="modal-title">${this.options.title || ''}</h3>
        ${this.options.closable ? '<button class="modal-close" type="button">✕</button>' : ''}
      </div>
      <div class="modal-body">
        ${this.options.content || ''}
      </div>
      ${this.options.footer ? `<div class="modal-footer">${this.options.footer}</div>` : ''}
    `;
    
    this.backdrop.appendChild(this.element);
    document.body.appendChild(this.backdrop);
  }

  bindEvents() {
    // Close button
    if (this.options.closable) {
      const closeBtn = this.element.querySelector('.modal-close');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => this.close());
      }
    }

    // Backdrop click
    if (this.options.backdrop) {
      this.backdrop.addEventListener('click', (e) => {
        if (e.target === this.backdrop) {
          this.close();
        }
      });
    }

    // Keyboard events
    if (this.options.keyboard) {
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen) {
          this.close();
        }
      });
    }
  }

  open() {
    if (this.isOpen) return;
    
    this.isOpen = true;
    Utils.addClass(this.backdrop, 'active');
    
    if (this.options.focus) {
      this.element.focus();
    }
    
    Utils.emit('modal:open', { modal: this });
  }

  close() {
    if (!this.isOpen) return;
    
    this.isOpen = false;
    Utils.removeClass(this.backdrop, 'active');
    
    Utils.emit('modal:close', { modal: this });
  }

  destroy() {
    if (this.backdrop && this.backdrop.parentNode) {
      this.backdrop.parentNode.removeChild(this.backdrop);
    }
    this.isOpen = false;
  }

  setTitle(title) {
    const titleElement = this.element.querySelector('.modal-title');
    if (titleElement) {
      titleElement.textContent = title;
    }
  }

  setContent(content) {
    const bodyElement = this.element.querySelector('.modal-body');
    if (bodyElement) {
      bodyElement.innerHTML = content;
    }
  }
}

// Toast Notification Component
class Toast {
  constructor(message, type = 'info', options = {}) {
    this.message = message;
    this.type = type;
    this.options = {
      duration: 5000,
      position: 'top-right',
      closable: true,
      ...options
    };
    
    this.element = null;
    this.init();
  }

  init() {
    this.createElement();
    this.show();
    this.autoHide();
  }

  createElement() {
    this.element = Utils.createElement('div', `toast toast-${this.type}`);
    
    const iconMap = {
      success: 'fas fa-check-circle',
      error: 'fas fa-exclamation-circle',
      warning: 'fas fa-exclamation-triangle',
      info: 'fas fa-info-circle'
    };

    this.element.innerHTML = `
      <div class="toast-content">
        <i class="${iconMap[this.type] || iconMap.info}"></i>
        <span>${this.message}</span>
      </div>
      ${this.options.closable ? '<button class="toast-close"><i class="fas fa-times"></i></button>' : ''}
    `;

    // Position the toast
    this.element.style.position = 'fixed';
    this.element.style.zIndex = '1000';
    this.setPosition();

    document.body.appendChild(this.element);

    // Bind close event
    if (this.options.closable) {
      const closeBtn = this.element.querySelector('.toast-close');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => this.hide());
      }
    }
  }

  setPosition() {
    const [vertical, horizontal] = this.options.position.split('-');
    
    if (vertical === 'top') {
      this.element.style.top = '1rem';
    } else {
      this.element.style.bottom = '1rem';
    }
    
    if (horizontal === 'right') {
      this.element.style.right = '1rem';
    } else if (horizontal === 'left') {
      this.element.style.left = '1rem';
    } else {
      this.element.style.left = '50%';
      this.element.style.transform = 'translateX(-50%)';
    }
  }

  show() {
    Utils.addClass(this.element, 'show');
    Utils.emit('toast:show', { toast: this });
  }

  hide() {
    Utils.removeClass(this.element, 'show');
    setTimeout(() => {
      if (this.element && this.element.parentNode) {
        this.element.parentNode.removeChild(this.element);
      }
    }, 300);
    Utils.emit('toast:hide', { toast: this });
  }

  autoHide() {
    if (this.options.duration > 0) {
      setTimeout(() => this.hide(), this.options.duration);
    }
  }

  static show(message, type = 'info', options = {}) {
    return new Toast(message, type, options);
  }
}

// Data Table Component
class DataTable {
  constructor(element, options = {}) {
    this.element = typeof element === 'string' ? document.querySelector(element) : element;
    this.options = {
      data: [],
      columns: [],
      sortable: true,
      searchable: true,
      paginate: true,
      pageSize: 10,
      ...options
    };
    
    this.data = [...this.options.data];
    this.filteredData = [...this.data];
    this.currentPage = 1;
    this.sortColumn = null;
    this.sortDirection = 'asc';
    
    this.init();
  }

  init() {
    this.createElement();
    this.bindEvents();
    this.render();
  }

  createElement() {
    this.element.innerHTML = `
      ${this.options.searchable ? `
        <div class="table-header">
          <div class="table-search">
            <input type="text" placeholder="Search..." class="search-input">
          </div>
        </div>
      ` : ''}
      <div class="table-container">
        <table class="table">
          <thead>
            <tr>
              ${this.options.columns.map(col => `
                <th data-column="${col.key}" ${this.options.sortable ? 'class="sortable"' : ''}>
                  ${col.title}
                  ${this.options.sortable ? '<i class="fas fa-sort sort-icon"></i>' : ''}
                </th>
              `).join('')}
            </tr>
          </thead>
          <tbody class="table-body">
          </tbody>
        </table>
      </div>
      ${this.options.paginate ? `
        <div class="table-pagination">
          <div class="pagination-info">
            <span class="page-info"></span>
          </div>
          <div class="pagination-controls">
            <button class="btn btn-sm pagination-btn" data-action="first">First</button>
            <button class="btn btn-sm pagination-btn" data-action="prev">Previous</button>
            <button class="btn btn-sm pagination-btn" data-action="next">Next</button>
            <button class="btn btn-sm pagination-btn" data-action="last">Last</button>
          </div>
        </div>
      ` : ''}
    `;
  }

  bindEvents() {
    // Search
    if (this.options.searchable) {
      const searchInput = this.element.querySelector('.search-input');
      if (searchInput) {
        searchInput.addEventListener('input', Utils.debounce((e) => {
          this.search(e.target.value);
        }, 300));
      }
    }

    // Sort
    if (this.options.sortable) {
      const headers = this.element.querySelectorAll('th.sortable');
      headers.forEach(header => {
        header.addEventListener('click', () => {
          this.sort(header.dataset.column);
        });
      });
    }

    // Pagination
    if (this.options.paginate) {
      const paginationBtns = this.element.querySelectorAll('.pagination-btn');
      paginationBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          this.paginate(btn.dataset.action);
        });
      });
    }
  }

  render() {
    this.renderTable();
    this.renderPagination();
  }

  renderTable() {
    const tbody = this.element.querySelector('.table-body');
    const start = (this.currentPage - 1) * this.options.pageSize;
    const end = start + this.options.pageSize;
    const pageData = this.options.paginate ? this.filteredData.slice(start, end) : this.filteredData;

    tbody.innerHTML = pageData.map(row => `
      <tr>
        ${this.options.columns.map(col => `
          <td>${this.formatCell(row[col.key], col)}</td>
        `).join('')}
      </tr>
    `).join('');
  }

  renderPagination() {
    if (!this.options.paginate) return;

    const pageInfo = this.element.querySelector('.page-info');
    const totalPages = Math.ceil(this.filteredData.length / this.options.pageSize);
    const start = (this.currentPage - 1) * this.options.pageSize + 1;
    const end = Math.min(start + this.options.pageSize - 1, this.filteredData.length);

    if (pageInfo) {
      pageInfo.textContent = `Showing ${start}-${end} of ${this.filteredData.length} entries`;
    }

    // Update pagination buttons
    const firstBtn = this.element.querySelector('[data-action="first"]');
    const prevBtn = this.element.querySelector('[data-action="prev"]');
    const nextBtn = this.element.querySelector('[data-action="next"]');
    const lastBtn = this.element.querySelector('[data-action="last"]');

    if (firstBtn) firstBtn.disabled = this.currentPage === 1;
    if (prevBtn) prevBtn.disabled = this.currentPage === 1;
    if (nextBtn) nextBtn.disabled = this.currentPage === totalPages;
    if (lastBtn) lastBtn.disabled = this.currentPage === totalPages;
  }

  formatCell(value, column) {
    if (column.render && typeof column.render === 'function') {
      return column.render(value);
    }
    return value || '';
  }

  search(query) {
    if (!query) {
      this.filteredData = [...this.data];
    } else {
      this.filteredData = this.data.filter(row => {
        return this.options.columns.some(col => {
          const value = row[col.key];
          return value && value.toString().toLowerCase().includes(query.toLowerCase());
        });
      });
    }
    this.currentPage = 1;
    this.render();
  }

  sort(column) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.filteredData.sort((a, b) => {
      const aVal = a[column];
      const bVal = b[column];
      
      if (aVal < bVal) return this.sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    // Update sort icons
    const headers = this.element.querySelectorAll('th.sortable');
    headers.forEach(header => {
      const icon = header.querySelector('.sort-icon');
      if (icon) {
        if (header.dataset.column === column) {
          icon.className = `fas fa-sort-${this.sortDirection === 'asc' ? 'up' : 'down'} sort-icon`;
        } else {
          icon.className = 'fas fa-sort sort-icon';
        }
      }
    });

    this.render();
  }

  paginate(action) {
    const totalPages = Math.ceil(this.filteredData.length / this.options.pageSize);

    switch (action) {
      case 'first':
        this.currentPage = 1;
        break;
      case 'prev':
        if (this.currentPage > 1) this.currentPage--;
        break;
      case 'next':
        if (this.currentPage < totalPages) this.currentPage++;
        break;
      case 'last':
        this.currentPage = totalPages;
        break;
    }

    this.render();
  }

  setData(data) {
    this.data = [...data];
    this.filteredData = [...data];
    this.currentPage = 1;
    this.render();
  }

  refresh() {
    this.render();
  }
}

// Export components
window.Modal = Modal;
window.Toast = Toast;
window.DataTable = DataTable; 
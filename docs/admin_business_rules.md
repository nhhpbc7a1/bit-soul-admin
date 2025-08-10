### Dropshipping Admin Business Rules (v1.0)

- **scope**: Admin panel behavior, permissions, and UI/UX conventions for a dropshipping marketplace
- **references**: `functional_requirement.txt`, `use_case_specific.txt`
- **status**: Source of truth for decisions already made; future changes must update this file

### Permissions & Responsibilities
- **admin_role**:
  - View and audit data across the platform
  - Approve/reject product submissions
  - Hide/unhide products (soft delete)
  - Track shipments, view commission/financial breakdown
  - Suspend orders in exceptional cases (with reason)
- **admin_restrictions**:
  - No direct edit on orders (quantities, addresses, items, prices)
  - No product editing; no hard delete for products

### Product Management
- **product_types**:
  - **Sales Product**: Seller-side listing derived from a supplier SKU
  - **Supplier Product**: Origin SKU from supplier
  - **Pending Approval**: Awaiting admin review
- **admin_actions_products**:
  - Allowed: View details, Hide/Unhide, Approve/Reject (pending), View analytics (where applicable)
  - Not allowed: Edit, Hard delete
- **product_detail**:
  - Must include both `Seller Information` and `Supplier Information`
  - Show `Financial Summary` (selling price, supplier cost, platform fee, margin)
  - Related links: navigate to supplier SKU when relevant
- **approval_flow**:
  - Page: `products-approval` (sub-page: `products` → `approval`)
  - Includes checklist, approval notes, and actions (Approve, Reject, Request Changes)
  - Checklist gates approve action (must pass all items)

### Order Management
- **admin_actions_orders**:
  - Allowed: View Details, Track Shipment (anchor to `#shipping-details`), View Commission Details (anchor to `#financial-breakdown`), Print Invoice, Suspend Order (reason required)
  - Not allowed: Edit Order, Delete Order
- **order_detail**:
  - Must include `Shipping Details` with `Shipment Tracking`
  - Must include `Financial Breakdown` (Supplier Cost, Platform Fee, Seller Commission, Payment Processing, Platform Profit)
  - Must include `Payment Flow` visualization (Customer → Platform → Supplier/Seller)
- **ui_actions_placement**:
  - Page header: only navigation/back and page context; no duplicate action buttons
  - All admin actions consolidated under the `Admin Actions` card in the sidebar

### UI/UX Conventions
- **page_header**: Keep minimal (Back, title, subtitle/badges). Do not duplicate actions here
- **admin_actions**: Centralize actionable controls in a dedicated `Admin Actions` section (sidebar on desktop)
- **stat_cards**: Avoid on “manage” index pages unless directly supporting the task; removed on `categories`, `packages`, `complaints`
- **responsive_tables**: Ensure no horizontal overflow at target widths (e.g., 1522px), reduce columns or stack on narrow screens
- **anchors**: Use in-page anchors for deep sections (e.g., `#shipping-details`, `#financial-breakdown`)

### Navigation & Architecture
- **layout**: `index.html` is the main layout; content pages are loaded dynamically into `#page-content`
- **routing**: Sub-pages follow the pattern `page-subpage` (e.g., `products-approval`), navigated via `navigateTo('products', 'approval', id)`
- **external_pages**: Most content lives under `pages/<section>/...` and is fetched and injected dynamically
- **controller**: Expose `window.navigationController` globally for in-page actions to navigate reliably

### CSS & Components
- **switch_component**: Single source of truth in `styles/components.css`; `.switch` and `.slider` consolidated (border, checked states, transforms)
- **dropdowns**: Use `visibility: hidden/visible` + `pointer-events` for smooth transitions
- **deduplication**: Remove duplicate CSS from `styles/shared-pages.css` that conflicts with `components.css`

### Design Consistency
- **modern_style**: Dribbble-like look with clean spacing, cards, subtle shadows, and consistent badges
- **detail_pages**: Use `detail-card` blocks; include contextual stats/financials where relevant
- **icons/typography**: Font Awesome + Inter across pages

### Data Integrity & Audit
- **immutability**: Orders are transactional records; admin avoids direct mutation to preserve audit trails
- **soft_delete**: Products can be hidden/unhidden; no hard delete from admin UI
- **approvals**: Product go-live is gated by admin approval with rationale recorded

### Edge Cases & Exceptions
- **manual_order_entry**: Allowed only in exceptional cases (tooling: `Create/Manual Order Entry`), but does not imply edit rights post-creation
- **suspensions**: Suspending orders requires a reason; notify relevant parties in real implementation

### Future Changes
- Any change impacting these rules must be reflected here and validated against `functional_requirement.txt` and `use_case_specific.txt` 
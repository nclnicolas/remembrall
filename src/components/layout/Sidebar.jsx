import { NavLink } from 'react-router-dom'
import { NAV_ITEMS, ROUTES } from '../../constants/navigation'
import './Sidebar.css'

function navLinkClassName({ isActive }) {
  return isActive ? 'sidebar-link active' : 'sidebar-link'
}

function Sidebar({ isOpen, onClose, onCreateReminder }) {
  function handleCreateReminder() {
    onClose()
    onCreateReminder()
  }

  return (
    <aside
      id="app-sidebar"
      className={isOpen ? 'sidebar is-open' : 'sidebar'}
    >
      <div className="sidebar-header">
        <NavLink
          to={ROUTES.DASHBOARD}
          className="sidebar-logo"
          onClick={onClose}
        >
          Remembrall
        </NavLink>
        <button
          type="button"
          className="sidebar-close"
          onClick={onClose}
          aria-label="Close menu"
        >
          ✕
        </button>
      </div>

      <button
        type="button"
        className="sidebar-new-reminder"
        onClick={handleCreateReminder}
      >
        + New Reminder
      </button>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) =>
          item.children ? (
            <div className="sidebar-group" key={item.label}>
              <span className="sidebar-group-label">{item.label}</span>
              {item.children.map((child) => (
                <NavLink
                  key={child.path}
                  to={child.path}
                  className={navLinkClassName}
                  onClick={onClose}
                >
                  {child.label}
                </NavLink>
              ))}
            </div>
          ) : (
            <NavLink
              key={item.path}
              to={item.path}
              className={navLinkClassName}
              onClick={onClose}
            >
              {item.label}
            </NavLink>
          ),
        )}
      </nav>
    </aside>
  )
}

export default Sidebar

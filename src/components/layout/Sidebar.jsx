import { useId, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { NAV_ITEMS, ROUTES } from '../../constants/navigation'
import useTexts from '../../hooks/useTexts'
import './Sidebar.css'

function navLinkClassName({ isActive }) {
  return isActive ? 'sidebar-link active' : 'sidebar-link'
}

// Grupo de links que se puede expandir o contraer. Arranca abierto.
// Si se navega a uno de sus links estando cerrado, se abre para mostrar el link activo.
function SidebarGroup({ item, onNavigate }) {
  const texts = useTexts()
  const { pathname } = useLocation()
  const listId = useId()
  const [isExpanded, setIsExpanded] = useState(true)
  const [previousPathname, setPreviousPathname] = useState(pathname)

  if (pathname !== previousPathname) {
    setPreviousPathname(pathname)
    if (item.children.some((child) => child.path === pathname)) {
      setIsExpanded(true)
    }
  }

  return (
    <div className="sidebar-group">
      <button
        type="button"
        className="sidebar-group-toggle"
        onClick={() => setIsExpanded((current) => !current)}
        aria-expanded={isExpanded}
        aria-controls={listId}
      >
        {texts.nav[item.labelKey]}
      </button>
      <div id={listId} className="sidebar-group-links" hidden={!isExpanded}>
        {item.children.map((child) => (
          <NavLink
            key={child.path}
            to={child.path}
            className={navLinkClassName}
            onClick={onNavigate}
          >
            {texts.nav[child.labelKey]}
          </NavLink>
        ))}
      </div>
    </div>
  )
}

function Sidebar({ isOpen, onClose, onCreateReminder }) {
  const texts = useTexts()

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
          aria-label={texts.nav.closeMenu}
        >
          ✕
        </button>
      </div>

      <button
        type="button"
        className="sidebar-new-reminder"
        onClick={handleCreateReminder}
      >
        {texts.nav.newReminder}
      </button>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) =>
          item.children ? (
            <SidebarGroup key={item.labelKey} item={item} onNavigate={onClose} />
          ) : (
            <NavLink
              key={item.path}
              to={item.path}
              className={navLinkClassName}
              onClick={onClose}
            >
              {texts.nav[item.labelKey]}
            </NavLink>
          ),
        )}
      </nav>
    </aside>
  )
}

export default Sidebar

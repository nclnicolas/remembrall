import useTexts from '../../hooks/useTexts'
import './MobileHeader.css'

function MobileHeader({ isMenuOpen, onMenuClick }) {
  const texts = useTexts()

  return (
    <header className="mobile-header">
      <button
        type="button"
        className="mobile-header-toggle"
        onClick={onMenuClick}
        aria-label={texts.nav.openMenu}
        aria-expanded={isMenuOpen}
        aria-controls="app-sidebar"
      >
        ☰
      </button>
      <span className="mobile-header-title">Remembrall</span>
    </header>
  )
}

export default MobileHeader

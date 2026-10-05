import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import MobileHeader from './MobileHeader'
import Sidebar from './Sidebar'
import Footer from './Footer'
import './Layout.css'

function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const openMenu = () => setIsMenuOpen(true)
  const closeMenu = () => setIsMenuOpen(false)

  useEffect(() => {
    if (!isMenuOpen) return

    function handleKeyDown(event) {
      if (event.key === 'Escape') setIsMenuOpen(false)
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isMenuOpen])

  return (
    <div className={isMenuOpen ? 'layout menu-open' : 'layout'}>
      <Sidebar isOpen={isMenuOpen} onClose={closeMenu} />
      {isMenuOpen && (
        <div
          className="layout-backdrop"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}
      <div className="layout-content">
        <MobileHeader isMenuOpen={isMenuOpen} onMenuClick={openMenu} />
        <main className="layout-main">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  )
}

export default Layout

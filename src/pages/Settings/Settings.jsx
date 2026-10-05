import ThemeSelector from '../../components/settings/ThemeSelector'

function Settings() {
  return (
    <div>
      <h1>Settings</h1>
      <p>Configuración de Remembrall.</p>
      <section>
        <h2>Appearance</h2>
        <ThemeSelector />
      </section>
    </div>
  )
}

export default Settings

import useTexts from '../../hooks/useTexts'

function NotFound() {
  const texts = useTexts()

  return (
    <div>
      <h1>{texts.pages.notFound.title}</h1>
      <p>{texts.pages.notFound.message}</p>
    </div>
  )
}

export default NotFound

function BackButton({ onClick, t }) {
  return (
    <button className="back-button icon-only" type="button" onClick={onClick} aria-label={t('app.back')}>
      <span aria-hidden="true">←</span>
    </button>
  )
}

export default BackButton

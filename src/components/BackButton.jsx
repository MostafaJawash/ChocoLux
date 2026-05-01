function BackButton({ onClick, t }) {
  return (
    <button className="back-button" type="button" onClick={onClick}>
      <span aria-hidden="true">‹</span>
      {t('app.back')}
    </button>
  )
}

export default BackButton

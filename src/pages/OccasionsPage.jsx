import PageIntro from '../components/PageIntro'
function OccasionsPage({ occasions, isLoading, onSelect, t }) {
  return (
    <>
      <PageIntro
        eyebrow={t('steps.occasion')}
        title={t('occasions.title')}
        copy={t('occasions.copy')}
      />

      {isLoading ? (
        <div className="occasion-grid">
          {Array.from({ length: 4 }, (_, index) => (
            <div className="occasion-card skeleton" key={index} />
          ))}
        </div>
      ) : (
        <div className="occasion-grid">
          {occasions.map((occasion) => (
            <button
              className="occasion-card"
              type="button"
              key={occasion.id}
              onClick={() => onSelect(occasion)}
            >
              <span className="card-icon" aria-hidden="true">{t('icons.occasion')}</span>
              <span>{occasion.name}</span>
              <small>{occasion.description || t('occasions.fallback')}</small>
              <b>{t('occasions.select')}</b>
            </button>
          ))}
        </div>
      )}
    </>
  )
}

export default OccasionsPage

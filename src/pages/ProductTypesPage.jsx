import PageIntro from '../components/PageIntro'

function ProductTypesPage({ productTypes, isLoading, cardImage, onSelect, t }) {
  return (
    <>
      <PageIntro eyebrow={t('steps.types')} title={t('types.title')} copy={t('types.copy')} />

      {isLoading ? (
        <div className="choice-grid two-column">
          {Array.from({ length: 4 }, (_, index) => (
            <div className="choice-card skeleton" key={index} />
          ))}
        </div>
      ) : productTypes.length ? (
        <div className="choice-grid two-column">
          {productTypes.map((type) => (
            <button className="choice-card compact-choice" type="button" key={type.id} onClick={() => onSelect(type)}>
              <img src={cardImage} alt="" />
              <strong>{type.name}</strong>
            </button>
          ))}
        </div>
      ) : (
        <p className="notice">{t('types.empty')}</p>
      )}
    </>
  )
}

export default ProductTypesPage

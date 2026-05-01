import PageIntro from '../components/PageIntro'

function ProductTypesPage({ productTypes, isLoading, onSelect, t }) {
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
              <span aria-hidden="true">▣</span>
              <strong>{type.name}</strong>
              <small>{t('types.productType')}</small>
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

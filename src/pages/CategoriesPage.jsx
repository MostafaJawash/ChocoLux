import PageIntro from '../components/PageIntro'

function CategoriesPage({ categories, isLoading, onSelect, t }) {
  return (
    <>
      <PageIntro eyebrow={t('steps.categories')} title={t('categories.title')} copy={t('categories.copy')} />

      {isLoading ? (
        <div className="choice-grid">
          {Array.from({ length: 6 }, (_, index) => (
            <div className="choice-card skeleton" key={index} />
          ))}
        </div>
      ) : categories.length ? (
        <div className="choice-grid">
          {categories.map((category) => (
            <button className="choice-card" type="button" key={category.id} onClick={() => onSelect(category)}>
              <span aria-hidden="true">◆</span>
              <strong>{category.name}</strong>
              <small>{t('categories.fallback')}</small>
              <b>{t('categories.select')}</b>
            </button>
          ))}
        </div>
      ) : (
        <p className="notice">{t('categories.empty')}</p>
      )}
    </>
  )
}

export default CategoriesPage

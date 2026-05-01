import PageIntro from '../components/PageIntro'

function SectionsPage({ sections, isLoading, onSelect, t }) {
  return (
    <>
      <PageIntro eyebrow={t('steps.sections')} title={t('sections.title')} copy={t('sections.copy')} />

      {isLoading ? (
        <div className="choice-grid two-column">
          {Array.from({ length: 4 }, (_, index) => (
            <div className="choice-card skeleton" key={index} />
          ))}
        </div>
      ) : sections.length ? (
        <div className="choice-grid two-column">
          {sections.map((section) => (
            <button className="choice-card compact-choice" type="button" key={section.id} onClick={() => onSelect(section)}>
              <span aria-hidden="true">◈</span>
              <strong>{section.name}</strong>
              <small>{t('sections.select')}</small>
            </button>
          ))}
        </div>
      ) : (
        <p className="notice">{t('sections.empty')}</p>
      )}
    </>
  )
}

export default SectionsPage

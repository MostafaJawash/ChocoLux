import { useState } from 'react'
import PageIntro from '../components/PageIntro'

function ProfilePage({ initialProfile, onSubmit, t }) {
  const [profile, setProfile] = useState(initialProfile)

  return (
    <>
      <PageIntro eyebrow={t('steps.profile')} title={t('profile.title')} copy={t('profile.copy')} />
      <form
        className="checkout-form panel profile-panel"
        onSubmit={(event) => {
          event.preventDefault()
          onSubmit(profile)
        }}
      >
        <label>
          {t('profile.fullName')}
          <input
            required
            value={profile.full_name}
            onChange={(event) => setProfile((value) => ({ ...value, full_name: event.target.value }))}
            placeholder={t('profile.fullNamePlaceholder')}
          />
        </label>
        <label>
          {t('checkout.phone')}
          <input
            required
            value={profile.phone}
            onChange={(event) => setProfile((value) => ({ ...value, phone: event.target.value }))}
            placeholder={t('checkout.phonePlaceholder')}
          />
        </label>
        <button className="primary-button" type="submit">
          {t('profile.save')}
        </button>
      </form>
    </>
  )
}

export default ProfilePage

import { useState } from 'react'
import PageIntro from '../components/PageIntro'

function ProfilePage({ initialProfile, onSubmit, t, error = '' }) {
  const [profile, setProfile] = useState(initialProfile)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [localError, setLocalError] = useState(error)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLocalError('')
    setIsSubmitting(true)
    try {
      await onSubmit(profile)
    } catch (err) {
      setLocalError(err.message || t('app.profileError'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <PageIntro eyebrow={t('steps.profile')} title={t('profile.title')} copy={t('profile.copy')} />
      {localError && <p className="notice notice-error">{localError}</p>}
      <form className="checkout-form panel profile-panel" onSubmit={handleSubmit}>
        <label>
          {t('profile.fullName')}
          <input
            required
            value={profile.full_name}
            onChange={(event) => {
              setProfile((value) => ({ ...value, full_name: event.target.value }))
              setLocalError('')
            }}
            placeholder={t('profile.fullNamePlaceholder')}
            disabled={isSubmitting}
          />
        </label>
        <label>
          {t('checkout.phone')}
          <input
            required
            value={profile.phone}
            onChange={(event) => {
              setProfile((value) => ({ ...value, phone: event.target.value }))
              setLocalError('')
            }}
            placeholder={t('checkout.phonePlaceholder')}
            disabled={isSubmitting}
          />
        </label>
        <button className="primary-button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? t('checkout.submitting') : t('profile.save')}
        </button>
      </form>
    </>
  )
}

export default ProfilePage

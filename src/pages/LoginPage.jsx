import { useState } from 'react'
import PageIntro from '../components/PageIntro'

function LoginPage({ initialPhone = '', onSubmit, t }) {
  const [phone, setPhone] = useState(initialPhone)

  return (
    <>
      <PageIntro eyebrow={t('steps.login')} title={t('login.title')} copy={t('login.copy')} />
      <form
        className="checkout-form panel login-panel"
        onSubmit={(event) => {
          event.preventDefault()
          onSubmit(phone)
        }}
      >
        <label>
          {t('checkout.phone')}
          <input
            required
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder={t('checkout.phonePlaceholder')}
          />
        </label>
        <button className="primary-button" type="submit">
          {t('login.submit')}
        </button>
      </form>
    </>
  )
}

export default LoginPage

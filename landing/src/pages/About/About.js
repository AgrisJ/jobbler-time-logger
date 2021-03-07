import React from 'react'
import { useIntl } from 'react-intl'

const AboutPage = () => {
  const intl = useIntl()
  return <div class="page">{intl.formatMessage({ id: 'about' })}</div>
}

export default AboutPage

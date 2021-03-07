import React from 'react'
import { useIntl } from 'react-intl'

const PageNotFound = () => {
    const intl = useIntl()
    return (
        <div class="page">
            <h2>{intl.formatMessage({ id: 'page_not_found' })}</h2>
            <p>{intl.formatMessage({ id: 'page_not_found_message' })}</p>
        </div>
    );
}
export default PageNotFound

const locales = [
    {
        locale: 'en',
        messages: import('./en'),
        //loadData: import(`@formatjs/intl-relativetimeformat/dist/locale-data/en`),
    },
    {
        locale: 'dk',
        messages: import('./dk'),
        //loadData: import(`@formatjs/intl-relativetimeformat/dist/locale-data/ru`),
    },
    {
        locale: 'lv',
        messages: import('./lv'),
        //loadData: import(`@formatjs/intl-relativetimeformat/dist/locale-data/de`),
    },
]

export default locales

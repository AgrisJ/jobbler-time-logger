// AVAILABLE THEMES:
// 'sidnabyg','jobbler'
export const CURRENT_THEME = "sidnabyg"; // change also in package.json "name" // for "themecopy" command

const themeVariables = require(`./themes/${CURRENT_THEME}/theme_variables`);
const companyDataVariables = require(`./themes/${CURRENT_THEME}/companyDataVariables`);
const api_url = require(`./themes/${CURRENT_THEME}/api_url`);

const importDropdownCSS = () => {
  /* eslint-disable no-unused-expressions */
  import(`../config/themes/${CURRENT_THEME}/dropdown.css`);
};

export const globalConfig = {
  CONFIG_themeVariables: themeVariables.themeVariables,
  CONFIG_companyDataVariables: companyDataVariables.companyDataVariables,
  CONFIG_API_URL: api_url.API_URL,
  CONFIG_USE_DROPDOWN_CSS: importDropdownCSS,
};

import { themeVariables } from "./theme_variables_sidnabyg";
import { companyDataVariables } from "./companyDataVariables_sidnabyg";
// import { themeVariables } from './theme_variables_jobbler';
// import { companyDataVariables } from './companyDataVariables_jobbler';

/*
	INFO: To change DROPDOWN styles the whole ./Styles/dropdown.css file should be switched
*/
export const globalConfig = {
  CONFIG_themeVariables: themeVariables,
  CONFIG_companyDataVariables: companyDataVariables,
  // TODO CONFIG variables: add icon paths as well
  // TODO CONFIG variables: think of env.production variable solution here too
  // REACT_APP_API_URL="https://demo.jobbler.dk"
  // REACT_APP_COMPANY_ID="602a645b88f8d210d6c34ca9"
};

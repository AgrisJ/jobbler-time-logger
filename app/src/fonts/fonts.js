import { createGlobalStyle } from 'styled-components/macro';

import ExpletusSansWoff from './expletusSans.woff';
import ExpletusSansWoff2 from './expletusSans.woff2';
import RobotoThinWoff from './robotoThin.woff';
import RobotoThinWoff2 from './robotoThin.woff2';
import RobotoLightV2Woff from './robotoLightV2.woff';
import RobotoLightV2Woff2 from './robotoLightV2.woff2';

export default createGlobalStyle`
	@font-face {
		font-family: 'Expletus Sans';
		src: local('Expletus Sans'), local('ExpletusSans'),
		url(${ExpletusSansWoff2}) format('woff2'),
		url(${ExpletusSansWoff}) format('woff');
		font-style: normal;
		font-weight: normal;
	}
	@font-face {
		font-family: 'Roboto Thin';
		src: local('Roboto Thin'), local('RobotoThin'),
		url(${RobotoThinWoff2}) format('woff2'),
		url(${RobotoThinWoff}) format('woff');
		font-style: normal;
		font-weight: normal;
	}
	@font-face {
		font-family: 'Roboto Light';
		src: local('Roboto Light'), local('RobotoLight'),
		url(${RobotoLightV2Woff2}) format('woff2'),
		url(${RobotoLightV2Woff}) format('woff');
		font-style: normal;
		font-weight: normal;
	}
`
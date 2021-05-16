import React, { useEffect, useState } from 'react'
import { languageData } from './../../languages/language_variables';
import parse from 'html-react-parser';
import { getlanguage } from './../../Store/slices/language';
import { connect } from 'react-redux';

function AppLocker({ language }) {

	const {
		_ACCESSDENIED,
		_REMOVEDIF
	} = languageData.COMPONENTS.AppLocker;

	const styles = {
		container: {
			height: '100vh',
			position: 'fixed',
			width: '100vw',
			left: '0px',
			top: '0px',
			background: 'rgba(0, 0, 0, 0.8)',
			zIndex: '100',
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
			color: 'white',
			transition: 'all 1s',
			WebkitUserSelect: 'none', /* Safari */
			msUserSelect: 'none', /* IE 10 and IE 11 */
			userSelect: 'none', /* Standard syntax */
			zIndex: '100000000000000000000000000000000000'
		},
		h1: {
			fontSize: '5em',
			fontWeight: '400',
			background: 'linear-gradient(90deg, rgb(213 96 64) 0%, rgb(255 211 96) 100%)',
			color: 'transparent',
			WebkitBackgroundClip: 'text',
			backgroundClip: 'text',
			fontFamily: 'Expletus Sans',
			textAlign: 'center',
			lineHeight: '1em'
		},
		p: {
			fontSize: '1.2em',
			color: '#ffd459',
			marginTop: '1em',
			textAlign: 'center'
		},
		span: {
			color: '#fff',

		}
	}


	return (
		<>
			<div style={styles.container}>
				<>
					<h1 style={styles.h1}>{_ACCESSDENIED[language]}</h1>
					<p style={styles.p}>{parse(_REMOVEDIF[language])}</p>
				</>
			</div>
		</>
	)
}

const mapStateToProps = state =>
({
	language: getlanguage(state)
})


// mapStateToProps takes state of the store and returns the part you are interested in:
// the properties of this object will end up as props of our componennt
export default connect(mapStateToProps)(AppLocker);

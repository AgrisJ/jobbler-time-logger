import React, { useEffect } from 'react'
import { connect } from 'react-redux';
import { getcurrentModeIndex, currentModeIndexChanged } from '../../Store/slices/currentModeIndex';
import { ControlPanelH1 } from './ModeSwitcherElements';
import { isLocalStored } from './../services/helpfulFunctions';


function ModeSwitcher({ currentModeIndex, titles, dispatch }) {

	const _onClickDataMode = () => {
		const endIndex = titles.length - 1;
		if (currentModeIndex === endIndex) dispatch(currentModeIndexChanged(0));
		else dispatch(currentModeIndexChanged(currentModeIndex + 1))
	}

	useEffect(() => {
		isLocalStored('currentModeIndex') && dispatch(currentModeIndexChanged(+isLocalStored('currentModeIndex')));
	}, []);


	return (
		<>
			<ControlPanelH1 onClick={_onClickDataMode}>{titles[currentModeIndex]}</ControlPanelH1>
		</>
	)
}

const mapStateToProps = state =>
({
	currentModeIndex: getcurrentModeIndex(state)
})


// mapStateToProps takes state of the store and returns the part you are interested in:
// the properties of this object will end up as props of our componennt
export default connect(mapStateToProps)(ModeSwitcher);



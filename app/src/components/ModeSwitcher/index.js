import React, { useEffect } from 'react'
import { connect } from 'react-redux';
import { getcurrentModeIndex, currentModeIndexChanged } from '../../Store/slices/currentModeIndex';
import { ModeSwitcherH1, ModeSwitcher_BackwardCaret, ModeSwitcher_ForwardCaret, ModeSwitcher_Container } from './ModeSwitcherElements';
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

		<ModeSwitcher_Container>
			<ModeSwitcher_BackwardCaret onClick={_onClickDataMode} />
			<ModeSwitcherH1 onClick={_onClickDataMode}>{titles[currentModeIndex]}</ModeSwitcherH1>
			<ModeSwitcher_ForwardCaret onClick={_onClickDataMode} />
		</ModeSwitcher_Container>

	)
}

const mapStateToProps = state =>
({
	currentModeIndex: getcurrentModeIndex(state)
})


// mapStateToProps takes state of the store and returns the part you are interested in:
// the properties of this object will end up as props of our componennt
export default connect(mapStateToProps)(ModeSwitcher);



import React, { useCallback, useEffect, useState } from 'react'
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import '../../Styles/dropdown.css'
import { ControlPanelContainer, ControlPanelContent, ControlPanelMonth, TotalDisplay, TotalDisplayWrapper, TotalTime, BackwardCaret, ForwardCaret, CardCounter } from './ControlPanelElements'
import { getProjectArray } from '../../Store/slices/projects';
import { connect } from 'react-redux';
import { getUsersArray } from '../../Store/slices/users';
import { getTimecardArray } from './../../Store/slices/timecards';
import { getMonthIndex, monthIndexChanged } from '../../Store/slices/monthIndex';
import { currentAddressChanged, getcurrentAddress } from '../../Store/slices/currentAddress';
import { currentContractorChanged, getcurrentContractor } from '../../Store/slices/currentContractor';
import { getcurrentModeIndex } from '../../Store/slices/currentModeIndex';
import { gettotalTime } from '../../Store/slices/totalTime';
import { getcardCount } from '../../Store/slices/cardCount';
import Checkbox from './../Checkbox/index';
import SelectUsers from '../SelectUsers';
import { isLocalStored } from './../services/helpfulFunctions';
import ModeSwitcher from '../ModeSwitcher';

function ControlPanelSection({ projects, users, timecards, monthIndex, currentAddress, currentContractor, currentModeIndex, totalTime, cardCount, dispatch, setprintAllChecked, printAllChecked }) {
	const addresses = projects.map(project => {
		return { address: project.address, projectId: project.id }
	}
	);

	const contractors = users.map(card => card.name);
	const monthNow = new Date().getMonth();
	const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
	const IS_PRINT_MODE = ['print'].some(item => window.location.href.indexOf(item) !== -1) ? true : false;
	const [{ listCardCount }, setListCardCount] = useState({ listCardCount: [] });

	const listIds =
		useCallback(() => idListPerMode(currentModeIndex)
			.map(id => {

				let propForMode = null;
				if (currentModeIndex === 0) propForMode = 'projectId';
				if (currentModeIndex === 1) propForMode = 'userId';

				return timecards
					.filter(card => card[propForMode] === id)
					.filter(card => card.jobDate.split('.')[1] - 1 === monthIndex).length
			}
			), [currentModeIndex, monthIndex, timecards]);
	const firstAddress = useCallback(() => (addresses[1] ? { address: addresses[1].address, projectId: addresses[1].projectId } : null), [addresses]);
	const firstContractor = contractors[0];
	const firstTimeLoadedAddress = firstAddress() && currentAddress.address === '';
	const firstTimeLoadedContractor = firstContractor && !currentContractor;
	useEffect(() => {
		dispatch(monthIndexChanged({ monthIndex: monthNow || 0 }));
		isLocalStored('monthIndex') && dispatch(monthIndexChanged({ monthIndex: +isLocalStored('monthIndex') }));
	}, []);
	useEffect(() => { localStorage.setItem('monthIndex', monthIndex) }, [monthIndex]);
	useEffect(() => { localStorage.setItem('currentModeIndex', currentModeIndex) }, [currentModeIndex]);
	useEffect(() => { firstTimeLoadedAddress && dispatch(currentAddressChanged(firstAddress())) }, [firstAddress, firstTimeLoadedAddress]);
	useEffect(() => { firstTimeLoadedContractor && dispatch(currentContractorChanged(firstContractor)) }, [firstContractor, firstTimeLoadedContractor]);
	useEffect(() => { currentAddress && localStorage.setItem('currentAddress', JSON.stringify(currentAddress)) }, [currentAddress]);
	useEffect(() => { currentContractor && localStorage.setItem('currentContractor', currentContractor) }, [currentContractor]);
	useEffect(() => { setListCardCount({ listCardCount: listIds() }); }, [monthIndex, currentAddress, currentContractor, listIds]);

	const defaultMonth = months[monthIndex];
	const _onSelectMonth = event => {
		const foundIndex = months.indexOf(event.value);
		dispatch(monthIndexChanged({ monthIndex: foundIndex }));
	};

	const prevMonth = () => (dispatch(monthIndexChanged({ monthIndex: monthIndex ? monthIndex - 1 : months.length - 1 })));
	const nextMonth = () => (dispatch(monthIndexChanged({ monthIndex: monthIndex < months.length - 1 ? monthIndex + 1 : 0 })));
	const hours = time => Math.floor(time);
	const minutes = time => ((time - hours(time)) * 60).toPrecision(2) / 1;
	const formattedTime = time => (`${hours(time)}h ${minutes(time)}min`);

	function idListPerMode(mode) {
		let resultIds = [];

		switch (mode) {
			case 0:
				resultIds = addresses.map(card => card.projectId)
				break;
			case 1:
				resultIds = users.map(card => card.id);
				break;

			default:

		}
		return resultIds;
	}

	const handlePrintAllCheckboxChange = event => {
		setprintAllChecked({ printAllChecked: event.target.checked });
	}

	return (
		<>
			<ControlPanelContainer>
				<ControlPanelContent>
					<ModeSwitcher titles={['Project hours', 'Contractor Hours']} />
					<ControlPanelMonth>
						<BackwardCaret onClick={prevMonth} />
						<Dropdown
							options={months}
							onChange={_onSelectMonth}
							value={defaultMonth}
							menuClassName='monthMenuClass'
							className='monthMenuClass'
							placeholderClassName='monthMenuClass'
							controlClassName='monthControlClass'
							arrowClosed={<span className="" />}
							arrowOpen={<span className="" />} />
						<ForwardCaret onClick={nextMonth} />
					</ControlPanelMonth>

					{IS_PRINT_MODE && <Checkbox
						checked={printAllChecked}
						onChange={handlePrintAllCheckboxChange}
						labelText={'Select All'}
					/>}

					{!IS_PRINT_MODE && <TotalDisplayWrapper>

						<SelectUsers listCardCount={listCardCount} />
						<TotalDisplay>
							Total: <TotalTime>{formattedTime(totalTime)}</TotalTime>
						</TotalDisplay>
					</TotalDisplayWrapper>}
					{!IS_PRINT_MODE && <CardCounter>{`${cardCount} entries`}</CardCounter>}
				</ControlPanelContent>
			</ControlPanelContainer>
		</>
	)
}


const mapStateToProps = state =>
({
	projects: getProjectArray(state),
	users: getUsersArray(state),
	timecards: getTimecardArray(state),
	monthIndex: getMonthIndex(state),
	currentAddress: getcurrentAddress(state),
	currentContractor: getcurrentContractor(state),
	currentModeIndex: getcurrentModeIndex(state),
	totalTime: gettotalTime(state),
	cardCount: getcardCount(state)

})


// mapStateToProps takes state of the store and returns the part you are interested in:
// the properties of this object will end up as props of our componennt
export default connect(mapStateToProps)(ControlPanelSection);

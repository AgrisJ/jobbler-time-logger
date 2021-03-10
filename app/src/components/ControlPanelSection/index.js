import React, { useCallback, useEffect, useState } from 'react'
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import '../../Styles/dropdown.css'
import { ControlPanelContainer, ControlPanelContent, ControlPanelMonth, TotalDisplay, TotalDisplayWrapper, TotalTime, BackwardCaret, ForwardCaret, CardCounter, AddCardButton } from './ControlPanelElements'
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
import { getLoginData, loggedIn } from '../../Store/slices/login';
import { timeFormat } from '../ContentSection';
import { useHistory } from 'react-router-dom';

function ControlPanelSection(
	{
		isAdmin,
		login,
		projects,
		users,
		timecards,
		monthIndex = 0,
		currentAddress,
		currentContractor,
		currentModeIndex,
		totalTime,
		cardCount,
		dispatch,
		setprintAllChecked,
		printAllChecked,
		setnotesModeOn,
		notesModeOn
	}
) {
	let history = useHistory();

	const addresses = projects.map(project => {
		return { id: project.id, address: project.address, projectId: project.projectId }
	}
	);
	const loggedInUserId = login.userId;
	const contractors = users.map(card => ({ name: card.name, userId: card.userId }));
	const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
	const IS_PRINT_MODE = ['print'].some(item => window.location.href.indexOf(item) !== -1) ? true : false;
	const [{ listCardCount }, setListCardCount] = useState({ listCardCount: [] });
	const [{ monthNow }, setmonthNow] = useState({ monthNow: new Date() });

	const listIds =
		useCallback(() => idListPerMode(currentModeIndex)
			.map(id => {

				let propForMode = null;
				if (currentModeIndex === 0) propForMode = 'projectId';
				if (currentModeIndex === 1) propForMode = 'userId';

				return timecards
					.filter(c => isAdmin ? c : c.userId === loggedInUserId)
					.filter(card => card[propForMode] === id)
					.filter(card => card.startTime.split('-')[1] - 1 === monthIndex).length
			}
			), [currentModeIndex, monthIndex, timecards]);
	const firstAddress = useCallback(() => (addresses[0] ? { id: addresses[0].id, address: addresses[0].address, projectId: addresses[0].projectId, loading: false } : null), [addresses]);
	const firstContractor = contractors[0];
	const firstTimeLoadedAddress = firstAddress() && currentAddress.address === null;
	const firstTimeLoadedContractor = firstContractor && !currentContractor;

	useEffect(() => {
		const getMonth = monthNow !== null ? monthNow.getMonth() : null;
		dispatch(monthIndexChanged({ monthIndex: getMonth || 0 }));
		isLocalStored('monthIndex') && dispatch(monthIndexChanged({ monthIndex: +isLocalStored('monthIndex') }));

	}, []);

	useEffect(() => { localStorage.setItem('monthIndex', monthIndex) }, [monthIndex]);
	useEffect(() => { localStorage.setItem('currentModeIndex', currentModeIndex) }, [currentModeIndex]);
	useEffect(() => { firstTimeLoadedAddress && dispatch(currentAddressChanged(firstAddress())) }, [firstAddress, firstTimeLoadedAddress]);
	useEffect(() => { firstTimeLoadedContractor && dispatch(currentContractorChanged(firstContractor)) }, [firstContractor, firstTimeLoadedContractor]);
	useEffect(() => { currentAddress && localStorage.setItem('currentAddress', JSON.stringify(currentAddress)) }, [currentAddress]);
	useEffect(() => { currentContractor && localStorage.setItem('currentContractor', JSON.stringify(currentContractor)) }, [currentContractor]);
	useEffect(() => { setListCardCount({ listCardCount: listIds() }); }, [monthIndex, currentAddress, currentContractor, listIds]);

	const defaultMonth = months[monthIndex];
	const _onSelectMonth = event => {
		const foundIndex = months.indexOf(event.value);
		const isMonthIndex = typeof monthIndex !== 'undefined' || monthIndex !== null;
		if (isMonthIndex) dispatch(monthIndexChanged({ monthIndex: foundIndex }));
	};

	const prevMonth = () => (dispatch(monthIndexChanged({ monthIndex: monthIndex ? monthIndex - 1 : months.length - 1 })));
	const nextMonth = () => (dispatch(monthIndexChanged({ monthIndex: monthIndex < months.length - 1 ? monthIndex + 1 : 0 })));

	function idListPerMode(mode) {
		let resultIds = [];

		switch (mode) {

			case 0:
				resultIds = addresses.map(card => card.projectId)
				break;
			case 1:
				resultIds = users.map(card => card.userId);
				break;

			default:

		}
		return resultIds;
	}

	const handlePrintAllCheckboxChange = event => {
		setprintAllChecked({ printAllChecked: event.target.checked });
	}
	const handleNotesModeCheckboxChange = event => {
		setnotesModeOn({ notesModeOn: event.target.checked });
	}

	const navigateAddEntryPage = () => history.push("/addentry");
	const isContractorMode = currentModeIndex === 1;

	function ONLY_ON_PRINT_MODULES() {
		if (IS_PRINT_MODE)
			return (
				<>
					<div style={{ display: 'flex' }}>
						<Checkbox
							checked={printAllChecked}
							onChange={handlePrintAllCheckboxChange}
							labelText={'Select All'}
						/>
						{isContractorMode &&
							<Checkbox
								checked={notesModeOn}
								onChange={handleNotesModeCheckboxChange}
								labelText={'Notes On/Off'}
							/>}
					</div>
				</>
			)
		else return null;
	}

	function HIDE_ON_PRINT_MODULES() {
		if (!IS_PRINT_MODE)
			return (
				<>
					<TotalDisplayWrapper>
						<SelectUsers listCardCount={listCardCount} isAdmin={isAdmin} /* manualOverride={isAdmin ? 1 : null} */ />
						<TotalDisplay>
							Total: <TotalTime>{timeFormat(totalTime)}</TotalTime>
						</TotalDisplay>
					</TotalDisplayWrapper>
					<CardCounter>{`${cardCount} entries`}</CardCounter>
					{isAdmin && isContractorMode ?
						<AddCardButton onClick={navigateAddEntryPage} /> : null}
				</>
			)
		else return null;
	}


	return (
		<>
			<ControlPanelContainer>
				<ControlPanelContent>
					{isAdmin ? <ModeSwitcher titles={['Project hours', 'Contractor Hours']} /> : null}
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
					{ONLY_ON_PRINT_MODULES()}
					{HIDE_ON_PRINT_MODULES()}
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
	cardCount: getcardCount(state),
	login: getLoginData(state)

})


// mapStateToProps takes state of the store and returns the part you are interested in:
// the properties of this object will end up as props of our componennt
export default connect(mapStateToProps)(ControlPanelSection);

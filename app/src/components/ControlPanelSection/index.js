import React, { useCallback, useEffect, useState } from 'react'
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import './dropdown.css'
import { ControlPanelContainer, ControlPanelContent, ControlPanelH1, ControlPanelMonth, TotalDisplay, TotalDisplayWrapper, TotalTime, BackwardCaret, ForwardCaret, CardCounter } from './ControlPanelElements'
import ContentSection from '../ContentSection';
import { getProjectArray } from '../../Store/slices/projects';
import { connect } from 'react-redux';
import { getUsersArray } from '../../Store/slices/users';
import { getTimecardArray } from './../../Store/slices/timecards';

function ControlPanelSection({ projects, users, timecards }) {
	const addresses = projects.map(project => {
		return { address: project.address, projectId: project.id }
	}
	);

	const contractors = users.map(card => card.name);
	const monthNow = new Date().getMonth();
	const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
	const dataModes = ['Project hours', 'Contractor Hours'];

	const [{ monthIndex }, setMonthIndex] = useState({ monthIndex: monthNow || 0 });
	const [{ currentAddress }, setCurrentAddress] = useState({ currentAddress: { address: addresses[0].address, projectId: addresses[0].projectId } });
	const [{ currentContractor }, setCurrentContractor] = useState({ currentContractor: contractors[0] });
	const [{ currentModeIndex }, setCurrentModeIndex] = useState({ currentModeIndex: 0 });
	const [{ totalTime }, setTotalTime] = useState({ totalTime: 0 });
	const [{ cardCount }, setCardCount] = useState({ cardCount: 0 });
	const [{ listCardCount }, setListCardCount] = useState({ listCardCount: [] });

	const firstMode = currentModeIndex === 0; // Project hours
	const secondMode = currentModeIndex === 1; // Contractor hours

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
		isLocalStored('monthIndex') && setMonthIndex({ monthIndex: +isLocalStored('monthIndex') });
		isLocalStored('currentAddress') && setCurrentAddress({ currentAddress: JSON.parse(isLocalStored('currentAddress')) });
		isLocalStored('currentContractor') && setCurrentContractor({ currentContractor: isLocalStored('currentContractor') });
		isLocalStored('currentModeIndex') && setCurrentModeIndex({ currentModeIndex: +isLocalStored('currentModeIndex') });

	}, []);
	useEffect(() => { localStorage.setItem('monthIndex', monthIndex) }, [monthIndex]);
	useEffect(() => { localStorage.setItem('currentModeIndex', currentModeIndex) }, [currentModeIndex]);
	useEffect(() => { firstTimeLoadedAddress && setCurrentAddress({ currentAddress: firstAddress() }) }, [firstAddress, firstTimeLoadedAddress]);
	useEffect(() => { firstTimeLoadedContractor && setCurrentContractor({ currentContractor: firstContractor }) }, [firstContractor, firstTimeLoadedContractor]);
	useEffect(() => { currentAddress && localStorage.setItem('currentAddress', JSON.stringify(currentAddress)) }, [currentAddress]);
	useEffect(() => { currentContractor && localStorage.setItem('currentContractor', currentContractor) }, [currentContractor]);
	useEffect(() => { setListCardCount({ listCardCount: listIds() }); }, [monthIndex, currentAddress, currentContractor, listIds]);

	function selectSrc(src, path) {
		const exists = src => src !== undefined;
		const sourceIsViable = src => exists(src);
		return sourceIsViable(src) ? src.props[path] : []
	};

	const defaultMonth = months[monthIndex];
	const _onSelectAddress = event => setCurrentAddress({ currentAddress: { address: selectSrc(event.value, 'item'), projectId: addresses.find(a => a.address === selectSrc(event.value, 'item')).projectId } });
	const _onSelectContractor = event => {
		setCurrentContractor({ currentContractor: selectSrc(event.value, 'item') })
	};
	const _onSelectMonth = event => {
		const foundIndex = months.indexOf(event.value);
		setMonthIndex({ monthIndex: foundIndex });
	};
	const _onClickDataMode = () => {
		const endIndex = dataModes.length - 1;
		if (currentModeIndex === endIndex) setCurrentModeIndex({ currentModeIndex: 0 });
		else setCurrentModeIndex({ currentModeIndex: currentModeIndex + 1 })
	}
	const selectingDataMode = event => {
		if (currentModeIndex === 0) return _onSelectAddress(event);  // Project hours
		if (currentModeIndex === 1) return _onSelectContractor(event); // Contractor hours
	}

	const prevMonth = () => (setMonthIndex({ monthIndex: monthIndex ? monthIndex - 1 : months.length - 1 }));
	const nextMonth = () => (setMonthIndex({ monthIndex: monthIndex < months.length - 1 ? monthIndex + 1 : 0 }));
	const hours = time => Math.floor(time);
	const minutes = time => ((time - hours(time)) * 60).toPrecision(2) / 1;
	const formattedTime = time => (`${hours(time)}h ${minutes(time)}min`);

	function contentListPerMode(mode) {
		let result = [];
		const countStyle = {
			fontSize: '0.7em',
			background: '#e2e2e2',
			padding: '3px 4px',
			borderRadius: '6px',
			marginLeft: '15px'
		};
		function Counter({ children, count }) {
			return <span style={{
				...countStyle,
				color: count > 0 ? '#484848' : '#aaaaaa'
			}
			}>{children}</span>;
		}
		function ListItem({ item, count }) {
			return <React.Fragment>{item} <Counter count={count}>{count}</Counter></React.Fragment>;
		}

		switch (mode) {

			case 0:
				result = addresses.map((a, index) => {
					const address = a.address;
					const count = listCardCount[index];

					if (index > 0)
						return <ListItem key={`${address}-${a.projectId}`} item={address} count={count} />;
					else
						return <></>;
				}
				).filter(a => a.props.hasOwnProperty('item'));
				break;

			case 1:
				result = users.map((user, index) => {
					const name = user.name;
					const count = listCardCount[index];
					return <ListItem key={`${name}-${user.id}`} item={name} count={count} />;
				}
				);
				break;

			default:

		}

		return result;
	}
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

	function savedChosenOption() {
		function address() { return contentListPerMode(currentModeIndex).find(address => selectSrc(address, 'item') === currentAddress.address) };
		function contractor() { return contentListPerMode(currentModeIndex).find(name => selectSrc(name, 'item') === currentContractor); }

		if (firstMode) return selectSrc(address(), 'item');
		if (secondMode) return selectSrc(contractor(), 'item');
	}

	function isLocalStored(name) {
		if (localStorage.getItem(name) === 'undefined') return false;
		if (localStorage.getItem(name)) return localStorage.getItem(name);
		return false
	};

	return (
		<>
			<ControlPanelContainer>
				{/* <ControlPanelBg>
					<VideoBg></VideoBg>
				</ControlPanelBg> */}
				<ControlPanelContent>
					<ControlPanelH1 onClick={_onClickDataMode}>{dataModes[currentModeIndex]}</ControlPanelH1>
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

					<TotalDisplayWrapper>
						<Dropdown
							options={contentListPerMode(currentModeIndex)}
							onChange={event => { selectingDataMode(event) }}
							value={savedChosenOption()}
							menuClassName='menuClass'
							className='menuClass'
							placeholderClassName='menuClass'
							controlClassName='controlClass'
							arrowClosed={<span className="arrow-closed" />}
							arrowOpen={<span className="arrow-open" />} />
						<TotalDisplay>
							Total: <TotalTime>{formattedTime(totalTime)}</TotalTime>
						</TotalDisplay>
					</TotalDisplayWrapper>
					<CardCounter>{`${cardCount} entries`}</CardCounter>
				</ControlPanelContent>
				<ContentSection
					projectId={currentAddress.projectId}
					setTotalTime={setTotalTime}
					selectedMonth={monthIndex}
					selectedContractor={currentContractor}
					currentModeIndex={currentModeIndex}
					setCardCount={setCardCount}
				/>
			</ControlPanelContainer>
		</>
	)
}


const mapStateToProps = state =>
({
	projects: getProjectArray(state),
	users: getUsersArray(state),
	timecards: getTimecardArray(state)
})


// mapStateToProps takes state of the store and returns the part you are interested in:
// the properties of this object will end up as props of our componennt
export default connect(mapStateToProps)(ControlPanelSection);

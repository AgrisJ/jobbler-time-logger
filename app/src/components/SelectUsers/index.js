import React, { useEffect } from 'react'
import { SelecUsersContainer } from './SelectUsersElements';
import Dropdown from 'react-dropdown';
import '../../Styles/dropdown.css'
import { connect } from 'react-redux';
import { getcurrentModeIndex } from '../../Store/slices/currentModeIndex';
import { currentAddressChanged, getcurrentAddress } from '../../Store/slices/currentAddress';
import { currentContractorChanged, getcurrentContractor } from '../../Store/slices/currentContractor';
import { getProjectArray } from '../../Store/slices/projects';
import { getUsersArray } from '../../Store/slices/users';
import { gettotalTime } from '../../Store/slices/totalTime';

function SelectUsers({ currentModeIndex, projects, users, currentContractor, currentAddress, listCardCount = [], dispatch }) {
	const addresses = projects.map(project => {
		return { address: project.address, projectId: project.id }
	});
	const firstMode = currentModeIndex === 0; // Project hours
	const secondMode = currentModeIndex === 1; // Contractor hours

	function isLocalStored(name) {
		if (localStorage.getItem(name) === 'undefined') return false;
		if (localStorage.getItem(name)) return localStorage.getItem(name);
		return false
	};

	useEffect(() => {
		const firstAddress = typeof addresses[0] !== 'undefined' ? addresses[0].address : null;
		const firstAddressId = typeof addresses[0] !== 'undefined' ? addresses[0].projectId : null;
		dispatch(currentAddressChanged({ address: firstAddress, projectId: firstAddressId }));
		isLocalStored('currentAddress') && dispatch(currentAddressChanged(JSON.parse(isLocalStored('currentAddress'))));
		isLocalStored('currentContractor') && dispatch(currentContractorChanged(isLocalStored('currentContractor')));
	}, []);

	const _onSelectAddress = event => dispatch(currentAddressChanged({ address: selectSrc(event.value, 'item'), projectId: addresses.find(a => a.address === selectSrc(event.value, 'item')).projectId }));
	const _onSelectContractor = event => dispatch(currentContractorChanged(selectSrc(event.value, 'item')))

	const selectingDataMode = event => {
		if (currentModeIndex === 0) return _onSelectAddress(event);  // Project hours
		if (currentModeIndex === 1) return _onSelectContractor(event); // Contractor hours
	}

	function selectSrc(src, path) {
		const exists = src => src !== undefined;
		const sourceIsViable = src => exists(src);
		return sourceIsViable(src) ? src.props[path] : []
	};

	function savedChosenOption() {
		function address() { return contentListPerMode(currentModeIndex).find(address => selectSrc(address, 'item') === currentAddress.address) }; //TODO simplify this after I put dispatch of changing currentAddress / contractor
		function contractor() { return contentListPerMode(currentModeIndex).find(name => selectSrc(name, 'item') === currentContractor); }

		if (firstMode) return selectSrc(address(), 'item').length > 0 ?
			selectSrc(address(), 'item') :
			projects.length > 0 ?
				projects[0].address : null;
		if (secondMode) return selectSrc(contractor(), 'item').length > 0 ?
			selectSrc(contractor(), 'item') :
			users.length > 0 ?
				users[0].name : null;
	}

	function contentListPerMode(mode) {
		let result = [];
		const listIsEmpty = listCardCount.length === 0;
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
			if (listIsEmpty) return <React.Fragment>{item}</React.Fragment>;
			else return <React.Fragment>{item} <Counter count={count}>{count}</Counter></React.Fragment>;
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


	return (
		<SelecUsersContainer>
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
		</SelecUsersContainer>
	)
}

const mapStateToProps = state =>
({
	projects: getProjectArray(state),
	users: getUsersArray(state),
	currentAddress: getcurrentAddress(state),
	currentContractor: getcurrentContractor(state),
	currentModeIndex: getcurrentModeIndex(state),
	totalTime: gettotalTime(state)
})


// mapStateToProps takes state of the store and returns the part you are interested in:
// the properties of this object will end up as props of our componennt
export default connect(mapStateToProps)(SelectUsers);

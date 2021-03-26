import React from 'react'
import { connect } from 'react-redux';
import { getLoginData } from '../../Store/slices/login';
import { getProjectArray } from '../../Store/slices/projects';
import { selectSrc } from './../SelectUsers/index';
import Dropdown from 'react-dropdown';
import { editTimecard, timecardProjectChanged } from '../../Store/slices/timecards';

function AddressPicker({ cardId, projects, dispatch, projectName, login }) {
	const addresses = projects.map(project => {
		return { id: project.id, address: project.address, projectId: project.projectId }
	});

	function addressList() {
		function ListItem({ item }) {
			return <React.Fragment>{item}</React.Fragment>;
		}

		return addresses.map((a, index) => {
			const address = a.address;
			return <ListItem key={`${address}-${a.projectId}`} item={address} />;
		}
		).filter(a => a.props.hasOwnProperty('item'));

	};

	const _onSelectAddress = event => {
		const newProjectId = addresses.find(a => a.address === selectSrc(event.value, 'item')).projectId;

		// change address in database
		dispatch(
			editTimecard(
				login.session,
				`${cardId}`,
				{
					"projectId": newProjectId
				}
			)
		)

		// change card on Store
		dispatch(timecardProjectChanged({ cardId, newProjectId }));
	};

	return (
		<Dropdown
			options={addressList()}
			onChange={event => { _onSelectAddress(event) }}
			value={projectName}
			menuClassName='menuTimecardClass'
			className='menuTimecardClass'
			placeholderClassName='menuTimecardClass'
			controlClassName='controlTimecardClass'
			arrowClosed={<span className="arrow-closed" />}
			arrowOpen={<span className="arrow-open" />}
		/>
	)
}

const mapStateToProps = (state) =>
({
	projects: getProjectArray(state),
	login: getLoginData(state)
})


// mapStateToProps takes state of the store and returns the part you are interested in:
// the properties of this object will end up as props of our componennt
export default connect(mapStateToProps)(AddressPicker);

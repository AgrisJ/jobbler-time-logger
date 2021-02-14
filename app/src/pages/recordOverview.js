import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import ControlPanelSection from '../components/ControlPanelSection';
import { connect } from 'react-redux';
import ContentSection from '../components/ContentSection/index';
import { useHistory } from 'react-router-dom';
import * as actions from '../Store/api';
import { getLoginData } from '../Store/slices/login';

function RecordOverview({ dispatch, login }) {
	let history = useHistory();
	const [{ isOpen }, setIsOpen] = useState({ isOpen: false });
	const toggle = () => {
		setIsOpen({ isOpen: !isOpen })
	}

	useEffect(() => {
		dispatch(actions.apiCallBegan({ // TODO ...and here - dispatch(loadUserTimecards());
			url: "/v1/user/hours",
			headers: {
				session: login.session
			},
			onSuccess: "timecards/timecardsReceived"
		}));
	}, [history]);

	return (
		<>
			<Sidebar isOpen={isOpen} toggle={toggle} isAdmin={false} />
			<Navbar toggle={toggle} />
			<ControlPanelSection isAdmin={false} />
			<ContentSection isAdmin={false} />
		</>
	)
}

const mapStateToProps = (state) =>
({
	login: getLoginData(state),
})


// mapStateToProps takes state of the store and returns the part you are interested in:
// the properties of this object will end up as props of our componennt
export default connect(mapStateToProps)(RecordOverview);
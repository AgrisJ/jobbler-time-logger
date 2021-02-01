import React, { useEffect } from 'react'
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import GlobalFonts from './fonts/fonts';
import Home from './pages/index';
import { connect } from 'react-redux';
import { projectAdded, getProjectArray } from './Store/slices/projects';
import { userAdded, getUsersArray } from './Store/slices/users';
import { getTimecardArray, timecardAdded } from './Store/slices/timecards';
import PrintReportPage from './pages/printReport';
import Login from './pages/login';
import AddRemove from './pages/addRemove';

function App({ dispatch }) {


	useEffect(() => {
		dispatch(projectAdded({ name: 'Elvi', address: 'Kirkevej 28' }));// 1
		dispatch(projectAdded({ name: 'Danske Bank', address: 'Gråbrødrestræde 10' }));// 2
		dispatch(projectAdded({ name: 'Lidl', address: 'Klosterstræde 76' }));// 3
		dispatch(projectAdded({ name: 'Peter Nielsen', address: 'Lille Kannikestræde 32' }));// 4
		dispatch(projectAdded({ name: 'Oskar Jensen', address: 'Vestergade 145' }));// 5
		dispatch(projectAdded({ name: 'David Petersen', address: 'Nytorv 53' }));// 6
		dispatch(projectAdded({ name: 'Jesper Nassar', address: 'Skindergade 111' }));// 7
		dispatch(projectAdded({ name: 'Mc Donalds', address: 'Vognmagergade 27' }));// 8
		dispatch(projectAdded({ name: 'David Petersencc', address: 'Nytorv 5333' }));// 9
		dispatch(projectAdded({ name: 'Jesper Nassarrrr', address: 'Skindergade 114441' }));// 10
		dispatch(projectAdded({ name: 'Mc Donaldsddd', address: 'Vognmagergade 22227' }));// 11

		dispatch(userAdded({ name: 'Egils Zariņš' })); // 1
		dispatch(userAdded({ name: 'Dainis Vītols' })); // 2
		dispatch(userAdded({ name: 'Jānis Paugurs' })); // 3
		dispatch(userAdded({ name: 'Pēteris Siliņš' })); // 4
		dispatch(userAdded({ name: 'Artūrs Laksts' })); // 5
		dispatch(userAdded({ name: 'Matīss Rītiņš' })); // 6
		dispatch(userAdded({ name: 'Kaspars Zuksis' })); // 7
		dispatch(userAdded({ name: 'Raitis Zauss' })); // 8
		dispatch(userAdded({ name: 'Edgars Koksis' })); // 9
		dispatch(userAdded({ name: 'Kristaps Egle' })); // 10
		dispatch(userAdded({ name: 'Reinis Feinis' })); // 11

		dispatch(timecardAdded({ userId: 1, projectId: 1, jobDate: '22.09.2020', hours: 14.5 }));
		dispatch(timecardAdded({ userId: 1, projectId: 2, jobDate: '22.09.2020', hours: 9.1 }));
		dispatch(timecardAdded({ userId: 1, projectId: 3, jobDate: '22.09.2020', hours: 2.3 }));
		dispatch(timecardAdded({ userId: 1, projectId: 4, jobDate: '22.09.2020', hours: 5 }));
		dispatch(timecardAdded({ userId: 2, projectId: 1, jobDate: '25.12.2020', hours: 14.8 }));
		dispatch(timecardAdded({ userId: 2, projectId: 2, jobDate: '25.12.2020', hours: 15.4 }));
		dispatch(timecardAdded({ userId: 3, projectId: 6, jobDate: '30.09.2020', hours: 21.2 }));
		dispatch(timecardAdded({ userId: 3, projectId: 2, jobDate: '30.09.2020', hours: 11.4 }));
		dispatch(timecardAdded({ userId: 4, projectId: 7, jobDate: '25.09.2020', hours: 3.7 }));
		dispatch(timecardAdded({ userId: 4, projectId: 2, jobDate: '25.09.2020', hours: 17.8 }));
		dispatch(timecardAdded({ userId: 5, projectId: 7, jobDate: '22.12.2020', hours: 24.1 }));
		dispatch(timecardAdded({ userId: 6, projectId: 4, jobDate: '25.09.2020', hours: 6.1 }));
		dispatch(timecardAdded({ userId: 6, projectId: 3, jobDate: '25.09.2020', hours: 9.3 }));
		dispatch(timecardAdded({ userId: 6, projectId: 8, jobDate: '25.09.2020', hours: 22.1 }));
		dispatch(timecardAdded({ userId: 7, projectId: 5, jobDate: '25.09.2020', hours: 14.8 }));
		dispatch(timecardAdded({ userId: 7, projectId: 2, jobDate: '25.09.2020', hours: 15.4 }));
		dispatch(timecardAdded({ userId: 8, projectId: 6, jobDate: '30.09.2020', hours: 21.2 }));
		dispatch(timecardAdded({ userId: 8, projectId: 2, jobDate: '30.09.2020', hours: 11.4 }));
		dispatch(timecardAdded({ userId: 9, projectId: 7, jobDate: '24.09.2020', hours: 3.7 }));
		dispatch(timecardAdded({ userId: 9, projectId: 2, jobDate: '24.09.2020', hours: 17.8 }));
		dispatch(timecardAdded({ userId: 10, projectId: 7, jobDate: '22.09.2020', hours: 24.1 }));
		dispatch(timecardAdded({ userId: 11, projectId: 4, jobDate: '25.09.2020', hours: 6.1 }));
		dispatch(timecardAdded({ userId: 11, projectId: 3, jobDate: '25.09.2020', hours: 9.3 }));
		dispatch(timecardAdded({ userId: 11, projectId: 8, jobDate: '25.09.2020', hours: 22.1 }));

	}, [])

	return (
		<Router>
			<GlobalFonts />
			<Switch>
				<Route path="/" component={Home} exact />
				<Route path="/print" component={PrintReportPage} exact />
				<Route path="/login" component={Login} exact />
				<Route path="/addremove" component={AddRemove} exact />
			</Switch>
		</Router>
	);
}


const mapStateToProps = (state) =>
({
	projects: getProjectArray(state),
	users: getUsersArray(state),
	timecards: getTimecardArray(state)
})


// mapStateToProps takes state of the store and returns the part you are interested in:
// the properties of this object will end up as props of our componennt
export default connect(mapStateToProps)(App);
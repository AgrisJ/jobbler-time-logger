import React, { useEffect } from 'react'
import './App.css';
import { BrowserRouter as Router, Redirect, Route, Switch, useLocation } from 'react-router-dom';
import GlobalFonts from './fonts/fonts';
import Admin from './pages/admin';
import { connect } from 'react-redux';
import { projectAdded, getProjectArray } from './Store/slices/projects';
import { userAdded, getUsersArray } from './Store/slices/users';
import { getTimecardArray, timecardAdded } from './Store/slices/timecards';
import PrintReportPage from './pages/printReport';
import Login from './pages/login';
import AddRemove from './pages/addRemove';
import * as actions from './Store/api';
import { getLoginData, loggedIn } from './Store/slices/login';
import { companyConfig } from './services/companyConfig';
import { getMonthIndex } from './Store/slices/monthIndex';
import recordOverview from './pages/recordOverview';
import AddEntry from './pages/addEntry';

function App({ dispatch, login, monthIndex, users }) {
	const storedLogin = localStorage.getItem('login');
	const storedLoginEmpty = storedLogin === '{}';

	const authenticated = login.isAuthenticated === true;
	const isAdmin = login.role === 'company' ? true : false;

	useEffect(() => {
		const storedParsedLogin = JSON.parse(storedLogin);
		if (storedParsedLogin && !storedLoginEmpty && storedParsedLogin.isAuthenticated)
			dispatch(loggedIn(storedParsedLogin));
	}, [])

	useEffect(() => {
		if (storedLoginEmpty || login.isAuthenticated)
			localStorage.setItem('login', JSON.stringify(login));
	}, [login])

	useEffect(() => {
		if (login.isAuthenticated) {

			if (isAdmin) {
				dispatch(actions.apiCallBegan({ // TODO "Getting Data from the Server" should be as simple as dispatch(loadUsers());
					url: "/v1/users",
					headers: {
						session: login.session
					},
					onSuccess: "users/usersReceived"
				}));
			}
			// if (!isAdmin) {
			// 	dispatch(actions.apiCallBegan({ // TODO ...and here - dispatch(loadProjects());
			// 		url: "/v1/user/hours",
			// 		headers: {
			// 			session: login.session
			// 		},
			// 		onSuccess: "timecards/timecardsReceived"
			// 	}));
			// }

			dispatch(actions.apiCallBegan({ // TODO ...and here - dispatch(loadProjects());
				url: "/v1/projects",
				headers: {
					session: login.session
				},
				onSuccess: "projects/projectsReceived"
			}));
		}
	}, [login.isAuthenticated]);

	useEffect(() => {
		const fromDate = selectedYear => {
			// output: 2021-02-01
			const day = '1';
			return formattedTime(monthIndex, day, selectedYear);
		}
		const toDate = selectedYear => {
			// output: 2021-02-28
			const now = new Date();
			const lastDateOfMonth = new Date(1900 + now.getYear(), now.getMonth() + 1, 0).getDate();
			const day = lastDateOfMonth;
			return formattedTime(monthIndex, day, selectedYear);
		}



		if (login.isAuthenticated) {
			if (isAdmin) {
				monthIndex && dispatch(actions.apiCallBegan({
					url: `/v1/timecards/${fromDate(monthIndex)}/${toDate(monthIndex)}`,
					data: {
						companyId: companyConfig.companyId
					},
					headers: {
						session: login.session
					},
					onSuccess: "timecards/timecardsReceived"
				}));
			}
		}
	}, [login.isAuthenticated, monthIndex]);



	return (
		<Router>
			<GlobalFonts />
			<Switch>
				{/* <Route path="/login" component={Login} exact>{authenticated && isAdmin ? <Redirect to="/admin" /> : !isAdmin ? <Redirect to="/addentry" /> : null}</Route> */}
				<Route path="/login" component={Login} exact>{!authenticated ? null : isAdmin ? <Redirect to="/admin" /> : <Redirect to="/addentry" />}</Route>
				{/* <Route path="/" component={Login} exact>{authenticated && isAdmin ? <Redirect to="/admin" /> : !isAdmin ? <Redirect to="/addentry" /> : <Redirect to="/login" />}</Route> */}
				<Route path="/" component={Login} exact>{!authenticated ? <Redirect to="/login" /> : !isAdmin ? <Redirect to="/addentry" /> : <Redirect to="/admin" />}</Route>
				{/* <PrivateRoute path="/" login={login} sourceComponent={Login} exact /> */}
				<PrivateRoute path="/admin" login={login} sourceComponent={Admin} exact />
				<PrivateRoute path="/print" login={login} sourceComponent={PrintReportPage} exact />
				<PrivateRoute path="/addremove" login={login} sourceComponent={AddRemove} exact />
				<PrivateRoute path="/addentry" login={login} sourceComponent={AddEntry} exact />
				<PrivateRoute path="/recordoverview" login={login} sourceComponent={recordOverview} exact />
			</Switch>
		</Router>
	);
}


const mapStateToProps = (state) =>
({
	projects: getProjectArray(state),
	users: getUsersArray(state),
	timecards: getTimecardArray(state),
	login: getLoginData(state),
	monthIndex: getMonthIndex(state),
})


// mapStateToProps takes state of the store and returns the part you are interested in:
// the properties of this object will end up as props of our componennt
export default connect(mapStateToProps)(App);


function PrivateRoute({ login, sourceComponent: Component, ...rest }) {
	return (
		<Route
			{...rest}
			render={({ location }) => {
				return login.isAuthenticated ? (
					<Component />
				) : (
						<Redirect
							to={{
								pathname: "/login",
								state: { from: location }
							}}
						/>
					)
			}

			}
		/>
	);
}

function formattedTime(monthIndex, day, selectedYear = new Date().getFullYear()) {
	let result = new Date(`${selectedYear}-${monthIndex + 1}-${day}`);
	let formattedTime = new Date(result.getTime() - (result.getTimezoneOffset() * 60000))
		.toJSON()
		.split("T")[0];
	return formattedTime;
}
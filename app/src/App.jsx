import React, { useEffect } from 'react'
import './App.css';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import GlobalFonts from './fonts/fonts';
import Admin from './pages/admin';
import { connect } from 'react-redux';
import { getProjectArray, loadProjects } from './Store/slices/projects';
import { getTimecardArray, timecardAdded, loadTimecards } from './Store/slices/timecards';
import PrintReportPage from './pages/printReport';
import Login from './pages/login';
import AddRemove from './pages/addRemove';
import { getLoginData, loggedIn } from './Store/slices/login';
import { getMonthIndex } from './Store/slices/monthIndex';
import recordOverview from './pages/recordOverview';
import AddEntry from './pages/addEntry';
import EditUsers from './pages/editUsers';
import { getlanguage, languageChanged } from './Store/slices/language';
import { loadUsers } from './Store/slices/users';

function App({ dispatch, login, monthIndex, language }) {

	const storedLogin = localStorage.getItem('login');
	const storedLanguage = localStorage.getItem('language');
	const storedLoginEmpty = storedLogin === '{}';

	const authenticated = login.isAuthenticated === true;
	const isAdmin = login.role === 'company' ? true : false;


	useEffect(() => {
		const storedParsedLogin = JSON.parse(storedLogin);
		if (storedParsedLogin && !storedLoginEmpty && storedParsedLogin.isAuthenticated)
			dispatch(loggedIn(storedParsedLogin));

		if (storedLanguage)
			dispatch(languageChanged(storedLanguage));
	}, [])

	useEffect(() => {
		if (storedLoginEmpty && login.isAuthenticated)
			localStorage.setItem('login', JSON.stringify(login));
	}, [login])

	useEffect(() => { localStorage.setItem('language', language) }, [language])

	useEffect(() => {
		if (login.isAuthenticated) {

			if (isAdmin) dispatch(loadUsers(login.session));
			dispatch(loadProjects(login.session));
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

			if (isAdmin)
				monthIndex && dispatch(loadTimecards(
					login.session,
					`${fromDate()}/${toDate()}`,
					{ companyId: process.env.REACT_APP_COMPANY_ID }
				));
		}
	}, [login.isAuthenticated, monthIndex]);



	return (
		<Router>
			<GlobalFonts />
			<Switch>
				<Route path="/login" component={Login} exact>{!authenticated ? null : isAdmin ? <Redirect to="/admin" /> : <Redirect to="/addentry" />}</Route>
				<Route path="/" component={Login} exact>{!authenticated ? <Redirect to="/login" /> : !isAdmin ? <Redirect to="/addentry" /> : <Redirect to="/admin" />}</Route>
				<PrivateRoute path="/admin" login={login} sourceComponent={Admin} exact />
				<PrivateRoute path="/print" login={login} sourceComponent={PrintReportPage} exact />
				<PrivateRoute path="/addremove" login={login} sourceComponent={AddRemove} exact />
				<PrivateRoute path="/addentry" login={login} sourceComponent={AddEntry} isAdmin={isAdmin} exact />
				<PrivateRoute path="/editusers" login={login} sourceComponent={EditUsers} isAdmin={isAdmin} exact />
				<PrivateRoute path="/recordoverview" login={login} sourceComponent={recordOverview} exact />
			</Switch>
		</Router>
	);
}


const mapStateToProps = (state) =>
({
	projects: getProjectArray(state),
	timecards: getTimecardArray(state),
	login: getLoginData(state),
	monthIndex: getMonthIndex(state),
	language: getlanguage(state)
})


// mapStateToProps takes state of the store and returns the part you are interested in:
// the properties of this object will end up as props of our componennt
export default connect(mapStateToProps)(App);


function PrivateRoute({ login, sourceComponent: Component, isAdmin, ...rest }) {
	return (
		<Route
			{...rest}
			render={({ location }) => {
				return login.isAuthenticated ? (
					<Component isAdmin={isAdmin} />
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
	let result = new Date(selectedYear, monthIndex, +day);
	const selectedTime = result.getTime();
	const timezoneAdjustedTime = result.getTimezoneOffset() * 60000;
	let formattedTime = new Date(selectedTime - timezoneAdjustedTime)
		.toJSON()
		.split("T")[0];
	return formattedTime;
}
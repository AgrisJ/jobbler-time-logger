import React from 'react'
import { CloseIcon, Icon, PageWrapper } from './PrintHeaderElements'
// import history from '.././services/history';
import { useHistory } from 'react-router-dom';

const PrintHeader = () => {
	const history = useHistory();

	const navigateHome = () => history.push('/');



	return (
		<PageWrapper className='noPrint'>
			<Icon onClick={navigateHome}>
				<CloseIcon />
			</Icon>
		</PageWrapper>
	)
}

export default PrintHeader

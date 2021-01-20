import React from 'react'
import PrintContent from '../components/PrintContent';
import PrintHeader from '../components/PrintHeader/index';
import '../Styles/printReport.css'

const PrintReportPage = () => {


	return (
		<div className="page">
			<PrintHeader className='noPrint' />
			<PrintContent />
		</div>
	)
}

export default PrintReportPage


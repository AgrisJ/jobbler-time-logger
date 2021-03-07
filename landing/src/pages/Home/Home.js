import React from 'react';
import { useIntl } from 'react-intl';
import { useSimpleValues } from 'base-shell/lib/providers/SimpleValues';
import Card from 'react-bootstrap/Card';

const HomePage = () => {
    const intl = useIntl()
    return (<>
                <div className="page">
                    <h3>{intl.formatMessage({id: 'home_heading'})}</h3>
                    <p>{intl.formatMessage({id: 'home_jobbler_description'})}</p>
                    <div className="jobbler-presentation">
                        <Card>
                            <Card.Body>
                                <Card.Title>{intl.formatMessage({id: 'features'})}:</Card.Title>
                                <Card.Body>
                                    <ul className="jobbler-features-list">
                                        <li>{intl.formatMessage({id: 'home_feature_1'})}</li>
                                        <li>{intl.formatMessage({id: 'home_feature_2'})}</li>
                                        <li>{intl.formatMessage({id: 'home_feature_3'})}</li>
                                        <li>{intl.formatMessage({id: 'home_feature_4'})}</li>
                                        <li>{intl.formatMessage({id: 'home_feature_5'})}</li>
                                    </ul>
                                </Card.Body>
                            </Card.Body>
                        </Card>
                        
                        <br/>
                        
                        <Card>
                            <Card.Body>
                                <Card.Title>{intl.formatMessage({id: 'customizable'})}:</Card.Title>
                            </Card.Body>
                            <Card.Body>{intl.formatMessage({id: 'home_extra_features'})}</Card.Body>
                        </Card>
                    </div>
                </div>
            </>)
}

export default HomePage

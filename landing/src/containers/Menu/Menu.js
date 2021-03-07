import React, { useContext } from 'react';
import { useIntl } from 'react-intl';
import { NavLink } from 'react-router-dom';
import LocaleContext from 'base-shell/lib/providers/Locale/Context';
import ConfigContext from 'base-shell/lib/providers/Config/Context';
import AuthContext from 'base-shell/lib/providers/Auth/Context';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';

const Menu = () => {
  const intl = useIntl();
  const { setLocale, locale = 'en' } = useContext(LocaleContext);
  const { appConfig } = useContext(ConfigContext);
  const auth = useContext(AuthContext);
  const { menu } = appConfig || {};
  const { getMenuItems } = menu || {};

    const itemsMenu = getMenuItems
        ? getMenuItems({
            intl,
            auth,
            locale,
            updateLocale: setLocale,
          }).filter((item) => {
            return item.visible !== false
          })
        : []

        const getNestedItems = function (hostItem, hostIndex) {
            if (hostItem.nestedItems !== undefined) {
            let nestedItems = hostItem.nestedItems.filter(function (item) {
                return item.visible !== false
            })
            
            return (
                <>
                    {nestedItems.map((nestedItem, k) => { // Settings
                        return (
                            <React.Fragment key={k}>
                                <Dropdown.Item as="button" onClick={(e) => {
                                    if (nestedItem.onClick) {
                                        nestedItem.onClick();
                                    }
                                }}>
                                    {nestedItem.primaryText}
                                </Dropdown.Item>
                            </React.Fragment>
                        );
                    })}
                </>
            );
        }

        return null
    }

    return (
    <div>
        <Navbar bg="dark" variant="dark" className="justify-content-between">
            <Navbar.Brand as={NavLink} to="/">Jobbler</Navbar.Brand>
            <Nav>
            {itemsMenu.map((item, i) => {
                return (
                    <React.Fragment key={i}>
                        <Nav.Item>
                            {item.value ? (                            
                                <Nav.Link as={NavLink} to={item.value} onClick={(e) => {
                                    if (item.onClick) {
                                        item.onClick()
                                    }
                                }}>{item.primaryText}</Nav.Link>
                            ) : (
                                <DropdownButton menuAlign="right" variant="dark" title={item.primaryText}>{getNestedItems(item, i)}</DropdownButton>
                            )}
                        </Nav.Item>
                    </React.Fragment>
                )
            })}
            </Nav>
        </Navbar>
    </div>
    )
}

export default Menu

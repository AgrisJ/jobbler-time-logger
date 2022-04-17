import React, { useCallback, useEffect, useState } from "react";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import "../../Styles/dropdown.css";
import {
  ControlPanelContainer,
  ControlPanelContent,
  ControlPanelMonth,
  TotalDisplay,
  TotalDisplayWrapper,
  TotalTime,
  BackwardCaret,
  ForwardCaret,
  CardCounter,
  AddCardButton,
} from "./ControlPanelElements";
import { getProjectArray } from "../../Store/slices/projects";
import { connect } from "react-redux";
import { getUsersArray } from "../../Store/slices/users";
import { getTimecardArray } from "./../../Store/slices/timecards";
import {
  getMonthIndex,
  monthIndexChanged,
} from "../../Store/slices/monthIndex";
import {
  currentAddressChanged,
  getcurrentAddress,
} from "../../Store/slices/currentAddress";
import {
  currentContractorChanged,
  getcurrentContractor,
} from "../../Store/slices/currentContractor";
import { getcurrentModeIndex } from "../../Store/slices/currentModeIndex";
import { gettotalTime } from "../../Store/slices/totalTime";
import { getcardCount } from "../../Store/slices/cardCount";
import Checkbox from "./../Checkbox/index";
import SelectUsers from "../SelectUsers";
import { isLocalStored } from "./../services/helpfulFunctions";
import ModeSwitcher from "../ModeSwitcher";
import { getLoginData, loggedIn } from "../../Store/slices/login";
import { timeFormat } from "../ContentSection";
import { useHistory } from "react-router-dom";
import { languageData } from "./../../languages/language_variables";
import { getlanguage } from "./../../Store/slices/language";
import DatePicker from "react-datepicker";
import {
  getSelectedYear,
  getYearNum,
  selectedYearChanged,
} from "./../../Store/slices/selectedYear";

function ControlPanelSection({
  isAdmin,
  login,
  projects,
  users,
  timecards,
  monthIndex = 0,
  currentAddress,
  currentContractor,
  currentModeIndex,
  totalTime,
  cardCount,
  dispatch,
  setprintAllChecked,
  printAllChecked,
  setnotesModeOn,
  notesModeOn,
  language,
  selectedYear,
}) {
  const {
    _JANUARY,
    _FEBRUARY,
    _MARCH,
    _APRIL,
    _MAY,
    _JUNE,
    _JULY,
    _AUGUST,
    _SEPTEMBER,
    _OCTOBER,
    _NOVEMBER,
    _DECEMBER,
    _SELECTALL,
    _NOTESONOFF,
    _TOTAL,
    _ENTRIES,
    _PROJECTHOURS,
    _CONTRACTORHOURS,
  } = languageData.COMPONENTS.ControlPanelSection;

  const { _HOURSHORT } = languageData.COMPONENTS.ContentSection;

  let history = useHistory();

  const addresses = projects.map((project) => {
    return {
      id: project.id,
      address: project.address,
      projectId: project.projectId,
    };
  });
  const loggedInUserId = login.userId;
  const contractors = users.map((card) => ({
    name: card.name,
    userId: card.userId,
  }));
  const months = [
    _JANUARY[language],
    _FEBRUARY[language],
    _MARCH[language],
    _APRIL[language],
    _MAY[language],
    _JUNE[language],
    _JULY[language],
    _AUGUST[language],
    _SEPTEMBER[language],
    _OCTOBER[language],
    _NOVEMBER[language],
    _DECEMBER[language],
  ];
  const IS_PRINT_MODE = ["print"].some(
    (item) => window.location.href.indexOf(item) !== -1
  )
    ? true
    : false;
  const [{ listCardCount }, setListCardCount] = useState({ listCardCount: [] });
  // const [{ monthNow }, setmonthNow] = useState({ monthNow: new Date() });

  const listIds = useCallback(
    () =>
      idListPerMode(currentModeIndex).map((id) => {
        let propForMode = null;
        if (currentModeIndex === 0) propForMode = "projectId";
        if (currentModeIndex === 1) propForMode = "userId";

        return timecards
          .filter((c) => (isAdmin ? c : c.userId === loggedInUserId))
          .filter((card) => card[propForMode] === id)
          .filter((card) => card.startTime.split("-")[1] - 1 === monthIndex)
          .length;
      }),
    [currentModeIndex, monthIndex, timecards]
  );
  const firstAddress = useCallback(
    () =>
      addresses[0]
        ? {
            id: addresses[0].id,
            address: addresses[0].address,
            projectId: addresses[0].projectId,
            loading: false,
          }
        : null,
    [addresses]
  );
  const firstContractor = contractors[0];
  const firstTimeLoadedAddress =
    firstAddress() && currentAddress.address === null;
  const firstTimeLoadedContractor = firstContractor && !currentContractor;

  // useEffect(() => {
  // 	const getMonth = monthNow !== null ? monthNow.getMonth() : null;
  // 	dispatch(monthIndexChanged({ monthIndex: getMonth || 0 }));
  // 	// isLocalStored('monthIndex') && dispatch(monthIndexChanged({ monthIndex: +isLocalStored('monthIndex') })); // read saved selected month

  // }, []);

  // useEffect(() => { localStorage.setItem('monthIndex', monthIndex) }, [monthIndex]); //save selected month
  useEffect(() => {
    localStorage.setItem("currentModeIndex", currentModeIndex);
  }, [currentModeIndex]);
  useEffect(() => {
    firstTimeLoadedAddress && dispatch(currentAddressChanged(firstAddress()));
  }, [firstAddress, firstTimeLoadedAddress]);
  useEffect(() => {
    firstTimeLoadedContractor &&
      dispatch(currentContractorChanged(firstContractor));
  }, [firstContractor, firstTimeLoadedContractor]);
  useEffect(() => {
    currentAddress &&
      localStorage.setItem("currentAddress", JSON.stringify(currentAddress));
  }, [currentAddress]);
  useEffect(() => {
    currentContractor &&
      localStorage.setItem(
        "currentContractor",
        JSON.stringify(currentContractor)
      );
  }, [currentContractor]);
  useEffect(() => {
    setListCardCount({ listCardCount: listIds() });
  }, [monthIndex, currentAddress, currentContractor, listIds, selectedYear]);

  const defaultMonth = months[monthIndex];
  const _onSelectMonth = (event) => {
    const foundIndex = months.indexOf(event.value);
    const isMonthIndex =
      typeof monthIndex !== "undefined" || monthIndex !== null;
    if (isMonthIndex) dispatch(monthIndexChanged({ monthIndex: foundIndex }));
  };

  const prevMonth = () =>
    dispatch(
      monthIndexChanged({
        monthIndex: monthIndex ? monthIndex - 1 : months.length - 1,
      })
    );
  const nextMonth = () =>
    dispatch(
      monthIndexChanged({
        monthIndex: monthIndex < months.length - 1 ? monthIndex + 1 : 0,
      })
    );

  function idListPerMode(mode) {
    let resultIds = [];

    switch (mode) {
      case 0:
        resultIds = addresses.map((card) => card.projectId);
        break;
      case 1:
        resultIds = users.map((card) => card.userId);
        break;

      default:
    }
    return resultIds;
  }

  const handlePrintAllCheckboxChange = (event) => {
    setprintAllChecked({ printAllChecked: event.target.checked });
  };
  const handleNotesModeCheckboxChange = (event) => {
    setnotesModeOn({ notesModeOn: event.target.checked });
  };
  const handleYearChange = (date) => {
    console.log(`date`, date);
    dispatch(selectedYearChanged(date.toString()));
  };

  const navigateAddEntryPage = () => history.push("/addentry");
  const isContractorMode = currentModeIndex === 1;

  function ONLY_ON_PRINT_MODULES() {
    if (IS_PRINT_MODE)
      return (
        <>
          <div style={{ display: "flex" }}>
            <Checkbox
              checked={printAllChecked}
              onChange={handlePrintAllCheckboxChange}
              labelText={_SELECTALL[language]}
            />
            {isContractorMode && (
              <Checkbox
                checked={notesModeOn}
                onChange={handleNotesModeCheckboxChange}
                labelText={_NOTESONOFF[language]}
              />
            )}
          </div>
        </>
      );
    else return null;
  }

  function HIDE_ON_PRINT_MODULES() {
    if (!IS_PRINT_MODE)
      return (
        <>
          <TotalDisplayWrapper>
            <SelectUsers
              listCardCount={listCardCount}
              isAdmin={isAdmin} /* manualOverride={isAdmin ? 1 : null} */
            />
            <TotalDisplay>
              {_TOTAL[language]}:{" "}
              <TotalTime>
                {timeFormat(totalTime, _HOURSHORT[language])}
              </TotalTime>
            </TotalDisplay>
          </TotalDisplayWrapper>
          <CardCounter>{`${cardCount} ${_ENTRIES[language]}`}</CardCounter>
          {isAdmin && isContractorMode ? (
            <AddCardButton onClick={navigateAddEntryPage} />
          ) : null}
        </>
      );
    else return null;
  }

  const styles = {
    button: {
      cursor: "pointer",
      borderRadius: "4px",
      fontFamily: "Expletus Sans",
      fontSize: "18px",
      borderStyle: "none",
      background: "none",
      color: "#06620cdb", //rgb(31 90 152)
      zIndex: 0,
      userSelect: "none",
      paddingRight: "0.8em",
      WebkitUserSelect: "none" /* Safari */,
      msUserSelect: "none" /* IE 10 and IE 11 */,
    },
  };
  const YearButton = React.forwardRef((props, ref) => {
    const { value, onClick } = props;
    return (
      <button style={styles.button} onClick={onClick} ref={ref}>
        {value}
      </button>
    );
  });

  return (
    <>
      <ControlPanelContainer>
        <ControlPanelContent>
          {isAdmin ? (
            <ModeSwitcher
              titles={[_PROJECTHOURS[language], _CONTRACTORHOURS[language]]}
            />
          ) : null}
          <ControlPanelMonth>
            <BackwardCaret onClick={prevMonth} />
            <DatePicker
              selected={selectedYear}
              onChange={(date) => handleYearChange(date)}
              customInput={<YearButton />}
              showYearPicker
              yearItemNumber={3}
              dateFormat="yyyy"
            />
            <Dropdown
              options={months}
              onChange={_onSelectMonth}
              value={defaultMonth}
              menuClassName="monthMenuClass"
              className="monthMenuClass"
              placeholderClassName="monthMenuClass"
              controlClassName="monthControlClass"
              arrowClosed={<span className="" />}
              arrowOpen={<span className="" />}
            />
            <ForwardCaret onClick={nextMonth} />
          </ControlPanelMonth>
          {ONLY_ON_PRINT_MODULES()}
          {HIDE_ON_PRINT_MODULES()}
        </ControlPanelContent>
      </ControlPanelContainer>
    </>
  );
}

const mapStateToProps = (state) => ({
  projects: getProjectArray(state),
  users: getUsersArray(state),
  timecards: getTimecardArray(state),
  monthIndex: getMonthIndex(state),
  currentAddress: getcurrentAddress(state),
  currentContractor: getcurrentContractor(state),
  currentModeIndex: getcurrentModeIndex(state),
  totalTime: gettotalTime(state),
  cardCount: getcardCount(state),
  login: getLoginData(state),
  language: getlanguage(state),
  selectedYear: getSelectedYear(state),
});

// mapStateToProps takes state of the store and returns the part you are interested in:
// the properties of this object will end up as props of our componennt
export default connect(mapStateToProps)(ControlPanelSection);

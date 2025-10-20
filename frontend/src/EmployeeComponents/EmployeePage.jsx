import React from "react";
import EmployeeHomepage from "./EmployeeHomepage.jsx";
import EmployeeAbout from "./EmployeeAbout.jsx";
import EmployeeHowItWorks from "./EmployeeHowitworks.jsx";
import EmployeeAssignCompany from "./EmployeeAssignCompany.jsx";
import EmployeeFeature from "./EmployeeFeature.jsx";
import EmployeeBanner from "./EmployeeBanner.jsx";
import EmployeeGetInTouch from "./EmployeeGetintouch.jsx";
import EmployeeFooter from "./EmployeeFooter.jsx";

const EmployeePage = () => {
  return (
    <>
      <EmployeeHomepage />
        <EmployeeAbout />
        <EmployeeHowItWorks />
        <EmployeeAssignCompany />
        <EmployeeFeature />
        <EmployeeBanner />
        <EmployeeGetInTouch />
        <EmployeeFooter />
    </>
  )
}

export default EmployeePage
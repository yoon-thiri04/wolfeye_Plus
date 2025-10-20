import React from "react";
import LandingHomepage from "./LandingHomepage.jsx";
import LandingAbout from "./LandingAbout.jsx";
import LandingHowItWorks from "./LandingHowItWorks.jsx";
import LandingFeature from "./LandingFeature.jsx";
import LandingSubscription from "./LandingSubscription.jsx";
import LandingGetInTouch from "./LandingGetintouch.jsx";
import LandingBanner from "./LandingBanner.jsx";
import LandingFooter from "./LandingFooter.jsx";

const LandingPage = () => {
  return (
    <>
      <LandingHomepage />
        <LandingAbout />
        <LandingHowItWorks />
        <LandingFeature />
        <LandingSubscription />
        <LandingBanner />
        <LandingGetInTouch />
        <LandingFooter />
    </>
  )
}

export default LandingPage
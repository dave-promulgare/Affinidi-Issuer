import React from 'react';
import 'pages/intro/Intro.scss'
import EntireFlow from 'assets/images/icons/flow.png';
import {routes} from 'constants/routes';

/**
 * Stateless component responsible for rendering a simple SSI introduction screen.
 * */
const IntroPage = () => {
  return (
    <div className='intro page-form page-form--large'>
      <div className='intro__heading-block'>
        <h1 className='intro__heading'>
          Purple Cross - CPR/AED Certification Issuer
        </h1>
        <h5 className='intro__subheading'>A simple use case for Affinidi hackathon</h5>
      </div>
      <div className='intro__text-block'>
        <h4>Scenario</h4>
        <p>Alex has taken a course in the use of an Automated External Defibrillator. </p>
        <p>While at the bus station, someone has a heart attack.</p>
        <p>Alex uses his AED certification credential to gain access to the AED device at the bus station.  His credential is used to unlock the cabinet that the AED is in.</p>
        <p>Alex does not need to be an employee of the bus company nor does he need to register with them for access.</p>
        <p>The bus company can lock the expensive AED device in a cabinet and be assured that the person accessing the AED is qualified to use it.</p>
        <h4>Roles in this scenario</h4>
        <p>There are 3 roles in the credential exchange flow: <strong>ISSUER</strong>, <strong>VERIFIER</strong>, and <strong>HOLDER</strong>. Each of them is explained in the example below.</p>
      </div>
      <div className='intro__example'>
        <img className='flow-size' src={EntireFlow} alt='entire-flow'/>
      </div>
      <div className='intro__roles-description'>
        <div className='intro__roles-description-role'>
          <h3>Issuer</h3>
          <p>The Purple Cross gives courses to certify people in CPR and the use of an AED.  They issue an AED Certified VC to graduates.</p>
        </div>
        <div className='intro__roles-description-role'>
          <h3>Holder</h3>
          <p>The graduate of the course can use their AED Certified VC to access AED equipment in public and private spaces.</p>
        </div>
        <div className='intro__roles-description-role'>
          <h3>Verifier</h3>
          <p>The Bus Company can put up AED devices in locked cabinets on their property that can only be accessed by people with the AED Certified VC.</p>
        </div>
      </div>

      <p>Ready to try out the application? Get started <a href={routes.APPLICANT_LOGIN} rel='noreferrer'>here</a> by being the applicant first!</p>
      <p>For more information and well documented tutorials, please visit <a href='https://www.affinidi.com/api' target='_blank' rel='noreferrer'>https://www.affinidi.com/api</a>.</p>
    </div>
  )
}

export default IntroPage

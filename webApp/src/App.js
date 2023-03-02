import {useEffect, useState,useRef} from 'react'

import { interests, powerMomentsArray } from './js/const';
import { getVideo } from './js/api';

import desktop_pattern from "./images/desktop_pattern.png";
import dynamic_logo from "./images/dynamic_logo.png";
import arrow_down from "./images/arrow_down.png";


function App() {

  const [interestVal, setInterestVal] = useState("placeholder");
  const [powerMomentVal, setPowerMomentVal] = useState("placeholder");
  const [powerMoments, setPowerMoments] = useState([]);
  const [showLoader, setShowLoader] = useState(false);
  const inputNameRef = useRef(null);


  useEffect(() => {
    console.log(interestVal);
    console.log(powerMomentVal);
    console.log(inputNameRef.current.value);
  }, [interestVal,powerMomentVal]);

  const interestOnChange = (e) => {
    setInterestVal(e.target.value);
    setPowerMoments(powerMomentsArray[e.target.value]);
    setPowerMomentVal("placeholder");
  };

  const onChangePowerMoment = (e) => {
    setPowerMomentVal(e.target.value);
  }

  const submitHandler = () => {
    var name = inputNameRef.current.value;
    getVideo(setShowLoader,name,interestVal,powerMomentVal)
  }

  return (
  <div className="App">
      <header className="App-header">
      <div className="pattern_bg">
        <img src={desktop_pattern} alt="petronas pattern" />
      </div>
      <div className="container">
        <div className="main_logo"></div>
        <div className="dynamic_logo margin_top">
          <img src={dynamic_logo} alt="dynamic logo" />
        </div>
        <div className="margin_top_5">
          <h2 className="h2_text">Tell us your <br /> power moment! </h2>
        </div>
        <div className="form-row margin_top">
          <div className="col">
            <input type="text" className="form-control form_center" placeholder="Name" ref={inputNameRef} />
          </div>
        </div>
        <div className="form-group form-row margin_top">
            <select id="interest_holder" className="form-control form_center" onChange={interestOnChange} defaultValue={"placeholder"}>
            <option value='placeholder' disabled >Select your interests</option>
              {interests.map((interest, index) => <option key={index} id={index} value={interest}>{interest}</option>)}
            </select>
          <div className="arrow_down">
            <img src={arrow_down} alt="arrow_down" />
          </div>
        </div>
        <div className="margin_top_5">
          <h2 className="h2_text h2_smaller">My power moment is</h2>
        </div>
        <div className="form-group form-row margin_top">
            <select id="interest_value" className="form-control form_center" onChange={onChangePowerMoment} defaultValue={powerMomentVal}>
            <option value='placeholder' disabled >Select your Power moment</option>
              {powerMoments.map((powerMoment, index) => <option key={index} id={index} value={powerMoment}>{powerMoment}</option>)}
            </select>
          <div className="arrow_down">
            <img src={arrow_down} alt="arrow_down" />
          </div>
        </div>
        <div className="no_underline" onClick={submitHandler}>
          <div className="btn_start margin_top_10"> Power up with dynamic diesel! </div>
        </div>
      </div>
    </header>
    </div>
  );
}
export default App;

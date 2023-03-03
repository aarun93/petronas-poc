import { useEffect, useState, useRef } from "react";

import { getVideo, getMetadata } from "./js/api";


import desktop_pattern from "./images/desktop_pattern.png";
import dynamic_logo from "./images/dynamic_logo.png";
import arrow_down from "./images/arrow_down.png";

function App() {
  const [interestVal, setInterestVal] = useState("placeholder");
  const [powerMomentVal, setPowerMomentVal] = useState("placeholder");
  const [powerMoments, setPowerMoments] = useState([]);
  const [showLoader, setShowLoader] = useState(false);
  const inputNameRef = useRef(null);
  const [metadata, setMetadata] = useState([]);
  const [videoGeturl, setVideoGetUrl] = useState(null);
  const [showForm, setShowForm] = useState(true);

  const baseUrl = "http://localhost:9000";

  useEffect(() => {
    console.log(interestVal);
    console.log(powerMomentVal);
    console.log(inputNameRef.current.value);
  }, [interestVal, powerMomentVal, metadata]);

  useEffect(() => {
    getMetadata(setMetadata);
  }, []);

  const interestOnChange = (e) => {
    setInterestVal(e.target.value);
    setPowerMoments(metadata?.find((x) => x.id === e.target.value)?.moments);
    setPowerMomentVal("placeholder");
  };

  const onChangePowerMoment = (e) => {
    setPowerMomentVal(e.target.value);
  };

  const submitHandler = () => {
    var name = inputNameRef.current.value;
    //getVideo(setShowLoader,name,interestVal,powerMomentVal)
    setVideoGetUrl(
      `${baseUrl}/petronas?interest=${interestVal}&moment=${powerMomentVal}&name=${name}`
    );
    setShowForm(false);
  };

  return (
    <div className="App">
      <header className="App-header"> </header>

      <div className="pattern_bg">
        <img src={desktop_pattern} alt="petronas pattern" />
      </div>
      {showForm && (
        <div className="container">
          <div className="main_logo"></div>
          <div className="dynamic_logo margin_top">
            <img src={dynamic_logo} alt="dynamic logo" />
          </div>
          <div className="margin_top_5">
            <h2 className="h2_text">
              Tell us your <br /> power moment!{" "}
            </h2>
          </div>
          <div className="form-row margin_top">
            <div className="col">
              <input
                type="text"
                className="form-control form_center"
                placeholder="Name"
                ref={inputNameRef}
              />
            </div>
          </div>
          <div className="form-group form-row margin_top">
            <select
              id="interest_holder"
              className="form-control form_center"
              onChange={interestOnChange}
              defaultValue={"placeholder"}
            >
              <option value="placeholder" disabled>
                Select your interests
              </option>
              {metadata.map((interest, index) => (
                <option key={index} id={index} value={interest.id}>
                  {interest.name}
                </option>
              ))}
            </select>
            <div className="arrow_down">
              <img src={arrow_down} alt="arrow_down" />
            </div>
          </div>
          <div className="margin_top_5">
            <h2 className="h2_text h2_smaller">My power moment is</h2>
          </div>
          <div className="form-group form-row margin_top">
            <select
              id="interest_value"
              className="form-control form_center"
              onChange={onChangePowerMoment}
              value={powerMomentVal}
            >
              <option value="placeholder" disabled>
                Select your Power moment
              </option>
              {powerMoments.map((powerMoment, index) => (
                <option key={index} id={index} value={powerMoment.id}>
                  {powerMoment.description}
                </option>
              ))}
            </select>
            <div className="arrow_down">
              <img src={arrow_down} alt="arrow_down" />
            </div>
          </div>
          <div className="no_underline" onClick={submitHandler}>
            <div className="btn_start margin_top_10">
              {" "}
              Power up with dynamic diesel!{" "}
            </div>
          </div>
        </div>
      )}

      {videoGeturl && (
        <div className="centerVideo">
          <video controls width="50%">
            <source src={videoGeturl} type="video/mp4" />
          </video>
        </div>
      )}
    </div>
  );
}
export default App;

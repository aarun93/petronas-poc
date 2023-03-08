import { useEffect, useState } from "react";

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import { getMetadata, getBaseUrl } from "./js/api";
import desktop_pattern from "./images/desktop_pattern.png";
import main_logo from "./images/logo.png";
import dynamic_logo from "./images/dynamic_logo.png";
import loading_img from "./images/SPLASH-SCREEN.gif";

function App() {
  const [powerMoments, setPowerMoments] = useState([]);
  const [metadata, setMetadata] = useState([]);
  const [videoGeturl, setVideoGetUrl] = useState(null);
  const [showForm, setShowForm] = useState(true);
  const [ form, setForm ] = useState({name:"",interest:"placeholder",powerMoment:"placeholder"})
  const [errors, setErrors] = useState({})
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    getMetadata(setMetadata);
  }, []);

  const setField = (field, value) => {
    setForm({
      ...form,
      [field]: value
    })
    if ( !!errors[field] ) setErrors({
      ...errors,
      [field]: null
    })
  }

  const interestOnChange = (val) => {
    setField('interest', val);
    setPowerMoments(metadata?.find((x) => x.id === val)?.moments);
  };

  const findFormErrors = () => {
    const { name,interest,powerMoment } = form
    const newErrors = {}
    // name errors
    if (!name || name === '') newErrors.name = 'Please input name.'
    if (!interest || interest === 'placeholder') { newErrors.interest = 'Please select interest.' }
    else {
      interestOnChange(interest)
    }
    if ( !powerMoment || powerMoment === 'placeholder' ) newErrors.powerMoment = 'Please select power moment.'
    return newErrors
}

  const submitHandler = (event) => {
    event.preventDefault()
    // get our new errors
    const newErrors = findFormErrors()
    if ( Object.keys(newErrors).length > 0 ) {
      //  got errors
      setErrors(newErrors)
    } else {
      // No errors! Put any logic here for the form submission!
      setVideoGetUrl(
        `${getBaseUrl()}/petronas?interest=${form.interest}&moment=${form.powerMoment}&name=${form.name}`
      );
      setShowLoader(true);
      setShowForm(false);
    }
  };

  const resetForm = () => {
    setShowForm(true);
    setVideoGetUrl(null);
    setForm({ name: "", interest: "placeholder", powerMoment: "placeholder" });
    setErrors({})
  }

  return (
    <div>
    {showLoader && (
      <>
        <div className="align-self-center loader_screen">
          <img src={loading_img} alt="petronas loading" />
        </div>
      </>
    )}
    <div className="pattern_bg">
      <img src={desktop_pattern} alt="petronas pattern" />
    </div>
    <div className="container my-3">

        {showForm && (
          <>
            <img className="main_logo mb-3" src={main_logo} alt="main logo" />
            <img className="dynamic_logo mb-3" src={dynamic_logo} alt="dynamic logo" />
           <h4 className="text-center">
           Tell us your <br /> power moment!
         </h4>
        <Form
          className="form-wrapper"
        >
          <Form.Group  className="w-100">
            <Form.Control
              required
              className="text-center"
              type="text"
              placeholder="Name"
                onChange={e => setField('name', e.target.value)}
                isInvalid={ !!errors.name }

            />
            <Form.Control.Feedback type="invalid">
            { errors.name }
            </Form.Control.Feedback>
          </Form.Group>
  
          <Form.Group  className="w-100">
            <Form.Select
              required
              key="interestSelect"
              onChange={e=>interestOnChange(e.target.value)}
                defaultValue={"placeholder"}
                isInvalid={ !!errors.interest }

            >
              <option value="placeholder" disabled>
                Select your interests
              </option>
              {metadata.map((interest, index) => (
                <option key={index} id={index} value={interest.id}>
                  {interest.name}
                </option>
              ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                { errors.interest }
            </Form.Control.Feedback>
          </Form.Group>
  
            <h4 className="text-center">My power moment is</h4>
  
          <Form.Group className="w-100" >
            <Form.Select
              required
              key="powerMomentSelect"
              className="text-center"
              onChange={e => setField('powerMoment', e.target.value)}
                value={form.powerMoment}
                isInvalid={ !!errors.powerMoment }

            >
              <option value="placeholder" disabled>
                Select your power moment
              </option>
              {powerMoments.map((powerMoment, index) => (
                <option
                  key={index}
                  id={index}
                  value={JSON.stringify(powerMoment)}
                >
                  {powerMoment.description}
                </option>
              ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
              { errors.powerMoment }
            </Form.Control.Feedback>
          </Form.Group>
  
          <Button
            variant="outline-light"
            className="submit-btn mt-3"
              type="submit"
              onClick={submitHandler}
          >
            Power up with dynamic diesel!
          </Button>
            </Form>
          </>
      )}
      {videoGeturl && (
        <div className="centerVideo">
            <video controls width="100%"
              onLoadedData={() => {
                    console.log('video is loaded!')
                    setShowLoader(false);
                }}>
            <source src={videoGeturl} type="video/mp4" />
            </video>
            <Button
            variant="outline-light"
            className="submit-btn mt-3"
              type="submit"
              onClick={resetForm}
          >
            Reset
          </Button>
        </div>
      )}
    </div>
  </div>
  );
}
export default App;

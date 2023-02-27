import './css/bootstrap.min.css';  
import './css/style.css';
//Images
import {useEffect} from 'react'
import desktop_pattern from "./images/desktop_pattern.png";
import dynamic_logo from "./images/dynamic_logo.png";
import arrow_down from "./images/arrow_down.png";

import {art} from "./js/main.js";

function App() {

  useEffect(() => {
    art();
  }, []);
  
  return (
    <div className="App">
      <header className="App-header">
        <div className="pattern_bg">
          <img src={desktop_pattern} alt="petronas pattern"/>
        </div>
        <div className="container">
          <div className="main_logo"></div>

          <div className="dynamic_logo margin_top">
            <img src={dynamic_logo} alt="dynamic logo"/>
          </div>

          <div className="margin_top_5">
            <h2 className="h2_text">Tell us your<br/> power moment!</h2>
          </div>
          <div className="form-row margin_top">
            <div className="col">
              <input type="text" className="form-control" placeholder="Name" id="requestSpecificationsFullName" />
            </div>
          </div>
          <div className="form-group form-row margin_top">
            <select id="interest_holder" className="form-control">
              <option value="">Interest</option>
              <option value="art" id="art">Art</option>
              <option value="music" id="music">Music</option>
              <option value="travel" id="travel">Travel</option>
              <option value="cooking" id="cooking">Cooking</option>
              <option value="sport" id="sport">Sports</option>
            </select>
            <div className="arrow_down">
              <img src={arrow_down} alt="arrow_down"/>
            </div>
          </div>

          <div className="margin_top_5">
            <h2 className="h2_text h2_smaller">My power moment is</h2>
          </div>
          <div className="form-group form-row margin_top">
            <select id="interest_music" className="form-control form_center">
              <option value="01">Rocking with power​</option>
              <option value="02">Moving with the rhythm​</option>
              <option value="03">Making big moves with big beats</option>
            </select>
            <select id="interest_art" className="form-control form_center">
              <option value="01">Unleashing can-do creativity​</option>
              <option value="02">Mastering the stroke of genius​​</option>
              <option value="03">Making imagination happen</option>
            </select>
            <select id="interest_travel" className="form-control form_center">
              <option value="01">Seeing the world from above​​</option>
              <option value="02">Reaching for new heights​​</option>
              <option value="03">Taking in the night sky​</option>
            </select>
            <select id="interest_cooking" className="form-control form_center">
              <option value="01">Creating joy on a plate​​</option>
              <option value="02">Getting a taste of happiness​​​</option>
              <option value="03">Baking moments of sweetness​​</option>
            </select>
            <select id="interest_sport" className="form-control form_center">
              <option value="01">Taking that winning swing​​</option>
              <option value="02">Getting a running start to a great day​​​​</option>
              <option value="03">Blazing trails on two wheels​​</option>
            </select>
            <div className="arrow_down">
              <img src={arrow_down} alt="arrow_down"/>
            </div>
          </div>
          <a className="no_underline" href="video.html">
            <div className="btn_start margin_top_10">
              Power up with dynamic diesel!
            </div>
          </a>
        </div>
      </header>
    </div>
  );
}
export default App;

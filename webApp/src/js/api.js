
import axios from 'axios';

const baseUrl = 'http://localhost:9000'

const getVideo = (setshowLoader,name, interest, powerMoment) => {
    const params = {
        name: name,
        interest: interest,
        powerMoment:powerMoment
    };
    
    axios.get(`${baseUrl}/petronas`, {params})
    .then(function (response) {
        console.log(response);
    })
    .catch(function (error) {
        console.log(error);
    });
    //return [];
}

const getMetadata = (setMetadata) => {
    axios.get(`${baseUrl}/metadata`).then(function (response) {
        setMetadata(response.data);
    })
    .catch(function (error) {
        console.log(error);
    });
}

export { getVideo,getMetadata };
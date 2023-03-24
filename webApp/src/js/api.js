
import axios from 'axios';

const baseUrl = window.location.origin.includes("localhost") ? "http://localhost:9000" : 'http://34.124.136.148:9000';

const getVideo = (setshowLoader,name, interest, powerMoment) => {
    const params = {
        name: name,
        interest: interest,
        moment:powerMoment
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

const getBaseUrl = () => {
    return baseUrl;
}

export { getVideo, getMetadata, getBaseUrl };
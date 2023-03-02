
import axios from 'axios';

const baseUrl = 'http://localhost:9000'

const getVideo = (name,interest,powerMoment) => {
    axios.post(`${baseUrl}/test`, {
        name: name,
        interest: interest,
        powerMoment:powerMoment
    })
    .then(function (response) {
        console.log(response);
    })
    .catch(function (error) {
        console.log(error);
    });
    return [];
}

export { getVideo };
/**
 * Fetch data from given url
 * @param {*} url
 * @param {*} options
 * @param {*} body
 */
import * as authUtils from './authUtils';
const config = require('./config.json');

const baseURL = "http://localhost:3333/talukdermortgage/api/";
// const baseURL = "https://tmb-backend.braintechsolution.com/api/";
// const baseURL = config.talukdermortgage.baseurl;

const fetchJSON = (url, options = {}) => {
    const token = authUtils.getToken();
    if(token){
        options.headers= { 'Accept': 'application/json','Content-Type': 'application/json','Authorization': 'Bearer ' +  token };
    }else{
        options.headers= { 'Accept': 'application/json','Content-Type': 'application/json' };
    }
    
    return fetch(baseURL+url, options)
        .then(response => {
            // if (response.status == 200) {
            //     return response.json();
            // }else{
            //     alert('response throw')
            //     throw response.json();
            // }
            return response.json();
        })
        .then(json => {
            return json;
        })
        .catch(error => {
            throw error;
        });
};
export { fetchJSON };

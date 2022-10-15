import axios from 'axios';
import * as common from '../utils/common';
import * as authUtils from './authUtils';
import * as api from './api';
const config = require('./config.json');

// const baseURL = "http://localhost:3333/talukdermortgage/api/";
// const baseURL = "https://tmb-backend.braintechsolution.com/api/";
const baseURL = config.talukdermortgage.baseurl;

let instance = axios.create({
  baseURL: baseURL,
})

// request header
instance.interceptors.request.use((config) => {
  const token = authUtils.getToken();
  if(token){
    config.headers = { 
    'Authorization': 'Bearer ' +  token,
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
  }
  return config;
}, error => {
  return Promise.reject(error);
})

// response parse
instance.interceptors.response.use(
    (response) => {
        return response
    }, 
    (error) => {
    console.warn('Error status ::', error.response.status)
    console.log(error.response.status);
    if(!error.response){
        return new Promise((resolve,reject)=>{
            reject(error)
        });
    }
    else if(error.response.status===401){
        authUtils.removeSession();
        window.location='/account/login';
    }
    else{
        return new Promise((resolve,reject)=>{
            reject(error)
        });
    }
})

export default instance;
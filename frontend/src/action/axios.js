import axios from 'axios';
import config from '../lib/config'
import { getCookies } from '../components/cookies/cookies';
import { isEmpty } from '../components/helperFun/helperFun';

const instance = axios.create({
    baseURL: config.apiurl
  });

  let AUTH_TOKEN = getCookies()

  console.log(AUTH_TOKEN,'AUTH_TOKEN')
  if(!isEmpty(AUTH_TOKEN) ){
    instance.interceptors.request.use(function (config) {
       
        config.headers['Authorization'] = AUTH_TOKEN;
        return config;
      }, function (error) {
       
        return Promise.reject(error);
      });
  }

  export default instance

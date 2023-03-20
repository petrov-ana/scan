import axios from 'axios';
import authHeader from './auth-header';
import { API_URL } from '../global'

const getAccountInfo = () => {
  return axios.get(API_URL + 'account/info', { headers: authHeader() });
}

const UserService = {
  getAccountInfo,
};

export default UserService;
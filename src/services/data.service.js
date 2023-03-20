import axios from 'axios';
import authHeader from './auth-header';
import { API_URL } from '../global'

const getHistogramsInfo = (body) => {
    return axios.post(API_URL + 'objectsearch/histograms', body, { headers: authHeader() });    
}

const getObjectsInfo = (body) => {
    return axios.post(API_URL + 'objectsearch', body, { headers: authHeader() });    
}

const getListDocuments = (body) => {
    return axios.post(API_URL + 'documents', body, { headers: authHeader() });    
}

const DataService = {
    getHistogramsInfo,
    getObjectsInfo,
    getListDocuments,
};

export default DataService;
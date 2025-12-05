import axios from 'axios';
import {type LoginDto} from '../types/auth';
import {type RegisterDto} from '../types/auth';

const API_URL = 'http://localhost:3000/auth';

export const login = async (loginData: LoginDto): Promise<any> => {
    try{
        const response = await axios.post(`${API_URL}/login`, loginData);
        return response.data ;
    }catch(error){
        throw error
    }

};

export const register = async (registerData: RegisterDto): Promise<any> => {
    try{
        const response = await axios.post(`${API_URL}/register`, registerData);
        const user = response.data;
        return user;
    }
    catch (error) {
        throw error;
    }
};

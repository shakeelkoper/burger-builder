import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://react-my-burger-74d41.firebaseio.com/'
});

export default instance;
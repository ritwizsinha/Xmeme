export const SERVER_URL = !process.env.NODE_ENV || process.env.NODE_ENV === 'development' ? 'http://localhost:8081': 'https://xmeme-api-server.herokuapp.com';
export const STATE = {
    LOADING: 0,
    LOADED: 1,
    ERROR: 2,
}

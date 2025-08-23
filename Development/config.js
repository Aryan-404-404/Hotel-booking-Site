const config = {
    apiUrl: process.env.NODE_ENV === 'production' 
        ? 'https://hotel-booking-site-9cth.onrender.com'
        : 'http://localhost:3000'
};
export default config;
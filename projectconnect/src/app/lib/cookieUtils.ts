import Cookies from 'js-cookie';

export const getUsernameFromCookie = () => Cookies.get('username');

export const getEmailFromCookie = () => Cookies.get('email');
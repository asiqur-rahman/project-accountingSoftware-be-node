// @flow
import { Cookies } from 'react-cookie';

import * as common from '../utils/common';

const sessionName='NeverTryToHack';

/**
 * Checks if user is authenticated
 */
// const isUserAuthenticated = () => {
//     const user = getLoggedInUser();
//     if (!user) {
//         return false;
//     }
//     else{
//         return true;
//     }
//     // const decoded = jwtDecode(user.token);
//     // const currentTime = Date.now() / 1000;
//     // // alert(decoded.exp+" "+ currentTime)
//     // if (decoded.exp < currentTime) {
//     //     console.warn('access token expired');
//     //     return false;
//     // } else {
//     //     return true;
//     // }
// };

/**
 * Returns the logged in user
 */
// const getLoggedInUser = () => {
//     const cookies = new Cookies();
//     const user = cookies.get('user');
//     return user ? (typeof user == 'object' ? user : JSON.parse(user)) : null;
// };


export const getUser = () => {
    const cookies = new Cookies();
    const user = cookies.get(sessionName);
    if(user){
        const data=common.decrypt(user);
        return JSON.parse(data);
    }
    else{
        removeSession();
        return null;
    }
}

export const getToken= () => {
    const cookies = new Cookies();
    const user = cookies.get(sessionName);
    // prompt("getToken",user);
    if(user){
        const data=common.decrypt(user);
        const session=JSON.parse(data);
        const SessionTime=new Date(session['sessionTime']).toLocaleTimeString();
        const LocalTime=new Date().toLocaleTimeString()
         //const rrr=SessionTime>LocalTime;
         //alert(SessionTime + ' - '+ LocalTime + ' - '+ rrr);
         return session.token;
        // if(SessionTime>LocalTime){
        //     return session.token;
        // }
        // else{
        //     removeSession();
        //     return null;
        // }
    }
    else{
        removeSession();
        return null;
    }
}


export const getRole= () => {
    const cookies = new Cookies();
    const user = cookies.get(sessionName);
    if(user){
        const data=common.decrypt(user);
        const session=JSON.parse(data);
        return session.RoleName;
    }
    else{
        removeSession();
        return null;
    }
}

export const getRoleCode= () => {
    const cookies = new Cookies();
    const user = cookies.get(sessionName);
    if(user){
        const data=common.decrypt(user);
        const session=JSON.parse(data);
        return session.RoleCode;
    }
    else{
        removeSession();
        return null;
    }
}

export const setSession= async (sessionData) => {
    if(sessionData){
        var sessionValidate = new Date();
        sessionValidate.setTime(new Date().getTime() + (sessionData.sessionTime*1000));
        sessionData.sessionTime = sessionValidate;
        // localStorage.setItem(sessionName,JSON.stringify(sessionData));

        // prompt("setSession",common.encrypt(JSON.stringify(sessionData)));
        let cookies = new Cookies();
        if (sessionData){
            cookies.set(sessionName, common.encrypt(JSON.stringify(sessionData)), { path: '/' });
        }
        else { cookies.remove(sessionName, { path: '/' });}
    }
    else{
        let cookies = new Cookies();
        cookies.remove(sessionName, { path: '/' });
    }
}

export const removeSession= async () => {
    let cookies = new Cookies();
    cookies.remove(sessionName, { path: '/' })
}


export const isUserAuthenticated = () => {
    const token = getToken();
    if (!token) {
        return false;
    }
    else{
        return true;
    }
    // const decoded = jwtDecode(user.token);
    // const currentTime = Date.now() / 1000;
    // // alert(decoded.exp+" "+ currentTime)
    // if (decoded.exp < currentTime) {
    //     console.warn('access token expired');
    //     return false;
    // } else {
    //     return true;
    // }
};


// export { isUserAuthenticated, getLoggedInUser };

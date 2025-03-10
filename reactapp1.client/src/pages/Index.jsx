/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import './Index.css';
import "../../bootstrap/css/bootstrap.min.css";
import Cookies from 'universal-cookie';
function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
export default function Index() {
    const cookies = new Cookies();
    const token = getCookie("JWTToken");
    console.log(token);
    return (
        <div>
            <p>Index</p>
            <a href="/account/login">Bejelentkezés</a>
        </div>        
    );
};
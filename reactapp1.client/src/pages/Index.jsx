/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import './Index.css';
import "../../bootstrap/css/bootstrap.min.css";
import Musor from './musor/Musor';
export default function Index() {
    document.title = "Főoldal - Premozi";
    return (
        <div>
            <p>A retek állna ebbe a projektbe</p>
            <Musor/>
        </div>        
    );
};
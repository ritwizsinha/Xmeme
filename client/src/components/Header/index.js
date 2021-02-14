import React from 'react';
import './style.css';
import Logo from '../../public/close.svg';
// Header component containing the Logo title and search text
const Header = ({ text, setText }) => {
    return (
        <div className="header">
            <div className="logo_container">
                <img src={Logo} className="logo_image" alt="Xmeme Logo" />
            </div>
            <div className="header_content">
                Meme
            </div>
            <div className="search_box">
                <input type="text" value={text} className="input_box" placeholder="Search for you meme...." onChange = {(e) => setText(e.target.value)}/>
            </div>
        </div>
    )
}

export default Header
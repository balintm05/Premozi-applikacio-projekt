import React, { useContext } from 'react';
import { ThemeContext } from './Layout';

const ThemeWrapper = ({
    children,
    className = '',
    style = {},
    as: Component = 'div', 
    noText = false, 
    noBg = false,   
    ...props
}) => {
    const { darkMode } = useContext(ThemeContext);

    const themeClasses = [
        !noBg && (darkMode ? 'bg-dark' : 'bg-light'),
        !noText && (darkMode ? 'text-white' : 'text-dark'),
        className
    ].filter(Boolean).join(' ');

    const themeStyles = {
        ...(!noBg && { backgroundColor: darkMode ? '#121212' : '#ffffff' }),
        ...(!noText && { color: darkMode ? '#ffffff' : '#000000' }),
        ...style
    };

    return (
        <Component
            className={themeClasses}
            style={themeStyles}
            {...props}
        >
            {children}
        </Component>
    );
};

export default ThemeWrapper;
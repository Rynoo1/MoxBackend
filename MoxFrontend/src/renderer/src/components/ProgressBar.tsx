import React, { useState } from 'react';

interface ProgressbarProps {
    progress: number; // Progress value between 0 and 100
    tooltipText?: string; // Optional custom text for the tooltip
    settooltipText?: (text: string) => 'complete'; // Optional function to set tooltip text
}

const Progressbar: React.FC<ProgressbarProps> = ({ progress, tooltipText }) => {
    const [isHovered, setIsHovered] = useState(false);

    const getBarColor = () => {
        if (progress < 40) return '#EF4444'; // Red
        if (progress < 80) return '#EFB917'; // Sunburn orange
        return '#B9E425'; // Lime green
    };

    // Constrain the thumb position
    const constrainedProgress = Math.min(100, Math.max(0, progress));

    return (
        <div
            style={styles.container}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div
                style={{
                    ...styles.fill,
                    width: `${constrainedProgress}%`,
                    background: getBarColor(),
                }}
            />
            <div
                style={{
                    ...styles.thumb,
                    left: `calc(${constrainedProgress}% - 10px)`, // Center the thumb
                }}
            />
            {isHovered && (
                <div
                    style={{
                        ...styles.tooltip,
                        left: `calc(${constrainedProgress}% - 20px)`, // Center the tooltip
                    }}
                >
                    {tooltipText ? tooltipText : `${constrainedProgress}%`}
                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        width: '100%',
        height: '20px',
        backgroundColor: '#e0e0e0',
        borderRadius: '10px',
        position: 'relative' as 'relative',
        overflow: 'hidden',
        boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.2)',
    },
    fill: {
        height: '100%',
        borderRadius: '10px',
        transition: 'width 0.3s ease',
        boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.2)',
    },
    thumb: {
        position: 'absolute' as 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        marginLeft: '-10px',
        width: '16px',
        height: '16px',
        borderRadius: '50%',
        backgroundColor: '#fff',
        boxShadow: '0 0 3px rgba(0,0,0,0.3)',
        transition: 'left 0.3s ease',
    },
    tooltip: {
        position: 'absolute' as 'absolute',
        top: '-35px', // Adjusted to ensure it appears above the bar
        padding: '5px 10px',
        backgroundColor: '#333',
        color: '#fff',
        borderRadius: '5px',
        fontSize: '12px',
        whiteSpace: 'nowrap',
        transform: 'translateX(-50%)',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
        zIndex: 10, // Ensure it appears above other elements
        border: '1px solid #fff', // Optional border for better visibility
    },
};

export default Progressbar;
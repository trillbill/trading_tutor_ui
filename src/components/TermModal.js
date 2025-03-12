import React from 'react';
import ChartDisplay from './ChartDisplay'; // Import the ChartDisplay component
import './TermModal.css'; // Create a CSS file for styling

const TermModal = ({ isOpen, onClose, term }) => {
    if (!isOpen || !term) return null; // Don't render if not open or term is not provided

    return (
        <div className="modal" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <span className="close" onClick={onClose}>&times;</span>
                <h2>{term.name}</h2>
                {term.video ? (
                    <iframe
                        width="100%"
                        height="300"
                        src={term.video}
                        title={term.name}
                        frameBorder="0"
                        allowFullScreen
                    ></iframe>
                ) : (
                    <ChartDisplay chartType={term.chartType} data={term.data} lineColor={term.lineColor} />
                )}
                <p>{term.value}</p>
            </div>
        </div>
        
    );
};

export default TermModal;

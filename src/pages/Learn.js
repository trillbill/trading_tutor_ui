import React, { useState } from 'react';
import axios from 'axios';
import ChartDisplay from '../components/ChartDisplay';
import './Learn.css';
import terminologyData from '../terminologyData';

const Learn = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');
    const [selectedTerm, setSelectedTerm] = useState(null);

    const filteredTerms = terminologyData.filter(term => {
        const matchesSearch = term.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === 'All' || term.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    const handleCardClick = (term) => {
        setSelectedTerm(term);
    };

    const handleCloseModal = () => {
        setSelectedTerm(null);
    };

    return (
        <div className="learn-container">
            <div className="search-filter">
                <input
                    type="text"
                    placeholder="Search terms..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select onChange={(e) => setFilterCategory(e.target.value)} value={filterCategory}>
                    <option value="All">All Categories</option>
                    <option value="Price Levels">Price Levels</option>
                    <option value="Chart Patterns">Chart Patterns</option>
                    <option value="Moving Averages">Moving Averages</option>
                    <option value="Momentum Indicators">Momentum Indicators</option>
                    <option value="Technical Analysis Tools">Technical Analysis Tools</option>
                </select>
            </div>
            <div className="learn-list">
                {filteredTerms.map((term, index) => (
                    <div className="term-card" key={index} onClick={() => handleCardClick(term)}>
                        <ChartDisplay chartType={term.chartType} data={term.data} color={term.lineColor} />
                        <h3>{term.name}</h3>
                        <p>{term.value}</p>
                    </div>
                ))}
            </div>

            {selectedTerm && (
                <div className="modal" onClick={handleCloseModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <span className="close" onClick={handleCloseModal}>&times;</span>
                        <h2>{selectedTerm.name}</h2>
                        <ChartDisplay chartType={selectedTerm.chartType} data={selectedTerm.data} lineColor={selectedTerm.lineColor} />
                        <p>{selectedTerm.value}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Learn;
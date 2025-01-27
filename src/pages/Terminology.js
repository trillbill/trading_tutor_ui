import React, { useState } from 'react';
import terminologyData from '../terminologyData';
import './Terminology.css';

const Terminology = () => {
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
        <div className="terminology-container">
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
                    <option value="Market Trends">Market Trends</option>
                    {/* Add more categories as needed */}
                </select>
            </div>
            <div className="terminology-list">
                {filteredTerms.map((term, index) => (
                    <div className="term-card" key={index} onClick={() => handleCardClick(term)}>
                        <img src={term.image} />
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
                        <img src={selectedTerm.image} alt={selectedTerm.name} className="modal-image" />
                        <p>{selectedTerm.value}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Terminology;
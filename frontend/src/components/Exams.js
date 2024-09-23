import React, { useState } from 'react';
import './Exam.css'; // Ensure the CSS file is imported

const Exams = () => {
    const [dropdown, setDropdown] = useState(null);

    const toggleDropdown = (subject) => {
        setDropdown(dropdown === subject ? null : subject);
    };

    return (
        <div className="exams-container">
            <h1 className="exams-title">Available Exams</h1>
            <ul className="exams-list">
                {['HTML', 'JavaScript', 'PHP', 'Python', 'Node.js'].map((subject) => (
                    <li key={subject}>
                        <button onClick={() => toggleDropdown(subject)} className="dropdown-button">
                            {subject} Exams
                        </button>
                        {dropdown === subject && (
                            <div className="dropdown-content">
                                <a href={`/exams/${subject.toLowerCase()}/easy`}>Easy</a>
                                <a href={`/exams/${subject.toLowerCase()}/intermediate`}>Intermediate</a>
                                <a href={`/exams/${subject.toLowerCase()}/advanced`}>Advanced</a>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Exams;

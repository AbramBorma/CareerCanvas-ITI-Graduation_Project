import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../static/styles/Exam.css'


const Exams = () => {
    const [selectedSubject, setSelectedSubject] = useState('');
    const navigate = useNavigate();

    const handleStartExam = () => {
        if (selectedSubject) {
            navigate(`/exams/${selectedSubject.toLowerCase()}`);
        }
    };

    return (
        <div className="exams-container">
            <h1 className="exams-title">Available Exams</h1>
            <div className="select-container">
                <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="exam-select"
                >
                    <option value="">Select an Exam</option>
                    {['HTML', 'JavaScript', 'PHP', 'Python', 'Node.js'].map((subject) => (
                        <option key={subject} value={subject}>
                            {subject} Exam
                        </option>
                    ))}
                </select>
                <button onClick={handleStartExam} className="start-exam-button" disabled={!selectedSubject}>
                    Start Exam
                </button>
            </div>
        </div>
    );
};

export default Exams;
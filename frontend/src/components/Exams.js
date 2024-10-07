import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../static/styles/Exam.css';
import { getAssignedSubjects } from '../services/api';
import AuthContext from '../context/AuthContext';

const Exams = () => {
    const [selectedSubject, setSelectedSubject] = useState('');
    const navigate = useNavigate();
    const { user } = React.useContext(AuthContext); 
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    

    useEffect(() => {
        const getSub = async () => {
            try {
                const res = await getAssignedSubjects(user.user_id);
                setSubjects(res || []);
            } catch (error) {
                console.error("Failed to fetch subjects:", error);
            } finally {
                setLoading(false);
            }
        };
        getSub();
    }, [user.user_id]);

    const handleStartExam = () => {
        if (selectedSubject) {
            const examData = JSON.parse(selectedSubject)
            navigate(`/exams/${JSON.parse(selectedSubject).subject.toLowerCase()}`,{ state: { examData }});
        }
    };

    return (
        <div className="exams-container">
            <h1 className="exams-title">Available Exams</h1>
            <p className="exam-instructions">
                Please choose an exam. 
                <br />
                Try not to cheat, as the exam will be submitted suddenly if you do!
            </p>
            <div className="select-container">
                {loading ? (
                    <p>Loading subjects...</p>
                ) : (
                    <>
                        <select
                            value={selectedSubject}
                            onChange={(e) => setSelectedSubject(e.target.value)}
                            className="exam-select"
                        >
                            <option value="">Select an Exam</option>
                            {subjects.map((subject) => (
                                <option key={subject.id} value={JSON.stringify(subject)}>
                                    {subject.name} Exam
                                </option>
                            ))}
                        </select>
                        <button onClick={handleStartExam} className="start-exam-button" disabled={!selectedSubject}>
                            Start Exam
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default Exams;

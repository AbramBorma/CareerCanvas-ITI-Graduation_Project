import React, { useEffect, useState,useContext } from 'react';
import { getQuestions, examSubjects,addSupervisorQuestions } from '../services/api';
import AuthContext from '../context/AuthContext'; 
import '../static/styles/CreateExam.css';

const CreateExam = () => {
    const { user } = useContext(AuthContext); 
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [difficulty, setDifficulty] = useState('');
    const [questions, setQuestions] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedQuestions, setSelectedQuestions] = useState([]);

    // Pagination states for questions and selected questions
    const [currentPageQuestions, setCurrentPageQuestions] = useState(1);
    const [questionsPerPage, setQuestionsPerPage] = useState(5); // Number of questions per page
    const [currentPageSelected, setCurrentPageSelected] = useState(1);
    const [selectedPerPage, setSelectedPerPage] = useState(5); // Number of selected questions per page

    const difficultyLevels = ['easy', 'intermediate', 'advanced', 'coding'];

    // Fetch subjects from the API
    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const response = await examSubjects();
                setSubjects(response);
            } catch (error) {
                console.error('Error fetching subjects:', error);
            }
        };

        fetchSubjects();
    }, []);

    // Fetch questions based on selected subject and difficulty
    const fetchQuestions = async () => {
        if (!selectedSubject || !difficulty) {
            alert('Please select both a subject and difficulty level.');
            return;
        }
        if (difficulty == "coding") {
            setQuestionsPerPage(2);
            setSelectedPerPage(2)
        } else {
            setQuestionsPerPage(5);
            setSelectedPerPage(5)
        }

        try {
            const response = await getQuestions(selectedSubject, difficulty);
            setQuestions(response);
            setCurrentPageQuestions(1); // Reset to first page when fetching new questions
        } catch (error) {
            console.error('Error fetching questions:', error);
        }
    };

    const addQuestions = async () => {
        if (!selectedQuestions) {
            alert('Please select Some Questions first.');
            return;
        }

        try {
            const response = await addSupervisorQuestions(user.user_id, {"questions" : selectedQuestions});
            console.log(response);
            // setCurrentPageQuestions(1); // Reset to first page when fetching new questions
        } catch (error) {
            console.error('Error fetching questions:', error);
        }
    };


    // Filter questions based on search term
    const filteredQuestions = questions.filter((question) =>
        question.question_text.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Handle question selection
    const handleQuestionSelect = (question) => {
        setSelectedQuestions((prevSelected) =>
            prevSelected.includes(question)
                ? prevSelected.filter((q) => q !== question)
                : [...prevSelected, question]
        );
    };

    // Pagination logic for questions
    const indexOfLastQuestion = currentPageQuestions * questionsPerPage;
    const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
    const currentQuestions = filteredQuestions.slice(indexOfFirstQuestion, indexOfLastQuestion);

    const paginateQuestions = (pageNumber) => setCurrentPageQuestions(pageNumber);

    // Pagination logic for selected questions
    const indexOfLastSelected = currentPageSelected * selectedPerPage;
    const indexOfFirstSelected = indexOfLastSelected - selectedPerPage;
    const currentSelectedQuestions = selectedQuestions.slice(indexOfFirstSelected, indexOfLastSelected);

    const paginateSelected = (pageNumber) => setCurrentPageSelected(pageNumber);

    return (
        <div className="exam-question-fetcher">
            <h2>Fetch Exam Questions</h2>

            {/* Subject Dropdown */}
            <div>
                <label htmlFor="subject">Select Subject:</label>
                <select
                    id="subject"
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="dropdown"
                >
                    <option value="">-- Select Subject --</option>
                    {subjects.map((subject) => (
                        <option key={subject} value={subject}>
                            {subject}
                        </option>
                    ))}
                </select>
            </div>

            {/* Difficulty Dropdown */}
            <div>
                <label htmlFor="difficulty">Select Difficulty:</label>
                <select
                    id="difficulty"
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="dropdown"
                >
                    <option value="">-- Select Difficulty --</option>
                    {difficultyLevels.map((level) => (
                        <option key={level} value={level}>
                            {level}
                        </option>
                    ))}
                </select>
            </div>

            {/* Fetch Button */}
            <button onClick={fetchQuestions} className="fetch-btn">
                Fetch Questions
            </button>

            {/* Search Input */}subjects
            <div>
                <input
                    type="text"
                    placeholder="Search questions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
            </div>

            {/* Questions List */}
            <div className="question-list">
                <h3>Questions:</h3>
                <ul>
                    {currentQuestions.map((question) => (
                        <li key={question.id} className="question-item">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={selectedQuestions.includes(question)}
                                    onChange={() => handleQuestionSelect(question)}
                                />
                                {question.question_text}
                            </label>
                        </li>
                    ))}
                </ul>

                {/* Pagination for Questions */}
                <Pagination
                    itemsPerPage={questionsPerPage}
                    totalItems={filteredQuestions.length}
                    paginate={paginateQuestions}
                    currentPage={currentPageQuestions}
                />
            </div>

            {/* Selected Questions */}
            <div className="selected-questions">
                <h3>Selected Questions:</h3>
                <ul>
                    {currentSelectedQuestions.map((question) => (
                        <li key={question.id}>{question.question_text}</li>
                    ))}
                </ul>

                {/* Pagination for Selected Questions */}
                <Pagination
                    itemsPerPage={selectedPerPage}
                    totalItems={selectedQuestions.length}
                    paginate={paginateSelected}
                    currentPage={currentPageSelected}
                />
            </div>
            <button onClick={addQuestions} className="fetch-btn">
                Add Questions
            </button>
        </div>
    );
};

// Pagination Component
const Pagination = ({ itemsPerPage, totalItems, paginate, currentPage }) => {
    const [pageRange, setPageRange] = useState(3); // Number of page buttons to show
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const startPage = Math.max(1, currentPage - Math.floor(pageRange / 2));
    const endPage = Math.min(totalPages, currentPage + Math.floor(pageRange / 2));

    const handlePrevious = () => {
        if (currentPage > 1) {
            paginate(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            paginate(currentPage + 1);
        }
    };

    return (
        <nav>
            <ul className="pagination">
                {/* Previous Button */}
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button onClick={handlePrevious} className="page-link">
                        Previous
                    </button>
                </li>

                {/* Page Numbers */}
                {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((number) => (
                    <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                        <button onClick={() => paginate(number)} className="page-link">
                            {number}
                        </button>
                    </li>
                ))}

                {/* Next Button */}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button onClick={handleNext} className="page-link">
                        Next
                    </button>
                </li>
            </ul>
        </nav>
    );
};


export default CreateExam;
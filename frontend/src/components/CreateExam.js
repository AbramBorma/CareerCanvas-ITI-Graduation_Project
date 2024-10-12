import React, { useEffect, useState, useContext } from 'react';
import { getQuestions, addSupervisorQuestions, getSupervisorExams, getExamQuestions, deleteExam,deleteQuestion } from '../services/api';
import AuthContext from '../context/AuthContext';
import SupervisorAddExam from './SupervisorAddExam'
import '../static/styles/CreateExam.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const CreateExam = () => {
    const { user } = useContext(AuthContext);
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState();
    const [difficulty, setDifficulty] = useState('');
    const [questions, setQuestions] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedQuestions, setSelectedQuestions] = useState([]);
    const [selectedSubjectchanged, setSelectedSubjectchanged] = useState(false)
    const [realSelectedSubject, setRealSelectedSubject] = useState();
    const [showModal, setShowModal] = useState(false);


    // Pagination states for questions and selected questions
    const [currentPageQuestions, setCurrentPageQuestions] = useState(1);
    const [questionsPerPage, setQuestionsPerPage] = useState(5); // Number of questions per page
    const [currentPageSelected, setCurrentPageSelected] = useState(1);
    const [selectedPerPage, setSelectedPerPage] = useState(5); // Number of selected questions per page
    const [totalItems, setTotalItems] = useState(0); 


    const difficultyLevels = ['easy', 'intermediate', 'advanced', 'coding'];

    // Fetch subjects from the API
    // useEffect(() => {
    //     const fetchSubjects = async () => {
    //         try {
    //             const response = await examSubjects();
    //             setSubjects(response);
    //         } catch (error) {
    //             console.error('Error fetching subjects:', error);
    //         }
    //     };

    //     fetchSubjects();
    // }, []);

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const response = await getSupervisorExams(user.user_id);
                console.log(response)
                setSubjects(response);
            } catch (error) {
                console.error('Error fetching subjects:', error);
            }
        };

        fetchSubjects();
    }, [selectedSubjectchanged]);

    // Fetch questions based on selected subject and difficulty

    const fetchAllQuestions = async (pageNumber = currentPageQuestions,search) => {
        try {
            const response = await getQuestions(pageNumber,search,JSON.parse(selectedSubject).subject, difficulty);
            console.log(response)
            setTotalItems(response.count)
            setQuestions(response.results);
            // setCurrentPageQuestions(1); // Reset to first page when fetching new questions
        } catch (error) {
            console.error('Error fetching questions:', error);
        }
    }
    const fetchSelectedQuestions = async () => {
        try {
            const response = await getExamQuestions(JSON.parse(selectedSubject).id, difficulty);
            console.log(response)
            setSelectedQuestions(response);
            setCurrentPageSelected(1); // Reset to first page when fetching new questions
        } catch (error) {
            console.error('Error fetching questions:', error);
        }
    }


    const fetchQuestions = async () => {
        // console.log(JSON.parse(selectedSubject).id)
        if (!selectedSubject || !difficulty) {
            // alert('Please select both a subject and difficulty level.');
            // toast.error('Passwords do not match');
            toast.error('Please select both a subject and difficulty level.');

            return;
        }


        // if (difficulty === "coding") {
        //     setQuestionsPerPage(2);
        //     setSelectedPerPage(2);
        // } else {
        //     setQuestionsPerPage(5);
        //     setSelectedPerPage(5);
        // }
        setCurrentPageQuestions(1);
        fetchAllQuestions(1,searchTerm)
        fetchSelectedQuestions()
        setRealSelectedSubject(selectedSubject);
    };

    const addQuestions = async () => {
        if (selectedQuestions.length === 0) {
            // alert('Please select some questions first.');
            toast.error('Please select some questions first');
            return;
        }

        try {
            const response = await addSupervisorQuestions(JSON.parse(realSelectedSubject).id, { questions: selectedQuestions });
            console.log(response);
        } catch (error) {
            console.error('Error adding questions:', error);
        }
        setQuestions([]);
        setSelectedQuestions([]);
    };

    // Filter questions based on search term
    const filteredQuestions = questions.filter((question) =>
        question.question_text.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Handle question selection (prevent duplicates)
    const handleQuestionSelect = (question) => {
        setSelectedQuestions((prevSelected) =>
            prevSelected.includes(question)
                ? prevSelected.filter((q) => q !== question) // Remove if it's already selected
                : [...prevSelected, question] // Add if it's not in the list
        );
    };

    // Check if a question is already selected
    const isQuestionSelected = (question) => {
        return selectedQuestions.some(selected => selected.id === question.id);
    };


    const addTheExam = () => {
        setShowModal(true)
    }

    const deleteTheExam = async () => {
        if (!selectedSubject) {
            // alert('Please select an Exam first.');
            toast.error('Please select an Exam first.');
            return;
        }
        const response = await deleteExam(JSON.parse(selectedSubject).id);
        console.log(response)
        setSelectedSubject()
        setSelectedSubjectchanged(state => !state)
    }

    const deletequestion  = async (qId) => {
        try{
        const response = await deleteQuestion(qId);
        toast.success("removed")
        setCurrentPageQuestions(1);
        fetchAllQuestions(1,searchTerm)
        }catch (error) {
            console.error('Error Deleting questions:', error);
        }
    }




    // Pagination logic for questions
    const indexOfLastQuestion = currentPageQuestions * questionsPerPage;
    const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
    const currentQuestions = filteredQuestions;
    // const currentQuestions = filteredQuestions.slice(indexOfFirstQuestion, indexOfLastQuestion);

    const paginateQuestions = (pageNumber) => {setCurrentPageQuestions(pageNumber); fetchAllQuestions(pageNumber,searchTerm);};

    // Pagination logic for selected questions
    const indexOfLastSelected = currentPageSelected * selectedPerPage;
    const indexOfFirstSelected = indexOfLastSelected - selectedPerPage;
    const currentSelectedQuestions = selectedQuestions.slice(indexOfFirstSelected, indexOfLastSelected);

    const paginateSelected = (pageNumber) => setCurrentPageSelected(pageNumber);

    return (
        <div className="exam-question-fetcher">
            <h2>Fetch Exam Questions</h2>

            {/* Subject Dropdown */}
            <div className="subject-div">
                <label htmlFor="subject">Select Exam:</label>
                <select
                    id="subject"
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="dropdown"
                >
                    <option value="">-- Select Subject --</option>
                    {subjects.map((subject) => (
                        <option key={subject.id} value={JSON.stringify(subject)}>
                            {subject.name}
                        </option>
                    ))}
                </select>
                <button onClick={addTheExam} className="add-btn">Add Exam</button>
                <button onClick={deleteTheExam} className="delete-btn">Remove Exam</button>
            </div>
            {showModal && (
                      <SupervisorAddExam  onClose={() => { setShowModal(false); setSelectedSubjectchanged(state => !state); }} />
                )}
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

            {/* Search Input */}
            <div>
                <input
                    type="text"
                    placeholder="Search questions..."
                    value={searchTerm}
                    onChange={(e) => {setSearchTerm(e.target.value);setCurrentPageQuestions(1);fetchAllQuestions(1,e.target.value);}}
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
                                    checked={isQuestionSelected(question)} // Check if it's already selected
                                    onChange={() => handleQuestionSelect(question)}
                                />
                                {question.question_text}
                                {(! question.is_general)&&(<button onClick={()=>deletequestion(question.id)} className="delete-btn1">Delete</button>)}
                            </label>
                        </li>
                    ))}
                </ul>

                {/* Pagination for Questions */}
                <Pagination
                    itemsPerPage={questionsPerPage}
                    // totalItems={filteredQuestions.length}
                    totalItems={totalItems}
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
            <ToastContainer />

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

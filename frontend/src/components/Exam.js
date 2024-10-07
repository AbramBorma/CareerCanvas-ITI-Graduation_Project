import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import '../static/styles/ExamStyles.css';
import { getExamQuestions, submitExam } from '../services/api';
import AuthContext from '../context/AuthContext';



const coding = {
    javascript: "javascript",
    reactjs: "javascript",
    nodejs: "javascript",
    python: "python",
    django: "python",
    flask: "python",
    java: "java",
    php: "php",
    laravel: "php",
    linux: "bash",
};


const Exam = () => {
    const { subject } = useParams();
    const [timeLeft, setTimeLeft] = useState(900); // 15 minutes = 900 seconds
    const [questions, setQuestions] = useState([]);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [cheat, setCheat] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logoutUser } = React.useContext(AuthContext);
    const { examData } = location.state || {};
    const [codingQuestionsLength, setCodingQuestionsLength] = useState(0)
    const [questionsNumber, setQuestionsNumber] = useState(0)




    useEffect(() => {
        console.log(examData)
        const getRandomQuestions = async () => {
            const reseasy = await getExamQuestions(examData.id, "easy");
            const resmed = await getExamQuestions(examData.id, "intermediate");
            const reshard = await getExamQuestions(examData.id, "advanced");
            // console.log(reseasy)
            const no_of_questions = examData.number_of_questions.split(",")
            // console.log(no_of_questions)
            const noOfEasy = no_of_questions[0]
            const noOfmedium = no_of_questions[1]
            const noOfhard = no_of_questions[2]


            const subjectQuestions = {
                easy: reseasy,
                medium: resmed,
                hard: reshard,
            };

            if (!subjectQuestions) {
                console.error("No questions available for the selected subject");
                return [];
            }

            const { easy, medium, hard } = subjectQuestions;
            const allQuestions = [];

            // Randomly select questions
            for (let i = 0; i < noOfEasy && easy.length > 0; i++) {
                const randomIndex = Math.floor(Math.random() * easy.length);
                allQuestions.push(easy[randomIndex]);
                easy.splice(randomIndex, 1);
            }

            for (let i = 0; i < noOfmedium && medium.length > 0; i++) {
                const randomIndex = Math.floor(Math.random() * medium.length);
                allQuestions.push(medium[randomIndex]);
                medium.splice(randomIndex, 1);
            }

            for (let i = 0; i < noOfhard && hard.length > 0; i++) {
                const randomIndex = Math.floor(Math.random() * hard.length);
                allQuestions.push(hard[randomIndex]);
                hard.splice(randomIndex, 1);
            }

            console.log("Selected Questions:", allQuestions); // Log selected questions
            setQuestionsNumber(allQuestions.length)
            return allQuestions;
        };

        const fetchQuestions = async () => {
            const allQuestions = await getRandomQuestions();
            setQuestions(allQuestions);
        };

        try {
            fetchQuestions();
        } catch (error) {
            console.error('Error fetching questions:', error);
        }




        const timer = setInterval(() => {
            setTimeLeft((prevTime) => {
                if (prevTime <= 0) {
                    clearInterval(timer);
                    handleSubmit(); // Automatically submit when time is up
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [subject]);

    function Cheating() {
        console.log(cheat)
        if (cheat) {
            handleSubmit();
        } else {
            setCheat(true);
            alert('Warning: No Cheating!');
        }
    }

    useEffect(() => {
        if (window) {
            window.onblur = () => Cheating();
        }

        return () => { window.onblur = null; };
    }, [cheat]);


    useEffect(() => {
        const fetchcoding = async () => {
            try {
                const codeQ = await getExamQuestions(examData.id, "coding");
                setCodingQuestionsLength(codeQ.length)
            } catch (error) {
                console.error('Error fetching questions:', error);
            }
        }
        fetchcoding()
    }, [])


    const handleAnswerChange = (questionId, answerId) => {
        setSelectedAnswers((prev) => ({
            ...prev,
            [questionId]: answerId,
        }));
    };


    const handleSubmit = async () => {
        let totalQNumber=0
        if(codingQuestionsLength >0){
             totalQNumber =questionsNumber+4;
        }else{            
             totalQNumber =questionsNumber;
        }

        const userAnswers = {
            exam_id: examData.id,
            answers: selectedAnswers,
            user_email: user.email,
            totalNumber:totalQNumber  
        };

        const code = coding[subject]
        if (code && codingQuestionsLength >0) {
            navigate(`/monaco/${code}`, { state: { userAnswers } });
        } else {
            try {
                console.log(userAnswers);
                // const response = await fetch('http://127.0.0.1:8000/exams/submit/', {
                //     method: 'POST',
                //     headers: {
                //         'Content-Type': 'application/json',
                //     },
                //     body: JSON.stringify(userAnswers),
                // });
                const response = await submitExam(JSON.stringify(userAnswers))
                console.log(response)
                const result = await response;
                window.onblur = null;
                alert(`Exam submitted! Your score: ${result.score}`);
                navigate(`/exams`);
            } catch (error) {
                console.error('Error submitting exam:', error);
            }
        }
    };

    return (
        <div className="exam-container">
            <h2>{subject.charAt(0).toUpperCase() + subject.slice(1)} Exam</h2>
            <h4>Time Left: {Math.floor(timeLeft / 60)}:{('0' + (timeLeft % 60)).slice(-2)}</h4>
            <ul>
                {questions.length > 0 ? questions.map((q) => (
                    <li key={q.id}>
                        <p>{q.question_text}</p>
                        <ul>
                            {q.options.map((a, index) => (
                                <li key={index}>
                                    <input
                                        type="radio"
                                        name={`question-${q.id}`}
                                        onChange={() => handleAnswerChange(q.id, a)}
                                    />
                                    {a}
                                </li>
                            ))}
                        </ul>
                    </li>
                )) : <p>No questions available for this exam.</p>}
            </ul>
            {timeLeft === 0 && <p>Time's up!</p>}
            <button className="submit-button" onClick={handleSubmit} disabled={timeLeft === 0}>Submit</button>
        </div>
    );
};

export default Exam;
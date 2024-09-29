import React, { useState, useEffect } from 'react';
import { useParams ,useNavigate} from 'react-router-dom';
import '../static/styles/ExamStyles.css';
import { getQuestions,submitExam } from '../services/api';


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
    const navigate = useNavigate();

    useEffect(() => {
        const getRandomQuestions = async () => {
            const reseasy = await getQuestions(subject, "easy");
            const resmed = await getQuestions(subject, "intermediate");
            const reshard = await getQuestions(subject, "advanced");

            const subjectQuestions = {
                easy: reseasy.data,
                medium: resmed.data,
                hard: reshard.data,
            };

            if (!subjectQuestions) {
                console.error("No questions available for the selected subject");
                return [];
            }

            const { easy, medium, hard } = subjectQuestions;
            const allQuestions = [];

            // Randomly select questions
            for (let i = 0; i < 10 && easy.length > 0; i++) {
                const randomIndex = Math.floor(Math.random() * easy.length);
                allQuestions.push(easy[randomIndex]);
                easy.splice(randomIndex, 1);
            }

            for (let i = 0; i < 10 && medium.length > 0; i++) {
                const randomIndex = Math.floor(Math.random() * medium.length);
                allQuestions.push(medium[randomIndex]);
                medium.splice(randomIndex, 1);
            }

            for (let i = 0; i < 5 && hard.length > 0; i++) {
                const randomIndex = Math.floor(Math.random() * hard.length);
                allQuestions.push(hard[randomIndex]);
                hard.splice(randomIndex, 1);
            }

            console.log("Selected Questions:", allQuestions); // Log selected questions
            return allQuestions;
        };

        const fetchQuestions = async () => {
            const allQuestions = await getRandomQuestions();
            setQuestions(allQuestions);
        };

        fetchQuestions();

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

    const handleAnswerChange = (questionId, answerId) => {
        setSelectedAnswers((prev) => ({
            ...prev,
            [questionId]: answerId,
        }));
    };

    const handleSubmit = async () => {
        const userAnswers = {
            subject_id: subject,
            answers: selectedAnswers,
            user_email:"mahmoud@gmail.com"
        };
        
        const code=coding[subject]
        if(code){
            navigate(`/monaco/${code}`, { state: { userAnswers } });
        }else{
        try {
            console.log(userAnswers);
            // const response = await fetch('http://127.0.0.1:8000/exams/submit/', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify(userAnswers),
            // });
            const response=await submitExam(JSON.stringify(userAnswers))
            console.log(response)
            const result = await response.data;
            alert(`Exam submitted! Your score: ${result.score}`);
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

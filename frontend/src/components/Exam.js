import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../static/styles/ExamStyles.css'

// Sample questions structure
const examQuestions = {
    html: {
        easy: [
            { id: 1, question_text: "What does HTML stand for?", options: ["Hyper Text Markup Language", "Hyperlinks and Text Markup Language"] },
            // Add more easy questions...
        ],
        medium: [
            { id: 2, question_text: "Which HTML element defines the title of a document?", options: ["<title>", "<head>", "<meta>"] },
            // Add more medium questions...
        ],
        hard: [
            { id: 3, question_text: "What is the purpose of the <head> tag?", options: ["Contains meta information", "Defines the body of the document"] },
            // Add more hard questions...
        ],
    },
    // Add other subjects with their questions...
};

// document.addEventListener('visibilitychange',()=>{
//     console.log('submited')
//     return()=>document.removeEventListener('visibilitychange')
// })
// if(window){
//     window.onblur = ()=> console.log('submiteddddddddddd')
// }


const Exam = () => {
    const { subject } = useParams();
    const [timeLeft, setTimeLeft] = useState(900); // 15 minutes = 900 seconds
    const [questions, setQuestions] = useState([]);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [loaded,setLoaded] = useState(false)

useEffect(()=>{
    if(window){
     window.onblur = ()=> console.log('submiteddddddddddd')
    }
},[])

    useEffect(() => {
        console.log("Selected Subject:", subject); // Log the selected subject

        const getRandomQuestions = () => {
            const subjectKey = subject.toLowerCase();
            const subjectQuestions = examQuestions[subjectKey];

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

                

        const fetchedQuestions = getRandomQuestions();
        setQuestions(fetchedQuestions);

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

    }, []);

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
        };

        try {
            const response = await fetch('/api/exams/submit/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userAnswers),
            });

            const result = await response.json();
            alert(`Exam submitted! Your score: ${result.score}`);
        } catch (error) {
            console.error('Error submitting exam:', error);
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
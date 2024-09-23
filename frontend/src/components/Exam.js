import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import './Exam.css'; // Import the CSS file

const Exam = () => {
  const { subject, level } = useParams();
  const [exam, setExam] = useState(null);
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes = 900 seconds

  useEffect(() => {
    // Fetch the exam data based on subject and level
    axios.get(`/api/exams/${subject}/${level}/`).then((res) => {
      setExam(res.data);
    });

    // Timer setup
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [subject, level]);

  return (
    <div className="exam-container">
      {exam ? (
        <div>
          <h2 className="exam-title">{exam.subject} - {exam.level}</h2>
          <h4 className="time-left">Time Left: {Math.floor(timeLeft / 60)}:{timeLeft % 60 < 10 ? `0${timeLeft % 60}` : timeLeft % 60}</h4>
          <ul>
            {exam.questions.map((q) => (
              <li key={q.id} className="question">
                <p>{q.text}</p>
                <ul className="answers">
                  {q.answers.map((a) => (
                    <li key={a.id}>
                      <input type="radio" name={`question-${q.id}`} />
                      {a.text}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Exam;

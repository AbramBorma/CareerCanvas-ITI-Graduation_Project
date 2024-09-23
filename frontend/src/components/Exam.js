import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './ExamStyles.css';

const Exam = () => {
    const { subject, level } = useParams();
    const [timeLeft, setTimeLeft] = useState(900); // 15 minutes = 900 seconds
    const [questions, setQuestions] = useState([]);
    const [selectedAnswers, setSelectedAnswers] = useState({});

    useEffect(() => {
      const examQuestions = {
          html: {
              easy: [
                  { id: 1, text: 'What does HTML stand for?', answers: [{ id: 1, text: 'Hypertext Markup Language' }, { id: 2, text: 'Hightext Machine Language' }] },
                  { id: 2, text: 'Which HTML element is used to define the title of a document?', answers: [{ id: 3, text: '<title>' }, { id: 4, text: '<head>' }] },
                  { id: 3, text: 'What tag is used to create a hyperlink?', answers: [{ id: 5, text: '<a>' }, { id: 6, text: '<link>' }] },
                  { id: 4, text: 'Which attribute is used to specify an inline style?', answers: [{ id: 7, text: 'style' }, { id: 8, text: 'class' }] },
                  { id: 5, text: 'What does the <br> tag do?', answers: [{ id: 9, text: 'Inserts a line break' }, { id: 10, text: 'Inserts a paragraph' }] },
                  { id: 6, text: 'What is the correct HTML for inserting an image?', answers: [{ id: 11, text: '<img src="url">' }, { id: 12, text: '<image src="url">' }] },
                  { id: 7, text: 'Which HTML element is used to define the body of the document?', answers: [{ id: 13, text: '<body>' }, { id: 14, text: '<main>' }] },
                  { id: 8, text: 'What does the <title> tag do?', answers: [{ id: 15, text: 'Sets the title of the document' }, { id: 16, text: 'Defines a section' }] },
                  { id: 9, text: 'Which element defines the footer of a document?', answers: [{ id: 17, text: '<footer>' }, { id: 18, text: '<bottom>' }] },
                  { id: 10, text: 'Which HTML element is used for comments?', answers: [{ id: 19, text: '<!-- comment -->' }, { id: 20, text: '<comment>' }] },
              ],
              intermediate: [
                  { id: 1, text: 'Which of the following tags are used to create a list in HTML?', answers: [{ id: 1, text: '<ul>' }, { id: 2, text: '<li>' }, { id: 3, text: '<ol>' }] },
                  { id: 2, text: 'What is the purpose of the <div> tag?', answers: [{ id: 4, text: 'To create a division or section in an HTML document' }, { id: 5, text: 'To add a paragraph' }] },
                  { id: 3, text: 'What is the difference between <b> and <strong> tags?', answers: [{ id: 6, text: '<b> is for styling, <strong> is for importance' }, { id: 7, text: '<b> makes text bold, <strong> emphasizes it semantically' }] },
                  { id: 4, text: 'Which HTML attribute is used to specify the character set for the document?', answers: [{ id: 8, text: 'charset' }, { id: 9, text: 'meta' }] },
                  { id: 5, text: 'What does the <section> tag represent?', answers: [{ id: 10, text: 'A thematic grouping of content' }, { id: 11, text: 'A navigation link' }] },
                  { id: 6, text: 'How can you open a link in a new tab?', answers: [{ id: 12, text: 'Use target="_blank"' }, { id: 13, text: 'Use target="_new"' }] },
                  { id: 7, text: 'What is the purpose of the <header> tag?', answers: [{ id: 14, text: 'To define the header of a document or section' }, { id: 15, text: 'To create a navigation menu' }] },
                  { id: 8, text: 'Which of the following is a semantic HTML element?', answers: [{ id: 16, text: '<article>' }, { id: 17, text: '<div>' }] },
                  { id: 9, text: 'What does the <form> element do?', answers: [{ id: 18, text: 'Collect user input' }, { id: 19, text: 'Display images' }] },
                  { id: 10, text: 'Which element is used for creating an input field?', answers: [{ id: 20, text: '<input>' }, { id: 21, text: '<field>' }] },
              ],
              advanced: [
                  { id: 1, text: 'What is the purpose of the <!DOCTYPE html> declaration?', answers: [{ id: 1, text: 'To define the document type' }, { id: 2, text: 'To link CSS files' }] },
                  { id: 2, text: 'Explain the difference between block-level and inline elements in HTML.', answers: [{ id: 3, text: 'Block-level elements take the full width, while inline elements only take as much width as necessary.' }] },
                  { id: 3, text: 'What are ARIA roles in HTML?', answers: [{ id: 4, text: 'Attributes that enhance accessibility' }, { id: 5, text: 'Styles for HTML elements' }] },
                  { id: 4, text: 'What is the significance of the <meta> tag?', answers: [{ id: 6, text: 'Provides metadata about the HTML document' }, { id: 7, text: 'Defines a CSS stylesheet' }] },
                  { id: 5, text: 'What is the difference between <script src="..."> and <script>...</script>?', answers: [{ id: 8, text: 'One loads an external file, the other contains inline code' }, { id: 9, text: 'They are the same' }] },
                  { id: 6, text: 'What is the purpose of the <canvas> element?', answers: [{ id: 10, text: 'To draw graphics on the fly' }, { id: 11, text: 'To create forms' }] },
                  { id: 7, text: 'How do you make a responsive web design using HTML?', answers: [{ id: 12, text: 'Using the viewport meta tag' }, { id: 13, text: 'Using media queries' }] },
                  { id: 8, text: 'What is an HTML5 data attribute?', answers: [{ id: 14, text: 'A way to store extra data on standard elements' }, { id: 15, text: 'A deprecated feature' }] },
                  { id: 9, text: 'What is the role of the <title> tag in an HTML document?', answers: [{ id: 16, text: 'Sets the title that appears in the browser tab' }, { id: 17, text: 'Defines the main heading' }] },
                  { id: 10, text: 'How does the <link> element function in HTML?', answers: [{ id: 18, text: 'Links external resources like CSS' }, { id: 19, text: 'Defines a script' }] },
              ],
          },
          // Add similar structures for other subjects (js, php, python, nodejs) here
      };


        // Set questions based on subject and level
        setQuestions(examQuestions[subject][level]);

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

    const handleAnswerChange = (questionId, answerId) => {
        setSelectedAnswers((prev) => ({
            ...prev,
            [questionId]: answerId,
        }));
    };

    const handleSubmit = () => {
        alert("Exam submitted! Your answers: " + JSON.stringify(selectedAnswers));
        // Here you can also handle the logic to calculate scores, etc.
    };

    return (
        <div className="exam-container">
            <h2>{subject.charAt(0).toUpperCase() + subject.slice(1)} - {level.charAt(0).toUpperCase() + level.slice(1)} Level</h2>
            <h4>Time Left: {Math.floor(timeLeft / 60)}:{('0' + (timeLeft % 60)).slice(-2)}</h4>
            <ul>
                {questions.length > 0 ? questions.map((q) => (
                    <li key={q.id}>
                        <p>{q.text}</p>
                        <ul>
                            {q.answers.map((a) => (
                                <li key={a.id}>
                                    <input
                                        type="radio"
                                        name={`question-${q.id}`}
                                        onChange={() => handleAnswerChange(q.id, a.id)}
                                    />
                                    {a.text}
                                </li>
                            ))}
                        </ul>
                    </li>
                )) : <p>No questions available for this exam.</p>}
            </ul>
            {timeLeft === 0 && <p>Time's up!</p>}
            <button className="submit-button" onClick={handleSubmit}>Submit</button>
        </div>
    );
};

export default Exam;

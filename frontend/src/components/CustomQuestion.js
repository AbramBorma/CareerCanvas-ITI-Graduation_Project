import React, { useState, useEffect } from 'react';
import '../static/styles/CustomQuestion.css';
import { examSubjects,addCustomQuestion } from '../services/api.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CustomQuestion = () => {
    const [activeTab, setActiveTab] = useState(1);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [difficulty, setDifficulty] = useState('easy');
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState({ option1: '', option2: '', option3: '', option4: '' });
    const [answer, setAnswer] = useState('');
    const [subjects, setSubjects] = useState([]);
    const [inputExpected, setInputExpected] = useState({
        input1: '', expected1: '',
        input2: '', expected2: '',
        input3: '', expected3: '',
        input4: '', expected4: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const codingLang = ['python', 'php', 'javascript'];

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const response = await examSubjects();
                setSubjects(response);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchSubjects();
    }, []);

    const handleTabClick = (tab) => {
        // Prevent switching to tab 2 if the selected subject is not a coding language
        if (tab === 2 && !codingLang.includes(selectedSubject)) {
            return;
        }
        setActiveTab(tab);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // if (activeTab === 2 && !codingLang.includes(selectedSubject)) {
        //     return;
        // }

        if (activeTab === 1 && !Object.values(options).includes(answer)) {
            // alert('The correct answer must match one of the provided options.');
            toast.error('The correct answer must match one of the provided options.');
            return;
        }

        let data;
        if (activeTab === 1) {
            if (!selectedSubject || !question || !difficulty || !answer ||
                !options.option1 || !options.option2 || !options.option3 || !options.option4) {
                // alert('Please fill in all the fields.');
                toast.error('Please fill in all the fields.');
                return;
            }
            // Collect data for Tab 1 (Multiple Choice Tab)
             data = {
                subject_name :selectedSubject,
                question_text:question,
                level:difficulty,
                // options,
                option1:options.option1,
                option2:options.option2,
                option3:options.option3,
                option4:options.option4,
                correct_answer:answer,
            };
            // console.log("Tab 1 Data:", JSON.stringify(tab1Data, null, 2));
        } else if (activeTab === 2) {
            // Collect data for Tab 2 (Input/Expected Tab)
            if (!selectedSubject || !question ||
                !inputExpected.expected1 || !inputExpected.expected2 ||!inputExpected.expected3 ||!inputExpected.expected4 ||
                !inputExpected.input1|| !inputExpected.input2 || !inputExpected.input3 || !inputExpected.input4) {
                    toast.error('Please fill in all the fields.');
                    return;
            }
            data= {
                subject_name :selectedSubject,
                question_text:question,
                level : "coding",
                // inputExpected,
                option1: JSON.stringify({input:JSON.parse(inputExpected.input1) , expected: JSON.parse(inputExpected.expected1) }),
                option3: JSON.stringify({input:JSON.parse(inputExpected.input3) , expected: JSON.parse(inputExpected.expected3)}),
                option4: JSON.stringify({input:JSON.parse(inputExpected.input4) , expected: JSON.parse(inputExpected.expected4)}),
                option2: JSON.stringify({input:JSON.parse(inputExpected.input2) , expected: JSON.parse(inputExpected.expected2)}),
                correct_answer : "-",
            };
            // console.log("Tab 2 Data:", JSON.stringify(tab2Data, null, 2));
        }
        try {
            const response = await addCustomQuestion(data);
            console.log(response)
            toast.success("Saved")
            } catch (error) {
                console.log(error);
                // setError(error.response.data.error);
                toast.error(error.response.data.error);
            }
    };





    return (
        <div className="tab-form-container">
            <select
                className="dropdown"
                value={selectedSubject}
                onChange={(e) => {setSelectedSubject(e.target.value);setActiveTab(1)}}>
                <option value="">-- Select Subject --</option>
                {subjects.map((subject) => (
                    <option key={subject.id} value={subject.name}>
                        {subject.name}
                    </option>
                ))}
            </select>

            <div className="tab-navigation">
                <button
                    className={activeTab === 1 ? 'active' : ''}
                    onClick={() => handleTabClick(1)}
                >
                    MCQ
                </button>
                <button
                    className={activeTab === 2 ? 'active' : ''}
                    onClick={() => handleTabClick(2)}
                    disabled={!codingLang.includes(selectedSubject)} // Disable the button if the subject isn't a coding language
                >
                    Problem Solving
                </button>
            </div>

            {activeTab === 1 && (
                <div className="tab-content">
                    <textarea
                        placeholder="Enter the question"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                    />
                    
                    <select
                        className="dropdown"
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value)}
                    >
                        <option value="easy">Easy</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                    </select>

                    <div className="options-container">
                        <div>
                            <label>Option 1</label>
                            <input
                                type="text"
                                value={options.option1}
                                onChange={(e) => setOptions({ ...options, option1: e.target.value })}
                            />
                        </div>
                        <div>
                            <label>Option 2</label>
                            <input
                                type="text"
                                value={options.option2}
                                onChange={(e) => setOptions({ ...options, option2: e.target.value })}
                            />
                        </div>
                        <div>
                            <label>Option 3</label>
                            <input
                                type="text"
                                value={options.option3}
                                onChange={(e) => setOptions({ ...options, option3: e.target.value })}
                            />
                        </div>
                        <div>
                            <label>Option 4</label>
                            <input
                                type="text"
                                value={options.option4}
                                onChange={(e) => setOptions({ ...options, option4: e.target.value })}
                            />
                        </div>
                    </div>
                    <input
                        type="text"
                        placeholder="Enter the correct answer"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                    />
                </div>
            )}

            {activeTab === 2 && (
                <div className="tab-content">
                    <textarea
                        placeholder="Enter the question"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                    />
                    <div className="input-expected-container">
                        <div>
                            <label>Input 1</label>
                            <input
                                type="text"
                                value={inputExpected.input1}
                                onChange={(e) => setInputExpected({ ...inputExpected, input1: e.target.value })}
                            />
                        </div>
                        <div>
                            <label>Expected 1</label>
                            <input
                                type="text"
                                value={inputExpected.expected1}
                                onChange={(e) => setInputExpected({ ...inputExpected, expected1: e.target.value })}
                            />
                        </div>
                        <div>
                            <label>Input 2</label>
                            <input
                                type="text"
                                value={inputExpected.input2}
                                onChange={(e) => setInputExpected({ ...inputExpected, input2: e.target.value })}
                            />
                        </div>
                        <div>
                            <label>Expected 2</label>
                            <input
                                type="text"
                                value={inputExpected.expected2}
                                onChange={(e) => setInputExpected({ ...inputExpected, expected2: e.target.value })}
                            />
                        </div>
                        <div>
                            <label>Input 3</label>
                            <input
                                type="text"
                                value={inputExpected.input3}
                                onChange={(e) => setInputExpected({ ...inputExpected, input3: e.target.value })}
                            />
                        </div>
                        <div>
                            <label>Expected 3</label>
                            <input
                                type="text"
                                value={inputExpected.expected3}
                                onChange={(e) => setInputExpected({ ...inputExpected, expected3: e.target.value })}
                            />
                        </div>
                        <div>
                            <label>Input 4</label>
                            <input
                                type="text"
                                value={inputExpected.input4}
                                onChange={(e) => setInputExpected({ ...inputExpected, input4: e.target.value })}
                            />
                        </div>
                        <div>
                            <label>Expected 4</label>
                            <input
                                type="text"
                                value={inputExpected.expected4}
                                onChange={(e) => setInputExpected({ ...inputExpected, expected4: e.target.value })}
                            />
                        </div>
                    </div>
                </div>
            )}

            <button className="submit-btn" onClick={handleSubmit}>
                Submit
            </button>

            <ToastContainer />
        </div>
    );
};

export default CustomQuestion;

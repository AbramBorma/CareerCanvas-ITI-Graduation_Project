import { useEffect, useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle"
import { examSubjects } from '../services/api.js';
import Spinner from './Spinner.js';

const SupervisorAddExam = ({ onClose }) => {
    const [inputs, setInputs] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState();

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const response = await examSubjects();
                setSubjects(response);
            } catch (err) {
                setError(err.message || 'Error fetching authors');
            } finally {
                setLoading(false);
            }
        };
        fetchSubjects();
    }, []);


    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({ ...values, [name]: value }));
    };

    const handleSubmit = async (event) => {
        console.log(inputs)
        event.preventDefault();
        try {
            onClose();
        } catch (error) {
            console.log(error);
            setError(error.response.data.message);
        }
    };

    return (
        <div className="position-fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-20 d-flex justify-content-center align-items-center z-index-1050 w-30">
            <div
                onClick={(event) => event.stopPropagation()}
                className="w-100 bg-white rounded p-3 position-relative"
            >
                <AiOutlineClose
                    className="position-absolute top-0 end-0 text-danger display-6 cursor-pointer"
                    onClick={onClose}
                />
                <h2 className="my-2 text-secondary">New Exam</h2>
                <br />
                {loading ? (
                    <Spinner />
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Enter Exam Title:</label>
                            <input
                                type="text"
                                name="title"
                                value={inputs.title || ""}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Choose Subject:</label>
                            <select
                                name='subject'
                                id="subject"
                                value={selectedSubject}
                                onChange={handleChange}
                                className="form-select"
                            >
                                <option value="">-- Select Subject --</option>
                                {subjects.map((subject) => (
                                    <option key={subject} value={subject}>
                                        {subject}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {/* <div className="mb-3">
                            <label className="form-label">Choose Category:</label>
                            <select name="Category" className="form-select" value={inputs.Category} onChange={handleChange}>
                                <option value="">Select Category</option>
                                {categories.map((category) => (
                                    <option key={category._id} value={category._id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div> */}
                        {/* <div className="mb-3">
                                <label className="form-label">Enter Image Link:</label>
                                <input
                                    type="text"
                                    name="image"
                                    value={inputs.image || ""}
                                    onChange={handleChange}
                                    className="form-control"
                                />
                            </div> */}
                        <div className="mb-3 text-center">
                            <label className="mx-2">No. Easy:</label>
                            <input
                                type="number"
                                name="easy"
                                value={inputs.easy || ""}
                                onChange={handleChange}
                                className="form-control d-inline-block  mx-1"
                                style={{ width: '60px' }} // Reduced width
                            />

                            <label className="mx-2">No. Intermediate:</label>
                            <input
                                type="number"
                                name="intermediate"
                                value={inputs.intermediate || ""}
                                onChange={handleChange}
                                className="form-control d-inline-block  mx-1"
                                style={{ width: '60px' }} // Reduced width
                            />

                            <label className="mx-2">No. Advanced:</label>
                            <input
                                type="number"
                                name="advanced"
                                value={inputs.advanced || ""}
                                onChange={handleChange}
                                className="form-control d-inline-block  mx-1"
                                style={{ width: '60px' }} // Reduced width
                            />
                        </div>
                        <div className="text-center">
                            <button type="submit" className="btn btn-primary">Add Exam</button>
                        </div>


                    </form>
                )}
                {error && <div className="text-danger text-center">{error}</div>}
            </div>
        </div>
    );
};

export default SupervisorAddExam;

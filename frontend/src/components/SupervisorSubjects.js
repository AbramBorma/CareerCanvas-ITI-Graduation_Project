import { useEffect, useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { getAuthors, getCategories, addBook, updateBook } from '../services/api';
import Spinner from './Spinner.jsx';

const AddAndUpdate = ({ book, onClose, type }) => {
    const [inputs, setInputs] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAuthors = async () => {
            try {
                const response = await getAuthors();
                setAuthors(response.data.data);
            } catch (err) {
                setError(err.message || 'Error fetching authors');
            } finally {
                setLoading(false);
            }
        };
        fetchAuthors();
    }, []);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await getCategories();
                if (Array.isArray(response.data.data)) {
                    setCategories(response.data.data);
                } else {
                    throw new Error('Categories data is not an array');
                }
            } catch (err) {
                setError(err.message || 'Error fetching categories');
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({ ...values, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            if (type === "add") {
                await addBook(inputs);
            } else {
                await updateBook(book._id, inputs);
            }
            onClose();
        } catch (error) {
            console.log(error);
            setError(error.response.data.message || (type === "add" ? 'Error Adding Book' : 'Error Updating Book'));
        }
    };

    return (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 d-flex justify-content-center align-items-center">
            <div
                onClick={(event) => event.stopPropagation()}
                className="w-50 max-w-full bg-white rounded p-4 position-relative"
            >
                <AiOutlineClose
                    className="position-absolute top-2 end-2 text-danger fs-3 cursor-pointer"
                    onClick={onClose}
                />
                <h2 className="my-2 text-secondary">{type === "add" ? 'New Book' : 'Update Book'}</h2>
                <br />
                {loading ? (
                    <Spinner />
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Enter Book Title:</label>
                            <input
                                type="text"
                                name="title"
                                value={inputs.title || ""}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Choose Author:</label>
                            <select name="AuthorId" value={inputs.AuthorId} className="form-select" onChange={handleChange}>
                                <option value="">Select Author</option>
                                {authors.map((author, i) => (
                                    <option key={author._id} value={author._id}>
                                        {author.firstName + " " + author.lastName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Choose Category:</label>
                            <select name="Category" className="form-select" value={inputs.Category} onChange={handleChange}>
                                <option value="">Select Category</option>
                                {categories.map((category) => (
                                    <option key={category._id} value={category._id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Enter Image Link:</label>
                            <input
                                type="text"
                                name="image"
                                value={inputs.image || ""}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </div>
                        <div className="text-center">
                            <button type="submit" className="btn btn-primary">
                                {type === "add" ? 'Add Book' : 'Update'}
                            </button>
                        </div>
                    </form>
                )}
                {error && <div className="text-danger text-center">{error}</div>}
            </div>
        </div>
    );
};

export default AddAndUpdate;

import axios from "axios";
import { useState } from "react";
import { serverEndpoint } from "../config/appConfig";
import { useSelector } from "react-redux";
import ExpenseSplitSection from "./ExpanseSplit";

function ExpenseModal({ show, onClose, groupId, onSuccess }) {
    const user = useSelector((state) => state.userDetails);
    const [formData, setFormData] = useState({
        title: "",
        amount: ""
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [split, setSplit] = useState([]);


    const validate = () => {
        let isValid = true;
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = "Expense title is required";
            isValid = false;
        }

        if (!formData.amount || Number(formData.amount) <= 0) {
            newErrors.amount = "Amount must be greater than 0";
            isValid = false;
        }

        let totalSplit = 0;

        if (split.length === 0) {
            newErrors.message = "At least one member must be included";
            isValid = false;
        } else {
            for (let i = 0; i < split.length; i++) {
                totalSplit += split[i].amount;
            }

            if (totalSplit !== Number(formData.amount)) {
                newErrors.message = "Split total must match expense amount";
                isValid = false;
            }
        }
        setErrors(newErrors);
        return isValid;
    };


    const onChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: null });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;
        setLoading(true);
        try {
            await axios.post(
                `${serverEndpoint}/expenses/create`,
                {
                    groupId,
                    title: formData.title,
                    totalAmount: Number(formData.amount),
                    paidBy: user.email,
                    split: split
                },
                { withCredentials: true }
            );

            onSuccess();
            setFormData({ title: "", amount: "" });
            setSplit([]);
            onClose();
        } catch (error) {
            console.error(error);
            setErrors({
                message: "Something went wrong. Please try again."
            });
        } finally {
            setLoading(false);
        }
    };

    if (!show) return null;

    return (
        <div
            className="modal show d-block"
            tabIndex="-1"
            style={{
                backgroundColor: "rgba(15, 23, 42, 0.6)",
                backdropFilter: "blur(4px)",
            }}
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 rounded-4 shadow-lg p-3">
                    <form onSubmit={handleSubmit}>
                        <div className="modal-header border-0 pb-0">
                            <div className="bg-primary bg-opacity-10 p-2 rounded-3 me-3">
                                <i className="bi bi-wallet-fill text-primary fs-4"></i>
                            </div>
                            <h5 className="fw-bold mb-0">Add Expense</h5>
                            <button
                                type="button"
                                className="btn-close shadow-none"
                                onClick={onClose}
                            ></button>
                        </div>

                        <div className="modal-body py-4">
                            <p className="text-muted small mb-4">
                                Add a new expense to this group and track who paid.
                            </p>

                            {errors.message && (
                                <div className="alert alert-danger py-2 small border-0 mb-3">
                                    {errors.message}
                                </div>
                            )}

                            <div className="mb-4">
                                <label className="form-label small fw-bold text-secondary text-uppercase mb-2">
                                    Expense Title
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g., Dinner, Taxi"
                                    className={`form-control form-control-lg bg-light border-0 fs-6 ${errors.title ? "is-invalid" : ""
                                        }`}
                                    name="title"
                                    value={formData.title}
                                    onChange={onChange}
                                />
                                {errors.title && (
                                    <div className="invalid-feedback ps-1">
                                        {errors.title}
                                    </div>
                                )}
                            </div>

                            <div className="mb-2">
                                <label className="form-label small fw-bold text-secondary text-uppercase mb-2">
                                    Amount
                                </label>
                                <input
                                    type="number"
                                    placeholder="Enter amount"
                                    className={`form-control form-control-lg bg-light border-0 fs-6 ${errors.amount ? "is-invalid" : ""
                                        }`}
                                    name="amount"
                                    value={formData.amount}
                                    onChange={onChange}
                                />
                                {errors.amount && (
                                    <div className="invalid-feedback ps-1">
                                        {errors.amount}
                                    </div>
                                )}
                            </div>
                            <ExpenseSplitSection
                                groupId={groupId}
                                onSplitChange={setSplit}
                            />
                        </div>


                        <div className="modal-footer border-0 pt-0">
                            <button
                                type="button"
                                className="btn btn-light rounded-pill px-4 fw-medium"
                                onClick={onClose}
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary rounded-pill px-5 fw-bold shadow-sm"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span
                                            className="spinner-border spinner-border-sm me-2"
                                            role="status"
                                            aria-hidden="true"
                                        ></span>
                                        Saving...
                                    </>
                                ) : (
                                    "Add Expense"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ExpenseModal;

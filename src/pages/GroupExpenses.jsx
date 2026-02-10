import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { serverEndpoint } from "../config/appConfig";
import ExpenseModal from "../components/ExpanseModal";

function GroupExpenses() {
    // 1. Get the groupId from the URL
    const { groupId } = useParams();
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [show, setShow] = useState(false);

    const fetchExpenses = async () => {
        try {
            const response = await axios.get(
                `${serverEndpoint}/expenses/${groupId}`,
                { withCredentials: true }
            );

            setExpenses(response.data);
        } catch (err) {
            setError("Failed to load expenses");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExpenses();
    }, [groupId]);

    if (loading) return <p>Loading expenses...</p>;
    if (error) return <p>{error}</p>;
    return (
        <div className="container py-5">
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                        <Link to="/dashboard">Groups</Link>
                    </li>
                    <li className="breadcrumb-item active">Expense Details</li>
                </ol>
            </nav>

            <div className="bg-white p-5 rounded-4 shadow-sm text-center border">
                <div className="mb-4">
                    <i className="bi bi-wallet2 display-1 text-primary opacity-25"></i>
                </div>
                <h2 className="fw-bold">Group Expense Manager</h2>
                <p className="text-muted">
                    Working with Group ID:{" "}
                    <code className="bg-light px-2 rounded">{groupId}</code>
                </p>

                <hr className="my-5" />
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="fw-semibold mb-0">Expenses</h4>
                    <button
                        className="btn btn-primary"
                        onClick={() => setShow(true)}
                    >
                        Add Expense
                    </button>
                </div>
                {expenses.length === 0 ? (
                    // <p>No expenses added yet</p>
                    <div className="text-center py-5 bg-light rounded-5 border border-dashed border-primary border-opacity-25 shadow-inner">
                        <div className="bg-white rounded-circle d-inline-flex p-4 mb-4 shadow-sm">
                            <i
                                className="bi bi-people text-primary"
                                style={{ fontSize: "3rem" }}
                            ></i>
                        </div>
                        <h4 className="fw-bold">No Expenses Found</h4>
                        <p
                            className="text-muted mx-auto mb-4"
                            style={{ maxWidth: "400px" }}
                        >
                            You haven't added any expenses yet in this group.
                        </p>
                        <button
                            className="btn btn-outline-primary rounded-pill px-4"
                            onClick={() => setShow(true)}
                        >
                            Get Started
                        </button>
                    </div>
                ) : (
                    <ul className="list-unstyled">
                        {expenses.map((expense) => (
                            <li key={expense._id} className="mb-3">
                                <strong>{expense.title}</strong> — ₹{expense.totalAmount}
                                <br />
                                <span className="text-muted">
                                    Paid by: {expense.paidBy}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <ExpenseModal
                show={show}
                onClose={() => setShow(false)}
                groupId={groupId}
                onSuccess={fetchExpenses}
            />
        </div>
    );
}

export default GroupExpenses;

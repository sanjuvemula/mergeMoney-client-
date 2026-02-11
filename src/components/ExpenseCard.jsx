import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";
import { serverEndpoint } from "../config/appConfig";

function ExpenseCard({ expense }) {
    return (
        <div className="card border-0 shadow-sm rounded-4 mb-3 transition-hover">
            <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-start mb-2">
                    <div className="bg-success bg-opacity-10 p-2 rounded-3 text-success">
                        <i className="bi bi-receipt fs-5"></i>
                    </div>
                    <span className="fw-bold text-dark">
                        ₹{expense.totalAmount}
                    </span>
                </div>

                <h6 className="fw-bold mb-1 text-dark">
                    {expense.title}
                </h6>

                <p className="text-muted small mb-2">
                    Paid by{" "}
                    <strong>{expense.paidBy.split("@")[0]}</strong>
                </p>

                <p className="extra-small text-secondary mb-0">
                    {new Date(expense.createdAt).toLocaleDateString()}
                </p>
            </div>
        </div>
    );
}

export default ExpenseCard;

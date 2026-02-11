function ExpenseSummary({ summary }) {
    const isEmpty = !summary || Object.keys(summary).length === 0;

    return (
        <div className="mt-5">
            <hr className="my-4" />
            <h4 className="fw-semibold mb-3">Expense Summary</h4>
            {isEmpty ? (
                <p className="text-muted">No summary available</p>
            ) : (
                <div className="card border-0 shadow-sm rounded-4 p-3">
                    {Object.entries(summary).map(([email, amount]) => (
                        <div
                            key={email}
                            className="d-flex justify-content-between align-items-center border-bottom py-2"
                        >
                            <span>{email}</span>

                            <span
                                className={
                                    amount > 0
                                        ? "text-success fw-bold"
                                        : amount < 0
                                        ? "text-danger fw-bold"
                                        : "text-muted"
                                }
                            >
                                {amount > 0
                                    ? `Gets ₹${amount}`
                                    : amount < 0
                                    ? `Owes ₹${Math.abs(amount)}`
                                    : "Settled"}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ExpenseSummary;

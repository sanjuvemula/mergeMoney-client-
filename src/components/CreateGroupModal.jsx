import { useEffect, useState } from "react";
import axios from "axios";
import { serverEndpoint } from "../config/appConfig";

function ExpenseSplitSection({ groupId, onSplitChange }) {
    const [members, setMembers] = useState([]);
    const [selectedMembers, setSelectedMembers] = useState({});

    const fetchGroupMembers = async () => {
        try {
            const response = await axios.get(
                `${serverEndpoint}/groups/${groupId}`,
                { withCredentials: true }
            );
            const groupMembers = response.data.membersEmail;
            setMembers(groupMembers);
            const initialData = {};
            groupMembers.forEach((email) => {
                initialData[email] = {
                    included: true,
                    amount: 0
                };
            });
            setSelectedMembers(initialData);
            updateSplit(initialData);
        } catch (error) {
            console.log(error);
        }
    };

    const updateSplit = (data) => {
        const splitArray = [];
        for (const email in data) {
            if (data[email].included) {
                splitArray.push({
                    email: email,
                    amount: data[email].amount
                });
            }
        }
        onSplitChange(splitArray);
    };

    const handleToggle = (email, checked) => {
        const updated = {
            ...selectedMembers,
            [email]: {
                ...selectedMembers[email],
                included: checked
            }
        };
        setSelectedMembers(updated);
        updateSplit(updated);
    };

    const handleAmountChange = (email, value) => {
        const updated = {
            ...selectedMembers,
            [email]: {
                ...selectedMembers[email],
                amount: Number(value)
            }
        };
        setSelectedMembers(updated);
        updateSplit(updated);
    };

    useEffect(() => {
        if (!groupId) return;   
        fetchGroupMembers();
    }, [groupId]);

    return (
        <div className="mt-4">
            <hr />
            <h6 className="fw-bold text-start">Split Among Members</h6>

            {members.map((email) => (
                <div key={email} className="d-flex align-items-center mb-2">

                    <input
                        type="checkbox"
                        className="form-check-input me-2"
                        checked={selectedMembers[email]?.included || false}
                        onChange={(e) =>
                            handleToggle(email, e.target.checked)
                        }
                    />

                    <span className="me-3 flex-grow-1">
                        {email}
                    </span>

                    <input
                        type="number"
                        className="form-control form-control-sm"
                        style={{ width: "100px" }}
                        value={selectedMembers[email]?.amount || 0}
                        disabled={!selectedMembers[email]?.included}
                        onChange={(e) =>
                            handleAmountChange(email, e.target.value)
                        }
                    />
                </div>
            ))}
        </div>
    );
}

export default ExpenseSplitSection;

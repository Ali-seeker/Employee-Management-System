import React, { useState } from 'react';
import toast from 'react-hot-toast';
import EmployeeList from './EmployeeList';

const EmployeeForm = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [designation, setDesignation] = useState('');
    const [salary, setSalary] = useState('');
    const [joiningDate, setJoiningDate] = useState('');
    const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // start loading

    try {
        const response = await fetch("http://localhost:8000/api/employees", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name,
                email,
                password,
                designation,
                salary: parseFloat(salary),
                joining_date: new Date().toISOString().split("T")[0],
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            // Validation or conflict error
            if (response.status === 409 && data.messages?.email) {
                toast.error(data.messages.email[0]); // "The email has already been taken."
                alert("The email has already been taken")
            } else if (data.messages) {
                const firstError = Object.values(data.messages)[0][0];
                toast.error(firstError);
            } else {
                toast.error("Something went wrong.");
            }
            return;
        }

        // Success
        toast.success("Employee added successfully!");
        // Reset form
        setName("");
        setEmail("");
        setPassword("");
        setDesignation("");
        setSalary("");
        setLoading(false);
        document.getElementById("my_modal_2").close();

    } catch (error) {
        toast.error("Server error: " + error.message);
    } finally {
        setLoading(false);
    }
};

    return (
        <>
            <div className="w-full flex justify-end pt-2 pr-9">
                <button
                    className="btn bg-slate-300 text-black"
                    onClick={() => document.getElementById('my_modal_2').showModal()}
                >
                    Add Employee
                </button>
            </div>
            <dialog id="my_modal_2" className="modal">
                <div className="modal-box h-auto">
                    <h2 className="text-lg font-bold mb-4">Add Employee</h2>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Name"
                            required
                            className="input mb-2 p-2 border border-gray-300 rounded w-full"
                        />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            required
                            className="input mb-2 p-2 border border-gray-300 rounded w-full"
                        />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            required
                            className="input mb-2 p-2 border border-gray-300 rounded w-full"
                        />
                        <input
                            type="text"
                            value={designation}
                            onChange={(e) => setDesignation(e.target.value)}
                            placeholder="Designation"
                            required
                            className="input mb-2 p-2 border border-gray-300 rounded w-full"
                        />
                        <input
                            type="number"
                            value={salary}
                            onChange={(e) => setSalary(e.target.value)}
                            placeholder="Salary"
                            required
                            className="input mb-2 p-2 border border-gray-300 rounded w-full"
                        />
                        <input
                            type="date"
                            value={joiningDate}
                            onChange={(e) => setJoiningDate(e.target.value)}
                            placeholder="Joining Date"
                            className="input mb-2 p-2 border border-gray-300 rounded w-full"
                        />
                        <button
                            type="submit"
                            className={`btn w-full text-white px-4 py-2 rounded mt-2 ${
                                loading ? 'bg-gray-500' : 'bg-green-500'
                            }`}
                            disabled={loading}
                        >
                            {loading ? 'Loading...' : 'Add Employee'}
                        </button>
                    </form>
                    <form method="dialog">
                        <button className="btn w-full bg-red-500 text-white px-4 py-2 rounded mt-2">Close</button>
                    </form>
                </div>
            </dialog>
            <EmployeeList />
        </>
    );
};

export default EmployeeForm;

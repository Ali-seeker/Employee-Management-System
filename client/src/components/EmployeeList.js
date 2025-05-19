import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const EmployeeList = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
    const [updatedName, setUpdatedName] = useState('');
    const [updatedDesignation, setUpdatedDesignation] = useState('');
    const [updatedSalary, setUpdatedSalary] = useState('');
    const [updatedJoiningDate, setUpdatedJoiningDate] = useState('');

    const fetchEmployees = async () => {
        try {
            const res = await fetch("http://localhost:8000/api/employees");
            const data = await res.json();
            setEmployees(data);
            setLoading(false);
        } catch (error) {
            toast.error("Failed to fetch employees.");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const handleDelete = async (id) => {
        try {
            const res = await fetch(`http://localhost:8000/api/employees/${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                toast.success("Employee deleted.");
                fetchEmployees();
            } else {
                toast.error("Failed to delete.");
            }
        } catch (error) {
            toast.error("Server error.");
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`http://localhost:8000/api/employees/${selectedEmployee.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: updatedName,
                    designation: updatedDesignation,
                    salary: parseFloat(updatedSalary),
                    joining_date: updatedJoiningDate,
                }),
            });

            if (res.ok) {
                toast.success("Updated successfully!");
                fetchEmployees();
                setUpdateModalOpen(false);
                setSelectedEmployee(null);
            } else {
                const data = await res.json();
                toast.error(data.message || "Update failed.");
            }
        } catch (error) {
            toast.error("Server error.");
        }
    };

    const openUpdateModal = (employee) => {
        setSelectedEmployee(employee);
        setUpdatedName(employee.name);
        setUpdatedDesignation(employee.designation);
        setUpdatedSalary(employee.salary);
        setUpdatedJoiningDate(employee.joining_date || "");
        setUpdateModalOpen(true);
    };

    if (loading) return <p className="text-center">Loading...</p>;

    return (
        <div className="shadow-lg rounded-lg overflow-hidden mx-4 md:mx-10">
            <h1 className="text-2xl font-bold py-4">Employee List</h1>
            <table className="w-full table-fixed">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="w-1/12 py-4 px-6 text-left text-gray-600 font-bold uppercase">#</th>
                        <th className="w-2/12 py-4 px-6 text-left text-gray-600 font-bold uppercase">Name</th>
                        <th className="w-3/12 py-4 px-6 text-left text-gray-600 font-bold uppercase">Email</th>
                        <th className="w-2/12 py-4 px-6 text-left text-gray-600 font-bold uppercase">Designation</th>
                        <th className="w-2/12 py-4 px-6 text-left text-gray-600 font-bold uppercase">Salary</th>
                        <th className="w-2/12 py-4 px-6 text-left text-gray-600 font-bold uppercase">Joining Date</th>
                        <th className="w-2/12 py-4 px-6 text-left text-gray-600 font-bold uppercase">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white">
                    {employees.map((employee, index) => (
                        <tr key={employee.id}>
                            <td className="py-4 px-6 border-b text-gray-600">{index + 1}</td>
                            <td className="py-4 px-6 border-b text-gray-600">{employee.name}</td>
                            <td className="py-4 px-6 border-b text-gray-600">{employee.email}</td>
                            <td className="py-4 px-6 border-b text-gray-600">{employee.designation}</td>
                            <td className="py-4 px-6 border-b text-gray-600">{employee.salary}</td>
                            <td className="py-4 px-6 border-b text-gray-600">{employee.joining_date}</td>
                            <td className="py-4 px-6 border-b text-gray-600">
                                <button
                                    className="btn bg-red-500 text-white px-2 py-1 rounded mr-2"
                                    onClick={() => handleDelete(employee.id)}
                                >
                                    Delete
                                </button>
                                <button
                                    className="btn bg-blue-500 text-white px-2 py-1 rounded"
                                    onClick={() => openUpdateModal(employee)}
                                >
                                    Update
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {isUpdateModalOpen && (
                <dialog open className="modal">
                    <div className="modal-box">
                        <h2 className="text-lg font-bold mb-4">Update Employee</h2>
                        <form onSubmit={handleUpdate}>
                            <input
                                type="text"
                                value={updatedName}
                                onChange={(e) => setUpdatedName(e.target.value)}
                                placeholder="Name"
                                required
                                className="input mb-2 p-2 border border-gray-300 rounded w-full"
                            />
                            <input
                                type="text"
                                value={updatedDesignation}
                                onChange={(e) => setUpdatedDesignation(e.target.value)}
                                placeholder="Designation"
                                required
                                className="input mb-2 p-2 border border-gray-300 rounded w-full"
                            />
                            <input
                                type="number"
                                value={updatedSalary}
                                onChange={(e) => setUpdatedSalary(e.target.value)}
                                placeholder="Salary"
                                required
                                className="input mb-2 p-2 border border-gray-300 rounded w-full"
                            />
                            <input
                                type="date"
                                value={updatedJoiningDate}
                                onChange={(e) => setUpdatedJoiningDate(e.target.value)}
                                placeholder="Joining Date"
                                className="input mb-2 p-2 border border-gray-300 rounded w-full"
                            />
                            <button
                                type="submit"
                                className="btn w-full bg-green-500 text-white px-4 py-2 rounded mt-2"
                            >
                                Update Employee
                            </button>
                        </form>
                        <form method="dialog" className="mt-4">
                            <button
                                className="btn w-full bg-red-500 text-white px-4 py-2 rounded"
                                onClick={() => setUpdateModalOpen(false)}
                            >
                                Close
                            </button>
                        </form>
                    </div>
                </dialog>
            )}
        </div>
    );
};

export default EmployeeList;

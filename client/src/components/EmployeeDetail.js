import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';

const GET_EMPLOYEE = gql`
    query($id: ID!) {
        employee(id: $id) {
            id
            name
            position
            details
        }
    }
`;

const EmployeeDetail = () => {
    const { id } = useParams();
    const { loading, error, data } = useQuery(GET_EMPLOYEE, { variables: { id } });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div>
            <h1>{data.employee.name}</h1>
            <p>Position: {data.employee.position}</p>
            <p>Details: {data.employee.details}</p>
        </div>
    );
};

export default EmployeeDetail;
import { gql } from '@apollo/client';

export const GET_EMPLOYEES = gql`
    query GetEmployees {
        employees {
            id
            name
            designation  
            salary       
            leaves       
        }
    }
`;


export const CREATE_EMPLOYEE = gql`
    mutation CreateEmployee($id: ID!, $name: String!, $designation: String!, $salary: Float!, $leaves: Int!) {
        createEmployee(id: $id, name: $name, designation: $designation, salary: $salary, leaves: $leaves) {
            id
            name
            designation  
            salary      
            leaves       
        }
    }
`;

export const UPDATE_EMPLOYEE = gql`
    mutation UpdateEmployee($id: ID!, $name: String, $designation: String, $salary: Float, $leaves: Int) {
        updateEmployee(id: $id, name: $name, designation: $designation, salary: $salary, leaves: $leaves) {
            id
            name
            designation  
            salary      
            leaves      
        }
    }
`;

export const DELETE_EMPLOYEE = gql`
    mutation DeleteEmployee($id: ID!) {
        deleteEmployee(id: $id) {
            id
            name
        }
    }
`;
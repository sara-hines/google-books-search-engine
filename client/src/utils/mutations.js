import { gql } from '@apollo/client';

// Functionality for a user to log in and be associated with a token
export const LOGIN_USER = gql`
    mutation login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            token 
            user {
                _id
                username
            }
        }
    }
`;

// Functionality for a user to be added to the db and associated with a token
export const ADD_USER = gql`
    mutation addUser($username: String!, $email: String!, $password: String!) {
        addUser(username: $username, email: $email, password: $password) {
            token 
            user {
                _id
                username
            }
        }
    }
`;

// Functionality to save a book using the userId and the BookInput type which handles the rest of the arguments
export const SAVE_BOOK = gql`
    mutation saveBook($userId: ID!, $bookToSave: BookInput!) {
        saveBook(userId: $userId, input: $bookToSave) {
            _id 
            username
            savedBooks {
                bookId
                authors
                title
                description
                image
                buyLink
                seeMoreLink
            }
        }
    }
`;

// Functionality to remove a book, relying on context and the bookId obtained from the API
export const REMOVE_BOOK = gql`
    mutation removeBook($bookId: String!) {
        removeBook(bookId: $bookId) {
            _id
            username
            savedBooks {
                bookId
                authors
                title
                description
                image
                buyLink
                seeMoreLink
            }
        }
    }
`;
import { gql } from '@apollo/client';

// Functionality to retrieve the user's data
export const GET_ME = gql`
    query GET_ME {
        me {
            _id
            username
            email
            password
            bookCount
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
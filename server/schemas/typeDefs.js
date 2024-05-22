// Defining the types to give structure to the GraphQL API
const typeDefs = `
    type User {
        _id: ID!
        username: String!
        email: String!
        password: String!
        bookCount: Int!
        savedBooks: [Book]!
    }

    type Book {
        bookId: String!
        authors: [String]!
        title: String!
        description: String!
        image: String
        buyLink: String
        seeMoreLink: String
    }

    type Auth {
        token: ID!
        user: User
    }

    type Query {
        me: User
    }

    # Input type which helps to manage the arguments passed for the saveBook mutation
    input BookInput {
        bookId: String!
        authors: [String]!
        title: String!
        description: String!
        image: String
        buyLink: String
        seeMoreLink: String
    }

    type Mutation {
        addUser(username: String!, email: String!, password: String!): Auth
        login(email: String!, password: String!): Auth
        saveBook(userId: ID!, input: BookInput!): User
        removeBook(bookId: String!): User
    }
`

module.exports = typeDefs;
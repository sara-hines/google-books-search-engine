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
        description: String!
        title: String!
        image: String
        link: String
    }

    # Should User be made non-nullable in the below?
    type Auth {
        token: ID!
        user: User
    }

    type Query {
        me: User
    }

    # I made image and link nullable, since I'm not sure if we would get them back from the API 100% of the time and I don't want to get an error.
    input BookInput {
        authors: [String]!
        description: String!
        bookId: String!
        image: String
        link: String
        title: String!
    }

    type Mutation {
        addUser(username: String!, email: String!, password: String!): Auth
        login(email: String!, password: String!): Auth
        saveBook(input: BookInput!): User
        removeBook(bookId: String!): User
    }

`
import {
    Container,
    Card,
    Button,
    Row,
    Col
} from 'react-bootstrap';
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ME } from '../utils/queries';
import { REMOVE_BOOK } from '../utils/mutations';

const SavedBooks = () => {
    // Run the GET_ME query to get the user's data 
    const { loading, data } = useQuery(GET_ME);
    const userData = data?.me || {};

    // Set up the removeBook mutation
    const [removeBook, { error }] = useMutation
        (REMOVE_BOOK, {
            refetchQueries: [
                GET_ME,
                'me'
            ]
        });

    const handleDeleteBook = async (bookId) => {
        // Check if user is logged in and get the token if so
        const token = Auth.loggedIn() ? Auth.getToken() : null;

        if (!token) {
            return false;
        }

        try {
            // Run the removeBook mutation, passing the bookId
            const { data } = await removeBook({
                variables: { bookId }
            });

            if (!data) {
                throw new Error('Something went wrong; we were unable to remove that book.')
            }
            // Remove book from localStorage
            removeBookId(bookId);
        } catch (err) {
            console.error(err);
        }
    };

    // If query is still fetching data, display a 'LOADING' h2
    if (loading) {
        return <h2>LOADING...</h2>;
    }

    return (
        <>
            <div fluid='true' className="text-light bg-dark p-5">
                <Container>
                    <h1>Viewing saved books!</h1>
                </Container>
            </div>
            <Container>
                <h2 className='pt-5 pb-4'>
                    {userData?.savedBooks.length
                        ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
                        : 'You have no saved books!'}
                </h2>
                <Row>
                    {/* Map over the user's saved books, displaying the book image, title, authors, description, and (conditionally) buttons to go buy the book or see more details. Delete button also rendered. */}
                    {userData.savedBooks.map((book) => {
                        return (
                            <Col md="4" key={book.bookId} className='py-2 py-lg-3'>
                                <Card border='dark' className='pb-3'>
                                    {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                                    <Card.Body>
                                        <Card.Title>{book.title}</Card.Title>
                                        <p className='small'>Authors: {book.authors}</p>
                                        <Card.Text>{book.description}</Card.Text>

                                        {book.buyLink !== 'null' && (
                                            <Button
                                                className='btn-block btn-info custom-btn-margin' onClick={() => window.location.assign(`${book.buyLink}`)}>
                                                Buy this Book!
                                            </Button>
                                        )}
                                        
                                        {book.buyLink === 'null' && book.seeMoreLink !== 'null' && (
                                            <>
                                                <Button
                                                    className='btn-block btn-info custom-btn-margin' onClick={() => window.location.assign(`${book.seeMoreLink}`)}>Show me More!
                                                </Button>
                                                <Card.Text className='no-sale-txt-saved-pg'>Sale link unavailable.</Card.Text>
                                            </>
                                        )}

                                        {book.buyLink === 'null' && book.seeMoreLink === 'null' && (
                                            <Card.Text className='no-sale-txt-saved-pg'>Sale link unavailable.</Card.Text>
                                        )}

                                        <Button className='btn-block btn-danger custom-btn-margin' onClick={() => handleDeleteBook(book.bookId)}>
                                            Delete this Book!
                                        </Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        );
                    })}
                </Row>
            </Container>
        </>
    );
};

export default SavedBooks;

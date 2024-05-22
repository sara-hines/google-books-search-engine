import { useState, useEffect } from 'react';
import {
    Container,
    Col,
    Form,
    Button,
    Card,
    Row
} from 'react-bootstrap';
import { useMutation } from '@apollo/client';
import { SAVE_BOOK } from '../utils/mutations';
import Auth from '../utils/auth';
import { searchGoogleBooks } from '../utils/API';
import { saveBookIds, getSavedBookIds } from '../utils/localStorage';

const SearchBooks = () => {
    // Initialize state variables for holding returned google api data; holding the search input data; and holding saved bookIds, respectively. Also set up the saveBook mutation.
    const [searchedBooks, setSearchedBooks] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const [savedBookIds, setSavedBookIds] = useState(getSavedBookIds());
    const [saveBook, { error }] = useMutation(SAVE_BOOK);

    // Set up useEffect hook to save `savedBookIds` list to localStorage on component unmount
    useEffect(() => {
        return () => saveBookIds(savedBookIds);
    });

    const handleFormSubmit = async (event) => {
        event.preventDefault();

        if (!searchInput) {
            return false;
        }

        try {
            // Make the call to the API with the user's search input
            const response = await searchGoogleBooks(searchInput);

            if (!response.ok) {
                throw new Error('something went wrong!');
            }

            const { items } = await response.json();

            // Map over the data to match the fields that the saveBook mutation will expect later. Give a value of 'null' to buyLink and seeMoreLink if the API didn't have that data.
            const bookData = items.map((book) => ({
                bookId: book.id,
                authors: book.volumeInfo.authors || ['No author to display'],
                title: book.volumeInfo.title,
                description: book.volumeInfo.description,
                image: book.volumeInfo.imageLinks?.thumbnail || '',
                buyLink: book.saleInfo.buyLink ?? 'null',
                seeMoreLink: book.volumeInfo.canonicalVolumeLink ?? 'null'
            }));

            // Update searchedBooks state with the bookData
            setSearchedBooks(bookData);
            setSearchInput('');
        } catch (err) {
            console.error(err);
        }
    };

    const handleSaveBook = async (bookId) => {
        // Find the book in searchedBooks state by the matching id
        const bookToSave = searchedBooks.find((book) => book.bookId === bookId);

        // Get token
        const token = Auth.loggedIn() ? Auth.getToken() : null;

        if (!token) {
            return false;
        }

        try {
            // Get the user's data, including _id, by decoding their token
            const profile = await Auth.getProfile();

            const userId = profile.data._id

            // Run the saveBook mutation, passing the user's id and book to be saved
            const data = await saveBook({
                variables: { userId, bookToSave }
            });

            // If book successfully saves to user's account, save book id to state
            setSavedBookIds([...savedBookIds, bookToSave.bookId]);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <>
            <div className="text-light bg-dark p-5">
                <Container>
                    <h1>Search for Books!</h1>
                    {/* Form with onSubmit and onChange handlers to help manage the search */}
                    <Form onSubmit={handleFormSubmit}>
                        <Row>
                            <Col xs={12} md={8}>
                                <Form.Control
                                    name='searchInput'
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    type='text'
                                    size='lg'
                                    placeholder='Search for a book'
                                />
                            </Col>
                            <Col xs={12} md={4}>
                                <Button type='submit' variant='success' size='lg'>
                                    Submit Search
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Container>
            </div>

            <Container>
                <h2 className='pt-5 pb-4'>
                    {searchedBooks.length
                        ? `Viewing ${searchedBooks.length} results:`
                        : 'Search for a book to begin'}
                </h2>
                <Row>
                    {/* Display the book results from the API call */}
                    {searchedBooks.map((book) => {
                        return (
                            <Col md="4" key={book.bookId} className='py-2 py-lg-3'>
                                <Card border='dark' className='pb-3'>
                                    {book.image ? (
                                        <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' />
                                    ) : null}
                                    <Card.Body>
                                        <Card.Title>{book.title}</Card.Title>
                                        <p className='small'>Authors: {book.authors}</p>
                                        <Card.Text>{book.description}</Card.Text>
                                        {Auth.loggedIn() && (
                                            <>
                                                {/* Save button */}
                                                <Button
                                                    // If the book is already saved, the button will be disabled with approprate text to match.
                                                    disabled={savedBookIds?.some((savedBookId) => savedBookId === book.bookId)}
                                                    className='btn-block btn-info custom-btn-margin'
                                                    onClick={() => handleSaveBook(book.bookId)}>
                                                    {savedBookIds?.some((savedBookId) => savedBookId === book.bookId)
                                                        ? 'Book already saved!'
                                                        : 'Save this Book!'}
                                                </Button>
                                                
                                                {/* Button to go buy book */}
                                                {book.buyLink !== 'null' && (
                                                    <Button
                                                        className='btn-block btn-warning custom-btn-margin' onClick={() => window.location.assign(`${book.buyLink}`)}>
                                                        Buy this Book!
                                                    </Button>
                                                )}

                                                {/* Button to go see more details on book if buyLink unavailable */}
                                                {book.buyLink === 'null' && book.seeMoreLink !== 'null' && (
                                                    <>
                                                        <Button
                                                            className='btn-block btn-warning custom-btn-margin' onClick={() => window.location.assign(`${book.seeMoreLink}`)}>Show me More!
                                                        </Button>
                                                        <Card.Text className='no-sale-txt-search-pg'>Sale link unavailable.</Card.Text>
                                                    </>
                                                )}

                                                {/* Message for books with no buyLink or seeMoreLink */}
                                                {book.buyLink === 'null' && book.seeMoreLink === 'null' && (
                                                    <Card.Text className='no-sale-txt-search-pg'>Sale link unavailable.</Card.Text>
                                                )}
                                            </>
                                        )}
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

export default SearchBooks;

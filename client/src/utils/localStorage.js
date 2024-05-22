// Get saved books from localStorage. Make savedBookIds an empty array if no saved books.
export const getSavedBookIds = () => {
    const savedBookIds = localStorage.getItem('saved_books')
        ? JSON.parse(localStorage.getItem('saved_books'))
        : [];

    return savedBookIds;
};

// Save books to localStorage, as bookIds, under the key saved_books.
export const saveBookIds = (bookIdArr) => {
    if (bookIdArr.length) {
        localStorage.setItem('saved_books', JSON.stringify(bookIdArr));
    } else {
        // Clear out localStorage if bookIdArr is empty
        localStorage.removeItem('saved_books');
    }
};

// Remove a book from localStorage. 
export const removeBookId = (bookId) => {
    const savedBookIds = localStorage.getItem('saved_books')
        ? JSON.parse(localStorage.getItem('saved_books'))
        : null;

    if (!savedBookIds) {
        return false;
    }

    // Filter the savedBookIds array to include all of the bookIds except the one to be removed. Then, set that to localStorage.
    const updatedSavedBookIds = savedBookIds?.filter((savedBookId) => savedBookId !== bookId);
    localStorage.setItem('saved_books', JSON.stringify(updatedSavedBookIds));

    return true;
};

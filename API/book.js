const BookModel = require("../schema/book");

const Router = require("express").Router();

// Route    - /book
// Des      - To get all books
// Access   - Public
// Method   - GET
// Params   - none
// Body     - none
Router.get("/book", async (req, res) => {
    const getAllBooks = await BookModel.find();
    return res.json(getAllBooks);
});

// Route    - /book/:bookID
// Des      - to get specific books 
// Access   - Public
// Method   - GET
// Params   - bookID
// Body     - none
Router.get("/book/:bookID", async (req, res) => {
    const getSpecificBook = await BookModel.findOne({
        ISBN: req.params.bookID
    });
    if (!getSpecificBook) {
        return res.json({
            error: `No book found for the ISBN of ${req.params.bookID}`,
        });
    }
    return res.json(getSpecificBook);
});

// Route    - /book/c/:category
// Des      - to get a list of books based on category
// Access   - Public
// Method   - GET
// Params   - category
// Body     - none

Router.get("/book/c/:category", async (req, res) => {
    const getSpecificBooks = await BookModel.findOne({
        category: req.params.category,
    });

    if (!getSpecificBooks) {
        return res.json({
            error: `No book found for the catogory of ${req.params.category}`
        });
    }

    return res.json({
        books: getSpecificBooks
    });
});

// Route    - /book/a/:authors 
// Des      - to get a list of books based on author
// Access   - Public
// Method   - GET
// Params   - author
// Body     - none
Router.get("/book/a/:author", (req, res) => {
    const getBook = Database.Book.filter((book) => book.authors.includes(parseInt(req
        .params.authors)));
    return res.json({
        book: getBook
    });
});

// Route    - /book/new
// Des      - to add new book
// Access   - Public
// Method   - POST
// Params   - none
Router.post("/book/new", async (req, res) => {

    try {
        const {
            newBook
        } = req.body;
        await BookModel.create(newBook);
        return res.json({
            message: 'Book added to the database'
        });

    } catch (error) {
        return res.json({
            error: error.message
        });

    }
});

// Route    - /book/update/:isbn
// Des      - to update book details
// Access   - Public
// Method   - PUT
// Params   - ISBN
Router.put("/book/update/:isbn", (req, res) => {
    const {
        updateData
    } = req.body;
    const {
        isbn
    } = req.params;

    const book = Database.Book.map((book) => {
        if (book.ISBN === isbn) {
            return {
                ...book,
                ...updateData
            };
        }

        return book;
    });

    return res.json(book);
});

// Route    - /book/updateAuthor/:isbn
// Des      - to update/add new author
// Access   - Public
// Method   - PUT
// Params   - ISBN
Router.put("/book/updateAuthor/:isbn", async (req, res) => {
    const {
        newAuthor
    } = req.body;
    const {
        isbn
    } = req.params;

    const updateBook = await BookModel.findOneAndUpdate({
        ISBN: isbn,
    }, {
        $addToSet: {
            authors: newAuthor,
        }
    }, {
        new: true,
    }, );

    const updateAuthor = await AuthorModel.findOneAndUpdate({
        id: newAuthor,
    }, {
        $addToSet: {
            books: isbn,
        }
    }, {
        new: true,
    }, );

    return res.json({
        book: updateBook,
        authors: updateAuthor,
        message: 'New author was added into database',
    });
});

// Route    - /book/updateTitle/:isbn
// Des      - to update title of a book
// Access   - Public
// Method   - PUT
// Params   - ISBN
Router.put("/book/updateTitle/:isbn", async (req, res) => {
    const {
        titleName
    } = req.body.title;
    const updateBook = await BookModel.findOneAndUpdate({
            ISBN: req.params.isbn,
        }, {
            title: titleName,
        }, {
            new: true,
        },

    );

    return res.json({
        book: updateBook
    });
});

// Route    - /book/delete/:isbn
// Des      - to delete a book
// Access   - Public
// Method   - DELETE
// Params   - ISBN
Router.delete("/book/delete/:isbn", async (req, res) => {
    const {
        isbn
    } = req.params;

    const updateBookDatabase = await BookModel.findOneAndDelete({
            ISBN: isbn,
        },

    )

    return res.json(updateBookDatabase);
});

// Route    - /book/delete/author/:isbn/:id
// Des      - delete an author from the book
// Access   - Public
// Method   - DELETE
// Params   - ISBN , id
Router.delete("/book/delete/author/:isbn/:id", async (req, res) => {
    const {
        isbn,
        id
    } = req.params;

    const updateBook = await BookModel.findOneAndUpdate({
        ISBN: isbn,
    }, {
        $pull: {
            authors: parseInt(id),
        }
    }, {
        new: true,
    }, );

    const updateAuthor = await AuthorModel.findByIdAndUpdate(
        {
            id: parseInt(id),
        },
        {
            $pull : {
                books : isbn,
            },
        },
        {
            new : true,
        },
    );
 

    return res.json({
        message: 'Author was deleted',
        book: updateBook,
        author: updateAuthor
    });
});

module.exports = Router;
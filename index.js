require('dotenv').config();
const express = require("express");
const mongoose = require('mongoose');

// Importing Different Schema

const BookModel = require("./schema/book");
const AuthorModel = require("./schema/author");
const PublicationModel = require("./schema/publication");

//database

const Database = require("./database");

//initialization

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("connection established!!"))
    .catch((err) => {
        console.log(err);
    });

const ourAPP = express();

ourAPP.use(express.json());




ourAPP.get("/", (req, res) => {
    res.json({
        message: "Request Served!!!!!"
    });
});

// Route    - /book
// Des      - To get all books
// Access   - Public
// Method   - GET
// Params   - none
// Body     - none
ourAPP.get("/book", async (req, res) => {
    const getAllBooks = await BookModel.find();
    return res.json(getAllBooks);
});

// Route    - /book/:bookID
// Des      - to get specific books 
// Access   - Public
// Method   - GET
// Params   - bookID
// Body     - none
ourAPP.get("/book/:bookID", async (req, res) => {
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

ourAPP.get("/book/c/:category", async (req, res) => {
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
ourAPP.get("/book/a/:author", (req, res) => {
    const getBook = Database.Book.filter((book) => book.authors.includes(parseInt(req
        .params.authors)));
    return res.json({
        book: getBook
    });
});

// Route    - /author
// Des      - to get all authors
// Access   - Public
// Method   - GET
// Params   - none
// Body     - none
ourAPP.get("/author", async (req, res) => {
    const getAllAuthors = await AuthorModel.find();
    return res.json(getAllAuthors);

});

// Route    - /author/:id
// Des      - to get Specific authors
// Access   - Public
// Method   - GET
// Params   - ID
// Body     - none
ourAPP.get("/author/:id", (req, res) => {
    const getBook = Database.Author.filter((author) => author.id === parseInt(req.params.id));
    return res.json({
        author: getBook
    });
});
// Route    - /book/new
// Des      - to add new book
// Access   - Public
// Method   - POST
// Params   - none
ourAPP.post("/book/new", async (req, res) => {

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

// Route    - /authors/new
// Des      - to add new author
// Access   - Public
// Method   - POST
// Params   - none
ourAPP.post("/author/new", (req, res) => {

    const {
        newAuthor
    } = req.body;

    AuthorModel.create(newAuthor);

    return res.json({
        message: 'Author upated successfully'
    });

});

// Route    - /publication/new
// Des      - Add new publication
// Access   - Public
// Method   - POST
// Params   - none
ourAPP.post("/publication/new", (req, res) => {

    const {
        newPublication
    } = req.body;

    console.log(newPublication);

    return res.json({
        message: "New Publication is Added Successfully"
    });

});

// Route    - /book/update/:isbn
// Des      - to update book details
// Access   - Public
// Method   - PUT
// Params   - ISBN
ourAPP.put("/book/update/:isbn", (req, res) => {
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
ourAPP.put("/book/updateAuthor/:isbn", async(req, res) => {
    const {
        newAuthor
    } = req.body;
    const {
        isbn
    } = req.params;

        const updateBook = await BookModel.findOneAndUpdate(
            {
                ISBN: isbn,
            },
            {
                $addToSet: {
                    authors: newAuthor,
                }
            },
            {
                new: true,
            },
        );

        const updateAuthor = await AuthorModel.findOneAndUpdate(
            {
                id : newAuthor,
            },
            {
                $addToSet: {
                    books: isbn,
                }
            },
            {
                new: true,
            },
        );

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
ourAPP.put("/book/updateTitle/:isbn", async (req, res) => {
    const { titleName } = req.body.title;
    const updateBook = await BookModel.findOneAndUpdate(
        {
            ISBN: req.params.isbn,
        },
        {
            title: titleName,
        },
        {
            new: true,
        },

    );

    return res.json({book: updateBook});
});

// Route    - /author/updateName/:id
// Des      - to update/add new author
// Access   - Public
// Method   - PUT
// Params   - ID
ourAPP.put("/author/updateName/:id", (req, res) => {
    const {
        updateName
    } = req.body;
    const {
        id
    } = req.params;

    Database.Author.forEach((author) => {
        if (author.id === parseInt(id)) {
            author.name = updateName.name;
            return author;
        }
        return author;
    });
    return res.json(Database.Author);
});

// Route    - /book/delete/:isbn
// Des      - to delete a book
// Access   - Public
// Method   - DELETE
// Params   - ISBN
ourAPP.delete("/book/delete/:isbn", (req, res) => {
    const {
        isbn
    } = req.params;

    const filterBooks = Database.Book.filter((book) => book.ISBN !== isbn);

    Database.Book = filterBooks;

    return res.json(Database.Book);
});

// Route    - /book/delete/author/:isbn/:id
// Des      - delete an author from the book
// Access   - Public
// Method   - DELETE
// Params   - ISBN , id
ourAPP.delete("/book/delete/author/:isbn/:id", (req, res) => {
    const {
        isbn,
        id
    } = req.params;

    Database.Book.forEach((book) => {
        if (book.ISBN === isbn) {
            if (!book.authors.includes(parseInt(id))) {
                return;
            }

            book.authors = book.authors.filter((databaseId) => databaseId !== parseInt(id));

            return book;
        }

        return book;
    });

    Database.Author.forEach((author) => {
        if (author.id === parseInt(id)) {
            if (!author.books.includes(isbn)) {
                return;
            }

            author.books = author.books.filter((book) => book !== isbn);

            return author;
        }

        return author;
    });

    return res.json({
        book: Database.Book,
        author: Database.Author
    });
});

// Route    - /author/delete/:id
// Des      - delete an author 
// Access   - Public
// Method   - DELETE
// Params   - id
ourAPP.delete("/author/delete/:id", (req, res) => {
    const {
        id
    } = req.params;

    const filteredAuthor = Database.Author.filter((author) => author.id !== parseInt(id));

    Database.Author = filteredAuthor;

    return res.json(Database.Author);
});

// Route    - /author/publication/:id
// Des      - delete an publication 
// Access   - Public
// Method   - DELETE
// Params   - id
ourAPP.delete("/author/publication/:id", (req, res) => {
    const {
        id
    } = req.params;

    const filteredpub = Database.Publication.filter((pub) => pub.id !== parseInt(id));

    Database.Publication = filteredpub;

    return res.json(Database.Publication);
});

// Route    - /publication/delete/book/:isbn/:id
// Des      - delete a book from publication
// Access   - Public
// Method   - DELETE
// Params   - ISBN , id
ourAPP.delete("/publication/delete/book/:isbn/:id", (req, res) => {
    const {
        isbn,
        id
    } = req.params;

    Database.Book.forEach((book) => {
        if (book.ISBN === isbn) {
            book.publication = 0;
            return book;
        }
        return book;
    });

    Database.Publication.forEach((publication) => {
        if (publication.id === parseInt(id)) {
            const filteredBooks = publication.books.filter(
                (book) => book !== isbn
            );
            publication.books = filteredBooks;
            return publication;
        }
        return publication;
    });

    return res.json({
        book: Database.Book,
        publication: Database.Publication
    });
});









ourAPP.listen(4000, () => console.log("Server is running"));
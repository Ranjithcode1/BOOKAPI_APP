const express = require("express");

//database

const Database = require("./database");

//initialization

const ourAPP = express();

ourAPP.use(express.json());


ourAPP.get("/", (req, res) => {
   res.json({ message: "Request Served!!!!!" });
});

// Route    - /book
// Des      - To get all books
// Access   - Public
// Method   - GET
// Params   - none
// Body     - none
ourAPP.get("/book", (req, res) => {
    return res.json({ books: Database.Book });
});

// Route    - /book/:bookID
// Des      - to get specific books 
// Access   - Public
// Method   - GET
// Params   - bookID
// Body     - none
ourAPP.get("/book/:bookID", (req, res) => { 
    const getBook = Database.Book.filter((book) => book.ISBN === req.params.bookID );
    return res.json({ book: getBook });
});

// Route    - /book/c/:category
// Des      - to get a list of books based on category
// Access   - Public
// Method   - GET
// Params   - category
// Body     - none

ourAPP.get("/book/c/:category", (req, res) => {
    const getBook = Database.Book.filter((book) => book.category.includes(req.params.category)); 
    return res.json({ book: getBook });
});

// Route    - /book/a/:authors 
// Des      - to get a list of books based on author
// Access   - Public
// Method   - GET
// Params   - author
// Body     - none
ourAPP.get("/book/a/:authors", (req, res) => {
    const getBook = Database.Book.filter((book) => book.authors.includes(parseInt(req.params.authors)) );
    return res.json({ book: getBook });
});

// Route    - /author
// Des      - to get all authors
// Access   - Public
// Method   - GET
// Params   - none
// Body     - none
ourAPP.get("/authors", (req, res) => {
    return res.json({ author: Database.Author });
});

// Route    - /book/new
// Des      - to add new book
// Access   - Public
// Method   - POST
// Params   - none
ourAPP.post("/book/new", (req, res) => {

    const {newBook} = req.body;

    Database.Book.push(newBook);

    return res.json(Database.Book);
});

// Route    - /authors/new
// Des      - to add new author
// Access   - Public
// Method   - POST
// Params   - none
ourAPP.post("/authors/new", (req, res)=> {
   
    const {newAuthor} = req.body;
   
    Database.Author.push(newAuthor);

    return res.json(Database.Author);

});

// Route    - /publication/new
// Des      - Add new publication
// Access   - Public
// Method   - POST
// Params   - none
ourAPP.post("/publication/new", (req, res)=>{

    const {newPublication} = req.body;
    
    console.log(newPublication);

    return res.json({message:"New Publication is Added Successfully"});
    
});

// Route    - /book/update/:isbn
// Des      - to update book details
// Access   - Public
// Method   - PUT
// Params   - ISBN
ourAPP.put("/book/update/:isbn", (req, res)=>{
    const {updateData} = req.body;
    const {isbn} = req.params;

    const book = Database.Book.map((book)=> {
        if(book.ISBN === isbn){
            return {...book, ...updateData};
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
ourAPP.put("/book/updateAuthor/:isbn", (req, res)=>{
    const {newAuthor} = req.body;
    const {isbn} = req.params;

    Database.Book.forEach((book)=> {
        if(book.ISBN === isbn){
            if(!book.authors.includes(newAuthor)){
            book.authors.push(newAuthor);
            return book;
        }

            return book;
        }

        return book;
    });

     Database.Author.forEach((author) =>{
        if(author.id === newAuthor ) {
            if(!author.books.includes(isbn)){
                author.books.push(isbn);
                return author;
            }
            return author;
        }

        return author;
    });

    return res.json({book : Database.Book, author : Database.Author});
});

// Route    - /book/updateTitle/:isbn
// Des      - to update title of a book
// Access   - Public
// Method   - PUT
// Params   - ISBN
ourAPP.put("/book/updateTitle/:isbn", (req, res) =>{
    const { updateBook } = req.body;
    const { isbn } = req.params;

    Database.Book.forEach((book) =>{
        if(book.ISBN === isbn) {
            book.title = updateBook.title;
            return book;
        }
        return book;
    });
    return res.json(Database.Book);
});

// Route    - /author/updateName/:id
// Des      - to update/add new author
// Access   - Public
// Method   - PUT
// Params   - ID
ourAPP.put("/author/updateName/:id", (req, res) =>{
    const { updateName } = req.body;
    const { id } = req.params;

    Database.Author.forEach((author) =>{
        if(author.id === parseInt(id)) {
            author.name = updateName.name;
            return author;
        }
        return author;
    });
    return res.json(Database.Author);
});

ourAPP.listen(4000, () => console.log("Server is running") );
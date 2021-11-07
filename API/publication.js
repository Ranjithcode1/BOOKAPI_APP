// const PublicationModel = require("./schema/publication");

const Router = require("express").Router();

// Route    - /publication/new
// Des      - Add new publication
// Access   - Public
// Method   - POST
// Params   - none
Router.post("/publication/new", (req, res) => {

    const {
        newPublication
    } = req.body;

    console.log(newPublication);

    return res.json({
        message: "New Publication is Added Successfully"
    });

});




// Route    - /publication/delete/book/:isbn/:id
// Des      - delete a book from publication
// Access   - Public
// Method   - DELETE
// Params   - ISBN , id

Router.delete("/publication/delete/book/:isbn/:id", (req, res) => {
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

module.exports = Router;
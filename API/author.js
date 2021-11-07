const AuthorModel = require("../schema/author");

const Router = require("express").Router();


// Route    - /author
// Des      - to get all authors
// Access   - Public
// Method   - GET
// Params   - none
// Body     - none
Router.get("/author", async (req, res) => {
    const getAllAuthors = await AuthorModel.find();
    return res.json(getAllAuthors);

});

// Route    - /author/:id
// Des      - to get Specific authors
// Access   - Public
// Method   - GET
// Params   - ID
// Body     - none
Router.get("/author/:id", (req, res) => {
    const getBook = Database.Author.filter((author) => author.id === parseInt(req.params.id));
    return res.json({
        author: getBook
    });
});


// Route    - /authors/new
// Des      - to add new author
// Access   - Public
// Method   - POST
// Params   - none
Router.post("/author/new", (req, res) => {

    const {
        newAuthor
    } = req.body;

    AuthorModel.create(newAuthor);

    return res.json({
        message: 'Author upated successfully'
    });

});

// Route    - /author/updateName/:id
// Des      - to update/add new author
// Access   - Public
// Method   - PUT
// Params   - ID
Router.put("/author/updateName/:id", (req, res) => {
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



// Route    - /author/delete/:id
// Des      - delete an author 
// Access   - Public
// Method   - DELETE
// Params   - id
Router.delete("/author/delete/:id", (req, res) => {
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
Router.delete("/author/publication/:id", (req, res) => {
    const {
        id
    } = req.params;

    const filteredpub = Database.Publication.filter((pub) => pub.id !== parseInt(id));

    Database.Publication = filteredpub;

    return res.json(Database.Publication);
});

module.exports = Router;
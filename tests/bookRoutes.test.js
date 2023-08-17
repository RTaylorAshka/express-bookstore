const request = require("supertest");
const app = require("../app");
const db = require("../db");
const Book = require("../models/book");
process.env.NODE_ENV = "test";

let testBook;

describe("Book Routes Test", function () {

    beforeEach(async function () {
        await db.query("DELETE FROM books");

        testBook = await Book.create({
            "isbn": "646864486",
            "amazon_url": "testurl.test",
            "author": "TestAuthor",
            "language": "Gibberish",
            "pages": 87,
            "publisher": "Imaginary Publishing",
            "title": "Placeholder Text: A History",
            "year": 1984
        });
    });


    describe("Get /books/", function () {
        test("get all books", async function () {
            const res = await request(app).get('/books/')
            expect(res.statusCode).toEqual(200)
        });
    });

    describe("Post /books/", function () {
        test("add book", async function () {
            const data = {
                "isbn": "3443434643",
                "amazon_url": "testurl2.test",
                "author": "ATotallyDifferentTestAuthor",
                "language": "Gibberish 2: Electric Boogaloo",
                "pages": 5,
                "publisher": "Imaginary Publishing Inc.",
                "title": "The Biography of Lorem Ipsum",
                "year": 2020
            }

            const res = await request(app).post('/books/').send({ book: data })
            expect(res.statusCode).toEqual(201)
        });
        test("add book, bad data", async function () {
            const data = {
                "isbn": "3443434643",
                "author": "ATotallyDifferentTestAuthor",
                "language": "Gibberish 2: Electric Boogaloo",
                "pages": "five",
                "publisher": "Imaginary Publishing Inc.",
                "title": "The Biography of Lorem Ipsum",
                "year": 2020
            }

            const res = await request(app).post('/books/').send({ book: data })
            expect(res.statusCode).toEqual(400)
        });
        test("add book, no isbn", async function () {
            const data = {
                "amazon_url": "testurl2.test",
                "author": "ATotallyDifferentTestAuthor",
                "language": "Gibberish 2: Electric Boogaloo",
                "pages": 5,
                "publisher": "Imaginary Publishing Inc.",
                "title": "The Biography of Lorem Ipsum",
                "year": 2020
            }

            const res = await request(app).post('/books/').send({ book: data })
            expect(res.statusCode).toEqual(400)
        });

    });

    describe("Get /books/:isbn", function () {
        test("get book by isbn", async function () {
            const res = await request(app).get(`/books/${testBook.isbn}`)
            expect(res.statusCode).toEqual(200)
        });
        test("get book by isbn, bad isbn", async function () {
            const res = await request(app).get(`/books/123rambutan`)
            expect(res.statusCode).toEqual(404)
        });
    });

    describe("Put /books/:isbn", function () {
        test("edit book by isbn", async function () {
            const data = {
                "amazon_url": "testurl2.test",
                "author": "ATotallyDifferentTestAuthor",
                "language": "Gibberish 2: Electric Boogaloo",
                "pages": 5,
                "publisher": "Imaginary Publishing Inc.",
                "title": "The Biography of Lorem Ipsum",
                "year": 2020
            }
            const res = await request(app).put(`/books/${testBook.isbn}`).send({ book: data })
            expect(res.statusCode).toEqual(200)
        });
        test("edit book by isbn, bad isbn", async function () {
            const data = {
                "amazon_url": "testurl2.test",
                "author": "ATotallyDifferentTestAuthor",
                "language": "Gibberish 2: Electric Boogaloo",
                "pages": 5,
                "publisher": "Imaginary Publishing Inc.",
                "title": "The Biography of Lorem Ipsum",
                "year": 2020
            }
            const res = await request(app).put(`/books/123rambutan`).send({ book: data })
            expect(res.statusCode).toEqual(404)
        });
        test("edit book by isbn, bad data", async function () {
            const data = {
                "amazon_url": "testurl2.test",
                "author": "ATotallyDifferentTestAuthor",
                "language": "Gibberish 2: Electric Boogaloo",
                "pages": "five",
                "publisher": "Imaginary Publishing Inc.",
                "title": "The Biography of Lorem Ipsum",
                "year": 2020
            }
            const res = await request(app).put(`/books/123rambutan`).send({ book: data })
            expect(res.statusCode).toEqual(400)
        });
    });

    describe("Delete /books/:isbn", function () {
        test("delete book by isbn", async function () {
            const res = await request(app).del(`/books/${testBook.isbn}`)
            expect(res.statusCode).toEqual(200)
        });
        test("delete book by isbn, bad isbn", async function () {
            const res = await request(app).del(`/books/123rambutan`)
            expect(res.statusCode).toEqual(404)
        });
    });

    afterAll(async function () {
        await db.end();
    });

});

const { nanoid } = require('nanoid');
const books = require('./books');

/*===============================================================================================*/
// Handler method POST addBook

const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  let finished = false;
  if (pageCount === readPage) {
    finished = finished !== true;
  }

  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message:
        'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

/*===============================================================================================*/
// Handler method GET allBook

const getAllBookHandler = (request, h) => {
  const { name, reading, finished } = request.query;

  if (finished) {
    const isFinished = finished === '1'; // if finished = '1' isFinished = True, other than '1' isFinished = false
    console.log(isFinished);
    // condition if(isFinished) will be triggered when finished value filled with 1 http://localhost:{{port}}/books?finished=1
    if (isFinished) {
      const filterByFinished = books.filter((book) => book.finished === true); //Filter books[] with finished === true

      const response = h.response({
        status: 'success',
        data: {
          books: filterByFinished.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          })),
        },
      });
      response.code(200);
      return response;
    }
    // condition else will be triggered when finished value filled with 0 http://localhost:{{port}}/books?finished=0
    else {
      const filterByFinished = books.filter((book) => book.finished === false); //Filter books[] with finished === false

      const response = h.response({
        status: 'success',
        data: {
          books: filterByFinished.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          })),
        },
      });
      response.code(200);
      return response;
    }
  }

  if (reading) {
    const isRead = reading === '1'; // if reading = '1' isRead = True, other than '1' isRead = false
    console.log(isRead);
    // condition if(isRead) will be triggered when reading value filled with 1 http://localhost:{{port}}/books?reading=1
    if (isRead) {
      const filterByRead = books.filter((book) => book.reading === true); //Filter books[] with reading === true

      const response = h.response({
        status: 'success',
        data: {
          books: filterByRead.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          })),
        },
      });
      response.code(200);
      return response;
    }
    // condition else will be triggered when reading value filled with 0 http://localhost:{{port}}/books?reading=0
    else {
      const filterByRead = books.filter((book) => book.reading === false); //Filter books[] with reading === false

      const response = h.response({
        status: 'success',
        data: {
          books: filterByRead.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          })),
        },
      });
      response.code(200);
      return response;
    }
  }

  if (name) {
    //Filter books[] Array to wanted book with name as parameter, with filter and non-case sensitive
    const filterByName = books.filter((book) =>
      book.name.toLowerCase().includes(name.toLowerCase())
    );

    const response = h.response({
      status: 'success',
      data: {
        books: filterByName.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    });
    response.code(200);
    return response;
  }

  if (name === undefined || name === '') {
    //No Filter, will GET All books[] Array Value
    const response = h.response({
      status: 'success',
      data: {
        books: books.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    });
    response.code(200);
    return response;
  }
};

/*===============================================================================================*/
// Handler method GET specificBook

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const book = books.filter((n) => n.id === bookId)[0];

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book: book,
      },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

/*===============================================================================================*/
// Handler method PUT updateSpecificBook

const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const updatedAt = new Date().toISOString();
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  const index = books.findIndex((book) => book.id === bookId);

  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message:
        'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

/*===============================================================================================*/
// Handler method DELETE deleteSpesificBook

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBookHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};

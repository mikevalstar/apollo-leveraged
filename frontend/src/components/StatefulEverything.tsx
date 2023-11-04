import { gql, useMutation, useQuery } from "@apollo/client";
import { useState } from "react";

const GET_BOOKS = gql`
  query GetBooks {
    books {
      id
      title
      deleted
    }
  }
`;

const ADD_BOOK = gql`
  mutation AddBook($title: String!) {
    bookAdd(title: $title) {
      id
      title
      deleted
    }
  }
`;

const ADD_DEL = gql`
  mutation RemoveBook($id: ID!) {
    bookRemove(id: $id) {
      id
      title
      deleted
    }
  }
`;

function Stateful() {
  const [title, setTitle] = useState("");
  const [books, setBooks] = useState<
    Array<{ title: string; id: string; deleted: boolean }>
  >([]);

  const { error } = useQuery(GET_BOOKS, {
    onCompleted: (data) => {
      if (data?.books) {
        setBooks(data.books);
      }
    },
  });
  const [addBook] = useMutation(ADD_BOOK);
  const [deleteBook] = useMutation(ADD_DEL);

  const deleteClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    deleteBook({
      variables: { id },
      onCompleted: (data) => {
        if (data?.bookRemove) {
          setBooks(books.filter((b) => b.id !== id));
        }
      },
      onError: (err) => {
        console.log(err);
      },
    });
  };

  const addClick = (e: React.MouseEvent) => {
    e.preventDefault();
    addBook({
      variables: { title },
      onCompleted: (data) => {
        if (data?.bookAdd) {
          setBooks([...books, data.bookAdd]);
        }
      },
      onError: (err) => {
        console.log(err);
      },
    });
    setTitle("");
  };

  if (error) {
    console.log(error);
    return <>Error!</>;
  }

  return (
    <div>
      <ul>
        {books.map((book) => (
          <li key={book.id}>
            {book.title}
            <button onClick={(e) => deleteClick(e, book.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <form>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button onClick={addClick}>Add</button>
      </form>
    </div>
  );
}

export default Stateful;

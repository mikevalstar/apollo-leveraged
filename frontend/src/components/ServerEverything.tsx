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

function ServerIt() {
  const [title, setTitle] = useState("");

  const { data, error, refetch } = useQuery(GET_BOOKS);
  const [addBook] = useMutation(ADD_BOOK);
  const [deleteBook] = useMutation(ADD_DEL);

  //console.log("Server Render");

  const deleteClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    deleteBook({
      variables: { id },
      onCompleted: () => {
        refetch();
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
      onCompleted: () => {
        refetch();
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
        {data?.books.map((book: { title: string; id: string }) => (
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

export default ServerIt;

import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

const typeDefs = `#graphql
  type Book {
    id: ID!
    title: String!
    deleted: Boolean!
  }

  type Query {
    books: [Book!]!
  }

  type Mutation {
    bookAdd(title: String!): Book!
    bookRemove(id: ID!): Book
  }
`;

const genId = () => Math.random().toString(36).slice(2, 10);

const books: Array<{ id: string; title: string; deleted: boolean }> = [
  { id: genId(), title: "The Awakening", deleted: false },
];

const resolvers = {
  Query: {
    books: () => books,
  },

  Mutation: {
    bookAdd: (_: any, { title }: { title: string }) => {
      const book = { id: genId(), title, deleted: false };
      books.push(book);
      return book;
    },
    bookRemove: (_: any, { id }: { id: string }) => {
      const book = books.find((book) => book.id === id);
      if (book) {
        book.deleted = true;
        books.splice(books.indexOf(book), 1);
      }
      return book;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

async function main() {
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });

  console.log(`🚀  Server ready at: ${url}`);
}

main();

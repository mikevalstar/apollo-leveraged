import "./App.css";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

import StatefulEverything from "./components/StatefulEverything";
import ServerEverything from "./components/ServerEverything";
import Leveraged from "./components/Leveraged";

const client = new ApolloClient({
  uri: "/graphql",
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <h2>Everything In State</h2>
      <StatefulEverything />

      <h2>Leveraging the Server</h2>
      <ServerEverything />

      <h2>Simplified Example</h2>
      <Leveraged />
    </ApolloProvider>
  );
}

export default App;

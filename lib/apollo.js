/* /lib/apollo.js */

import { withApollo } from "next-apollo";
import { ApolloClient, InMemoryCache } from "@apollo/client";
const API_URL =
  process.env.STRAPI_URL ||
  "https://restaurant-app-backend-strapi-d2f56ca44dd9.herokuapp.com";
const apolloClient = new ApolloClient({
  uri: `${API_URL}/graphql`, // Server URL (must be absolute)
  cache: new InMemoryCache(),
});
export default withApollo(apolloClient);

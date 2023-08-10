/* /lib/apollo.js */

import { withApollo } from "next-apollo";
import { ApolloClient, InMemoryCache } from "@apollo/client";
const API_URL =
  process.env.STRAPI_URL || "https://strapi-backend-ck3p.onrender.com";
const apolloClient = new ApolloClient({
  uri: `${API_URL}/graphql`, // Server URL (must be absolute)
  cache: new InMemoryCache(),
});
export default withApollo(apolloClient);

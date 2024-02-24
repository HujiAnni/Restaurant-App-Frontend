/* /pages/index.js */

import React, { useState } from "react";
import { Input, InputGroup, InputGroupAddon } from "reactstrap";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import RestaurantList from "../components/RestaurantList";
import Dishes from "@/components/dishes";
import Cart from "../components/cart";
import {
  ApolloProvider,
  ApolloClient,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import Head from "next/head";

function Home() {
  const [query, updateQuery] = useState("");
  return (
    <div className="container-fluid">
      <Row className="justify-content-md-center">
        <Col xs={12} sm={12} md={6} lg={4} xl={4}>
          <div className="search">
            <InputGroup>
              <div className="input-group-append">
                <span className="input-group-text" id="basic-addon2">
                  Search
                </span>
              </div>
              <Input
                onChange={(e) =>
                  updateQuery(e.target.value.toLocaleLowerCase())
                }
                value={query}
              />
            </InputGroup>
          </div>
          <RestaurantList search={query} />
        </Col>
      </Row>
      <Cart> </Cart>
      <style jsx>
        {`
          .search {
            margin: 20px;
            width: 500px;
          }
        `}
      </style>
    </div>
  );
}

// function Home() {
//   const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";
//   console.log(`URL: ${API_URL}`);
//   const [query, setQuery] = useState("");
//   const link = new HttpLink({ uri: `${API_URL}/graphql` });
//   const cache = new InMemoryCache();
//   const client = new ApolloClient({ link, cache });

//   return (
//     <ApolloProvider client={client}>
//       <div className="search">
//         <h2> Local Restaurants</h2>
//         <InputGroup>
//           <InputGroupAddon addonType="append"> Search </InputGroupAddon>
//           <Input
//             onChange={(e) => setQuery(e.target.value.toLocaleLowerCase())}
//             value={query}
//           />
//         </InputGroup>
//         <br></br>
//       </div>
//       <RestaurantList search={query} />
//       <Cart> </Cart>
//     </ApolloProvider>
//   );
// }
export default Home;

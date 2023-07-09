/* /pages/restaurant/[id].js */

import { useContext } from "react";
import React, { useState } from "react";
import { useRouter } from "next/router";
import { gql, serializeFetchParameter, useQuery } from "@apollo/client";
import Cart from "../../components/cart/";
import AppContext from "../../context/AppContext";
import Dishes from "@/components/dishes";
import {
  Button,
  Card,
  CardBody,
  CardImg,
  CardText,
  CardTitle,
  Col,
  Row,
  Container,
  Input,
  InputGroup,
} from "reactstrap";
const GET_RESTAURANT_DISHES = gql`
  query ($id: ID!) {
    restaurant(id: $id) {
      data {
        id
        attributes {
          name
          dishes {
            data {
              id
              attributes {
                name
                description
                price
                image {
                  data {
                    attributes {
                      url
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

function Restaurants(props) {
  const appContext = useContext(AppContext);
  const router = useRouter();
  const [query, updateQuery] = useState("");
  const { loading, error, data } = useQuery(GET_RESTAURANT_DISHES, {
    variables: { id: router.query.id },
  });
  // console.log(props);

  if (error) return "Error Loading Dishes";
  if (loading) return <h1>Loading ...</h1>;
  if (data.restaurant.data.attributes.dishes.data.length) {
    const { restaurant } = data;
    // console.log(restaurant.data.attributes.dishes.data);

    return (
      <>
        <h1>{restaurant.data.attributes.name}</h1>

        <br></br>
        {/* <Dishes search={query} /> */}
        <div className="search">
          <InputGroup>
            <div className="input-group-append">
              <span className="input-group-text" id="basic-addon2">
                Search
              </span>
            </div>
            <Input
              onChange={(e) => updateQuery(e.target.value.toLocaleLowerCase())}
              value={query}
            />
          </InputGroup>
        </div>

        <br></br>
        <Row>
          {restaurant.data.attributes.dishes.data.map((res) => {
            let ress = { res };
            // console.log(ress);

            return (
              <Col xs="6" sm="4" style={{ padding: 0 }} key={Math.random()}>
                <Card style={{ margin: "0 10px" }}>
                  <CardImg
                    top={true}
                    style={{ height: 250 }}
                    src={`${process.env.STRAPI_URL || "http://localhost:1337"}${
                      res.attributes.image.data.attributes.url
                    }`}
                  />
                  <CardBody>
                    <CardTitle tag="h5">{res.attributes.name}</CardTitle>
                    <CardText>{res.attributes.description}</CardText>
                  </CardBody>
                  <div className="card-footer">
                    <Button
                      outline
                      color="secondary"
                      onClick={() => {
                        appContext.addItem(ress);
                      }}
                    >
                      + Add To Cart
                    </Button>
                    <style jsx>
                      {`
                        a {
                          color: white;
                        }
                        a:link {
                          text-decoration: none;
                          color: white;
                        }
                        .container-fluid {
                          margin-bottom: 30px;
                        }
                        .btn-outline-primary {
                          color: #007bff !important;
                        }
                        a:hover {
                          color: white !important;
                        }
                      `}
                    </style>
                  </div>
                </Card>
              </Col>
            );
          })}
          <Col xs="3" style={{ padding: 0 }}>
            <div>
              <Cart />
            </div>
          </Col>
        </Row>
      </>
    );
  }

  return <h1>Add Dishes</h1>;
}
export default Restaurants;

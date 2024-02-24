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
          city
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
    const searchQuery = restaurant.data.attributes.dishes.data.filter((obj) =>
      obj.attributes.name.toLowerCase().includes(query)
    );
    if (searchQuery.length) {
      return (
        <>
          <h2>{restaurant.data.attributes.name}</h2>
          <h5>{restaurant.data.attributes.city}</h5>
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
                onChange={(e) =>
                  updateQuery(e.target.value.toLocaleLowerCase())
                }
                value={query}
              />
            </InputGroup>
          </div>

          <br></br>

          <Row>
            {searchQuery.map((res) => {
              let ress = { res };
              // console.log(ress);

              return (
                <Col
                  xs={12}
                  sm={6}
                  lg={4}
                  xl={4}
                  style={{ padding: 0 }}
                  key={Math.random()}
                >
                  <Card style={{ margin: "0 10px" }}>
                    <CardImg
                      top={true}
                      style={{ height: "100%" }}
                      src={`${res.attributes.image.data.attributes.url}`}
                    />
                    <CardBody>
                      <CardTitle tag="h5">{res.attributes.name}</CardTitle>
                      <CardText>{res.attributes.description}</CardText>
                      <CardText>Price: ${res.attributes.price}</CardText>
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
            <Col xs={12} sm={6} lg={4} xl={4} style={{ padding: 0 }}>
              <div>
                <Cart />
              </div>
            </Col>
          </Row>
        </>
      );
    } else {
      return (
        <>
          <h2>{restaurant.data.attributes.name}</h2>

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
                onChange={(e) =>
                  updateQuery(e.target.value.toLocaleLowerCase())
                }
                value={query}
              />
            </InputGroup>
          </div>

          <br></br>
          <h5>No Dishes Found</h5>
        </>
      );
    }
  }

  return <h5>Add Dishes</h5>;
}
export default Restaurants;

/* components/RestaurantList/index.js */

import { gql, useQuery } from "@apollo/client";
import Link from "next/link";
import Dishes from "../dishes/index";
import { useContext, useState } from "react";
import AppContext from "../../context/AppContext";

import {
  Button,
  Card,
  CardBody,
  CardImg,
  CardText,
  CardTitle,
  Row,
  Col,
  Container,
  CardFooter,
} from "reactstrap";

const QUERY = gql`
  {
    restaurants {
      data {
        id
        attributes {
          name
          description
          city
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
`;

function RestaurantList(props) {
  const [restaurantID, setRestaurantID] = useState(0);
  const { cart } = useContext(AppContext);
  const [state, setState] = useState(cart);
  const { loading, error, data } = useQuery(QUERY);
  if (error) return "Error loading restaurants";
  //if restaurants are returned from the GraphQL query, run the filter query
  //and set equal to variable restaurantSearch
  if (loading) return <h1>Fetching</h1>;
  if (data.restaurants.data && data.restaurants.data.length) {
    //searchQuery
    const searchQuery = data.restaurants.data.filter((query) =>
      query.attributes.name.toLowerCase().includes(props.search)
    );
    const renderDishes = (restaurantID) => {
      return <Dishes restId={restaurantID} />;
    };

    if (searchQuery.length != 0) {
      const restList = searchQuery.map((res) => (
        <Col xs={12} sm={6} lg={4} xl={4} key={res.id}>
          <Card style={{ margin: "0 0.5rem 20px 0.5rem" }}>
            <CardImg
              top={true}
              style={{ height: 300 }}
              src={`${res?.attributes?.image?.data?.attributes?.url}`}
            />
            <CardBody>
              <CardTitle tag="h4">{res.attributes.name}</CardTitle>
              <CardText>{res.attributes.description}</CardText>
            </CardBody>
            <CardFooter>{res.attributes.city}</CardFooter>
            <div className="card-footer">
              <Link href={`/restaurant/${res.id}`} legacyBehavior>
                <a className="btn btn-dark">{res.attributes.name}</a>
              </Link>
              <Button
                color="outline-secondary"
                onClick={() => setRestaurantID(res.id)}
              >
                View Dishes
              </Button>
            </div>
          </Card>
        </Col>
      ));

      return (
        <Container>
          <Row xs="3">
            {restList}
            <style jsx global>
              {`
                a {
                  color: white;
                }
                a:link {
                  text-decoration: none;
                  color: white;
                }
                a:hover {
                  color: white;
                }
                .card-columns {
                  column-count: 3;
                }
              `}
            </style>
          </Row>
          <Row xs="3">{renderDishes(restaurantID)}</Row>
        </Container>
      );
    } else {
      return <h1>No Restaurants Found</h1>;
    }
  }
  return <h5>Add Restaurants</h5>;
}
export default RestaurantList;

/* /pages/login.js */

import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import { login } from "../lib/auth";
import AppContext from "../context/AppContext";
function Login(props) {
  const [data, updateData] = useState({ identifier: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const router = useRouter();
  const appContext = useContext(AppContext);
  useEffect(() => {
    if (appContext.isAuthenticated) {
      router.push("/"); // redirect if you're already logged in
    }
  }, []);
  function onChange(event) {
    updateData({ ...data, [event.target.name]: event.target.value });
  }
  return (
    <Container>
      <Row>
        <Col sm="12" md={{ size: 5, offset: 3 }}>
          <div className="paper">
            <div className="header">
              {/* <img
                src="https://www.shutterstock.com/image-vector/covid19-coronavirus-epidemic-delivery-service-260nw-1697742205.jpg"
                style={{
                  width: "77%",
                  borderRadius: "5px",
                }}
              /> */}

              <h2 className="text-white text-center ">Login</h2>
            </div>
            <section className="wrapper">
              {Object.entries(error).length !== 0 &&
                error.constructor === Object && (
                  <div key={error.error.name} style={{ marginBottom: 10 }}>
                    <small style={{ color: "red" }}>
                      {error.error.message}
                    </small>
                  </div>
                )}
              <Form>
                <fieldset disabled={loading}>
                  <FormGroup>
                    <Label>Email:</Label>
                    <Input
                      onChange={(event) => onChange(event)}
                      name="identifier"
                      style={{
                        height: 50,
                        fontSize: "1.2em",
                      }}
                    />
                  </FormGroup>
                  <FormGroup style={{ marginBottom: 30 }}>
                    <Label>Password:</Label>
                    <Input
                      onChange={(event) => onChange(event)}
                      type="password"
                      name="password"
                      style={{
                        height: 50,
                        fontSize: "1.2em",
                      }}
                    />
                  </FormGroup>
                  <FormGroup>
                    <span>
                      <a href="">
                        <small>Forgot Password?</small>
                      </a>
                    </span>
                    <Button
                      style={{
                        float: "right",
                        width: 120,
                      }}
                      color="dark"
                      onClick={() => {
                        setLoading(true);
                        login(data.identifier, data.password)
                          .then((res) => {
                            setLoading(false);
                            // set authed User in global context to update header/app state
                            appContext.setUser(res.data.user);
                          })
                          .catch((error) => {
                            setError(error.response.data);
                            setLoading(false);
                          });
                      }}
                    >
                      {loading ? "Loading... " : "Submit"}
                    </Button>
                    {/* <Button
                      style={{
                        float: "right",
                        width: 120,
                      }}
                      color="dark"
                      onClick={() => {
                        // setLoading(true);
                        // login(data.identifier, data.password)
                        //   .then((res) => {
                        //     setLoading(false);
                        //     // set authed User in global context to update header/app state
                        //     appContext.setUser(res.data.user);
                        //   })
                        //   .catch((error) => {
                        //     setError(error.response.data);
                        //     setLoading(false);
                        //   });
                      }}
                    >
                      {loading ? "Loading... " : "Google Login"}
                    </Button> */}
                  </FormGroup>
                </fieldset>
              </Form>
            </section>
          </div>
        </Col>
      </Row>
      <style jsx>
        {`
          .paper {
            border: 1px solid lightgray;
            box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.2),
              0px 1px 1px 0px rgba(0, 0, 0, 0.14),
              0px 2px 1px -1px rgba(0, 0, 0, 0.12);
            border-radius: 6px;
            margin-top: 90px;
          }
          .notification {
            color: #ab003c;
          }
          .header {
            width: 100%;
            height: 120px;
            background-color: #343a40;
            margin-bottom: 30px;
            border-radius-top: 6px;
          }
          .wrapper {
            padding: 10px 30px 20px 30px !important;
          }
          a {
            color: blue !important;
          }
          img {
            margin: 15px 30px 10px 50px;
          }
        `}
      </style>
    </Container>
  );
}
export default Login;

/* _app.js */
import React from "react";
import App from "next/app";
import Head from "next/head";
import Cookie from "js-cookie";
import fetch from "isomorphic-fetch";
import Layout from "../components/Layout";
import AppContext from "../context/AppContext";
import withData from "../lib/apollo";
// import "@/styles/globals.css";

class MyApp extends App {
  state = {
    user: null,
    cart: { items: [], total: 0 },
  };
  componentDidMount() {
    const token = Cookie.get("token");
    // restore cart from cookie, this could also be tracked in a db
    const cart = Cookie.get("cart");
    if (typeof cart === "string" && cart !== "undefined") {
      let sum = 0;
      JSON.parse(cart).forEach((item) => {
        sum += item.res.attributes.price * item.quantity;
        this.setState({
          cart: {
            items: JSON.parse(cart),
            total: sum,
          },
        });
      });
    }
    if (token) {
      // authenticate the token on the server and place set user object
      fetch(
        `${
          process.env.STRAPI_URL || `https://rstrapi-backend-ck3p.onrender.com`
        }/api/users/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ).then(async (res) => {
        // if res comes back not valid, token is not valid
        // delete the token and log the user out on client
        if (!res.ok) {
          Cookie.remove("token");
          this.setState({ user: null });
          return null;
        }
        const user = await res.json();
        this.setUser(user);
      });
    }
  }
  setUser = (user) => {
    this.setState({ user });
  };
  addItem = (item) => {
    let { items } = this.state.cart;
    //check for item already in cart
    //if not in cart, add item if item is found increase quantity ++
    let newItem = items.find((i) => i.res.id === item.res.id);
    // if item is not new, add to cart, set quantity to 1
    if (!newItem) {
      //set quantity property to 1
      item.quantity = 1;
      this.setState(
        {
          cart: {
            items: [...items, item],
            total: this.state.cart.total + item.res.attributes.price,
          },
        },
        () => Cookie.set("cart", JSON.stringify(this.state.cart.items))
      );
    } else {
      this.setState(
        {
          cart: {
            items: this.state.cart.items.map((item) =>
              item.res.id === newItem.res.id
                ? Object.assign({}, item, {
                    quantity: item.quantity + 1,
                  })
                : item
            ),
            total: this.state.cart.total + item.res.attributes.price,
          },
        },
        () => Cookie.set("cart", JSON.stringify(this.state.cart.items))
      );
    }
  };

  removeItem = (item) => {
    let { items } = this.state.cart;
    //check for item already in cart
    //if not in cart, add item if item is found increase quantity ++
    let newItem = items.find((i) => i.res.id === item.res.id);
    if (newItem.quantity > 1) {
      this.setState(
        {
          cart: {
            items: this.state.cart.items.map((item) =>
              item.res.id === newItem.res.id
                ? Object.assign({}, item, {
                    quantity: item.quantity - 1,
                  })
                : item
            ),
            total: this.state.cart.total - item.res.attributes.price,
          },
        },
        () => Cookie.set("cart", JSON.stringify(this.state.cart.items))
      );
    } else {
      const items = [...this.state.cart.items];
      const index = items.findIndex((i) => i.res.id === item.res.id);
      items.splice(index, 1);
      this.setState(
        {
          cart: {
            items: items,
            total: this.state.cart.total - item.res.attributes.price,
          },
        },
        () => Cookie.set("cart", JSON.stringify(this.state.cart.items))
      );
    }
  };

  // removeAllItem = () => {
  //   this.setState(
  //     {
  //       cart: {},
  //     },
  //     () => Cookie.set("cart", JSON.stringify({}))
  //   );
  // };

  render() {
    const { Component, pageProps } = this.props;
    return (
      <AppContext.Provider
        value={{
          user: this.state.user,
          isAuthenticated: !!this.state.user,
          setUser: this.setUser,
          cart: this.state.cart,
          addItem: this.addItem,
          removeItem: this.removeItem,
        }}
      >
        <Head>
          <link
            rel="stylesheet"
            href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
            integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm"
            crossOrigin="anonymous"
          />
          <meta name="description" content="Generated by create next app" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </AppContext.Provider>
    );
  }
}
export default withData({ ssr: true })(MyApp);

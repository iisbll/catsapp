import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import { render } from "react-dom";
import _ from "lodash";

import Alert from "react-bootstrap/esm/Alert";

import HomePage from "./pages/Home";
import CatPage from "./pages/Cat";
import NoMatch from "./pages/NoMatch";

import Cat, { Breed } from "./interfaces/Cat";

import { sendRequest } from "./api";
import "./styles/index.scss";

const PAGE_LIMIT = 10;

function App() {
  const [breeds, setBreeds] = useState<Breed[]>([]);
  const [selectedBreed, selectBreed] = useState<string>("");
  const [cats, setCats] = useState<Cat[]>([]);
  const [totalCatCount, setCatCount] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  // set the initial values for breeds
  // added a placeholder bc react-bootstrap doesn't allow placeholders
  // in Select
  useEffect(() => {
    sendRequest({ url: "/breeds", method: "get" })
      .then((data: Breed[]) => {
        // just typed the placeholder as `any`
        setBreeds([{ id: "", name: "Pick a Cat Breed" } as any, ...data]);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  // if a `breed` is specified in the search params
  // set that as the initial selectedBreed
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const currentBreed = searchParams.get("breed");
    if (breeds.length > 0 && currentBreed) {
      selectBreed(currentBreed);
    }
  }, [breeds]);

  // query and load the cat images
  // associated to the selectedBreed whenever it's updated
  // - get total number of images via headers' `pagination-count`
  //   to help with the "load more" functionality
  useEffect(() => {
    if (selectedBreed) {
      setLoading(true);
      sendRequest({
        url: "/images/search",
        method: "get",
        params: {
          breed_id: selectedBreed,
          page: 1,
          limit: PAGE_LIMIT
        }
      }, true)
      .then(({ headers, data }) => {
        setCats(data);
        setCatCount(headers["pagination-count"]);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
    } else {
      setCats([]);
      setCatCount(0);
    }
  }, [selectedBreed]);

  // query more images of the selectedBreed using the page parameter
  useEffect(() => {
    if (selectedBreed) {
      setLoading(true);
      sendRequest({
        url: "/images/search",
        method: "get",
        params: {
          breed_id: selectedBreed,
          limit: PAGE_LIMIT,
          page
        }
      })
      .then((data: Cat[]) => {
        // make sure `cats` values are unique to avoid 
        // dupes + React key warnings
        const newCats = _.uniqBy([...cats, ...data], (c) => c.id);
        if (cats.length === newCats.length) {
          setCatCount(cats.length);
        } else {
          setCats(newCats);
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
    }
  }, [page]);

  const homeProps = {
    breeds,
    selectedBreed,
    cats,
    loading,
    totalCatCount,
    page,

    setPage,
    selectBreed
  };

  return (
    <>
    {
      error && (
        <Alert variant="danger" onClose={() => setError(false)} dismissible>
          <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
          <p>Apologies but we could not load new cats for you at this time! Miau!</p>
        </Alert>
      )
    }
    <Router>
      <Switch>
        <Route exact path="/:breed" >
          <CatPage cats={cats} />
        </Route>
        <Route exact path="/">
          <HomePage {...homeProps}/>
        </Route>
        <Route path="*">
          <NoMatch />
          </Route>
      </Switch>
    </Router>
    </>
  )
}

render(<App />, document.getElementById("root"));
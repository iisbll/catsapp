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

  useEffect(() => {
    sendRequest({ url: "/breeds", method: "get" })
      .then((data: Breed[]) => {
        // just typed the placeholder as any
        setBreeds([{ id: "", name: "Pick a Cat Breed" } as any, ...data]);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const currentBreed = searchParams.get("breed");
    if (breeds.length > 0 && currentBreed) {
      selectBreed(currentBreed);
    }
  }, [breeds]);

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
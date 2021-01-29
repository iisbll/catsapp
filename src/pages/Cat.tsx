import React, { useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Spinner from "react-bootstrap/Spinner";

import Cat from "../interfaces/Cat";

import { sendRequest } from "../api";
import "../styles/cat.scss";

interface Props {
  cats: Cat[];
}

export default function CatPage(props: Props) {
  const history = useHistory<any>();
  const params = useParams<any>();

  const { cats } = props
  const starCat = cats.find((c: Cat) => c.id === params.breed);
  const [cat, setCat] = useState<Cat>(starCat);
  const [loading, setLoading] = useState<boolean>(cats.length === 0);

  useEffect(() => {
    if (cats.length === 0) {
      setLoading(true);
      sendRequest({ url: `/images/${params.breed}` })
      .then((data: Cat) => {
        setCat(data);
      })
      .finally(() => setLoading(false));
    }
  }, [cats])

  return (
    <div className="cat-page">
      {cat && <Button onClick={history.goBack}>Back</Button>}
      {
        loading && <Spinner animation="grow" />
      }
      {
        cat ? (
          <Card key={`cat-img-${cat.id}`} className="cat-container">
            <Card.Img variant="top" src={cat.url} width={600}/>
            <Card.Body>
              <div>Breed: <strong>{cat.breeds[0].name}</strong></div>
              <div>Origin: {cat.breeds[0].origin}</div>
              <div>Temperament: {cat.breeds[0].temperament}</div>
              <div>Description: {cat.breeds[0].description}</div>
            </Card.Body>
          </Card>
        ) : !loading ?
        <div className="not-found">
          <Link to="/">
            <Button>Go Home</Button>
          </Link>
          <h3 className="indicator-text">Oops! Cat not feownd :(</h3>
          <img src="https://i.pinimg.com/736x/30/3f/02/303f027d32f2eeeeb596ef77be4e10f0.jpg" />
        </div>: null
      }
    </div>
  )
}


import React, { useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import _ from "lodash";

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import CardColumns from "react-bootstrap/CardColumns";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";

import Cat, { Breed } from "../interfaces/Cat";
import "../styles/home.scss";

interface Props {
  breeds: Breed[];
  cats: Cat[];
  loading: boolean;
  page: number;
  selectedBreed: string;
  totalCatCount: number;

  selectBreed: (breedId: string) => void;
  setPage: (page: number) => void;
}

export default function HomePage(props: Props) {
  const {
    breeds,
    selectedBreed,
    cats,
    loading,
    totalCatCount,
    page,

    setPage,
    selectBreed
  } = props;
  const history = useHistory();
  const location = useLocation();

  // if a user navigates from a full-page loaded CatPage
  // to HomePage, reinitialize the selectedBreed using
  // the `breed` search parameter
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const currentBreed = searchParams.get("breed");
    if (breeds && !selectedBreed && currentBreed) {
      selectBreed(currentBreed);
    }
  }, []);
    
  const handleBreedSelect = (e: any) => {
    const breedId = e.target.value;
    history.push({
      pathname: '/',
      search: breedId ? `?breed=${breedId}` : ""
    });
    selectBreed(breedId);
  }

  return (
    <div className="home-page">
      <div className="search-banner">
        <div className="banner-overlay"></div>
        <Form>
          <Form.Group controlId="breedSelect">
            <Form.Control as="select" onChange={handleBreedSelect} size="lg" value={selectedBreed}>
            {
              breeds.map((b:Breed, i: number) =>
                <option key={`breed-${i}`} value={b.id}>{b.name}</option>
              )
            }
          </Form.Control>
        </Form.Group>
      </Form>
      {
        loading && <Spinner animation="grow" />
      }
    </div>
    {
      cats.length > 0 ? (
        <>
        <div className="cats-list">
          <CardColumns>
            {
              cats.map((cat:Cat) => 
              <Card  key={`cat-img-${cat.id}`} className="cat-content">
                <Card.Img variant="top" src={cat.url} />
                <Card.Body>
                  <Button onClick={() => history.push(`/${cat.id}`)}>
                    View Details
                  </Button>
                </Card.Body>
              </Card>
              )
            }
          </CardColumns>
        </div>
        {cats.length < totalCatCount && (
          <Button onClick={() => setPage(page + 1)}>Load more</Button>
        )}
        </>
      ) : selectedBreed && !loading ? 
        <div className="indicator-text">No results for this breed D:</div> : null
    }
    </div>
  )
}
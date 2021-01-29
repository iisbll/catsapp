import React from "react";
import { Link } from "react-router-dom";

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

import "../styles/cat.scss";

export default function NoMatch() {
  return (
    <>
      <Link to="/">
        <Button>Go Home</Button>
      </Link>
      <Card className="cat-container cat-404">
        <Card.Img variant="top" src="https://static.boredpanda.com/blog/wp-content/uploads/2014/02/funny-wet-cats-coverimage.jpg" width={600}/>
        <Card.Body>
          <h1>404 Nothing to see here {">"}:D</h1>
        </Card.Body>
      </Card>
    </>
  )
}
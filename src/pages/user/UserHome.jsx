import React from "react";
import { Carousel, Container, Row, Col, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import BanerImage from "./image/1.jpeg"
import BanerImage2 from "./image/2.jpg"
import BanerImage3 from "./image/3.jpeg"
import Restaurant from "./image/res.jpg"
import Dish from "./image/dish.webp"
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/userHome.css"; // Import CSS file

const HomePage = () => {
  const navigate = useNavigate(); 

  return (
    <div>

      {/* Carousel Section */}
      <Carousel className="carousel-container">
        <Carousel.Item>
          <img
            className="d-block w-100"
            src={BanerImage3}
            alt="Delicious Meals"
          />
          <Carousel.Caption>
            <h3>Delicious Meals</h3>
            <p>Order fresh and tasty food delivered to your doorstep.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src={BanerImage2}
            alt="Pizza"
          />
          <Carousel.Caption>
            <h3>Fast & Reliable Delivery</h3>
            <p>We deliver your favorite meals quickly and safely.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src={BanerImage}
            alt="Burger"
          />
          <Carousel.Caption>
            <h3>Variety of Cuisines</h3>
            <p>Explore a wide range of dishes from different cuisines.</p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>

      {/* Navigation Cards */}
      <Container className="mt-4">
        <h2 className="text-center mb-4">Explore More</h2>
        <Row className="justify-content-center">
          <Col md={5} sm={12} className="mb-4">
            <Card className="nav-card">
              <Card.Img
                variant="top"
                src={Restaurant}
                alt="Restaurants"
              />
              <Card.Body className="text-center">
                <Card.Title>Restaurants</Card.Title>
                <Card.Text>Find the best restaurants near you.</Card.Text>
                <Button variant="primary" className="restaurant" onClick={() => navigate("/allrestaurants")}>
                 Restaurants
                </Button>
              </Card.Body>
            </Card>
          </Col>

          <Col md={5} sm={12} className="mb-4">
            <Card className="nav-card">
              <Card.Img
                variant="top"
                src={Dish}
                alt="Dishes"
              />
              <Card.Body className="text-center">
                <Card.Title>Dishes</Card.Title>
                <Card.Text>Browse through delicious dishes.</Card.Text>
                <Button variant="success" className="dish" onClick={() => navigate("/alldishes")}>
               Dishes
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

   
    </div>
  );
};

export default HomePage;


import React from "react"
import { Container, Row, Col } from "reactstrap"

const Footer = () => {
  return (
    <>
      <footer className="footer">
        <Container fluid={true}>
          <Row>
            <Col md={6}>{new Date().getFullYear()} © Brain Tech Solution.</Col>
            <Col md={6}>
              <div className="text-sm-end d-none d-sm-block">
                Design & Develop by Brain Tech Solution
              </div>
            </Col>
          </Row>
        </Container>
      </footer>
    </>
  )
}

export default Footer

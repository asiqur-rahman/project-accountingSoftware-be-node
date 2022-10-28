import React from "react"
import { Container, Row, Col } from "reactstrap"

const Footer = () => {
  return (
    <>
      <footer className="footer">
        <Container fluid={true}>
          <Row>
            <Col sm={6}>{new Date().getFullYear()} © Brain Tech Solution.</Col>
            <Col sm={6}>
              <div className="text-sm-end d-none d-sm-block">
                Design & Develop <i className="mdi mdi-heart text-danger"></i> by Brain Tech Solution
              </div>
            </Col>
          </Row>
        </Container>
      </footer>
    </>
  )
}

export default Footer

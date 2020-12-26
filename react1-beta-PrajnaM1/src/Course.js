import React from 'react';
import './App.css';
import Section from './Section'
import Accordion from 'react-bootstrap/Accordion'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'

class Course extends React.Component {

  constructor(props) {
    super(props);
    this.buttonClick = this.buttonClick.bind(this);
    this.AddSectionFunc = this.AddSectionFunc.bind(this);
    this.addSubsectionFunc = this.addSubsectionFunc.bind(this);
    
  }

  getReqs(){
    var i, j, x = "", y = "", req_fin_count=0, inner_req_fin_count=0, req_count=0, inner_req_count=0;
    req_fin_count = this.props.data.requisites.length;

    for (i of this.props.data.requisites){
      inner_req_fin_count = i.length;
      x = "(";
      inner_req_count = 0;
      for (j of i){
        x += j;
        inner_req_count += 1;
        if (inner_req_count !== inner_req_fin_count){
          x += ' or ';
        }
      }
      y += x;
      y += ")"
      req_count += 1;
      if (req_count !== req_fin_count){
        y += ' and ';
      }
    }
    if (req_fin_count === 0){
      y = 'None';
    }
    return y
  }

  getSec(){
    let sections = [];
    for(const section of Object.values(this.props.data.sections)) {
      sections.push (
        <Section data={section} AddSectionToCart2={this.AddSectionFunc} AddSubsectionToCart3={this.addSubsectionFunc}/>
      )
    }

    return sections;
  }

  buttonClick(event){
   this.props.AddCourseToCart1(event, this.props.data);
  }

  AddSectionFunc(event){
    this.props.AddSectionToCart1(event, this.props.data);
   }

  addSubsectionFunc(event){
    this.props.AddSubsectionToCart2(event, this.props.data);
   }

  
  render() {
    return (
      <>
        <Accordion>
          <Card >
            <Card.Header style={{textAlign: 'center'}}>
              <Accordion.Toggle as={Button} variant="link" eventKey='0'>
                ({this.props.data.number}) {this.props.data.name} | ({this.props.data.credits} Credits)
              </Accordion.Toggle>
            </Card.Header>
            <Accordion.Collapse eventKey='0'>
              <Card.Body style={{marginLeft:'600px', marginRight:'600px'}}>
                <button style={{border:'3px solid green'}} type="button" onClick={this.buttonClick}>Add Course</button>
                <br></br>
                <br></br>
                <h4>Subject: </h4><p style={{fontSize: '15px'}}>{this.props.data.subject}</p>
                <h4>Description: </h4><p style={{fontSize: '15px'}}>{this.props.data.description}</p>
                <h4> Requisites: </h4>
                {this.getReqs()}
                <h4> Keywords: </h4>
                <p> {this.props.data.keywords.join(", ")}</p>
                <h4>Sections</h4>
                {this.getSec()}
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>
      </>




      // <div>
      //   <h2> ({this.props.data.number}) {this.props.data.name} | ({this.props.data.credits} Credits) <button type="button" onClick={this.buttonClick}>Add Course</button></h2>
      //   <h4>Subject: </h4><p style={{fontSize: '15px'}}>{this.props.data.subject}</p>
      //   <h4>Description: </h4><p style={{fontSize: '15px'}}>{this.props.data.description}</p>
      //   <h4> Requisites: </h4>
      //   {this.getReqs()}
      //   <h4> Keywords: </h4>
      //   <p> {this.props.data.keywords.join(", ")}</p>
      //   <h4>Sections</h4>
      //   {this.getSec()}
      // </div>
    )
  }

}

export default Course;

import React from 'react';
import './App.css';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Accordion from 'react-bootstrap/Accordion';

class Course extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
      showModal: false
    }
  }

  render() {
    return (
      <Card style={{width: '33%', marginTop: '5px', marginBottom: '5px'}}>
        <Card.Body>
          <Card.Title>
            <div style={{maxWidth: 250}}>
              {this.props.data.name}
            </div>
            {this.getExpansionButton()}
          </Card.Title>
          <Card.Subtitle className="mb-2 text-muted">{this.props.data.number} - {this.getCredits()}</Card.Subtitle>
          {this.getDescription()}
          <Button variant='dark' onClick={() => this.openModal()}>View sections</Button>
        </Card.Body>
        <Modal show={this.state.showModal} onHide={() => this.closeModal()} centered>
          <Modal.Header closeButton>
            <Modal.Title>{this.props.data.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {this.getSections()}
          </Modal.Body>
          <Modal.Footer>
            {this.getCourseButton()}
            <Button variant="secondary" onClick={() => this.closeModal()}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Card>
    )
  }

  getCourseButton() {
    let buttonVariant = 'dark';
    let buttonOnClick = () => this.addCourse();
    let buttonText = 'Add Course';

    if(this.props.courseKey in this.props.cartCourses) {
      buttonVariant = 'outline-dark';
      buttonOnClick = () => this.removeCourse();
      buttonText = 'Remove Course'
    }

    return (
      <Button variant={buttonVariant} onClick={buttonOnClick}>
        {buttonText}
      </Button>
    )
  }

  getSections() {
    let sections = [];


    for (let i =0; i < this.props.data.sections.length; i++){
      
      sections.push (
          <Card key={i}>
            <Accordion.Toggle as={Card.Header} variant="link" eventKey={i} style={{height: 63, display: 'flex', alignItems: 'center'}}>
              {"Section " + i}
              {this.getSectionButton(i)}
            </Accordion.Toggle>
            <Accordion.Collapse eventKey={i}>
              <Card.Body>
                {JSON.stringify(this.props.data.sections[i].time)}
                {this.getSubsections(i, this.props.data.sections[i])}
              </Card.Body>
            </Accordion.Collapse>
          </Card>
      )
    }

    return (
      <Accordion defaultActiveKey="0">
        {sections}
      </Accordion>
    )
  }

  getSectionButton(section) {
    let buttonVariant = 'dark';
    let buttonOnClick = (e) => this.addSection(e, section);
    let buttonText = 'Add Section';

    if(this.props.courseKey in this.props.cartCourses) {
      if(section in this.props.cartCourses[this.props.courseKey]) {
        buttonVariant = 'outline-dark';
        buttonOnClick = (e) => this.removeSection(e, section);
        buttonText = 'Remove Section';
      }
    }

    return <Button variant={buttonVariant} onClick={buttonOnClick} style={{position: 'absolute', right: 20}}>{buttonText}</Button>
  }

  addCourse() {
    for(const arr of Object.values(this.props.cdata)){
      var course_presence = false;
      for (const i of arr.data){ //iterating through coursenums
        if (this.props.courseKey === i){
          alert("Warning: Course already taken!");
          course_presence = true;
          this.props.addCartCourse (
            {
              course: this.props.courseKey
            }
          ); 
        }
      }
    }
    if (course_presence === false){
      //console.log('Course not present, checking requisites!')
      //compare this.props.data reqs with i reqs; doesn't match? alert, add course: add course
      if (this.props.data.requisites.length !== 0){
        var and_req_presence = false;
        for (const req_array of this.props.data.requisites){
          var or_req_presence = false;
          for (const req of req_array){ //Got one req of course that has to be added

            for(const arr of Object.values(this.props.cdata)){
              for (const i of arr.data){ //iterating through coursenums
                if (i === req){
                  or_req_presence = true;
                  break;
                }
              }
            }

          }
          if (or_req_presence === true){
            and_req_presence = true;
          }
          else{
            and_req_presence = false;
            break;
          }
        }

        if (and_req_presence === true){
          this.props.addCartCourse (
            {
              course: this.props.courseKey
            }
          ); 
        }
        else{
          alert('Warning: Requisites not met!');
          this.props.addCartCourse (
            {
              course: this.props.courseKey
            }
          ); 
        }
      }
      else{
        this.props.addCartCourse (
          {
            course: this.props.courseKey
          }
        ); 
      }
    }

  }

  removeCourse() {
    this.props.removeCartCourse (
      {
        course: this.props.courseKey
      }
    );
  }

  addSection(e, section) {

    for(const arr of Object.values(this.props.cdata)){
      var course_presence = false;
      for (const i of arr.data){ //iterating through coursenums
        if (this.props.courseKey === i){
          alert("Warning: Course already taken!");
          course_presence = true;
          this.props.addCartCourse (
            {
              course: this.props.courseKey
            }
          ); 
        }
      }
    }
    if (course_presence === false){
      //console.log('Course not present, checking requisites!')
      //compare this.props.data reqs with i reqs; doesn't match? alert, add course: add course
      if (this.props.data.requisites.length !== 0){
        var and_req_presence = false;
        for (const req_array of this.props.data.requisites){
          var or_req_presence = false;
          for (const req of req_array){ //Got one req of course that has to be added

            for(const arr of Object.values(this.props.cdata)){
              for (const i of arr.data){ //iterating through coursenums
                if (i === req){
                  or_req_presence = true;
                  break;
                }
              }
            }

          }
          if (or_req_presence === true){
            and_req_presence = true;
          }
          else{
            and_req_presence = false;
            break;
          }
        }

        if (and_req_presence === false){
          alert('Warning: Requisites not met!');
        }
      }
    }

    e.stopPropagation();
    this.props.addCartCourse (
      {
        course: this.props.courseKey,
        section: section
      }
    );
  }

  removeSection(e, section) {
    e.stopPropagation();
    this.props.removeCartCourse (
      {
        course: this.props.courseKey,
        section: section
      }
    );
  }

  addSubsection(e, section, subsection) {

    for(const arr of Object.values(this.props.cdata)){
      var course_presence = false;
      for (const i of arr.data){ //iterating through coursenums
        if (this.props.courseKey === i){
          alert("Warning: Course already taken!");
          course_presence = true;
          this.props.addCartCourse (
            {
              course: this.props.courseKey
            }
          ); 
        }
      }
    }
    if (course_presence === false){
      //console.log('Course not present, checking requisites!')
      //compare this.props.data reqs with i reqs; doesn't match? alert, add course: add course
      if (this.props.data.requisites.length !== 0){
        var and_req_presence = false;
        for (const req_array of this.props.data.requisites){
          var or_req_presence = false;
          for (const req of req_array){ //Got one req of course that has to be added

            for(const arr of Object.values(this.props.cdata)){
              for (const i of arr.data){ //iterating through coursenums
                if (i === req){
                  or_req_presence = true;
                  break;
                }
              }
            }

          }
          if (or_req_presence === true){
            and_req_presence = true;
          }
          else{
            and_req_presence = false;
            break;
          }
        }

        if (and_req_presence === false){
          alert('Warning: Requisites not met!');
        }
      }
    }

    e.stopPropagation();
    this.props.addCartCourse (
      {
        course: this.props.courseKey,
        section: section,
        subsection: subsection
      }
    );
  }

  removeSubsection(e, section, subsection) {
    e.stopPropagation();
    this.props.removeCartCourse (
      {
        course: this.props.courseKey,
        section: section,
        subsection: subsection
      }
    );

  }

  getSubsections(sectionKey, sectionValue) {
    let subsections = [];

    for (let i =0; i < sectionValue.subsections.length; i++){  
    subsections.push (
        <Card key={i}>
          <Accordion.Toggle as={Card.Header} variant="link" eventKey={i} style={{height: 63, display: 'flex', alignItems: 'center'}}>
            {i}
            {this.getSubsectionButton(sectionKey, i)}
          </Accordion.Toggle>
          <Accordion.Collapse eventKey={i}>
            <Card.Body>
              {JSON.stringify(sectionValue.subsections[i].time)}
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      )
    }

    return (
      <Accordion defaultActiveKey="0">
        {subsections}
      </Accordion>
    )
  }

  getSubsectionButton(section, subsection) {
    let buttonVariant = 'dark';
    let buttonOnClick = (e) => this.addSubsection(e, section, subsection);
    let buttonText = 'Add Subsection';

    if(this.props.courseKey in this.props.cartCourses) {
      if(section in this.props.cartCourses[this.props.courseKey]) {
        if(this.props.cartCourses[this.props.courseKey][section].indexOf(subsection) > -1) {
          buttonVariant = 'outline-dark';
          buttonOnClick = (e) => this.removeSubsection(e, section, subsection);
          buttonText = 'Remove Subsection';
        }
      }
    }

    return <Button variant={buttonVariant} onClick={buttonOnClick} style={{position: 'absolute', right: 20}}>{buttonText}</Button>
  }

  openModal() {
    this.setState({showModal: true});
  }

  closeModal() {
    this.setState({showModal: false});
  }

  setExpanded(value) {
    this.setState({expanded: value});
  }

  getExpansionButton() {
    let buttonText = '▼';
    let buttonOnClick = () => this.setExpanded(true);

    if(this.state.expanded) {
      buttonText = '▲';
      buttonOnClick = () => this.setExpanded(false)
    }

    return (
      <Button variant='outline-dark' style={{width: 25, height: 25, fontSize: 12, padding: 0, position: 'absolute', right: 20, top: 20}} onClick={buttonOnClick}>{buttonText}</Button>
    )
  }

  getDescription() {
    if(this.state.expanded) {
      return (
        <div>
          {this.props.data.description}
        </div>
      )
    }
  }

  getCredits() {
    if(this.props.data.credits === 1)
      return '1 credit';
    else
      return this.props.data.credits + ' credits';
  }
}

export default Course;

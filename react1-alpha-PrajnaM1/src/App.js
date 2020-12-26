import React from 'react';
import './App.css';
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import Sidebar from './Sidebar';
import CourseArea from './CourseArea';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allCourses: {},
      filteredCourses: {},
      subjects: [],
      cart: [],
    };
    this.setCartCourse = this.setCartCourse.bind(this);
    this.setCartSection = this.setCartSection.bind(this);
    this.setCartSubsection = this.setCartSubsection.bind(this);

    this.removeCartCourse = this.removeCartCourse.bind(this);
    this.removeCartSection = this.removeCartSection.bind(this);
    this.removeCartSubsection = this.removeCartSubsection.bind(this);
  }

  componentDidMount() {
    fetch('http://mysqlcs639.cs.wisc.edu:53706/api/react/classes').then(
      res => res.json()
    ).then(data => this.setState({allCourses: data, filteredCourses: data, subjects: this.getSubjects(data)}));
  }

  getSubjects(data) {
    let subjects = [];
    subjects.push("All");

    for(const course of Object.values(data)) {
      if(subjects.indexOf(course.subject) === -1)
        subjects.push(course.subject);
    }

    return subjects;
  }

  setCourses(courses) {
    this.setState({filteredCourses: courses})
  }

  setCartCourse(e, msg) {
    if (this.state.cart.length !== 0){
      var course_presence = false;
      for (const course of this.state.cart){
        if (course.name === msg.name){
          if (course.sections.length !== 0){
            alert("Course with one or more sections/subsections already present. Now adding all sections/subsections...");
            course_presence = true;
            var removeIndex = this.state.cart.map(function(course) { return course.name; }).indexOf(msg.name);
            this.state.cart.splice(removeIndex, 1);
            this.setState( {cart: this.state.cart.concat(msg)} )
          }
          else{
            alert("Course already present");
            course_presence = true;
          }
        }
      }
      if (course_presence === false){
        this.setState( {cart: this.state.cart.concat(msg)} )
      }
    }
    else{
      this.setState( {cart: this.state.cart.concat(msg)} )
    }
  }

  setCartSection(e, msg) {
    if (this.state.cart.length !== 0){
      var course_presence = false;
      for (const course of this.state.cart){
          if (msg.name === course.name){
            var section_presence = false;
            course_presence = true;
            for (const section of course.sections){
              if (e.target.getAttribute("number") === section.number){ //Found section in cart
                section_presence = true;
                for (const msg_section of msg.sections){
                  if (e.target.getAttribute("number") === msg_section.number){ //Found section in msg
                    if (section.subsections.length !== msg_section.subsections.length){ //Lesser subsections in cart
                      alert("This section with one or more subsections is already present. Now adding all the subsections of this section...");
                      section_presence = true;
                      for (const msg_subsec of msg_section.subsections){ //msg
                        var subsec_presence_in_cart = false;
                        for (const subsec of section.subsections){ //cart
                          if (subsec.number === msg_subsec.number){
                            subsec_presence_in_cart = true;
                            break; //Subsec present
                          }
                        }
                        if (subsec_presence_in_cart === false){
                          //Add msg_subsec to cart
                          section.subsections.push(msg_subsec);
                        }
                      }
                      this.setState( {cart: this.state.cart} )
                    }
                    else{
                      alert("Section already added with ALL the subsections!");
                      section_presence = true;
                    } 
                  }
                }
              }
            }
                
            if (section_presence === false){
              //Add the section object and update cart
              var section_obj = { "sections":[] };
              for (const section of msg.sections){
                if (section.number === e.target.getAttribute("number")){
                  course["sections"].push(section);
                }
              }
              this.setState( {cart: this.state.cart} )
            }    
          }
        }
        if (course_presence === false){//course is not there
          var section_obj = {"credits":msg.credits, "subject":msg.subject, "description":msg.description, "keywords":msg.keywords, "name":msg.name, "number":msg.number, "requisites":msg.requisites, "sections":[]};
          for (const section of msg.sections){
            if (section.number === e.target.getAttribute("number")){
              section_obj["sections"].push(section);
            }
          }
          this.setState( {cart: this.state.cart.concat(section_obj)} )
        }
      
    }
    else{
      var section_obj = {"credits":msg.credits, "subject":msg.subject, "description":msg.description, "keywords":msg.keywords, "name":msg.name, "number":msg.number, "requisites":msg.requisites, "sections":[]};
      for (const section of msg.sections){
        if (section.number === e.target.getAttribute("number")){
          section_obj["sections"].push(section);
        }
      }
      this.setState( {cart: this.state.cart.concat(section_obj)} )
    }
  }

  setCartSubsection(e, msg){
    if (this.state.cart.length !== 0){
      var course_presence = false;
      for (const course of this.state.cart){
          if (msg.name === course.name){
            course_presence = true;
            var section_presence = false;
            for (const section of course.sections){
              if (e.target.getAttribute("sec_num") === section.number){
                section_presence = true;
                if(section.subsections.length !== 0){
                  var subsection_presence = false;
                  for (const subsection of section.subsections){
                    if (e.target.getAttribute("number") === subsection.number){
                      alert("Subsection already added!");
                      subsection_presence = true;
                      break;
                    }
                  }
                  if (subsection_presence === false && section_presence === true && course_presence === true){
                    //add subsection to course
                    for (const msg_section of msg.sections){
                      if (msg_section.number === e.target.getAttribute("sec_num") ){
                        for (const msg_subsec of msg_section.subsections){
                          if (msg_subsec.number === e.target.getAttribute("number")){
                                //Found subsection required to add
                                section["subsections"].push(msg_subsec);
                              }
                            }
                          }
                        }
                      
                    this.setState( {cart: this.state.cart} )
                  }
                }
              }
            }
            if (section_presence === false && course_presence === true){
              for (const section of msg.sections){
                if (section.number === e.target.getAttribute("sec_num")){
                  var section_obj = {"instructor": section.instructor, "location": section.location, "subsections":[], "time": section.time, "number":section.number};
                    for (const subsection of section.subsections){
                      if (subsection.number === e.target.getAttribute("number")){
                        section_obj["subsections"].push(subsection);
                        course["sections"].push(section_obj);
                      }
                    }
                }
              }   
              this.setState( {cart: this.state.cart} )
            }
          }
        }
        if (course_presence === false){//course not there
            var main_obj = {"credits":msg.credits, "subject":msg.subject, "description":msg.description, "keywords":msg.keywords, "name":msg.name, "number":msg.number, "requisites":msg.requisites, "sections":[]};
            
            for (const section of msg.sections){
              if (section.number === e.target.getAttribute("sec_num")){
                var section_obj = {"instructor": section.instructor, "location": section.location, "subsections":[], "time": section.time, "number":section.number};
                for (const subsection of section.subsections){
                  if (subsection.number === e.target.getAttribute("number")){
                    section_obj["subsections"].push(subsection);
                    main_obj["sections"].push(section_obj);
                  }
                }
              }
            }
            this.setState( {cart: this.state.cart.concat(main_obj)} )
          }
      
    }
    
    else{ //cart empty
      var main_obj = {"credits":msg.credits, "subject":msg.subject, "description":msg.description, "keywords":msg.keywords, "name":msg.name, "number":msg.number, "requisites":msg.requisites, "sections":[]};
      for (const section of msg.sections){
        if (section.number === e.target.getAttribute("sec_num")){
          var section_obj = {"instructor": section.instructor, "location": section.location, "subsections":[], "time": section.time, "number":section.number};
          for (const subsection of section.subsections){
            if (subsection.number === e.target.getAttribute("number")){
              section_obj["subsections"].push(subsection);
              main_obj["sections"].push(section_obj);
            }
          } 
        }
      }
      this.setState( {cart: this.state.cart.concat(main_obj)} )
    }

  }

  removeCartCourse(e, msg){
    var removeIndex = this.state.cart.map(function(course) { return course.name; }).indexOf(msg.name);
    this.state.cart.splice(removeIndex, 1);
    this.setState( {cart: this.state.cart} )
  }
  
  removeCartSection(e, msg){
    for (var i=0; i<this.state.cart.length; i++){
      if (this.state.cart[i].name === msg.name){
        var removeSecIndex = this.state.cart[i].sections.map(function(sec) {return sec.number; }).indexOf(e.target.getAttribute("number"));
        this.state.cart[i].sections.splice(removeSecIndex, 1);
        if (this.state.cart[i].sections.length === 0){
          this.state.cart.splice(i, 1);
        }
      }
    }
    this.setState( {cart: this.state.cart} );

    fetch('http://mysqlcs639.cs.wisc.edu:53706/api/react/classes').then(
      res => res.json()
    ).then(data => this.setState({allCourses: data, filteredCourses: data, subjects: this.getSubjects(data)}));

  }

  removeCartSubsection(e, msg){
    for (var i=0; i<this.state.cart.length; i++){
      if (msg.name === this.state.cart[i].name) {
        for (var j=0; j<this.state.cart[i].sections.length; j++){
          if (this.state.cart[i].sections[j].number === e.target.getAttribute("sec_num")){
            var removeSubsecIndex = this.state.cart[i].sections[j].subsections.map(function(subsec) {return subsec.number; }).indexOf(e.target.getAttribute("number"));
            this.state.cart[i].sections[j].subsections.splice(removeSubsecIndex, 1);
            //Remove section if empty subsection
            if (this.state.cart[i].sections[j].subsections.length === 0){
              this.state.cart[i].sections.splice(j, 1);
            }
          }
        }
        if (this.state.cart[i].sections.length === 0){
          this.state.cart.splice(i,1);
        }
      }
    }

    this.setState( {cart: this.state.cart} );

    fetch('http://mysqlcs639.cs.wisc.edu:53706/api/react/classes').then(
      res => res.json()
    ).then(data => this.setState({allCourses: data, filteredCourses: data, subjects: this.getSubjects(data)}));

  }

  

  render() {
    return (
      <>
        <link
          rel="stylesheet"
          href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
          integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
          crossOrigin="anonymous"
        />

        <Tabs defaultActiveKey="search" style={{position: 'fixed', zIndex: 1, width: '100%', backgroundColor: 'white'}}>
          <Tab eventKey="search" title="Search" style={{paddingTop: '5vh'}}>
            <Sidebar setCourses={(courses) => this.setCourses(courses)} courses={this.state.allCourses} subjects={this.state.subjects}/>
            <div style={{marginLeft: '20vw'}}>
              <CourseArea data={this.state.filteredCourses} allData={this.state.allCourses} cartMode={false} AddCourseToCart0={this.setCartCourse} AddSectionToCart0={this.setCartSection} AddSubsectionToCart1={this.setCartSubsection} />
            </div>
          </Tab>

          <Tab eventKey="cart" title="Cart" style={{paddingTop: '5vh'}}>
            <div style={{marginLeft: '5vw'}} id="cart_content">
              <div>
                <CourseArea data={this.state.cart} allData={this.state.allCourses} cartMode={true} RemoveCourseFromCart0={(e,msg) => this.removeCartCourse(e,msg)} RemoveSectionFromCart0={this.removeCartSection} RemoveSubsectionFromCart1={this.removeCartSubsection}/>
              </div>
            </div>
          </Tab>
        </Tabs> 
      </>
    )
  }
}

export default App;

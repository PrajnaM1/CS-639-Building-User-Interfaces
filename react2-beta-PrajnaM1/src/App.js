import React from 'react';
import './App.css';
import Sidebar from './Sidebar';
import CourseArea from './CourseArea';
import CompletedCourseArea from './CompletedCourseArea'
import RecommendedCourseArea from './RecommendedCourseArea'
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allCourses: [],
      filteredCourses: [],
      subjects: [],
      cartCourses: {},
      completedCourses:[],
      completedsubjects:[],
      courseRatings:[],
      temp:[],
      recommendedCourses:[]
    };
    this.getRating = this.getRating.bind(this);
  }

  componentDidMount() {
   this.loadInitialState()
  }

  async loadInitialState(){
    let courseURL = "http://mysqlcs639.cs.wisc.edu:53706/api/react/classes";
    let completedcourseURL = "http://mysqlcs639.cs.wisc.edu:53706/api/react/students/5022025924/classes/completed";
    let courseData = await (await fetch(courseURL)).json()
    let courseDataCompleted = await (await fetch(completedcourseURL)).json()

    this.setState({allCourses: courseData, filteredCourses: courseData, subjects: this.getSubjects(courseData), completedCourses: this.state.completedCourses.concat(courseDataCompleted)});
  }

  getSubjects(data) {
    let subjects = [];
    subjects.push("All");

    for(let i = 0; i < data.length; i++) {
      if(subjects.indexOf(data[i].subject) === -1)
        subjects.push(data[i].subject);
    }

    return subjects;
  }

  setCourses(courses) {
    this.setState({filteredCourses: courses})

    //this.state.courseRatings = [{'course':'PSYCH 202', 'rating':'0'}, {'course':'CHEM 103', 'rating':'0'}, {'course':'PSYCH202', 'rating':'0'}, {'course':'PSYCH202', 'rating':'0'}, {'course':'PSYCH202', 'rating':'0'}, {'course':'PSYCH202', 'rating':'0'}, ]
    
  }

  addCartCourse(data) {
    let newCartCourses = JSON.parse(JSON.stringify(this.state.cartCourses))// I think this is a hack to deepcopy
    if (data.course !== '0'){
      let courseIndex = this.state.allCourses.findIndex((x) => {return x.number===data.course})
      if (courseIndex === -1)
      {
        return 
      }

      if('subsection' in data) {
        if(data.course in this.state.cartCourses) {
          if(data.section in this.state.cartCourses[data.course]) {
            newCartCourses[data.course][data.section].push(data.subsection);
          }
          else {
            newCartCourses[data.course][data.section] = [];
            newCartCourses[data.course][data.section].push(data.subsection);
          }
        }
        else {
          newCartCourses[data.course] = {};
          newCartCourses[data.course][data.section] = [];
          newCartCourses[data.course][data.section].push(data.subsection);
        }
      }
      else if('section' in data) {
        if(data.course in this.state.cartCourses) {
          newCartCourses[data.course][data.section] = [];

          for(let i = 0; i < this.state.allCourses[courseIndex].sections[data.section].subsections.length; i++) {
            newCartCourses[data.course][data.section].push(this.state.allCourses[courseIndex].sections[data.section].subsections[i]);
          }
        
        
        }
        else {
          newCartCourses[data.course] = {};
          newCartCourses[data.course][data.section] = [];
          for(let i = 0; i < this.state.allCourses[courseIndex].sections[data.section].subsections.length; i++) { 
            newCartCourses[data.course][data.section].push(this.state.allCourses[courseIndex].sections[data.section].subsections[i]);
          }
        }
      }
      else {
        newCartCourses[data.course] = {};

        for (let i = 0; i < this.state.allCourses[courseIndex].sections.length; i++){
          newCartCourses[data.course][i] = [];

          for(let c= 0; c < this.state.allCourses[courseIndex].sections[i].subsections.length; c ++){
            newCartCourses[data.course][i].push(this.state.allCourses[courseIndex].sections[i].subsections[c]);
          }

        }
      }
      this.setState({cartCourses: newCartCourses});
    }
  }

    removeCartCourse(data) {
      let newCartCourses = JSON.parse(JSON.stringify(this.state.cartCourses))

      if('subsection' in data) {
        newCartCourses[data.course][data.section].splice(newCartCourses[data.course][data.section].indexOf(data.subsection), 1);
        if(newCartCourses[data.course][data.section].length === 0) {
          delete newCartCourses[data.course][data.section];
        }
        if(Object.keys(newCartCourses[data.course]).length === 0) {
          delete newCartCourses[data.course];
        }
      }
      else if('section' in data) {
        delete newCartCourses[data.course][data.section];
        if(Object.keys(newCartCourses[data.course]).length === 0) {
          delete newCartCourses[data.course];
        }
      }
      else {
        delete newCartCourses[data.course];
      }
      this.setState({cartCourses: newCartCourses});
    }
  

  getCartData() {
    let cartData = [];

    for(const courseKey of Object.keys(this.state.cartCourses)) {
      let course = this.state.allCourses.find((x) => {return x.number === courseKey})

      cartData.push(course);
    }
    return cartData;
  }

  getRating(rating, coursenum){

    let courseRatings = JSON.parse(JSON.stringify(this.state.courseRatings));
    let index = this.state.courseRatings.findIndex((obj) => obj["course"] === coursenum);

    if (index !== -1){  //if object is present
      if(rating === "No Rating")
        courseRatings[index]["rating"] = '0';
      else
        courseRatings[index]["rating"] = rating;

      this.setState(
        {courseRatings: JSON.parse(JSON.stringify(courseRatings))}, this.recommenderAlgorithm
        )
    }
    else{ //object not present but rating array exists
        let cr = {};
        cr.course = coursenum;
        //console.log(rating);
        if(rating === "No Rating")
          cr.rating = '0';
        this.state.courseRatings.push(cr);
        this.setState(
          {courseRatings: JSON.parse(JSON.stringify(this.state.courseRatings))}, this.recommenderAlgorithm
        );
    }
    
  }

  recommenderAlgorithm(){
    
    //Recommender Algorithm
    //console.log('CourseRatings:', this.state.courseRatings);
    this.state.courseRatings.sort((a, b) => parseInt(b.rating) - parseInt(a.rating));
    //console.log('Sorted Course nums are:', this.state.courseRatings);

      let keyword_list = [];
      for (let j=0; j< this.state.courseRatings.length; j++){
        let cnum = this.state.courseRatings[j].course;
        if (this.state.courseRatings[j].rating !== '0' && this.state.courseRatings[j].rating !== '1' && this.state.courseRatings[j].rating !== '2')
          for(let i = 0; i < this.state.allCourses.length; i++){
            if (cnum === this.state.allCourses[i].number){ //found course in allCourses, now append keywords into keyword array
              for (let keyword of this.state.allCourses[i].keywords){
                if ( (keyword_list.findIndex((key) => key === keyword)) === -1){
                  keyword_list.push(keyword);
                }
              }
              break;
            }
          }
        }
      
      //console.log('Sorted keyword_list is', keyword_list);

      //Add the recommended courses
      // let recArray = [];
      // this.setState({recommendedCourses:recArray});
      this.state.recommendedCourses = [];

      for (let keyword of keyword_list){
        for (let i=0; i<this.state.allCourses.length; i++){
          for (let course_key of this.state.allCourses[i].keywords){
            if (keyword === course_key){
              let course_completion = false;
              for(const arr of Object.values(this.state.completedCourses)){
                for (const n of arr.data){ //iterating through coursenums
                    if (n === this.state.allCourses[i].number){
                      course_completion = true;
                      break;
                    }
                }
                if (course_completion === true){
                  break;
                }
              }
              if (course_completion === false){
                if ( (this.state.recommendedCourses.findIndex((item) => item === this.state.allCourses[i].number )) === -1)
                  this.state.recommendedCourses.push(this.state.allCourses[i].number);
              }
            }
          }
        }
      }

      this.setState({
        recommendedCourses: JSON.parse(JSON.stringify(this.state.recommendedCourses))
      });
      console.log('Sorted recommended courses are:', this.state.recommendedCourses);
      //console.log(this.state.courseRatings); //array for objects with latest course ratings
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
              <CourseArea data={this.state.filteredCourses} cdata={this.state.completedCourses}  addCartCourse={(data) => this.addCartCourse(data)} removeCartCourse={(data) => this.removeCartCourse(data)} cartCourses={this.state.cartCourses}/>
            </div>
          </Tab>

          <Tab eventKey="cart" title="Cart" style={{paddingTop: '5vh'}}>
            <div style={{marginLeft: '20vw'}}>
              <CourseArea data={this.getCartData()} cdata={this.state.completedCourses} addCartCourse={(data) => this.addCartCourse(data)} removeCartCourse={(data) => this.removeCartCourse(data)} cartCourses={this.state.cartCourses}/>
            </div>
          </Tab>

          <Tab eventKey="CompletedCourse" title="Completed Courses" style={{paddingTop: '5vh'}}>
            <div>
              <CompletedCourseArea cdata={this.state.completedCourses} data = {this.state.allCourses} getRating = {this.getRating}/>
            </div>
          </Tab>

          <Tab eventKey="RecommendedCourse" title="Recommended Courses" style={{paddingTop: '5vh'}}>
            <div style={{marginLeft: '20vw'}}>
            <RecommendedCourseArea rdata={this.state.recommendedCourses} data = {this.state.allCourses}/>
            </div>
          </Tab>

          <Tab eventKey="Help" title="Need Help?" style={{paddingTop: '5vh'}}>
            <div style={{ marginLeft:'500px', paddingLeft:'10px', backgroundColor:'lightyellow', paddingRight:'10px', marginRight:'500px'}}>
              <h2 style={{color:'blue', textAlign:'center'}}>Hints</h2>
              <br></br>
              <h4>How should you navigate through this webpage?</h4>
              <ol>
                <li>Select the required courses from the 'Search' tab and add the course/section/subsection simply by clicking on the buttons 'Add Course', 'Add Section' and 'Add Subsection', respectively.</li>
                <li>Check your cart to review your selections.</li>
                <li>To remove course/section/subsection from the cart, simply click on 'Remove Course', 'Remove Section' and 'Remove Subsection' buttons, respectively.</li>
                <li>Confused which course to take? Rate the courses in the 'Completed Courses' tab and view courses recommended for you in the 'Recommended Courses' tab!</li>
              </ol>
              <br></br>
              <h4>Search and Filter</h4>
              <p>Courses that satisfy the intersection of all the selected filters will be displayed.</p>
              <br></br>
              <h4>Add/Remove Course/Section/Subsection</h4>
              <p>To add/remove a course/section/subsection, simply click on the respective buttons! Do check your CART to review your selections!</p>
              <h6 style={{color:'lightcoral'}}>Alert Info!</h6>
              <ul>
                <li>If you receive an alert saying 'Course already taken!', please check the 'Completed Courses' tab to review your past courses.</li>
                <li>If you receive an alert regarding unmet requisites, please make sure that you satisfy all the requisites of the course you wish to take.</li>
              </ul>
              <br></br>
              <h4>Cart</h4>
              <p>You can review your course selections here. You can remove courses/sections/subsections to edit your course selections.</p>
              <br></br>
              <h4>Ratings</h4>
              <p>Your course ratings matter! Courses will be recommended based on highly rated course interest areas.</p>
              <br></br>
              <h4>Recommended Courses</h4>
              <p>Untaken courses whose interest areas match with the high rated course interest areas will be displayed.</p>
              <br></br>
              <br></br>
            </div>
            <br></br>
            <div style={{textAlign:'center', marginLeft:'500px', paddingLeft:'10px', backgroundColor:'lightpink', paddingRight:'10px', marginRight:'500px'}}>
              <h2 style={{color:'blue'}}>Need more help?</h2>
              <p> Please contact UW Course Enrollment Services!</p>
            </div>
          </Tab>

        </Tabs>
      </>
    )
  }
}

export default App;

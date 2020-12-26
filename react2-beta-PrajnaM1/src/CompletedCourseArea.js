import React from 'react';
import './App.css';
import CompletedCourse from './CompletedCourse';
import Jumbotron from 'react-bootstrap/Jumbotron'

class CompletedCourseArea extends React.Component {

  constructor(props){
    super(props);
    this.getRatingFunc = this.getRatingFunc.bind(this);
  }

  getCourses() {
    let courses = [];
    
        for(const arr of Object.values(this.props.cdata)){
            //console.log('Array of coursenums:', arr);
            for (const i of arr.data){ //iterating through coursenums
                let course = this.props.data.find((x) => {return x.number === i})
                //console.log('Course:', course);
                courses.push (
                    <CompletedCourse key={i} data={course} courseKey={i} getRating = {this.getRatingFunc}/>
                )
            }
        }
     
    return courses;
  }

  shouldComponentUpdate(nextProps) {
    return (JSON.stringify(this.props) !== JSON.stringify(nextProps))
  }

  getRatingFunc(rating, course){
    //console.log(course.number);
    this.props.getRating(rating, course);
  }

  render() {
    return (
      <div >
        <Jumbotron style={{backgroundColor:'lightgoldenrodyellow', paddingTop:'20px', paddingBottom:'20px'}}>
          <h5 style={{textAlign:"center"}}>Below are a list of all your completed courses. Please rate the courses and we will recommend courses for you!</h5>
          <p style={{textAlign:"center"}}>Note: Only courses with ratings 4 and above are considered as excellent courses with 'high' ratings. 'No Rating' is equivalent to 0 rating implying highly undesirable course.</p>
        </Jumbotron>
        <div style={{marginLeft:'500px', marginRight:'500px'}}>
        {this.getCourses()}
        </div>
        <Jumbotron style={{backgroundColor:'lightgoldenrodyellow', paddingTop:'20px', paddingBottom:'20px'}}>
          <h5 style={{textAlign:"center"}}> Done rating? Your Recommended Courses are available in the Recommended Courses tab!</h5>
        </Jumbotron>
      </div>
    )
  }
}

export default CompletedCourseArea;

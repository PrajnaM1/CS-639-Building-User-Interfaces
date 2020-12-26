import React from 'react';
import './App.css';
import CompletedCourse from './CompletedCourse';

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
      <div style={{margin: 5, marginTop: -5}}>
        {this.getCourses()}
      </div>
    )
  }
}

export default CompletedCourseArea;

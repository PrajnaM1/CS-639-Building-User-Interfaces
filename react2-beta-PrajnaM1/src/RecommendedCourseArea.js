import React from 'react';
import './App.css';
import RecommendedCourse from './RecommendedCourse';

class RecommendedCourseArea extends React.Component {

  getCourses() {
    let courses = [];
    
        for(const num of this.props.rdata){
            //console.log('Array of coursenums:', arr);
            let course = this.props.data.find((x) => {return x.number === num})
            //console.log('Course:', course);
            courses.push (
                <RecommendedCourse key={num} data={course} courseKey={num}/>
                )
        }
        
    return courses;
  }

  shouldComponentUpdate(nextProps) {
    return (JSON.stringify(this.props) !== JSON.stringify(nextProps))
  }


  render() {
    return (
      <div style={{margin: 5, marginTop: -5}}>
        {this.getCourses()}
      </div>
    )
  }
}

export default RecommendedCourseArea;

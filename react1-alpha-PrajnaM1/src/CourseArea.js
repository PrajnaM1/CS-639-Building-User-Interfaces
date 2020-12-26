import React from 'react';
import Add_Course from './Add_Course';
import './App.css';
import Course from './Course';

class CourseArea extends React.Component {

  constructor(props) {
    super(props);
    this.addCourse = this.addCourse.bind(this);
    this.addSection = this.addSection.bind(this);
    this.addSubsection = this.addSubsection.bind(this);
    this.RemoveCourseFromCartFunc = this.RemoveCourseFromCartFunc.bind(this);
    this.RemoveSectionFromCartFunc = this.RemoveSectionFromCartFunc.bind(this);
    this.RemoveSubsectionFromCartFunc = this.RemoveSubsectionFromCartFunc.bind(this);
  }

  addCourse(e, course){
    this.props.AddCourseToCart0(e, course);
  }

  addSection(e, course){
    this.props.AddSectionToCart0(e, course);
  }

  addSubsection(e, course){
    this.props.AddSubsectionToCart1(e, course);
  }

  RemoveCourseFromCartFunc(e, course){
     this.props.RemoveCourseFromCart0(e, course);
  }

  RemoveCourseFromCartFunc(e, course){
     this.props.RemoveCourseFromCart0(e, course);
  }

  RemoveSectionFromCartFunc(e, course){
     this.props.RemoveSectionFromCart0(e, course);
  }

  RemoveSubsectionFromCartFunc(e, course){
     this.props.RemoveSubsectionFromCart1(e, course);
  }

  getCourses() {
    let courses = [];
    for(const course of Object.values(this.props.data)) {
      if (this.props.cartMode){
        courses.push (
          <Add_Course key={course.name} data={course} RemoveCourseFromCart1={this.RemoveCourseFromCartFunc} RemoveSectionFromCart1={this.RemoveSectionFromCartFunc} RemoveSubsectionFromCart2={this.RemoveSubsectionFromCartFunc}/>
        )
      }
      else{
        courses.push (
          <Course key={course.name} data={course} AddCourseToCart1={this.addCourse} AddSectionToCart1={this.addSection} AddSubsectionToCart2={this.addSubsection}/>
        )
      }  
    }
    return courses;
  }


  render() {
    return (
      <div style={{margin: '5px'}}>
        {this.getCourses()}
      </div>
    )
  }
}

export default CourseArea;

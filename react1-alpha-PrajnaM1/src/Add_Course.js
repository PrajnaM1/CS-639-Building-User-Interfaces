import React from 'react';
import './App.css';
import Add_Section from './Add_Section'

class Add_Course extends React.Component {

    constructor(props) {
      super(props);
      this.buttonClick = this.buttonClick.bind(this);
      this.RemoveSectionFromCartFunc = this.RemoveSectionFromCartFunc.bind(this);
      this.RemoveSubsectionFromCartFunc = this.RemoveSubsectionFromCartFunc.bind(this);
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
          <Add_Section data={section} RemoveSectionFromCart2={this.RemoveSectionFromCartFunc} RemoveSubsectionFromCart3={this.RemoveSubsectionFromCartFunc}/>
        )
      }
      return sections;
    }

    buttonClick(event){
      this.props.RemoveCourseFromCart1(event, this.props.data);
    }

    RemoveSectionFromCartFunc(event){
      this.props.RemoveSectionFromCart1(event, this.props.data);
    }

    RemoveSubsectionFromCartFunc(event){
      this.props.RemoveSubsectionFromCart2(event, this.props.data);
    }
    
    render() {
      return (
        <div>
          <h2> ({this.props.data.number}) {this.props.data.name} | ({this.props.data.credits} Credits) <button type="button" onClick={this.buttonClick}>Remove Course</button></h2>
          <h4>Subject: </h4><p style={{fontSize: '15px'}}>{this.props.data.subject}</p>
          <h4>Description: </h4><p style={{fontSize: '15px'}}>{this.props.data.description}</p>
          <h4> Requisites: </h4>
          {this.getReqs()}
          <h4> Keywords: </h4>
          <p> {this.props.data.keywords.join(", ")}</p>
          <h4>Sections</h4>
          {this.getSec()}
        </div>
      )
    }
  
  }
  
  
export default Add_Course;
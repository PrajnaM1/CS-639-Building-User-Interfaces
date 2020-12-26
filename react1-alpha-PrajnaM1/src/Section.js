import React from 'react'
import './App.css'
import Subsection from './Subsection.js'


class Section extends React.Component {

	constructor(props) {
		super(props);
		this.buttonClick = this.buttonClick.bind(this);
		this.AddSubsectionFunc = this.AddSubsectionFunc.bind(this);
	  }
	
	getDayandTime(){
		var y='';
		var meettime = this.props.data.time;
      	var days_list = Object.keys(meettime);
		var time_range_list = Object.values(meettime);
		  
		y = '<ul>';

		for (var j=0; j< days_list.length; j++){
			y += "<li>" + days_list[j] + ": " + time_range_list[j] + "</li>";
		}  
		
		y += '</ul>';
		return <div dangerouslySetInnerHTML={{__html:  y}} />;;

	}
	
	getSubsec() {
		let subsections = [];
    	for(const subsection of Object.values(this.props.data.subsections)) {
      		subsections.push (
        		<Subsection data={subsection} num={this.props.data.number} AddSubsectionToCart4={this.AddSubsectionFunc}/>
      		)
		}
		return subsections;
	}

	buttonClick(event){
		this.props.AddSectionToCart2(event, this.props.data);
	}

	AddSubsectionFunc(event){
		this.props.AddSubsectionToCart3(event, this.props.data);
	}

	render() {
		
		return (
			<div>
				<ul>
					<li> {this.props.data.number}  <button onClick={this.buttonClick} number={this.props.data.number}> Add Section </button> </li>
					<ul>
						<li> Instructor: {this.props.data.instructor}</li>
						<li> Location: {this.props.data.location}</li>
						<li> Meeting Times: {this.getDayandTime()} </li>
					</ul>
					<h4> { this.props.data.subsections.length>0 ? "Subsections": "" } </h4> 
					{this.getSubsec()}
				</ul>
			</div>
		)
	}
}

export default Section;
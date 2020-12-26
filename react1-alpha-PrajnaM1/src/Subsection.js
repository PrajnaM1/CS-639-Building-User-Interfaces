import React from 'react'
import './App.css'

class Subsection extends React.Component {

	constructor(props) {
		super(props);
		this.buttonClick = this.buttonClick.bind(this);
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

	buttonClick(event){
		this.props.AddSubsectionToCart4(event, this.props.data);
	}

	render() {
		return (
			<div>
				<ul>
					<li> {this.props.data.number} <button style={{display : 'inline-block'}} onClick={this.buttonClick} number={this.props.data.number} sec_num={this.props.num}> Add Subsection </button> </li> 
					<ul>
						<li> Location: {this.props.data.location}</li>
						<li> Meeting Times: {this.getDayandTime()}</li>
					</ul>
				</ul>
			</div>
		)
	}
}

export default Subsection;
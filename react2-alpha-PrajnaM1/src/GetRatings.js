import React from 'react';
import './App.css';
import Form from 'react-bootstrap/Form';


class GetRatings extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    }
    this.rating = React.createRef();
    this.setRating = this.setRating.bind(this);

  }

  // getRating() {
  //   if(this.rating.current != null) {
  //     this.props.getRatings({rating: this.rating.current.value});
  //   }
  // }

  getRatingOptions(){
    let ratingOptions = [];

    let options = ['No Rating','1', '2', '3', '4', '5'];

    for(const rating of options) {
      ratingOptions.push(<option key={rating}>{rating}</option>);
    }

    return ratingOptions;
  }

  setRating(){
      this.props.getRating(this.rating.current.value);
      //console.log(this.rating.current.value);
  }
  
    render() {
      return (
      
        <Form>
          <Form.Group controlId="formRatings">
            {/*<Form.Label>Rating</Form.Label>*/}
            <br></br>
            <Form.Control as="select" ref={this.rating} onClick={this.setRating}>
              {this.getRatingOptions()}
            </Form.Control>
          </Form.Group>
        </Form>
      )
    }
}

export default GetRatings;

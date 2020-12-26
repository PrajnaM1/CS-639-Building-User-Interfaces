import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, ScrollView } from 'react-native';
import { Card } from 'react-native-elements'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Dimensions } from 'react-native';
import { withNavigation } from 'react-navigation';
import moment from 'moment';

class TodayView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            goalDailyCalories: 0.0,
            goalDailyProtein: 0.0,
            goalDailyCarbohydrates: 0.0,
            goalDailyFat: 0.0,
            goalDailyActivity: 0.0,
            activities:[],
        }
        
        this.isToday = this.isToday.bind(this);
        this.calculateSum = this.calculateSum.bind(this);
        this.getExercisesCards = this.getExercisesCards.bind(this);
        this.getExercisesCard = this.getExercisesCard.bind(this);
    }


    componentDidMount() {
        //console.log('mounted')
        const { navigation } = this.props;
        // console.log('usernme', this.props.username)
        // console.log('token', this.props.accessToken)
        this._navListener = navigation.addListener("focus", () => {
            // this.setAsyn();
            // console.log("In focus lis");
            fetch('https://mysqlcs639.cs.wisc.edu/users/' + this.props.username, {
                method: 'GET',
                headers: { 'x-access-token': this.props.accessToken }
            })
                .then(res => res.json())

                .then(res => {
                    this.setState({
                        goalDailyCalories: res.goalDailyCalories,
                        goalDailyProtein: res.goalDailyProtein,
                        goalDailyCarbohydrates: res.goalDailyCarbohydrates,
                        goalDailyFat: res.goalDailyFat,
                        goalDailyActivity: res.goalDailyActivity
                    });
                //console.log('From server:', res.goalDailyActivity)
                });

            fetch('https://mysqlcs639.cs.wisc.edu/activities/', {
                method: 'GET',
                headers: { 'x-access-token': this.props.accessToken }
            })
            .then(res => res.json())
            .then(res => {
                this.setState({
                    activities: res.activities
                } );
                // console.log('activities in delete', res.activities);
            })
        });
    }

    isToday = (date) => {
        let today = new Date();
        let tday = moment(today).format("dddd");
        let tdate = moment(today).format("MMMM D, YYYY");
        console.log('TODAY Day and Date in moment', tday, ":", tdate);

        //Convert date to Date format from ISO String
        var dateStr = JSON.stringify(date);
        var dateParsed = JSON.parse(dateStr);
        date = new Date(dateParsed);

        let dday = moment(date).format("dddd");
        let ddate = moment(date).format("MMMM D, YYYY");
        console.log('DATE Day and Date in moment', dday, ":", ddate);

        let con = (tday==dday && tdate==ddate);
        console.log('condition:', con)
        console.log('Activities:', this.state.activities);

        return con;
    }

    calculateSum = () => {

        let sum=0.0;

        this.state.activities.forEach((activity) => {
            if (this.isToday(activity.date))
            {
                sum += parseFloat(activity.duration); 
            }
        })

        console.log(sum)

        return sum;
    }

    getExercisesCards(){

        let cards = [];

        this.state.activities.forEach((activity, index) => {
            // console.log('Date:',activity.date);
            if (this.isToday(activity.date)){
                cards.push(this.getExercisesCard(activity, index));
            }  
         })

         return cards;
    }

    getExercisesCard(activity, index){
        //console.log('Activity in CARD:', activity);
            return (
                    <Card key={index}>
                        <Card.Title>{activity.name}</Card.Title>
                        <Card.Divider/>
                        <View>
                            <Text>Date (UTC): {moment(activity.date).format('MMMM Do YYYY, h:mm:ss a')}</Text>
                            <Text>Duration: {activity.duration}</Text>
                            <Text>Calories Burnt: {activity.calories}</Text>
                        </View>
                        <View style={styles.space} />
                    </Card>

            );
    }
    

    render() {
        console.log(this.state.goalDailyActivity);
        return(
            <ScrollView style={styles.mainContainer} contentContainerStyle={{ flexGrow: 11, justifyContent: 'center', alignItems: "center" }}>
                <View style={styles.space} />
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                    <Ionicons name="ios-sunny" size={40} color="#900" style={{ marginRight: 20 }} />
                    <Text style={styles.bigText}>Today</Text>
                </View>
                <View style={styles.spaceSmall}></View>
                <Text>What's on the agenda today?</Text>
                <Text>Below are all of your goals and exercises.</Text>
                <View style={styles.space} />
                <Card>
                    <Card.Title>Goal Status</Card.Title>
                    <Card.Divider/>
                    <Text>Daily Activity: {this.calculateSum()}/ {this.state.goalDailyActivity} minutes</Text>
                    
                </Card>

                <View style={styles.space} />
                <View style={styles.space} />
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                    <Ionicons name="ios-fitness" size={40} color="#900" style={{ marginRight: 20 }} />
                    <Text style={styles.bigText}>Exercises</Text>
                </View>
                <View style={styles.spaceSmall} />

                <View>
                    {this.getExercisesCards()}
                </View>

                <View style={styles.space} />


            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    scrollView: {
        height: Dimensions.get('window').height
    },
    mainContainer: {
        flex: 1
    },
    scrollViewContainer: {},
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    bigText: {
        fontSize: 32,
        fontWeight: "700",
        marginBottom: 5
    },
    spaceSmall: {
        width: 20,
        height: 10,
    },
    space: {
        width: 20,
        height: 20,
    },
    spaceHorizontal: {
        display: "flex",
        width: 20
    },
    buttonInline: {
        display: "flex"
    },
    input: {
        width: 200,
        padding: 10,
        margin: 5,
        height: 40,
        borderColor: '#c9392c',
        borderWidth: 1
    },
    inputInline: {
        flexDirection: "row",
        display: "flex",
        width: 200,
        padding: 10,
        margin: 5,
        height: 40,
        borderColor: '#c9392c',
        borderWidth: 1
    }
    
});

export default withNavigation(TodayView);
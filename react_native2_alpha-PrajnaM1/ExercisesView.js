import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Dimensions } from 'react-native';
import { StyleSheet, Text, View, Button, TextInput, ScrollView, Modal} from 'react-native';
import { Card } from 'react-native-elements'
import { withNavigation } from 'react-navigation';
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";

class ExercisesView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activities: [],
            activityDuration: 0.0,
            activityCalBurnt: 0.0,
            activityName: '',
            activityDate: new Date() ,
            activityAddDate: new Date(),
            activityID: 0.0,
            modalVisible: false,
            modalVisibleEdit: false,
            mode: 'date',
            show: false,
            date: new Date(),
        }
        this.handleSaveExercise = this.handleSaveExercise.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.toggleModalEdit = this.toggleModalEdit.bind(this);
        this.getCard = this.getCard.bind(this);
        this.getCards = this.getCards.bind(this);
        this.handleDeleteExercise = this.handleDeleteExercise.bind(this);
        this.handleEditExercise = this.handleEditExercise.bind(this);
        this.setActivityName = this.setActivityName.bind(this);
        this.setActivityDuration = this.setActivityDuration.bind(this);
        this.setActivityCalories = this.setActivityCalories.bind(this);
        this.showMode = this.showMode.bind(this);
        this.showDatePicker = this.showDatePicker.bind(this);
        this.showTimePicker = this.showTimePicker.bind(this);
        this.onChange = this.onChange.bind(this);
    }


    toggleModal = (visible) => {
        this.setState({ modalVisible: visible, activityAddDate: (new Date()).toISOString()});

    }

    toggleModalEdit = (visible, activity) => {
        this.setState({ modalVisibleEdit: visible});

        this.setState({ activityName:activity.name, activityDuration: Number(activity.duration), activityCalBurnt: Number(activity.calories), activityID: Number(activity.id) , activityDate: activity.date});
    
    }

    toggleModalEditClose = (visible) =>{
        this.setState({ modalVisibleEdit: visible });
    }

    componentDidMount() {
        const { navigation } = this.props;
        this._navListener = navigation.addListener("focus", () => {
            fetch('https://mysqlcs639.cs.wisc.edu/activities/', {
                method: 'GET',
                headers: { 'x-access-token': this.props.accessToken }
            })
                .then(res => res.json())
                .then(res => {
                    this.setState({
                        activities: res.activities
                    } );
                })
        })
    }

    handleEditExercise = async(activityName, activityDuration, activityCalBurnt, index) => {
        try{
            console.log(activityName);
            console.log(index);
            let activity={};
            let url = 'https://mysqlcs639.cs.wisc.edu/activities/' + index + '/';
            let response = await fetch(url, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json',
                'x-access-token': this.props.accessToken },
                body: JSON.stringify({
                    name: activityName,
                    duration: activityDuration,
                    calories: activityCalBurnt,
                    date: this.state.date.toISOString(),
                })
            })
            let json = await response.json();
            alert('Exercise updated!');
            this.toggleModalEdit(false, activity, false);


            response = await fetch('https://mysqlcs639.cs.wisc.edu/activities/', {
                method: 'GET',
                headers: { 'x-access-token': this.props.accessToken }
            })
            json = await response.json();
            this.setState({activities: json.activities});
            console.log(json);
        }
        catch(error){
                alert("Something went wrong! Verify you have filled out the fields correctly.");
        }
    }

    handleDeleteExercise = async(index) => {
        try {
            
            let url = 'https://mysqlcs639.cs.wisc.edu/activities/' + index + '/';
        
            let response = await fetch(url, {
                method: 'DELETE',
                headers: {'x-access-token': this.props.accessToken },
            })
            let json = await response.json();
            alert('Exercise deleted!');

            response = await fetch('https://mysqlcs639.cs.wisc.edu/activities/', {
                method: 'GET',
                headers: { 'x-access-token': this.props.accessToken }
            })
            json = await response.json();
            this.setState({ activities: json.activities})

        }
        catch(error){
            alert("Something went wrong! Please try again.");
        }
        
    }

    setActivityName = (name) =>{
        this.setState({activityName: name});
    }

    setActivityDuration = (duration) =>{
        this.setState({activityDuration: duration});
    }

    setActivityCalories = (calories) =>{
        this.setState({activityCalBurnt: calories});
    }

    getCard(activity, index) {
        // console.log('1 Act:', activity);
        return (
            <View key={index}>
                <Card>
                    <Card.Title>{activity.name}</Card.Title>
                    <Card.Divider/>
                    <View>
                        <Text>Date (UTC): {moment(activity.date).format('MMMM Do YYYY, h:mm:ss a')}</Text>
                        <Text>Duration: {activity.duration}</Text>
                        <Text>Calories Burnt: {activity.calories}</Text>
                    </View>
                    
                    <View style={styles.space} />
                    <Card.Divider/>

                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center'}}>
                        <Button color="#942a21" style={styles.buttonInline} title="Edit" onPress={() => this.toggleModalEdit(true, activity)} />
                        <View style={styles.spaceHorizontal} />
                        <Button color="#942a21" style={styles.buttonInline} title="Delete" onPress={() => this.handleDeleteExercise(activity.id)} />
                    </View>

                </Card>

                <Modal animationType={"slide"} transparent={true}
                visible={this.state.modalVisibleEdit}
                onRequestClose={() => { console.log("Modal has been closed.") }}>

                    <View style={styles.modalView}>
                        <Text style={styles.bigText}>Exercise Details</Text>
                        <View>
                            <Text style={{ textAlignVertical: "center", fontWeight: "700" }}>Exercise Name</Text>
                        </View>
                        <TextInput style={styles.input}
                            underlineColorAndroid="transparent"
                            // placeholder={String(activity.name)}
                            // placeholderTextColor="#000000"
                            onChangeText={this.setActivityName}
                            value={String(this.state.activityName)}
                            autoCapitalize="none" />
                        <View style={styles.spaceSmall}></View>
                        <View>
                            <Text style={{ textAlignVertical: "center", fontWeight: "700" }}>Duration (minutes)</Text>
                        </View>
                        <TextInput style={styles.input}
                            underlineColorAndroid="transparent"
                            // placeholder={String(activity.duration)}
                            // placeholderTextColor="#000000"
                            onChangeText={this.setActivityDuration}
                            value={String(this.state.activityDuration)}
                            autoCapitalize="none" />
                        <View style={styles.spaceSmall}></View>
                        <View>
                            <Text style={{ textAlignVertical: "center", fontWeight: "700" }}>Calories Burnt</Text>
                        </View>
                        <TextInput style={styles.input}
                            underlineColorAndroid="transparent"
                            // placeholder={String(activity.calories)}
                            // placeholderTextColor="#000000"
                            onChangeText={this.setActivityCalories}
                            value={String(this.state.activityCalBurnt)}
                            autoCapitalize="none" />
                        <View style={styles.spaceSmall}></View>

                        <View>
                            <Text style={{ textAlignVertical: "center", fontWeight: "700" }}>Exercise Date and Time</Text>
                        </View>

                        <View style={styles.spaceSmall}></View>

                        <View>
                            <Text style={{ textAlignVertical: "center", fontWeight: "700" }}> {moment(this.state.activityDate).format('MMMM Do YYYY, h:mm:ss a')}</Text>
                        </View>
                        
                        <View style={styles.spaceSmall}></View>

                        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                            <Button color="#942a21" style={styles.buttonInline} title="Set Date" onPress={() => this.showDatePicker()} />
                            <View style={styles.spaceHorizontal} />
                            <Button color="#942a21" style={styles.buttonInline} title="Set Time" onPress={() => this.showTimePicker()} />
                            <View style={styles.spaceSmall} />
                        </View>
                        
                        <View style={styles.space} />
                        {this.state.show && (
                            <DateTimePicker
                                testID="dateTimePicker"
                                value={this.state.date}
                                mode={this.state.mode}
                                is24Hour={true}
                                display="default"
                                onChange={this.onChange}
                            />

                        )}

                        <Text style={{ fontWeight: "700", fontSize: 13 }}>Looks good! Do you want to save your work?</Text>
                        <View style={styles.spaceSmall} />
                        <View style={styles.spaceSmall} />

                        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                            <Button color="#942a21" style={styles.buttonInline} title="Update" onPress={() => this.handleEditExercise(this.state.activityName, this.state.activityDuration, this.state.activityCalBurnt, this.state.activityID)} />
                            <View style={styles.spaceHorizontal} />
                            <Button color="#a1635f" style={styles.buttonInline} title="Nevermind" onPress={() => { this.toggleModalEditClose(false) }} />
                        </View>
                        <View style={styles.space} />
                    </View>
                </Modal>

            </View>
          
        
        );
    }

    getCards(){
        let cards = [];
        // console.log('getCards:', this.state.activities);

            this.state.activities.forEach((activity, index) => {
                cards.push(this.getCard(activity, index));
            })

            return cards
    }


    handleSaveExercise = async () => {
        try {
            // var dateJSON = JSON.stringify(date);
            //date = date.split('"').join('');
            // console.log('Date in SAVE/POST',dateJSON);

            let response = await fetch('https://mysqlcs639.cs.wisc.edu/activities/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': this.props.accessToken
                },
                body: JSON.stringify({
                    name: this.state.activityName,
                    duration: this.state.activityDuration,
                    calories: this.state.activityCalBurnt,
                    date: this.state.date.toISOString(),
                })
            })

            let json = await response.json();

            if (this.state.activityName == '') {
                this.toggleModal(!this.state.modalVisible);
            }
            else {
                alert('Exercise added!')
                this.toggleModal(!this.state.modalVisible);
            }

            fetch('https://mysqlcs639.cs.wisc.edu/activities/', {
                method: 'GET',
                headers: { 'x-access-token': this.props.accessToken }
            })
            .then(res => res.json())
            .then(res => {
                this.setState({
                    activities: res.activities
                } );
                console.log('activities in SAVE/POST', res.activities);
            })

        }
        catch (error) {
            alert("Something went wrong! Please try again.");
        }

    }

    showMode = (currentMode) => {
        this.setState({show: true});
        this.setState({mode: currentMode});
    }

    showDatePicker = () =>{
        this.showMode('date');
    }

    showTimePicker = () =>{
        this.showMode('time');
    }

    onChange = (event, selectedDate) => {
        const currentDate = selectedDate || this.state.date;
        this.setState({show: false});
        this.setState({date: currentDate});
        this.setState({activityDate: this.state.date.toISOString()});
        this.setState({activityAddDate: this.state.date.toISOString()});
        // console.log('Show is:', this.state.show)
    }


    render() {
        return <>
            <ScrollView style={styles.mainContainer} contentContainerStyle={{ flexGrow: 11, justifyContent: 'center', alignItems: "center" }}>
                <View style={styles.space} />
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                    <Ionicons name="ios-fitness" size={40} color="#900" style={{ marginRight: 20 }} />
                    <Text style={styles.bigText}>Exercises</Text>
                </View>
                <View style={styles.spaceSmall}></View>
                <Text>Let's get to work!</Text>
                <Text>Record your exercise below:</Text>
                <View style={styles.space} />

                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                    <Button color="#942a21" title="Add Exercise" onPress={() => this.toggleModal(true)} />
                </View>
                <View style={styles.space} />

                <View style={styles.mainContainer}>
                    {this.getCards()}
                </View>
                <View style={styles.space} />

                <Modal animationType={"slide"} transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => { console.log("Modal has been closed.") }}>

                    <View style={styles.modalView}>
                        <Text style={styles.bigText}>Exercise Details</Text>
                        <View>
                            <Text style={{ textAlignVertical: "center", fontWeight: "700" }}>Exercise Name</Text>
                        </View>
                        <TextInput style={styles.input}
                            underlineColorAndroid="transparent"
                            placeholder="Jogging"
                            placeholderTextColor="#d9bebd"
                            onChangeText={(activityName) => this.setState({ activityName: activityName })}
                            // value={String(this.state.activityName)}
                            autoCapitalize="none" />
                        <View style={styles.spaceSmall}></View>
                        <View>
                            <Text style={{ textAlignVertical: "center", fontWeight: "700" }}>Duration (minutes)</Text>
                        </View>
                        <TextInput style={styles.input}
                            underlineColorAndroid="transparent"
                            placeholder="0"
                            placeholderTextColor="#d9bebd"
                            onChangeText={(activityDuration) => this.setState({ activityDuration: activityDuration })}
                            // value={String(this.state.activityDuration)}
                            autoCapitalize="none" />
                        <View style={styles.spaceSmall}></View>
                        <View>
                            <Text style={{ textAlignVertical: "center", fontWeight: "700" }}>Calories Burnt</Text>
                        </View>
                        <TextInput style={styles.input}
                            underlineColorAndroid="transparent"
                            placeholder="0"
                            placeholderTextColor="#d9bebd"
                            onChangeText={(activityCalBurnt) => this.setState({ activityCalBurnt: activityCalBurnt })}
                            // value={String(this.state.activityCalBurnt)}
                            autoCapitalize="none" />
                        <View style={styles.spaceSmall}></View>

                        <View>
                            <Text style={{ textAlignVertical: "center", fontWeight: "700" }}>Exercise Date and Time</Text>
                        </View>

                        <View style={styles.spaceSmall}></View>

                        <View>
                            <Text style={{ textAlignVertical: "center", fontWeight: "700" }}> {moment(this.state.activityAddDate).format('MMMM Do YYYY, h:mm:ss a')}</Text>
                        </View>
                        
                        <View style={styles.spaceSmall}></View>

                        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                            <Button color="#942a21" style={styles.buttonInline} title="Set Date" onPress={() => this.showDatePicker()} />
                            <View style={styles.spaceHorizontal} />
                            <Button color="#942a21" style={styles.buttonInline} title="Set Time" onPress={() => this.showTimePicker()} />
                            <View style={styles.spaceSmall} />
                        </View>
                        
                        <View style={styles.space} />
                        {this.state.show && (
                            <DateTimePicker
                                testID="dateTimePicker"
                                value={this.state.date}
                                mode={this.state.mode}
                                is24Hour={true}
                                display="default"
                                onChange={this.onChange}
                            />

                        )}

                        <Text style={{ fontWeight: "700", fontSize: 13 }}>Looks good! Do you want to save your work?</Text>
                        <View style={styles.spaceSmall} />
                        <View style={styles.spaceSmall} />

                        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                            <Button color="#942a21" style={styles.buttonInline} title="Save" onPress={() => this.handleSaveExercise()} />
                            <View style={styles.spaceHorizontal} />
                            <Button color="#a1635f" style={styles.buttonInline} title="Nevermind" onPress={() => { this.toggleModal(!this.state.modalVisible) }} />
                        </View>
                        <View style={styles.space} />
                    </View>
                </Modal>



            </ScrollView>
        </>
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
    },
    modalView: {
        marginTop: 55 ,
        marginLeft:18,
        marginRight:18,
        backgroundColor: "#FFe5b4",
        borderRadius: 20,
        padding: 20,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },

});

export default withNavigation(ExercisesView);
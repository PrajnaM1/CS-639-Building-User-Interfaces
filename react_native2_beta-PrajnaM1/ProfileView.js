import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Dimensions } from 'react-native';

class ProfileView extends React.Component {

  /**
   * Specifies the default values that will be shown for a split second
   * while data is loading in from the server.
   */
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      goalDailyCalories: 0.0,
      goalDailyProtein: 0.0,
      goalDailyCarbohydrates: 0.0,
      goalDailyFat: 0.0,
      goalDailyActivity: 0.0
    }

    this.handleSaveProfile = this.handleSaveProfile.bind(this);
    this.backToLogin = this.backToLogin.bind(this);
  }

  componentDidMount() {
      fetch('https://mysqlcs639.cs.wisc.edu/users/' + this.props.username, {
        method: 'GET',
        headers: { 'x-access-token': this.props.accessToken }
      })
        .then(res => res.json())
        .then(res => {
          this.setState({
            firstName: res.firstName,
            lastName: res.lastName,
            goalDailyCalories: res.goalDailyCalories,
            goalDailyProtein: res.goalDailyProtein,
            goalDailyCarbohydrates: res.goalDailyCarbohydrates,
            goalDailyFat: res.goalDailyFat,
            goalDailyActivity: res.goalDailyActivity
          });
        });
  }

  
  handleSaveProfile() {
    this.setState({
      goalDailyCalories: parseFloat(this.state.goalDailyCalories),
      goalDailyProtein: parseFloat(this.state.goalDailyProtein),
      goalDailyCarbohydrates: parseFloat(this.state.goalDailyCarbohydrates),
      goalDailyFat: parseFloat(this.state.goalDailyFat),
      goalDailyActivity: parseFloat(this.state.goalDailyActivity)
    }, () => fetch('https://mysqlcs639.cs.wisc.edu/users/' + this.props.username, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': this.props.accessToken
      },
      body: JSON.stringify({
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        goalDailyCalories: this.state.goalDailyCalories,
        goalDailyProtein: this.state.goalDailyProtein,
        goalDailyCarbohydrates: this.state.goalDailyCarbohydrates,
        goalDailyFat: this.state.goalDailyFat,
        goalDailyActivity: this.state.goalDailyActivity
      })
    })
      .then(res => res.json())
      .then(res => {
        alert("Your profile has been updated!");
      })
      .catch(err => {
        alert("Something went wrong! Verify you have filled out the fields correctly.");
      }));

  }

  backToLogin() {
    this.props.revokeAccessToken();
  }

  render() {
    return (
      <ScrollView style={styles.mainContainer} contentContainerStyle={{ flexGrow: 11, justifyContent: 'center', alignItems: "center" }}>
        <View style={styles.space} />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          <Icon name="male" size={40} color="#900" style={{ marginRight: 20 }} />
          <Text style={styles.bigText}>About Me</Text>
        </View>
        <View style={styles.spaceSmall}></View>
        <Text>Let's get to know you!</Text>
        <Text>Specify your information below.</Text>
        <View style={styles.space} />

        <Text style={{ textAlignVertical: "center", fontWeight: "700", fontSize: 20 }}>Personal Information</Text>
        <View style={styles.spaceSmall}></View>
        <View>
          <Text style={{ textAlignVertical: "center", fontWeight: "700" }}>First Name</Text>
        </View>
        <TextInput style={styles.input}
          underlineColorAndroid="transparent"
          placeholder="Bucky"
          placeholderTextColor="#d9bebd"
          onChangeText={(firstName) => this.setState({ firstName: firstName })}
          value={this.state.firstName}
          autoCapitalize="none" />
        <View style={styles.spaceSmall}></View>

        <View>
          <Text style={{ textAlignVertical: "center", fontWeight: "700" }}>Last Name</Text>
        </View>
        <TextInput style={styles.input}
          underlineColorAndroid="transparent"
          placeholder="Badger"
          placeholderTextColor="#d9bebd"
          onChangeText={(lastName) => this.setState({ lastName: lastName })}
          value={this.state.lastName}
          autoCapitalize="none" />
        <View style={styles.spaceSmall}></View>

        <Text style={{ textAlignVertical: "center", fontWeight: "700", fontSize: 20 }}>Fitness Goals</Text>
        <View style={styles.spaceSmall}></View>
        <View>
          <Text style={{ textAlignVertical: "center", fontWeight: "700" }}>Daily Calories (kcal)</Text>
        </View>
        <TextInput style={styles.input}
          underlineColorAndroid="transparent"
          placeholder="2200"
          placeholderTextColor="#d9bebd"
          onChangeText={(goalDailyCalories) => this.setState({ goalDailyCalories: goalDailyCalories })}
          value={this.state.goalDailyCalories + ""}
          autoCapitalize="none" />
        <View style={styles.spaceSmall}></View>
        <View>
          <Text style={{ textAlignVertical: "center", fontWeight: "700" }}>Daily Protein (grams)</Text>
        </View>
        <TextInput style={styles.input}
          underlineColorAndroid="transparent"
          placeholder="52"
          placeholderTextColor="#d9bebd"
          onChangeText={(goalDailyProtein) => this.setState({ goalDailyProtein: goalDailyProtein })}
          value={this.state.goalDailyProtein + ""}
          autoCapitalize="none" />
        <View style={styles.spaceSmall}></View>
        <View>
          <Text style={{ textAlignVertical: "center", fontWeight: "700" }}>Daily Carbs (grams)</Text>
        </View>
        <TextInput style={styles.input}
          underlineColorAndroid="transparent"
          placeholder="130"
          placeholderTextColor="#d9bebd"
          onChangeText={(goalDailyCarbohydrates) => this.setState({ goalDailyCarbohydrates: goalDailyCarbohydrates })}
          value={this.state.goalDailyCarbohydrates + ""}
          autoCapitalize="none" />
        <View style={styles.spaceSmall}></View>
        <View>
          <Text style={{ textAlignVertical: "center", fontWeight: "700" }}>Daily Fat (grams)</Text>
        </View>
        <TextInput style={styles.input}
          underlineColorAndroid="transparent"
          placeholder="35"
          placeholderTextColor="#d9bebd"
          onChangeText={(goalDailyFat) => this.setState({ goalDailyFat: goalDailyFat })}
          value={this.state.goalDailyFat + ""}
          autoCapitalize="none" />
        <View style={styles.spaceSmall}></View>
        <View>
          <Text style={{ textAlignVertical: "center", fontWeight: "700" }}>Daily Activity (mins)</Text>
        </View>
        <TextInput style={styles.input}
          underlineColorAndroid="transparent"
          placeholder="60"
          placeholderTextColor="#d9bebd"
          onChangeText={(goalDailyActivity) => this.setState({ goalDailyActivity: goalDailyActivity })}
          value={this.state.goalDailyActivity + ""}
          autoCapitalize="none" />
        <View style={styles.spaceSmall}></View>

        <View style={styles.space} />

        <Text style={{ fontWeight: "700", fontSize: 20 }}>Looks good! All set?</Text>
        <View style={styles.spaceSmall} />

        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          <Button color="#942a21" style={styles.buttonInline} title="Save Profile" onPress={() => this.handleSaveProfile()} />
          <View style={styles.spaceHorizontal} />
          <Button color="#a1635f" style={styles.buttonInline} title="Exit" onPress={() => this.backToLogin()} />
        </View>
        <View style={styles.space} />
      </ScrollView>
      
    );
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

export default ProfileView;
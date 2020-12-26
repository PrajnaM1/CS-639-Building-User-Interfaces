import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import base64 from 'react-native-base64';

export default class App extends Component {

  constructor(props){
    super(props);
    this.state = {
        username: '',
        password: '',
        token: '',
        firstName: '',
        lastName: '',
        goalDailyCalories: '',
        goalDailyProtein: '',
        goalDailyCarbohydrates: '',
        goalDailyFat: '',
        goalDailyActivity: ''
    };
    this.myTextInput1 = React.createRef();
    this.myTextInput2 = React.createRef();
  }

  handleUsername = (text) => {
    this.setState({ username: text })
  }

  handlePassword = (text) => {
    this.setState({ password: text }) 
  }

  handleSignupPress = async(username, password, {navigation}) => {
    try { 
      let response = await fetch('https://mysqlcs639.cs.wisc.edu/users', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "username": username,
          "password": password
        })
      });
      let json = await response.json();
      let msg = await json.message;
      alert(msg);
      if (msg == 'User created!'){
        this.setState({username:''});
        this.setState({password:''});
        navigation.navigate('Login');
      }

    }
    catch(error){
      console.error(error);
    }
  }

  handleLoginPress = async(username, password, {navigation}) => {
    try { 
      let response = await fetch('https://mysqlcs639.cs.wisc.edu/login', {
        method: 'GET',
        headers: {
          'Accept' : 'application/json',         
          'Content-Type' : 'application/json',         
          'Authorization' : 'Basic ' + base64.encode(username + ':' +  password)
        },
      });
      let json = await response.json();
      let tok = await json.token;
      this.setState({token: tok});

      let message = await json.message;
      if (message !== undefined){
        if (message == "Could not verify"){
          alert('Username or password is incorrect! Please try again.');
        }
        else{
          alert(message);
        }
      }
      else{
        //alert('Successfully Logged In!');
        await this.getUserDetails(this.state.username);
        navigation.navigate('Profile')
      }
      this.myTextInput1.current.clear();
      this.myTextInput2.current.clear();
      // this.setState({username:''});
      // this.setState({password:''});
    }
    catch(error){
      console.error(error);
    }
  }



  HomeScreen = ({ navigation }) => {
    return (
      <View style={styles.container}>
        <Text style={{fontSize:50, fontWeight:"bold" }}>FitnessTracker</Text>
        <Text> </Text>
        <Text style={{fontSize:18 }}>Welcome! Please login or signup to continue.</Text>
        <Text> </Text>
        <Text> </Text>
        <TextInput 
          style={styles.input}
          placeholder="Username"
          ref={this.myTextInput1}
          onChangeText={this.handleUsername}
        />
        <TextInput 
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          ref={this.myTextInput2}
          onChangeText={this.handlePassword}
        />
        <Text> </Text>
        <View style={styles.btnContainer}>
          <TouchableOpacity style={styles.userBtn} onPress={()=> this.handleLoginPress(this.state.username, this.state.password, {navigation})}>
            <Text style={styles.btnTxt}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.userBtn} onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.btnTxt}>SignUp</Text>
          </TouchableOpacity>
        </View>
        <StatusBar style="auto" />
      </View>
    );
  }

  handleNevermindPress = async({navigation}) => {
      this.setState({username:''});
      this.setState({password:''});
      navigation.navigate('Login')
  }


  SignupScreen = ({ navigation }) => {
    return (
      
        <View style={styles.container}>
          <Text style={{fontSize:50, fontWeight:"bold" }}>FitnessTracker</Text>
          <Text> </Text>
          <Text style={{fontSize:18 }}>New here? Let's get started!</Text>
          <Text style={{fontSize:18 }}>Please create an account below.</Text>
          <Text> </Text>
          <Text> </Text>
          <TextInput 
            style={styles.input}
            placeholder="Username"
            onChangeText={this.handleUsername}
          />
          <TextInput 
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            onChangeText={this.handlePassword}
          />
          <Text> </Text>
          <View style={styles.btnContainer}>
            <TouchableOpacity style={styles.userBtnSignup} onPress={()=> this.handleSignupPress(this.state.username, this.state.password, {navigation})}>
              <Text style={styles.btnTxt}>SignUp</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.userBtnSignup} onPress={() => this.handleNevermindPress({navigation})}>
              <Text style={styles.btnTxt}>Nevermind</Text>
            </TouchableOpacity>
          </View>
          <StatusBar style="auto" />
        </View>
    
    );
  }

  handleFirstName = (text) => {
    this.setState({ firstName: text }) 
  }

  handleLastName = (text) => {
    this.setState({ lastName: text }) 
  }

  handleDailyCalories = (text) => {
    this.setState({ goalDailyCalories: String(Number(text)) }) 
  }

  handleDailyProtein = (text) => {
    this.setState({ goalDailyProtein: String(text) }) 
  }

  handleDailyCarbs = (text) => {
    this.setState({  goalDailyCarbohydrates: String(text) }) 
  }

  handleDailyFat = (text) => {
    this.setState({  goalDailyFat: String(text) }) 
  }

  handleDailyActivity = (text) => {
    this.setState({  goalDailyActivity: String(text) }) 
  }

  handleSaveProfilePress = async(firstName, lastName, dailyCalories, dailyProtein, dailyCarbs, dailyFat, dailyActivity) => {
    try { 
      // console.log('In handlePress: ', this.state.username, typeof(this.state.username));
      //console.log(this.state.token);
      //console.log(firstName);
      //console.log(lastName);
      let url = 'https://mysqlcs639.cs.wisc.edu/users/' + this.state.username;
      let response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Accept' : 'application/json',         
          'Content-Type' : 'application/json',         
          'x-access-token' : this.state.token
        },
        body: JSON.stringify({
          "firstName": firstName,
          "lastName": lastName,
          "goalDailyCalories": dailyCalories,
          "goalDailyProtein": dailyProtein,
          "goalDailyCarbohydrates": dailyCarbs,
          "goalDailyFat": dailyFat,
          "goalDailyActivity": dailyActivity
        })
      });
      let json = await response.json();
      let message = await json.message;
      alert(message);
      
    }
    catch(error){
      console.error(error);
    }
  }

  getUserDetails = async(username) => {
    try { 
      // console.log('In getUserDetails: ', this.state.username, typeof(this.state.username));
      //console.log(this.state.token);
      let url  = 'https://mysqlcs639.cs.wisc.edu/users/' + username;
      let response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept' : 'application/json',         
          'Content-Type' : 'application/json',         
          'x-access-token' : this.state.token
        },
      });
      let json = await response.json();

      let message = await json.message;
      if (message !== 'Incorrect user' || message !== 'Invalid token'){
        let firstName = await json.firstName;
        //console.log(firstName);
        if (firstName == null){
          firstName = '';
        }
        //console.log(' Getting:', firstName);
        let lastName = await json.lastName;
        //console.log(lastName);
        if (lastName == null){
          lastName = '';
        }
        //console.log(' Getting:', lastName);
        //console.log(lastName);
        let goalDailyCalories = await json.goalDailyCalories;
        let goalDailyProtein = await json.goalDailyProtein;
        let goalDailyCarbohydrates = await json.goalDailyCarbohydrates;
        let goalDailyFat = await json.goalDailyFat;
        let goalDailyActivity = await json.goalDailyActivity;

        this.setState({firstName: firstName});
        this.setState({lastName: lastName});
        //console.log('firstname after setting', this.state.firstName);

        this.setState({goalDailyCalories: goalDailyCalories});
        this.setState({goalDailyProtein: goalDailyProtein});
        this.setState({goalDailyCarbohydrates: goalDailyCarbohydrates});
        this.setState({goalDailyFat: goalDailyFat});
        this.setState({goalDailyActivity: goalDailyActivity});
      }
      else{
        alert(message);
      }
    }
    catch(error){
      console.error(error);
    }
  }

  handleExitPress = async({navigation}) => {
    this.setState({username:''});
    this.setState({password:''});
    navigation.navigate('Login')
  }


  ProfileScreen = ({ navigation }) => {

    // console.log('In profileScreen', this.state.firstName);
    // console.log('In profileScreen',this.state.lastName);
    return (
      <SafeAreaView style={styles.scrollContainer}>
        <ScrollView style={styles.ScrollView}>
          <Text style={{fontSize:40, fontWeight:"bold",textAlign:'center' }}>About Me</Text>
          <Text> </Text>
          <Text style={{fontSize:15, textAlign:'center'}}>Let's get to know you!</Text>
          <Text style={{fontSize:15,  textAlign:'center'}}>Specify your information below.</Text>
          <Text> </Text>
          <Text> </Text>
          <Text style={{fontSize:25, fontWeight:"bold", textAlign:'center' }}>Personal Information</Text>
          <Text> </Text>
          <Text style={{fontSize:15, fontWeight:"bold", paddingLeft:25 }}>First Name</Text>
          <Text> </Text>
          <TextInput 
            style={styles.inputProfile}
            onChangeText={this.handleFirstName}
            defaultValue={String(this.state.firstName)}
          />
          <Text style={{fontSize:15, fontWeight:"bold", paddingLeft:25 }}>Last Name</Text>
          <Text> </Text>
          <TextInput 
            style={styles.inputProfile}
            onChangeText={this.handleLastName}
            defaultValue={String(this.state.lastName)}
          />
          <Text style={{fontSize:25, fontWeight:"bold", textAlign:'center' }}>Fitness Goals</Text>
          <Text> </Text>
          <Text style={{fontSize:15, fontWeight:"bold", paddingLeft:25 }}>Daily Calories (kcal)</Text>
          <Text> </Text>
          <TextInput 
            style={styles.inputProfile}
            defaultValue={String(Number(this.state.goalDailyCalories))}
            onChangeText={this.handleDailyCalories}
          />
          <Text style={{fontSize:15, fontWeight:"bold", paddingLeft:25 }}>Daily Protein (grams)</Text>
          <Text> </Text>
          <TextInput 
            style={styles.inputProfile}
            defaultValue={String(this.state.goalDailyProtein)}
            onChangeText={this.handleDailyProtein}
          />
          <Text style={{fontSize:15, fontWeight:"bold", paddingLeft:25 }}>Daily Carbs (grams)</Text>
          <Text> </Text>
          <TextInput 
            style={styles.inputProfile}
            defaultValue={String(this.state.goalDailyCarbohydrates)}
            onChangeText={this.handleDailyCarbs}
          />
          <Text style={{fontSize:15, fontWeight:"bold", paddingLeft:25 }}>Daily Fat (grams)</Text>
          <Text> </Text>
          <TextInput 
            style={styles.inputProfile}
            defaultValue={String(this.state.goalDailyFat)}
            onChangeText={this.handleDailyFat}
          />
          <Text style={{fontSize:15, fontWeight:"bold", paddingLeft:25 }}>Daily Activity (mins)</Text>
          <Text> </Text>
          <TextInput 
            style={styles.inputProfile}
            defaultValue={String(this.state.goalDailyActivity)}
            onChangeText={this.handleDailyActivity}
          />
          <Text style={{fontSize:25, fontWeight:"bold", textAlign:'center' }}>Looks good! All set?</Text>
          <Text> </Text>
          <Text> </Text>
          <View style={styles.btnContainerProfile}>
            <TouchableOpacity style={styles.userBtn} onPress={() => this.handleSaveProfilePress(this.state.firstName, this.state.lastName, this.state.goalDailyCalories, this.state.goalDailyProtein, this.state.goalDailyCarbohydrates, this.state.goalDailyFat, this.state.goalDailyActivity)}>
              <Text style={styles.btnTxt}>Save Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.userBtn} onPress={() => this.handleExitPress({navigation})}>
              <Text style={styles.btnTxt}>Exit</Text>
            </TouchableOpacity>
          </View>
          <Text></Text>
        </ScrollView>
      </SafeAreaView>
    );
  }

  MyStack = () => {
    const Stack = createStackNavigator();
    return (
      <Stack.Navigator>
        <Stack.Screen name="Login" component={this.HomeScreen} />
        <Stack.Screen name="SignUp" component={this.SignupScreen} />
        <Stack.Screen name="Profile" component={this.ProfileScreen} />
      </Stack.Navigator>
    );
  }

  render() {
    return (
      <NavigationContainer>
        {this.MyStack()}
      </NavigationContainer>
    );
  }

}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ADD8E6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContainer: {
    flex: 1,
    // marginTop: Constants.statusBarHeight,
    // marginBottom: 15,
    backgroundColor: '#ADD8E6',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#ADD8E6',
    marginHorizontal:20,
  },
  input: {
    width:"90%",
    padding: 10,
    marginBottom: 10,
    alignItems: 'center',
    backgroundColor: "#FFF",
    borderColor: '#D3D3D3',
    borderWidth: 3
  },
  inputProfile: {
    width:"90%",
    padding: 10,
    marginBottom: 10,
    alignItems: 'center',
    backgroundColor: "#FFF",
    borderColor: '#D3D3D3',
    borderWidth: 3,
    paddingLeft: 25,
    alignItems:'center',
    marginLeft: 20
  },
  btnContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
  },
  btnContainerProfile: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    alignItems:'center',
    paddingLeft: 25
  },
  userBtn: {
    backgroundColor: "#FFD700",
    padding: 15,
    width: "45%",
  },
  userBtnSignup: {
    backgroundColor: "#FFD700",
    padding: 15,
    width: "45%",
    // alignSelf:'center',
    // marginLeft:100,
    // marginRight:100,
  },
  btnTxt: {
    fontSize: 18,
    textAlign: "center",
  },
});

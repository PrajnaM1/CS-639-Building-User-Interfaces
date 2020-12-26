import React from 'react';

import LoginView from './LoginView';
import SignupView from './SignupView';

import TodayView from './TodayView'
import ExercisesView from './ExercisesView'
import ProfileView from './ProfileView'

import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { TouchableOpacity, Image, View, Text } from 'react-native';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      accessToken: undefined,
      username: undefined,
      sum: 0.0,
    }

    this.login = this.login.bind(this);
    this.revokeAccessToken = this.revokeAccessToken.bind(this);

    this.SignoutButton = this.SignoutButton.bind(this);
    this.profileView = this.profileView.bind(this);
    this.todayView = this.todayView.bind(this);
    this.exerciseView = this.exerciseView.bind(this);
    this.tabFunc = this.tabFunc.bind(this);
    this.setSum = this.setSum.bind(this);
  }

  login(username, accessToken) {
    this.setState({
      username: username,
      accessToken: accessToken
    });
  }

  revokeAccessToken() {
    this.setState({
      accessToken: undefined
    });
  }

  setSum = (value) => {
    this.setState({
      sum: value
    });
  }

  SignoutButton = () => {
    return <>
      <View style={{ flexDirection: 'row', marginRight: 25 }}>
        <TouchableOpacity onPress={() => this.revokeAccessToken()} accessible={true} 
          accessibilityLabel="Sign out button"
          accessibilityHint="Double tap me to sign out of the Fitness Tracker app">
          <Ionicons name="ios-log-out" size={40} color="#942a21"/>
        </TouchableOpacity>
      </View>
    </>
  }

  exerciseView = ({ navigation }) => {
    return(
        <>
         <ExercisesView navigation={ navigation } username={this.state.username} accessToken={this.state.accessToken} revokeAccessToken={this.revokeAccessToken} />
        </>
    )
}

  profileView = ({ navigation }) => {
    return(
        <>
            <ProfileView navigation={ navigation } username={this.state.username} accessToken={this.state.accessToken} revokeAccessToken={this.revokeAccessToken} />
        </>
    )

  }

  todayView = ({ navigation }) => {
    return(
        <>
            <TodayView navigation={ navigation } username={this.state.username} accessToken={this.state.accessToken} revokeAccessToken={this.revokeAccessToken}/>
        </>
    )

  }

  tabFunc = () => {
    let Tab = createBottomTabNavigator();
        return <>
            <Tab.Navigator screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Today') {
                        iconName = focused
                        ? 'ios-sunny'
                        : 'ios-sunny';
                    } else if (route.name === 'Exercises') {
                        iconName = focused ? 'ios-fitness' : 'ios-fitness';
                    } else if (route.name === 'Me') {
                        iconName = focused ? 'md-man' : 'md-man';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                    },
                })}
                tabBarOptions={{
                activeTintColor: '#942a21',
                inactiveTintColor: 'gray',
                }}
                
            >
                <Tab.Screen name="Today" component={this.todayView} />
                <Tab.Screen name="Exercises" component={this.exerciseView} />
                <Tab.Screen name="Me" component={this.profileView} />
            </Tab.Navigator>             
        </>
  }

  
  render() {

    let AuthStack = createStackNavigator();
    
    return (

      <NavigationContainer>
         
        <AuthStack.Navigator>
          {!this.state.accessToken ? (
            <>
              <AuthStack.Screen
                name="SignIn"
                options={{
                  title: 'Fitness Tracker Welcome',
                }}
              >
                {(props) => <LoginView {...props} login={this.login} />}
              </AuthStack.Screen>

              <AuthStack.Screen
                name="SignUp"
                options={{
                  title: 'Fitness Tracker Signup',
                }}
              >
                {(props) => <SignupView {...props} />}
              </AuthStack.Screen>
            </>
          ) : (
              <>
                <AuthStack.Screen 
                  name="FitnessTracker" 
                  options={{
                    headerRight: this.SignoutButton
                  }}
                  component={this.tabFunc}
                >

                </AuthStack.Screen>
              </>

            )}
        </AuthStack.Navigator> 
      </NavigationContainer>
    );
  }
}

export default App;

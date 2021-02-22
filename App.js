/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React,{useEffect,useState} from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
} from 'react-native';


import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, HeaderTitle} from '@react-navigation/stack';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import HomePageHeader from './component/HomePageHeader';
import AllProductPage from './pages/AllProductPage';
import NewProduct from './pages/NewProduct';
import ProductPage from './pages/ProductPage';
import MyProfilePage from './pages/MyProfilePage';
import CartPage from './pages/CartPage';
import NotificationPage from './pages/NotificationPage';
import SettingPage from './pages/SettingPage';
import storage from './global';
const Stack = createStackNavigator();
const App= () => {
  const [SplashVisible,setVisible]=useState(true);
  const [init,setInit]=useState('login')
  useEffect(() => {
    storage.load({
      key:'user'
    }).then(auth=>{
      if(auth.token)
      {
        setInit('home')
      }
    }).catch(e=>{

    })
    
   
  }, [])
 useEffect(() => {
  setTimeout(() => {
    setVisible(false)
    
  }, 3000);
   }, [])

  return (
    <>
       {  
        (SplashVisible === true) ?
        <View style={styles.splashscreen}>
         <Image source={require('./Images/GrowMandi_icon.jpg')}  
                  style={{width:'40%', height: '40%', resizeMode: 'contain'}} />
        <Text style={styles.splashscreen_text}>A dynamic marketplace connecting buyers and sellers</Text>        
        <Image source={require('./Images/GrowIndigo_icon.png')}  
                  style={{width:'60%', height: '60%', resizeMode: 'contain'}} />
    </View> 
    :
    <NavigationContainer >
      <Stack.Navigator initialRouteName={init}>
        <Stack.Screen name="login" component={LoginPage} options={{ headerShown: false }} />
        <Stack.Screen name="home" component={HomePage} options={{headerTitle:()=><HomePageHeader/>}}/>
        <Stack.Screen name="allproduct" component={AllProductPage} options={{headerTitle:()=><HomePageHeader/>}}   />
        <Stack.Screen name="New Product" component={NewProduct}/>
        <Stack.Screen name="Profile" component={MyProfilePage}/>
        <Stack.Screen name="Product Details" component={ProductPage}/>
        <Stack.Screen name="Notifications" component={NotificationPage}/>
        <Stack.Screen name="Cart" component={CartPage}/>
        <Stack.Screen name="Setting" component={SettingPage}/>
        
        <Stack.Screen name="Register" component={RegisterPage} options={{headerTintColor:'#fff',headerStyle:{backgroundColor:'#009999'}}}/>
      </Stack.Navigator>
    </NavigationContainer>  
       }    
    </>
  );
};
const styles = StyleSheet.create(  
  {  
    splashscreen:{
      flex:1,
      justifyContent:'space-between',
      alignItems:'center'
    },
    splashscreen_text:{
      fontSize:28,
      fontWeight:'700',
      color:'#009999',
      justifyContent:'center',
      textAlign:'center'

    }
  }); 

export default App;

import { NavigationContainer } from '@react-navigation/native';
import React,{useState,useEffect} from 'react'
import { View, Text,TouchableOpacity } from 'react-native'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
const HeaderNav = ({navigation}) => {
    return (
        <View style={{height:50,width:'100%',flexDirection:'row',justifyContent:'space-around',alignItems:'center',borderBottomColor:'#ccc',borderBottomWidth:3,borderTopColor:'#009999',borderTopWidth:3}}>
            <TouchableOpacity onPress={()=>navigation.navigate('home')} style={{flexDirection:'column',justifyContent:'center',alignItems:'center',padding:4}}>
            <FontAwesome name="home" style={{fontSize:25,color:'#009999'}}/>
            <Text style={{fontSize:10}}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>navigation.navigate('Cart')} style={{flexDirection:'column',justifyContent:'center',alignItems:'center',padding:4}}>
            <FontAwesome name="shopping-cart" style={{fontSize:25,color:'#009999'}}/>
            <Text style={{fontSize:10}}>Cart</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>navigation.navigate('allproduct')} style={{flexDirection:'column',justifyContent:'center',alignItems:'center',padding:4}}>
            <FontAwesome name="shopping-bag" style={{fontSize:25,color:'#009999'}}/>
            <Text style={{fontSize:10}}>Buy</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>navigation.navigate('New Product')}  style={{flexDirection:'column',justifyContent:'center',alignItems:'center',padding:4}}>
            <FontAwesome5 name="hand-holding-usd" style={{fontSize:25,color:'#009999'}}/>
            <Text style={{fontSize:10}}>Sell</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>navigation.navigate('Setting')} style={{flexDirection:'column',justifyContent:'center',alignItems:'center',padding:4}}>
            <AntDesign name="setting" style={{fontSize:25,color:'#009999'}}/>
            <Text style={{fontSize:10}}>Setting</Text>
            </TouchableOpacity>    
        </View>
    )
}

export default HeaderNav;

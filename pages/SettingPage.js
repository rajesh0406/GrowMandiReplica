import React from 'react'
import { View, Text,TouchableOpacity,Linking,Alert } from 'react-native'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Storage from '../global';
const SettingPage = ({navigation}) => {
    const whatsapp=()=>{
        const url = `whatsapp://send?phone=919168943563`;
    Linking.canOpenURL(url).then(supported => {
        if (supported) {
            Linking.openURL(url);
        } else {
            Alert.alert(
                'Alert',
                'WhatsApp is not installed',
            )
        }
    });
    }
    const call=()=>{
        Linking.canOpenURL('tel:+919168943563').then(supported => {
            if (supported) {
                Linking.openURL('tel:+919168943563');
            } else {
                Alert.alert(
                    'Alert',
                    'Something went wrong',
                )
            }
        });
    
    }
    const logout=()=>{
        Storage.remove({
            key:'user'
        }).then(
            navigation.navigate('login')
        ).catch(e=>{
            Alert.alert('Error','Something went wrong',[{text:'Ok'}])
        })
    }
    return (
        <View style={{flex:1}}>
           <TouchableOpacity onPress={()=>whatsapp()} style={{backgroundColor:'#009999',paddingLeft:10,margin:8,flexDirection:'row',width:'96%',height:50,borderWidth:2,borderRadius:5,borderColor:'#ccc',marginBottom:5,justifyContent:'flex-start',alignItems:'center',padding:10}}>
           <FontAwesome name="whatsapp" style={{fontSize:20,padding:8,color:'#fff'}}/>
               <Text style={{color:'#fff',fontSize:20}}>Whatsapp</Text>
           </TouchableOpacity>
           <TouchableOpacity onPress={()=>call()} style={{backgroundColor:'#009999',paddingLeft:10,margin:8,flexDirection:'row',width:'96%',height:50,borderWidth:2,borderRadius:5,borderColor:'#ccc',marginBottom:5,justifyContent:'flex-start',alignItems:'center',padding:10}}>
           <FontAwesome name="phone" style={{fontSize:20,padding:8,color:'#fff'}}/>
               <Text style={{color:'#fff',fontSize:20}}>Phone Number</Text>
           </TouchableOpacity>
           <TouchableOpacity onPress={()=>navigation.navigate('Cart')} style={{backgroundColor:'#009999',paddingLeft:10,margin:8,flexDirection:'row',width:'96%',height:50,borderWidth:2,borderRadius:5,borderColor:'#ccc',marginBottom:5,justifyContent:'flex-start',alignItems:'center',padding:10}}>
           <FontAwesome name="shopping-cart" style={{fontSize:20,padding:8,color:'#fff'}}/>
               <Text style={{color:'#fff',fontSize:20}}>Activity</Text>
           </TouchableOpacity>
           <TouchableOpacity onPress={()=>navigation.navigate('Profile')} style={{backgroundColor:'#009999',paddingLeft:10,margin:8,flexDirection:'row',width:'96%',height:50,borderWidth:2,borderRadius:5,borderColor:'#ccc',marginBottom:5,justifyContent:'flex-start',alignItems:'center',padding:10}}>
           <FontAwesome name="user-circle-o" style={{fontSize:20,padding:8,color:'#fff'}}/>
               <Text style={{color:'#fff',fontSize:20}}>Profile</Text>
           </TouchableOpacity>
           <TouchableOpacity onPress={()=>logout()} style={{backgroundColor:'#009999',paddingLeft:10,margin:8,flexDirection:'row',width:'96%',height:50,borderWidth:2,borderRadius:5,borderColor:'#ccc',marginBottom:5,justifyContent:'flex-start',alignItems:'center',padding:10}}>
           <MaterialIcons name="logout" style={{fontSize:20,padding:8,color:'#fff'}}/>
               <Text style={{color:'#fff',fontSize:20}}>Logout</Text>
           </TouchableOpacity>
        </View>
    )
}

export default SettingPage

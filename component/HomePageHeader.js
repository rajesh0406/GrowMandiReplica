import React,{useEffect,useState} from 'react'
import { View, Text,Image,Linking,Alert } from 'react-native'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import Storage from '../global';
const HomePageHeader = () => {
    const [Token,setToken]=useState("")
    const [length,setLength]=useState("");
    const [data,setData]=useState([]);
    const navigation = useNavigation();

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
    useEffect(() => {
     Storage.load({
         key:'user'
     }).then(auth=>{
         setToken(Token)
         const options={
             method:'GET',
             headers:{
                'Content-Type':'application/json',
                "Authorization":"Bearer "+auth.token,
                },
         }
         fetch('https://growmandi.herokuapp.com/myinfo',options).then(res=>res.json())
         .then(d=>{
             setData(d)
             //console.log("USer data",d.notifications)
             setLength(d.notifications.length)

         }).catch(e=>{
             console.log(e)
         })
     })
    }, [])
    return (
        <View>
            <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',}}>
            <Image source={require('../Images/GrowMandi_icon.jpg')} style={{height:25,width:25}}/>
            <View style={{flexDirection:'row',}}>
                <FontAwesome name="whatsapp"  onPress={()=>whatsapp()}  style={{fontSize:20,padding:8,color:'#009999'}}/>
                <FontAwesome name="bell" onPress={()=>navigation.navigate('Notifications',{data:data})} style={{fontSize:20,padding:8,color:'#009999'}}/>
                {
                (length)?
                <Text style={{color:'#ff0000',borderColor:'#ff0000',borderWidth:1,fontWeight:'700',marginLeft:-10,borderRadius:10,padding:1,height:20,width:20,textAlign:'center'}}>{length}</Text>
                :
                null
                }
                <FontAwesome name="phone" onPress={()=>call()} style={{fontSize:20,padding:8,color:'#009999'}}/>
            </View>

            </View>
           
        </View>
    )
}

export default HomePageHeader;

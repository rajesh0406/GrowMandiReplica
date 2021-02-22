import React,{useEffect,useState} from 'react'
import { View, Text,Image } from 'react-native'
import Storage from '../global';
const MyProfilePage = () => {
    const [User,setUser]=useState([]);
    const [count,setCount]=useState(0);
    useEffect(() => {
    Storage.load({
        key:'user'
    }).then(auth=>{
        console.log(auth.user)
        let d=JSON.parse(auth.user)
        setCount(d.my_product.length)
        setUser(d)
    })
    }, [])
    return (
        <View style={{flex:1}}>
             <Image source={{uri:User.profilePic}} style={{width:200,height:200,marginLeft:80,marginTop:10,marginBottom:3}}/>
            <Text style={{fontSize:20,fontWeight:'700',textAlign:'center'}}>{User.name}</Text>
            <View style={{width:'90%',height:200,marginLeft:40,paddingTop:30}}>
                <Text style={{fontSize:20}}>Mobile Number: <Text style={{fontSize:20,color:'#009999'}}>{User.mobile_number}</Text></Text>
                <Text style={{fontSize:20}}>State: <Text style={{fontSize:20,color:'#009999'}}>{User.state}</Text></Text>
                <Text style={{fontSize:20}}>Category: <Text style={{fontSize:20,color:'#009999'}}>{User.category}</Text></Text>
                <Text style={{fontSize:20}}>Products: <Text style={{fontSize:20,color:'#009999'}}>{count}</Text></Text>
        
            </View>
        </View>
    )
}

export default MyProfilePage

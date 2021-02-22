import React,{useState,useEffect} from 'react'
import { View, Text,Image,ScrollView,FlatList,Alert,RefreshControl,TouchableOpacity } from 'react-native'
import Storage from '../global';
import Modal from 'react-native-modal';
import * as Animatable from 'react-native-animatable';
const CartPage = () => {
    const [Data,setData]=useState([])
    const [refreshing,setRefreshing]=useState(false);
    const [Token,setToken]=useState("");
    const [isIgnoreVisible, setIgnoreVisible] = useState(false);
    const [NotId,setNotId]=useState("");
    useEffect(() => {
        Storage.load({
            key:'user'
        }).then(auth=>{
            setToken(auth.token)
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
            }).catch(e=>{
               Alert.alert('Error',"Something went wrong",[{text:'Ok'}])
            })
        }).catch(e=>{
            console.log(e)
        })
     }, [])
     const Refreshing=()=>{
        const options={
            method:'GET',
            headers:{
               'Content-Type':'application/json',
               "Authorization":"Bearer "+Token,
               },
        }
        fetch('https://growmandi.herokuapp.com/myinfo',options).then(res=>res.json())
        .then(d=>{
            setData(d)
            //let a=d.notifications[0]
            //console.log("USer data",d.notifications)
            //setLength(d.notifications.length)

        }).catch(e=>{
           Alert.alert('Error',"Something went wrong",[{text:'Ok'}])
        })
    }
    const Reload=()=>{
        const options={
            method:'GET',
            headers:{
               'Content-Type':'application/json',
               "Authorization":"Bearer "+Token,
               },
        }
        fetch('https://growmandi.herokuapp.com/myinfo',options).then(res=>res.json())
        .then(d=>{
            setData(d)
            //let a=d.notifications[0]
            //console.log("USer data",d.notifications)
            //setLength(d.notifications.length)

        }).catch(e=>{
           Alert.alert('Error',"Something went wrong",[{text:'Ok'}])
        })
    }
    const deleteEnquiry=(item)=>{
        setNotId(item._id)
        setIgnoreVisible(true)
    }
    const Enquires=()=>{
        console.log(NotId)
        const data={
            _id:NotId,
        }
        const options={
            method:'POST',
            headers:{
              'Content-Type':'application/json',
              "Authorization":"Bearer "+Token,
              },
              body:JSON.stringify(data)
        }
        fetch("https://growmandi.herokuapp.com/deleteEnquiry",options).then(res=>res.json())
        .then(data=>{
            console.log(data)
            setNotId("")
            Reload()
            setIgnoreVisible(false)
            
        }).catch(e=>{
            setNotId("")
            console.log(e)
            setIgnoreVisible(false)
        })

    }
    //console.log(Data.enquires)
    return (
        <View style={{flex:1}}>
              <ScrollView 
           
           refreshControl={
             <RefreshControl refreshing={refreshing} onRefresh={()=>Refreshing()}/>
           }
           > 
           
           
               <FlatList
           data={Data.enquires}
           renderItem={({item})=>(
               <>
               {
                   (Object.keys(item).length===5)?
                   <View style={{paddingLeft:10,margin:8,flexDirection:'column',width:'96%',maxHeight:200,borderWidth:2,borderRadius:5,borderColor:'#ccc',marginBottom:5,justifyContent:'space-between',alignItems:'flex-start'}}>
                   <Text style={{fontSize:20,fontWeight:'700'}}>
                       Enquired Details
                   </Text>
                   <Text style={{fontSize:18,fontWeight:'600'}}>
                       Product Name: <Text style={{fontSize:18,fontWeight:'600',color:'#009999'}}>
                            {item.product_name}
                       </Text>
                   </Text>
                   <Text style={{fontSize:18,fontWeight:'600'}}>
                       Mobile Number: <Text style={{fontSize:18,fontWeight:'600',color:'#009999'}}>
                            {item.mobile_number}
                       </Text>
                   </Text>
                   <Text style={{fontSize:18,fontWeight:'600'}}>
                       Message: <Text style={{fontSize:18,fontWeight:'600',color:'#009999'}}>
                            {item.message}
                       </Text>
                   </Text>
                   <View style={{flexDirection:'row',justifyContent:'space-evenly',alignItems:'center',width:'100%',marginBottom:10,marginTop:10}}>
                   <TouchableOpacity onPress={()=>deleteEnquiry(item)}  style={{backgroundColor:'#009999',width:120,height:45,borderRadius:5,justifyContent:'center',alignItems:'center',borderColor:'#ccc',borderWidth:1}}>
                            <Text style={{color:'#fff',fontSize:17}}>Delete</Text>
                        </TouchableOpacity>
                        
                   </View>
                   </View>
                   :
                   <View style={{paddingLeft:10,margin:8,flexDirection:'column',width:'96%',maxHeight:400,borderWidth:2,borderRadius:5,borderColor:'#ccc',marginBottom:5,justifyContent:'space-between',alignItems:'flex-start'}}>
                      <Text style={{fontSize:20,fontWeight:'700'}}>
                       Requested Product
                   </Text>
                   <Text style={{fontSize:18,fontWeight:'600'}}>
                       Product Name: <Text style={{fontSize:18,fontWeight:'600',color:'#009999'}}>
                            {item.product_name}
                       </Text>
                   </Text>
                   <Text style={{fontSize:18,fontWeight:'600'}}>
                       Expected Price/kg: Rs.<Text style={{fontSize:18,fontWeight:'600',color:'#009999'}}>
                            {item.cost}
                       </Text>
                   </Text> 
                   <Text style={{fontSize:18,fontWeight:'600'}}>
                       Expected Quantity(kg):<Text style={{fontSize:18,fontWeight:'600',color:'#009999'}}>
                            {item.unit}
                       </Text>
                   </Text>
                   <Text style={{fontSize:18,fontWeight:'600'}}>
                       Mobile Number: <Text style={{fontSize:18,fontWeight:'600',color:'#009999'}}>
                            {item.mobile_number}
                       </Text>
                   </Text>
                   <Text style={{fontSize:18,fontWeight:'600'}}>
                       Quality Terms: <Text style={{fontSize:18,fontWeight:'600',color:'#009999'}}>
                            {item.quality_terms}
                       </Text>
                   </Text>
                   <Text style={{fontSize:18,fontWeight:'600'}}>
                       Price valid till: <Text style={{fontSize:18,fontWeight:'600',color:'#009999'}}>
                            {item.price_validity_date}
                       </Text>
                   </Text>
                   <View style={{flexDirection:'row',justifyContent:'space-evenly',alignItems:'center',width:'100%',marginBottom:10,marginTop:10}}>
                   <TouchableOpacity   onPress={()=>deleteEnquiry(item)} style={{backgroundColor:'#009999',width:120,height:45,borderRadius:5,justifyContent:'center',alignItems:'center',borderColor:'#ccc',borderWidth:1}}>
                            <Text style={{color:'#fff',fontSize:17}}>Delete</Text>
                        </TouchableOpacity>
                        
                   </View>
                   </View>
                }
                </>
           )}
           />

           
           
           </ScrollView>
           <Modal 
            style={{justifyContent:'center',alignItems:'center'}}
            isVisible={isIgnoreVisible}
            backdropColor="#B4B3DB"
            backdropOpacity={0.8}
            animationIn="zoomInDown"
            animationOut="zoomOutUp"
            animationInTiming={600}
            animationOutTiming={600}
            backdropTransitionInTiming={600}
            backdropTransitionOutTiming={600}
            >
         <View style={{flexDirection:'column',width:'90%',height:150,padding:20,backgroundColor:'#fff',borderRadius:5}}>
         <Text style={{fontSize:18,color:'#009999'}}>Are you sure you want to delete this message ?</Text>
         <View style={{marginTop:20,flexDirection:'row',height:50,width:'100%',justifyContent:'space-evenly',alignItems:'center'}}>
             <TouchableOpacity onPress={()=>setIgnoreVisible(false)} style={{backgroundColor:'#fff',width:100,height:45,justifyContent:'center',alignItems:'center',borderRadius:5,borderColor:'#009999',borderWidth:2}}>
                    <Text style={{color:'#009999',fontSize:17}}>Cancel</Text>
                </TouchableOpacity>
            <TouchableOpacity onPress={()=>Enquires()}  style={{backgroundColor:'#fff',width:100,height:45,justifyContent:'center',alignItems:'center',borderRadius:5,borderWidth:2,borderColor:'#009999'}}>
                    <Text style={{color:'#009999',fontSize:17}}>Yes</Text>
                </TouchableOpacity>

             </View>
         </View>
        </Modal>
        </View>
    )
}

export default CartPage

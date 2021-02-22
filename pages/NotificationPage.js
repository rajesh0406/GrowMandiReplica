import React,{useState,useEffect} from 'react'
import { View, Text,FlatList,Image,TouchableOpacity,ScrollView,RefreshControl,Alert,TextInput,StyleSheet } from 'react-native'
import Storage from '../global';
import Modal from 'react-native-modal';
import * as Animatable from 'react-native-animatable';

const NotificationPage = ({navigation,route}) => {
    let {data}=route.params;
    //console.log("notification params",data)
    const [Data,setData]=useState(data)
    const [refreshing,setRefreshing]=useState(false);
    const [Token,setToken]=useState("");
    const [isEnquiryVisible, setEnquiryVisible] = useState(false);
    const [isIgnoreVisible, setIgnoreVisible] = useState(false);
    const [EnquiryNumber,setEnquiryNumber]=useState("");
    const [EnquiryMessage,setEnquiryMessage]=useState("");
    const [validnumber,setvalidnumber]=useState(true);
    const [NotId,setNotId]=useState("");
    const [sendId,setsendId]=useState("");
    const [productName,setProductName]=useState("");
    useEffect(() => {
       Storage.load({
           key:'user'
       }).then(auth=>{
           setToken(auth.token)
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
            let a=d.notifications[0]
            console.log("USer data",d.notifications)
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
    
    useEffect(() => {
        const pattern=/^[6-9][0-9]{9}$/
        console.log(EnquiryNumber.length)
        if(EnquiryNumber.length===0)
        {
            setvalidnumber(true)
            return;
        }
        if(pattern.test(EnquiryNumber))
        {
            setvalidnumber(true)
            return;
        }
        else
        {
            setvalidnumber(false)
            return;
        }
    
        return () => {
            
        }
    }, [EnquiryNumber])
    const reply=(item)=>{
        console.log(item)
        setNotId(item._id)
        setsendId(item.sender_id)
        setProductName(item.product_name)
        setEnquiryVisible(true)
        
    }
    const response=()=>{
        console.log("Res",NotId,sendId,productName,EnquiryMessage,EnquiryNumber)
        const data={
            _id:NotId,
            sender_id:sendId,
            product_name:productName,
            mobile_number:EnquiryNumber,
            message:EnquiryMessage
        }
        const options={
            method:'POST',
            headers:{
              'Content-Type':'application/json',
              "Authorization":"Bearer "+Token,
              },
              body:JSON.stringify(data)
        }
        fetch("https://growmandi.herokuapp.com/reply",options).then(res=>res.json())
        .then(data=>{
            setNotId("")
        setsendId("")
        setProductName("")
        setEnquiryVisible(false)
        Reload();
        }).catch(e=>{
            setNotId("")
            setsendId("")
            setProductName("")
            setEnquiryVisible(false)
            Alert.alert('Error','Something went wrong',[{text:'Ok'}])
        })
    }
    const ignore=(item)=>{
        setNotId(item._id)
        setIgnoreVisible(true)
    }
    const deleteMessage=(item)=>{
        console.log("Ignore",NotId)
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
        fetch("https://growmandi.herokuapp.com/ignore",options).then(res=>res.json())
        .then(data=>{
            setNotId("")
            console.log(data)
            Reload()
            setIgnoreVisible(false)
            
        }).catch(e=>{
            setNotId("")
            console.log(e)
            setIgnoreVisible(false)
        })
    }
    console.log(Data.notifications.length)
    return (
        
        <View style={{flex:1}}>
             <ScrollView 
           
           refreshControl={
             <RefreshControl refreshing={refreshing} onRefresh={()=>Refreshing()}/>
           }
           > 
           {
               (Data.notifications.length===0)?
               <Text style={{marginLeft:120,marginTop:200,fontSize:20,color:'#009999'}}>No Notifications</Text>
               :
               <FlatList
               data={Data.notifications}
               renderItem={({item})=>(
                   <>
                   {
                       (Object.keys(item).length===5)?
                       <View style={{paddingLeft:10,margin:8,flexDirection:'column',width:'96%',maxHeight:200,borderWidth:2,borderRadius:5,borderColor:'#ccc',marginBottom:5,justifyContent:'space-between',alignItems:'flex-start'}}>
                       <Text style={{fontSize:20,fontWeight:'700'}}>
                           Enquiry
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
                       <TouchableOpacity onPress={()=>reply(item)}  style={{backgroundColor:'#009999',width:120,height:45,borderRadius:5,justifyContent:'center',alignItems:'center',borderColor:'#ccc',borderWidth:1}}>
                                <Text style={{color:'#fff',fontSize:17}}>Reply</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>ignore(item)} style={{backgroundColor:'#009999',width:120,height:45,borderRadius:5,justifyContent:'center',alignItems:'center',borderColor:'#ccc',borderWidth:1}}>
                                <Text style={{color:'#fff',fontSize:17}}>Ignore</Text>
                            </TouchableOpacity>
                       </View>
                       </View>
                       :
                       <View style={{paddingLeft:10,margin:8,flexDirection:'column',width:'96%',maxHeight:400,borderWidth:2,borderRadius:5,borderColor:'#ccc',marginBottom:5,justifyContent:'space-between',alignItems:'flex-start'}}>
                          <Text style={{fontSize:20,fontWeight:'700'}}>
                           Buy Request
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
                       <TouchableOpacity   onPress={()=>reply(item)} style={{backgroundColor:'#009999',width:120,height:45,borderRadius:5,justifyContent:'center',alignItems:'center',borderColor:'#ccc',borderWidth:1}}>
                                <Text style={{color:'#fff',fontSize:17}}>Reply</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>ignore(item)} style={{backgroundColor:'#009999',width:120,height:45,borderRadius:5,justifyContent:'center',alignItems:'center',borderColor:'#ccc',borderWidth:1}}>
                                <Text style={{color:'#fff',fontSize:17}}>Ignore</Text>
                            </TouchableOpacity>
                       </View>
                       </View>
                    }
                    </>
               )}
               />
           }
       
           </ScrollView>
           <Modal 
            style={{justifyContent:'center',alignItems:'center'}}
            isVisible={isEnquiryVisible}
            backdropColor="#B4B3DB"
            backdropOpacity={0.8}
            animationIn="zoomInDown"
            animationOut="zoomOutUp"
            animationInTiming={600}
            animationOutTiming={600}
            backdropTransitionInTiming={600}
            backdropTransitionOutTiming={600}
            >
         <View style={{width:'90%',height:300,backgroundColor:'#fff',borderRadius:5}}>
             <View style={{width:'100%',height:40,backgroundColor:'#009999',justifyContent:'center',alignItems:'center'}}>
                 <Text style={{fontSize:18,color:'#fff'}}>Enquiry</Text>
             </View>
             
             <Text style={{fontSize:16,textAlign:'center',margin:5}}>Type in your question</Text>
             <TextInput value={EnquiryMessage} onChangeText={(text)=>setEnquiryMessage(text)} placeholder="Enquiry" style={{marginLeft:14,borderRadius:3,height:40,width:'90%',borderWidth:1,borderColor:'#009999'}}/>
            
             <TextInput value={EnquiryNumber} onChangeText={(text)=>setEnquiryNumber(text)} placeholder="Mobile Number" style={{marginTop:30,marginLeft:14,borderRadius:3,height:40,width:'90%',borderWidth:1,borderColor:'#009999'}}/>        
             { validnumber ? null : 
            <Animatable.View animation="fadeInLeft" duration={500}>
            <Text style={styles.errorMsg}>Phone number must have 10 digits and  start with 6-9</Text>
            </Animatable.View>
            }
             <View style={{marginTop:20,flexDirection:'row',height:50,width:'100%',justifyContent:'space-evenly',alignItems:'center'}}>
             <TouchableOpacity onPress={()=>setEnquiryVisible(false)} style={{backgroundColor:'#fff',width:100,height:45,justifyContent:'center',alignItems:'center',borderRadius:5,borderColor:'#009999',borderWidth:2}}>
                    <Text style={{color:'#009999',fontSize:17}}>Back</Text>
                </TouchableOpacity>
            <TouchableOpacity onPress={()=>response()} style={{backgroundColor:'#fff',width:100,height:45,justifyContent:'center',alignItems:'center',borderRadius:5,borderWidth:2,borderColor:'#009999'}}>
                    <Text style={{color:'#009999',fontSize:17}}>Submit</Text>
                </TouchableOpacity>

             </View>
         </View>
        </Modal>
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
            <TouchableOpacity onPress={()=>deleteMessage()} style={{backgroundColor:'#fff',width:100,height:45,justifyContent:'center',alignItems:'center',borderRadius:5,borderWidth:2,borderColor:'#009999'}}>
                    <Text style={{color:'#009999',fontSize:17}}>Yes</Text>
                </TouchableOpacity>

             </View>
         </View>
        </Modal>
        </View>
    )
}
const styles=StyleSheet.create(
    {
        errorMsg:{
            color:'#ff0000',
            fontFamily:'Roboto-Regular',
            fontSize:13,
            marginLeft:10
     
        }
    });
export default NotificationPage

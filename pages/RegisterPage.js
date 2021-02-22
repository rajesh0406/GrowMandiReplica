import React,{useState,useEffect} from 'react'
import { View, Text,StyleSheet, Image,TouchableOpacity,TextInput,ScrollView,Alert,ActivityIndicator} from 'react-native'
import Entypo from 'react-native-vector-icons/Entypo';
import {Picker} from '@react-native-picker/picker';
import Modal from 'react-native-modal';
import * as Animatable from 'react-native-animatable';
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
const RegisterPage = ({navigation}) => {
    const [profilePic,setProfilePic]=useState({name:'user_avatar',uri:'http://d22r54gnmuhwmk.cloudfront.net/public/img/default-user-avatar-dc6f2da9.gif'})
  
    const [URL,setURL]=useState(null);
    const [visible,setVisible]=useState(true);
    const [icon,setIcon]=useState('eye-with-line');
    const [isModalVisible, setModalVisible] = useState(false);
    const [isLoaderVisible, setLoaderVisible] = useState(false);
    const [name,setName]=useState("")
    const [mobile_number,setMobile_number]=useState("");
    const [State,setStates]=useState("");
    const [category,setCategory]=useState("");
    const [password,setPassword]=useState(""); 
    const [validnumber,setvalidnumber]=useState(true);
    const [validpassword,setvalidpassword]=useState(true);
    useEffect(() => {
        const pattern=/^[6-9][0-9]{9}$/
        console.log(mobile_number.length)
        if(mobile_number.length===0)
        {
            setvalidnumber(true)
            return;
        }
        if(pattern.test(mobile_number))
        {
            setvalidnumber(true)
            return;
        }
        else
        {
            setvalidnumber(false)
            return;
        }
    
      
    }, [mobile_number])
   useEffect(() => {
    if(password.length===0)
    {
        setvalidpassword(true)
        return;
    }
    if(password.length<=6 && password.length>0)
    {
        setvalidpassword(false)
        return;
    }
    else{
        setvalidpassword(true)
        return; 
    }
      
   }, [password])
    const toggleModal = () => {
        setModalVisible(!isModalVisible);
      };
    const changeVisibility=()=>{
        setVisible(!visible)
        setIcon(icon==='eye'?'eye-with-line':'eye')
    }
    const pickSingleWithCamera=()=>{
        ImagePicker.openCamera({
          width: 500,
          height: 500,
          includeExif: true,
          mediaType:'any',
        })
          .then((image) => {
            let path=image.path;
            const imageName=path.match(/[\w-]+\.(jpg|png|txt)/g);
            const obj={
                name:imageName[0],
                uri:path
            }
           setProfilePic(obj)
            console.log('received image', image);
            toggleModal();
            post();
          })
          .catch((e) => {
              alert(e)
              toggleModal();
        });
      }
      const pickSingle=(cropit=false, circular = false)=>{
        ImagePicker.openPicker({
          cropping: cropit,
          cropperCircleOverlay: circular,
          sortOrder: 'none',
          compressImageMaxWidth: 1000,
          compressImageMaxHeight: 1000,
          compressImageQuality: 1,
          compressVideoPreset: 'MediumQuality',
          includeExif: true,
          cropperStatusBarColor: 'white',
          cropperToolbarColor: 'white',
          cropperActiveWidgetColor: 'white',
          cropperToolbarWidgetColor: '#3498DB',
        })
          .then((image) => {
            console.log('received image', image);
            let path=image.path;
            const imageName=path.match(/[\w-]+\.(jpg|png|txt)/g);
            const obj={
                name:imageName[0],
                uri:path
            }
           setProfilePic(obj)
           toggleModal();
           post();
          })
          .catch((e) => {
            console.log(e);
         
            toggleModal();
          });
      }
      const post= ()=>{
        // console.log(ImgData)
           if(profilePic.length===0)
           {
             Alert.alert('Error', 'No Post selected', [
                 {text: 'Ok'}
             ]);
             return;
           }
          console.log(profilePic)
           
          storage()
          .ref(`images/${profilePic.name}`)
          .putFile(profilePic.uri)
          .then((snapshot) => {
             
           console.log(`${profilePic.name} has been successfully uploaded.`);
           getUrl()
           }).catch(e=>{
               console.log(e)
               Alert.alert('Error', 'Something went wrong.Try again', [
                {text: 'Ok'}
            ]);
           })   
         
     }
     const getUrl=()=>{
         console.log(profilePic.name)
        storage()
          .ref('images')
          .child(`${profilePic.name}`)
          .getDownloadURL().then(data=>{
              console.log("URL",data)
              const obj={
                  name:"Profile pic",
                  uri:data
              }
              setProfilePic(obj)
   
          }).catch(e=>{
              console.log(e)
              Alert.alert('Error', 'Something went wrong.Try again', [
                {text: 'Ok'}
            ]);
          })
          
          
     }
     const register=()=>{
        if(profilePic.uri==="" || category===""|| name==="" ||mobile_number===""|| password==="" ||State==="")
        {
            Alert.alert('Error', 'Enter all details', [
                {text: 'Ok'}
            ]);
            return;
        }
        setLoaderVisible(true)
        const data={
            mobile_number:mobile_number,
            password:password,
            profilePic:profilePic.uri,
            category:category,
            state:State,
            name:name,
        }
        const options={
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(data)
        } 
        fetch("https://growmandi.herokuapp.com/signup",options).then(res=>res.json())
        .then(data=>{
            setLoaderVisible(false)
            if(data.message)
            {
                Alert.alert('Error', data.message, [
                    {text: 'Ok'}
                ]);
                
                return;

            }
            navigation.navigate("login")

        }).catch(e=>{
            setLoaderVisible(false)
            Alert.alert('Error',"Something went wrong", [
                {text: 'Ok'}
            ]);
        })
     }
    return (
        <ScrollView contentContainerStyle={{flexGrow:1}}>
        <View style={{backgroundColor:'#009999',flex:1,justifyContent:'space-evenly',alignItems:'center'}}>
            <Text style={styles.title}>Grow Mandi Registration</Text>
            <Modal 
            style={{justifyContent:'center',alignItems:'center',}}
     
            isVisible={isLoaderVisible}
            backdropColor="#B4B3DB"
            backdropOpacity={0.8}
            animationIn="zoomInDown"
            animationOut="zoomOutUp"
            animationInTiming={600}
            animationOutTiming={600}
            backdropTransitionInTiming={600}
            backdropTransitionOutTiming={600}
            >
          <View style={{borderRadius:5,height:150,width:'90%',backgroundColor:'#fff',justifyContent:'space-evenly',alignItems:'center'}}>
            <ActivityIndicator size="large"  color="#009999" />
          </View>
        </Modal>
            <Modal 
            style={{justifyContent:'center',alignItems:'center',}}
     
            isVisible={isModalVisible}
            backdropColor="#B4B3DB"
            backdropOpacity={0.8}
            animationIn="zoomInDown"
            animationOut="zoomOutUp"
            animationInTiming={600}
            animationOutTiming={600}
            backdropTransitionInTiming={600}
            backdropTransitionOutTiming={600}
            >
          <View style={{borderRadius:5,height:150,width:'90%',backgroundColor:'#fff',justifyContent:'space-evenly',alignItems:'center'}}>
          <TouchableOpacity style={{flexDirection:'row',justifyContent:'center',alignItems:'center',backgroundColor:'#009999',height:35,width:'85%',borderRadius:5}}>
                <Entypo name="camera" style={{fontSize:20,color:'#fff'}}/>
               <Text style={{fontFamily:'Roboto-Regular',fontSize:15,padding:5,fontWeight:'700',color:'#fff'}} onPress={()=>pickSingleWithCamera()}>Camera</Text>
           </TouchableOpacity>
          <TouchableOpacity style={{flexDirection:'row',justifyContent:'center',alignItems:'center',backgroundColor:'#009999',height:35,width:'85%',borderRadius:5}}>
                <Entypo name="images" style={{fontSize:20,color:'#fff'}}/>
               <Text style={{fontFamily:'Roboto-Regular',fontSize:15,padding:5,fontWeight:'700',color:'#fff'}} onPress={()=>pickSingle()}>Gallery</Text>
           </TouchableOpacity>
          <TouchableOpacity style={{flexDirection:'row',justifyContent:'center',alignItems:'center',backgroundColor:'#009999',height:35,width:'85%',borderRadius:5}} onPress={()=>toggleModal()}>
               <Text style={{fontFamily:'Roboto-Regular',fontSize:15,padding:5,fontWeight:'700',color:'#fff'}} >Cancel</Text>
           </TouchableOpacity>
          </View>
        </Modal>
            <TouchableOpacity style={{overflow:'hidden',borderRadius:60,width:120,height:120,borderColor:'#fff',borderWidth:2,alignItems:'center'}} onPress={toggleModal} >
            <Image source={{uri:profilePic.uri}}
            style={{width:'100%',height:'100%'}}/>
            <Entypo name="camera" style={{fontSize:30,color:'#ccc',marginTop:-30}}/>
        </TouchableOpacity>
        <View style={{backgroundColor:'#fff',width:'90%',height:300,borderRadius:5,alignItems:'center'}}>
            <TextInput onChangeText={(text)=>setName(text)} placeholder="Enter name" style={{borderRadius:3,borderWidth:2,borderColor:'#009999',width:'95%',margin:5,color:'#009999'}} placeholderTextColor="#009999"/>
            <TextInput onChangeText={(text)=>setMobile_number(text)} placeholder="Mobile Number" style={{borderRadius:3,borderWidth:2,borderColor:'#009999',width:'95%',margin:5,color:'#009999'}} placeholderTextColor="#009999"/>
            { validnumber ? null : 
            <Animatable.View animation="fadeInLeft" duration={500}>
            <Text style={styles.errorMsg}>Phone number must have 10 digits and  start with 6-9</Text>
            </Animatable.View>
            }
         <View style={{width:'90%',flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
             <Text style={{fontSize:17,color:'#ccc',textAlign:'center'}}>State*</Text>
             <Picker
            
            selectedValue={State}
            style={{height: 50, width: 200}}
            onValueChange={(itemValue) =>
            setStates(itemValue)
            }>
            <Picker.Item label="Andhra Pradesh" value="Andhra Pradesh" />
            <Picker.Item label="Arunachal Pradesh" value="Arunachal Pradesh" />
            <Picker.Item label="Assam" value="Assam" />
            <Picker.Item label="Bihar" value="Bihar" />
            <Picker.Item label="Chhattisgarh" value="Chhattisgarh" />
            <Picker.Item label="Goa" value="Goa" />
            <Picker.Item label="Gujarat" value="Gujarat" />
            <Picker.Item label="Haryana" value="Haryana" />
            <Picker.Item label="Himachal Pradesh" value="Himachal Pradesh" />
            <Picker.Item label="Jharkhand" value="Jharkhand" />
            <Picker.Item label="Karnataka" value="Karnataka" />
            <Picker.Item label="Kerala" value="Kerala" />
            <Picker.Item label="Madhya Pradesh" value="Madhya Pradesh" />
            <Picker.Item label="Maharashtra" value="Maharashtra" />
            <Picker.Item label="Manipur" value="Manipur" />
            <Picker.Item label="Meghalaya" value="Meghalaya" />
            <Picker.Item label="Mizoram" value="Mizoram" />
            <Picker.Item label="Nagaland" value="Nagaland" />
            <Picker.Item label="Odisha" value="Odisha" />
            <Picker.Item label="Punjab" value="Punjab" />
            <Picker.Item label="Rajasthan" value="Rajasthan" />
            <Picker.Item label="Sikkim" value="Sikkim" />
            <Picker.Item label="Tamil Nadu" value="Tamil Nadu" />
            <Picker.Item label="Telangana" value="Telangana" />
            <Picker.Item label="Tripura" value="Tripura" />
            <Picker.Item label="Uttar Pradesh" value="Uttar Pradesh" />
            <Picker.Item label="Uttarakhand" value="Uttarakhand" />
            <Picker.Item label="West Bengal" value="West Bengal" />
            </Picker>
         </View>
         <View style={{width:'90%',flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
             <Text style={{fontSize:17,color:'#ccc',textAlign:'center'}}>Category*</Text>
             <Picker
            
            selectedValue={category}
            style={{height: 50, width: 200}}
            onValueChange={(itemValue) =>
            setCategory(itemValue)
            }>
            <Picker.Item label="Farmer" value="Farmer" />
            <Picker.Item label="FPO/FPC" value="FPO/FPC" />
            <Picker.Item label="Trader" value="Trader" />
            <Picker.Item label="Company" value="Company" />
            <Picker.Item label="Other" value="Other" />
           
            </Picker>
         </View>
         
        <TouchableOpacity style={styles.TogglePasswordInput}>
            <TextInput onChangeText={(text)=>setPassword(text)} placeholder="Password" secureTextEntry={visible} style={styles.TogglePasswordtext} placeholderTextColor="#009999" />
            <Entypo name={icon} onPress={changeVisibility} style={icon==='eye'?styles.eye_icon:styles.eye_line_icon}/>
        </TouchableOpacity>
        { validpassword ? null : 
            <Animatable.View animation="fadeInLeft" duration={500}>
            <Text style={styles.errorMsg}>password should have atleast 6 characters</Text>
            </Animatable.View>
            }
        <View style={styles.already_have_account}>
                <Text style={{fontSize:18,fontWeight:'600'}}>Already have an account? <Text style={{fontSize:18,fontWeight:'700',color:'#009999'}} onPress={() => navigation.navigate('login')}> Login.</Text></Text>
            </View>     
        </View>
        <TouchableOpacity style={styles.registerbutton}>
                <Text style={styles.registerbuttontext} onPress={()=>register()}>Register</Text>
            </TouchableOpacity>
        </View>
       
        </ScrollView>
    )
}
const styles =StyleSheet.create({
    errorMsg:{
        color:'#ff0000',
        fontFamily:'Roboto-Regular',
        fontSize:13,
        marginLeft:4
 
    },
title:{
    fontSize:25,
    fontWeight:'700',
    color:'#fff',
    textAlign:'center',
    margin:5
}
,TogglePasswordInput:{
    color:'#fff',
    borderColor:'#009999',
    borderWidth:2,
    borderRadius:4,
    flexDirection:'row',
    width:'95%',
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center'

},
TogglePasswordtext:{
    color:'#009999',
    flex:0.8,
    
    padding:4,

},
eye_line_icon:{
   flex:0.1,
   padding:5,
   color:'#009999',
   fontSize:18
},
eye_icon:{
flex:0.1,
padding:5,
color:'#009999',
fontSize:18
},
already_have_account:{
    margin:7,
    justifyContent:'center',
    alignItems:'center',
   },
   registerbutton:{
    borderRadius:5,
    height:40,
    borderColor:'#fff',
    borderWidth:2,
    backgroundColor:'#009999',
    width:'90%',
    justifyContent:'center',
    alignItems:'center'
},
registerbuttontext:{
    color:'#fff',
    textAlign:'center',
    fontSize:20,
    fontWeight:'700'

}

   
})
export default RegisterPage

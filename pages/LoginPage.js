import React,{useState,useEffect} from 'react'
import { View, Text,StyleSheet,Image ,TextInput,TouchableOpacity,ScrollView,ActivityIndicator, Alert} from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import Modal from 'react-native-modal';
import * as Animatable from 'react-native-animatable';
import storage from '../global';
const LoginPage = ({navigation}) => {
    const [visible,setVisible]=useState(true);
    const [icon,setIcon]=useState('eye-with-line');
    const [isLoaderVisible, setLoaderVisible] = useState(false);
    const [mobile_number,setMobile_number]=useState("");
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
    
        return () => {
            
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
       return () => {
           
       }
   }, [password])
    const changeVisibility=()=>{
        setVisible(!visible)
        setIcon(icon==='eye'?'eye-with-line':'eye')
    }
    const login=()=>{
        if(mobile_number==="" || password==="")
        {
            Alert.alert('Error', 'Enter all details', [
                {text: 'Ok'}
            ]);
            return
        }
        setLoaderVisible(true)

        const data={
            mobile_number:mobile_number,
            password:password
        }
        const options={
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(data)
        } 
        fetch("https://growmandi.herokuapp.com/login",options).then(res=>res.json())
        .then(data=>{
            console.log(data.token)
            setMobile_number("")
            setPassword("")
            setLoaderVisible(false)
            const d=JSON.stringify(data.user)
            storage.save({
                key: 'user',
                data: {
                  token:data.token,
                  user: d,
                },
                expires:null
              });
              navigation.navigate('home')

        }).catch(er=>{
            setLoaderVisible(false)
            Alert.alert('Error', 'Something went wrong.Try again', [
                {text: 'Ok'}
            ]);
           
        })
        
        
    }
    return (
        <ScrollView contentContainerStyle={{flexGrow:1}}>
        <View style={styles.login}>
        <Modal 
            style={{justifyContent:'center',alignItems:'center',opacity:0}}
     
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
          <ActivityIndicator size="large"  color="#009999" />
        </Modal>
            <Text style={styles.text}>Welcome to Grow Mandi</Text>
            <View style={{backgroundColor:'#fff',height:180,width:180,borderRadius:3,opacity:0.6,justifyContent:'center',alignItems:'center'}}>
            <Image source={require('../Images/GrowMandi_icon.jpg')}  
                  style={{width:'80%', height: '80%', resizeMode: 'contain',borderRadius:5}} />
            </View>
            <View style={{flexDirection:'column',width:'90%'}}>
            <TouchableOpacity style={styles.inputfieldbox}>
                <TextInput  placeholder="Mobile Number.." onChangeText={(text)=>setMobile_number(text)} placeholderTextColor="#fff" style={styles.inputfield} />
                <Ionicons name="person" style={styles.person_icon}/>
            </TouchableOpacity>
            { validnumber ? null : 
            <Animatable.View animation="fadeInLeft" duration={500}>
            <Text style={styles.errorMsg}>Phone number must have 10 digits and  start with 6-9</Text>
            </Animatable.View>
            }
            <TouchableOpacity style={styles.TogglePasswordInput} >
            <TextInput placeholder="Password" onChangeText={(text)=>setPassword(text)} secureTextEntry={visible} style={styles.TogglePasswordtext} placeholderTextColor="#fff" />
            <Entypo name={icon} onPress={changeVisibility} style={icon==='eye'?styles.eye_icon:styles.eye_line_icon}/>
        </TouchableOpacity>
        { validpassword ? null : 
            <Animatable.View animation="fadeInLeft" duration={500}>
            <Text style={styles.errorMsg}>password should have atleast 6 characters</Text>
            </Animatable.View>
            }
            </View>
            <View style={{flexDirection:'column',height:'20%',width:'100%',justifyContent:'space-evenly',alignItems:'center'}}>
            <TouchableOpacity style={styles.loginbutton} onPress={()=>login()}>
                <Text style={styles.loginbuttontext}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.registerbutton}>
                <Text style={styles.registerbuttontext} onPress={()=>navigation.navigate('Register')}>Register</Text>
            </TouchableOpacity>
            </View>
           
        </View>
        </ScrollView>
    )
};
const styles=StyleSheet.create(
    {
        errorMsg:{
            color:'#ff0000',
            fontFamily:'Roboto-Regular',
            fontSize:13,
            marginLeft:4
     
        },
        login:{
            flex:1,
            backgroundColor:'#009999',
            justifyContent:'space-between',
            alignItems:'center',
            
        },
        text:{
            color:'#fff',
            fontSize:25,
            fontWeight:'700',
            textAlign:'center'
        },
        inputfieldbox:{
            margin:4,
            padding:3,           
            flexDirection:'row',
            justifyContent:'space-between',
            alignItems:'center',
            borderRadius:5,
            borderColor:'#fff',
            borderWidth:2,
        
        },
        inputfield:{
            color:'#fff',
            flex:0.8,
            padding:10
        },
        person_icon:{
            fontSize:20,
            padding:7,
            color:'#fff'
        },
        TogglePasswordInput:{
            color:'#fff',
            borderColor:'#fff',
            borderWidth:2,
            borderRadius:4,
            flexDirection:'row',
            margin:4,
            padding:3,
            flexDirection:'row',
            justifyContent:'space-between',
            alignItems:'center'
    
        },
        TogglePasswordtext:{
            color:'#fff',
            flex:0.8,
            
            padding:4,
    
        },
       eye_line_icon:{
           flex:0.1,
           padding:5,
           color:'#fff',
           fontSize:18
       },
       eye_icon:{
        flex:0.1,
        padding:5,
        color:'#fff',
        fontSize:18
       },
       loginbutton:{
           borderRadius:5,
           height:40,
           backgroundColor:'#fff',
           width:'90%',
           justifyContent:'center',
           alignItems:'center'
       },
       loginbuttontext:{
           color:'#009999',
           textAlign:'center',
           fontSize:20,
           fontWeight:'700'

       },
buttons:{
    width:'100%',
    justifyContent:'center',
    alignItems:'center'
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

    }
    );
export default LoginPage;

import React,{useState} from 'react'
import { View, Text,Image,TextInput,TouchableOpacity,Alert,ScrollView,ActivityIndicator } from 'react-native'
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import Modal from 'react-native-modal';
import Entypo from 'react-native-vector-icons/Entypo';
import {Picker} from '@react-native-picker/picker';
import Storage from '../global';
const NewProduct = ({navigation}) => {
    const [profilePic,setProfilePic]=useState({name:'user_avatar',uri:''})
    const [productName,setProductName]=useState("");
    const [variety,setVariety]=useState("");
    const [category,setCategory]=useState("");
    const [quantity,setQuantity]=useState("");
    const [price,setPrice]=useState("");
    const [availability_date,setAvailabilityDate]=useState("");
    const [expiry_date,setExpiryDate]=useState("");
    const [location,setLocation]=useState("");
    const [isModalVisible, setModalVisible] = useState(false);
    const [isLoaderVisible, setLoaderVisible] = useState(false);
    const [isImageLoaderVisible, setImageLoaderVisible] = useState(false);
    const toggleModal = () => {
        setModalVisible(!isModalVisible);
      };
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
          setImageLoaderVisible(true)
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
           setImageLoaderVisible(false)
           }).catch(e=>{
               console.log(e)
               setImageLoaderVisible(false)
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
                 uri:data
             }
             setProfilePic(obj)
             
         }).catch(e=>{
             console.log(e)
           
         })    
    }
    const uploadProduct=()=>{
        if(productName==="" || category===""|| variety===""||price===""||quantity===""||availability_date===""||expiry_date===""||location===""||profilePic.uri==="")
        {
            Alert.alert('Error', 'Enter all details', [
                {text: 'Ok'}
            ]);
            return;
        }
        Storage.load({
            key:'user'
        }).then(auth=>{
            const user=JSON.parse(auth.user)
            setLoaderVisible(true)
            const data={
               product_name:productName,
               category:category,
               variety:variety,
               price:price,
               quantity:quantity,
               availability_date:availability_date,
               expiry_date:expiry_date,
               location:location,
               product_image:profilePic.uri,
               quality_certificate:"None"
            }
            const options={
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                    "Authorization":"Bearer "+auth.token
                },
                body:JSON.stringify(data)
            } 
            fetch("https://growmandi.herokuapp.com/new_product",options).then(res=>res.json())
            .then(data=>{
                setLoaderVisible(false)
                console.log(data)
                navigation.navigate('home')
            }).catch(e=>{
                setLoaderVisible(false)
                Alert.alert('Error','Something went wrong',[{text:'Ok'}])
            })
        })
       
    }
    return (
     <ScrollView contentContainerStyle={{flexGrow:1}}>
          <View style={{backgroundColor:'#009999',flex:1,justifyContent:'space-evenly',alignItems:'center'}}>
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
            <Text style={{fontSize:20,fontWeight:'600'}}>Please wait.Uploading Product</Text>
            <ActivityIndicator size="large"  color="#0095F6" />
          </View>
        </Modal>
        

        <TouchableOpacity style={{overflow:'hidden',margin:5,borderRadius:60,width:120,height:120,borderColor:'#fff',borderWidth:2,alignItems:'center'}} onPress={toggleModal} >
            <Image source={{uri:profilePic.uri}}style={{width:'100%',height:'100%'}}/>
            
            {
                (isImageLoaderVisible)
                ?
                <ActivityIndicator size="large" style={{position:'absolute',marginTop:40}} color="#ff0000" />
                :
                null
            }
            <Entypo name="camera" style={{fontSize:30,color:'#ccc',marginTop:-30}}/>
            
        </TouchableOpacity>
        <View style={{backgroundColor:'#fff',width:'90%',borderRadius:5,alignItems:'center'}}>
        <TextInput placeholder="Enter product Name" onChangeText={(text)=>setProductName(text)} value={productName} style={{borderRadius:3,borderWidth:2,borderColor:'#009999',width:'95%',margin:5,color:'#009999'}} placeholderTextColor="#009999"/>
            <TextInput placeholder="Enter variety" onChangeText={(text)=>setVariety(text)} value={variety} style={{borderRadius:3,borderWidth:2,borderColor:'#009999',width:'95%',margin:5,color:'#009999'}} placeholderTextColor="#009999"/>
            <View style={{width:'90%',flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
             <Text style={{fontSize:17,color:'#ccc',textAlign:'center'}}>Category*</Text>
             
            <Picker
            
            selectedValue={category}
            style={{height: 50, width: 200}}
            onValueChange={(itemValue) =>
            setCategory(itemValue)
            }>
            <Picker.Item label="Grain and pulses" value="Grain and pulses" />
            <Picker.Item label="Fruits" value="Fruits" />
            <Picker.Item label="Vegetable" value="Vegetable" />
            <Picker.Item label="Flowers" value="Flowers" />
            <Picker.Item label="Oil and seeds" value="Oil and seeds" />
           
            </Picker>
            </View>
            <TextInput placeholder="Enter quantity" onChangeText={(text)=>setQuantity(text)} value={quantity} style={{borderRadius:3,borderWidth:2,borderColor:'#009999',width:'95%',margin:5,color:'#009999'}} placeholderTextColor="#009999"/>
            <TextInput placeholder="Enter price" onChangeText={(text)=>setPrice(text)} value={price} style={{borderRadius:3,borderWidth:2,borderColor:'#009999',width:'95%',margin:5,color:'#009999'}} placeholderTextColor="#009999"/>
            <TextInput placeholder="Enter availability date" onChangeText={(text)=>setAvailabilityDate(text)} value={availability_date} style={{borderRadius:3,borderWidth:2,borderColor:'#009999',width:'95%',margin:5,color:'#009999'}} placeholderTextColor="#009999"/>
            <TextInput placeholder="Enter expiry date" onChangeText={(text)=>setExpiryDate(text)} value={expiry_date} style={{borderRadius:3,borderWidth:2,borderColor:'#009999',width:'95%',margin:5,color:'#009999'}} placeholderTextColor="#009999"/>
            <TextInput placeholder="Enter location" onChangeText={(text)=>setLocation(text)} value={location} style={{borderRadius:3,borderWidth:2,borderColor:'#009999',width:'95%',margin:5,color:'#009999'}} placeholderTextColor="#009999"/>
            <TouchableOpacity onPress={()=>uploadProduct()} style={{borderRadius:5,height:40,borderColor:'#fff',borderWidth:2,backgroundColor:'#009999',width:'95%',justifyContent:'center',alignItems:'center'}}>
                <Text style={{ color:'#fff',textAlign:'center',fontSize:20,fontWeight:'700'}} >Add Product</Text>
            </TouchableOpacity>
         
            </View>
          </View>

     </ScrollView>
    )
}

export default NewProduct

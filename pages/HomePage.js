import React,{useRef,useEffect,useState} from 'react';
import { View, Text,Image,TouchableOpacity,FlatList,Dimensions, } from 'react-native';
import HomeNav from '../component/HeaderNav';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Storage from '../global';
const Fullwidth=Dimensions.get('screen').width;

const HomePage = ({navigation}) => {
    const images = [
        'https://themindunleashed.com/wp-content/uploads/2016/10/Organic-Farm-Rajasthan-copy.jpg',
        'https://newsabode.com/wp-content/uploads/2020/02/India_crops_2_Fig_7._Farmer_taught_recording_obervations.jpg_Credit_Rajib_Sharma.jpg',
        'http://doerlife.com/wp-content/uploads/2019/09/Subash-Palekar-Image-Credits-Grin.jpeg',
        'https://tse2.mm.bing.net/th?id=OIP.IiSre66w96Cm72JNVRz4gAHaEZ&pid=Api&P=0&w=296&h=176',
      ];
    let CurrentSlide = 0;
    let IntervalTime = 4000;
    let timerId=null;
    let sliderRef=useRef();
    const [userCount,setUserCount]=useState(0);
    const [productCount,setProductCount]=useState(0);
    useEffect(() => {
       Storage.load({
           key:'user'
       }).then(auth=>{
        const options={
            method:'GET',
            headers:{
               'Content-Type':'application/json',
               "Authorization":"Bearer "+auth.token,
               },
        }
        fetch('https://growmandi.herokuapp.com/count',options).then(res=>res.json())
        .then(data=>{
            setUserCount(data.users.length)
            setProductCount(data.products.length)

        }).catch(e=>{
            console.log(e)
        })
       })
    }, [])
    useEffect(() => {
        startAutoPlay()
        return () => {
          stopAutoPlay()
        }
    }, [])
    const goToNextPage = () => {
        if (CurrentSlide >= images.length-1) CurrentSlide = -1;
        
        sliderRef.current.scrollToIndex({
          index: ++CurrentSlide,
          animated: true,
        });
      };
      const startAutoPlay = () => {
        timerId = setInterval(goToNextPage, IntervalTime);
      };
      const stopAutoPlay = () => {
        if (timerId) {
          clearInterval(timerId);
          timerId = null;
        }
      };
   
    return (
        <View style={{flex:1}}>
            <HomeNav navigation={navigation}/>
           <FlatList
           style={{width:Fullwidth,height:170,padding:0,marginBottom:70}}
           horizontal={true}
           data={images}
           renderItem={({item})=>(
               <Image
               source={{uri: item}}
               style={{width:Fullwidth,height:170}}
               />
           )}
           ref={sliderRef}
           />
           <View style={{width:'100%',height:250}}>
               <View style={{flexDirection:'row',justifyContent:'space-evenly',alignItems:'center',marginBottom:10}}>
               <TouchableOpacity onPress={()=>navigation.navigate('allproduct')}  style={{justifyContent:'center',alignItems:'center',width:100,height:100,color:'#000',backgroundColor:'#6600cc',borderRadius:5}}>
               <FontAwesome name="shopping-bag" style={{fontSize:30,color:'#fff'}}/>
            <Text style={{fontSize:14,color:'#fff'}}>Buy product</Text>
               </TouchableOpacity>
               <TouchableOpacity onPress={()=>navigation.navigate('New Product')}  style={{justifyContent:'center',alignItems:'center',width:100,height:100,color:'#000',backgroundColor:'#00ccff',borderRadius:5}}>
               <FontAwesome5 name="hand-holding-usd" style={{fontSize:30,color:'#fff'}}/>
            <Text style={{fontSize:14,color:'#fff'}}>Sell product</Text>
               </TouchableOpacity>
               </View>
              
               <View style={{flexDirection:'row',justifyContent:'space-evenly',alignItems:'center'}}>
               <TouchableOpacity  style={{justifyContent:'center',alignItems:'center',width:100,height:100,color:'#000',backgroundColor:'#ffcc00',borderRadius:5}}>
               <FontAwesome5 name="people-arrows" style={{fontSize:30,color:'#fff'}}/>
            <Text style={{fontSize:14,color:'#fff'}}>Enquiry</Text>
               </TouchableOpacity>
               <TouchableOpacity onPress={()=>navigation.navigate('Cart')} style={{justifyContent:'center',alignItems:'center',width:100,height:100,color:'#000',backgroundColor:'#00cc66',borderRadius:5}}>
               <FontAwesome name="user-circle-o" style={{fontSize:30,color:'#fff'}}/>
            <Text style={{fontSize:14,color:'#fff'}}>Activity</Text>
               </TouchableOpacity> 
               </View>
           </View>
           <View style={{justifyContent:'center',alignItems:'center',width:'95%',height:70,margin:10,flexDirection:'column',borderRadius:4,borderWidth:1,borderColor:'#009999'}}>
               <Text  style={{color:'#009999',fontSize:15}}><Text style={{color:'#ff6600',fontSize:15}}>{userCount}</Text> Sellers onboard</Text>
               <Text  style={{color:'#009999',fontSize:15}}><Text style={{color:'#ff6600',fontSize:15}}>{productCount}</Text> Products listed till today</Text>
            

           </View>
          
        </View>
    )
}

export default HomePage
/* <FlatList
           horizontal
           data={data}
           renderItem={({item})=>(
               <Image source={{uri:data[0]}} isH/>
           )}
           style={{width:'100%',height:100}}
           />*/
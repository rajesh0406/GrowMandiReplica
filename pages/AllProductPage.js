import React,{useState,useEffect} from 'react'
import { View, Text,TextInput,TouchableOpacity,StyleSheet,Image,FlatList,ActivityIndicator,Alert} from 'react-native'
import HeaderNav from '../component/HeaderNav';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Picker} from '@react-native-picker/picker';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Storage from '../global';
import Modal from 'react-native-modal';
import * as Animatable from 'react-native-animatable';
const AllProductPage = ({navigation}) => {
    const [sortOrder,setSortOrder]=useState(true);
    const [searchFilter,setSearchFilter]=useState("product_name")
    const [data,setData]=useState([]);
    const [filteredData,setFilteredData]=useState([])
    const [SearchText,setSearchText]=useState("");
    const [User,setUser]=useState([]);
    const [Token,setToken]=useState("");
    const [isLoaderVisible, setLoaderVisible] = useState(false);
    const [isEnquiryVisible, setEnquiryVisible] = useState(false);
    const [isRequestVisible, setRequestVisible] = useState(false);
    const [productName,setProductName]=useState("");
    const [SellId,setSellId]=useState("");
    const [EnquiryNumber,setEnquiryNumber]=useState("");
    const [EnquiryMessage,setEnquiryMessage]=useState("");
    const [EnquiredProduct,setEnquiredProduct]=useState([]);
    const [validnumber,setvalidnumber]=useState(true);
    const [BuyCost,setBuyCost]=useState("")
    const [BuyQuantity,setBuyQuantity]=useState("")
    const [BuyTerms,setBuyTerms]=useState("")
    const [BuyValidDate,setBuyValidDate]=useState("")
    const [BuyRequestProduct,setBuyRequestProduct]=useState([])
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
    useEffect(() => {
        Storage.load({
            key:'user'
        }).then(auth=>{
            const d=JSON.parse(auth.user)
            setUser(d)
            setToken(auth.token)
            const options={
                method:'GET',
                headers:{
                    'Content-Type':'application/json',
                    "Authorization":"Bearer "+auth.token
              },
            }
    
            fetch("https://growmandi.herokuapp.com/all_product",options).then(res=>res.json())
            .then(data=>{
                console.log(data)
                setData(data)
                setFilteredData(data.reverse())
            }).catch(e=>{
                console.log(e)
                Alert.alert("Error","Something went error.Try again",[{text:'Ok'}])
            }) 

        })
       
    }, [])
    const returnAscending=()=>{
        return (
            <>
            <MaterialIcon name="order-alphabetical-ascending" style={{fontSize:20,color:'#009999'}}/>
            <Text style={{fontSize:10,color:'#009999',fontWeight:'700'}}>ASC</Text>
            </>

        );

    }
    const returnDescending=()=>{
        return (
            <>
            <MaterialIcon name="order-alphabetical-descending" style={{fontSize:20,color:'#009999'}}/>
            <Text style={{fontSize:10,color:'#009999',fontWeight:'700'}}>DESC</Text>
            </>

        );

    }
  useEffect(() => {
      if(SearchText)
      {
          const newData=data.filter((item)=>{
             // console.log("filter",item.product_name)
              let pname=item[searchFilter]
              const element=pname.toUpperCase()
              const NewSearchText=SearchText.toUpperCase()
              return element.indexOf(NewSearchText)>-1
          })
          setFilteredData(newData);
          return;

      }
      else
      {
          setFilteredData(data)
          return;
      }
    
  }, [SearchText])
  useEffect(() => {
      setFilteredData(filteredData.reverse())
  }, [sortOrder])
  const buyrequest=(Pname,Sid,prod)=>{
      setBuyRequestProduct(prod)
      setProductName(Pname)
      setSellId(Sid)
      setRequestVisible(true)
  }
  const enquiry=(Pname,Sid,prod)=>{
    setEnquiredProduct(prod)
    setProductName(Pname)
    setSellId(Sid)
    setEnquiryVisible(true)
  }
  const postEnquiry=()=>{
      if(productName==="" || SellId==="" || EnquiryNumber==="" || EnquiryMessage==="")
      {
          Alert.alert('Error','Enter all details',[{text:'ok'}])
          return;
      }
      console.log(productName,SellId,EnquiryMessage,EnquiryNumber,EnquiredProduct)
      const data={
          seller_id:SellId,
          product_name:productName,
          message:EnquiryMessage,
          mobile_number:EnquiryNumber,
          enquired_product:EnquiredProduct
      }
      console.log(Token)
      const options={
          method:'POST',
          headers:{
            'Content-Type':'application/json',
            "Authorization":"Bearer "+Token,
            },
            body:JSON.stringify(data)
      }
      fetch('https://growmandi.herokuapp.com/product_enquiry',options).then(res=>res.json())
      .then(data=>{
          
          setEnquiryMessage("")
          setEnquiryNumber("")
          setEnquiredProduct([])
          setEnquiryVisible(false)
          
      }).catch(e=>{
        Alert.alert('Error','Something went wrong',[{text:'Ok'}])
          setEnquiryMessage("")
          setEnquiryNumber("")
          setEnquiredProduct([])
          setEnquiryVisible(false)
      })
  }
  const BuyRequest=()=>{
      if(productName==="" || SellId==="" || BuyTerms==="" || BuyValidDate==="" || BuyCost==="" || BuyQuantity==="")
      {
          Alert.alert('Error','Enter all details',[{text:'ok'}])
          return;
      }
      //console.log(productName,SellId,EnquiryMessage,EnquiryNumber,EnquiredProduct)
      const data={
          seller_id:SellId,
          product_name:productName,
          cost:BuyCost,
          unit:BuyQuantity,
          price_validity_date:BuyValidDate,
          quality_terms:BuyTerms,
          mobile_number:EnquiryNumber,
          buy_request_product:BuyRequestProduct          
      }
      console.log(Token)
      const options={
          method:'POST',
          headers:{
            'Content-Type':'application/json',
            "Authorization":"Bearer "+Token,
            },
            body:JSON.stringify(data)
      }
      fetch('https://growmandi.herokuapp.com/product_buy_request',options).then(res=>res.json())
      .then(data=>{
         setBuyTerms("")
         setBuyCost("")
         setBuyQuantity("")
         setBuyValidDate("")
         setBuyRequestProduct("")
         setRequestVisible(false)
          
      }).catch(e=>{
        setBuyTerms("")
        setBuyCost("")
        setBuyQuantity("")
        setBuyValidDate("")
        setBuyRequestProduct("")
        setRequestVisible(false)
        Alert.alert('Error','Something went wrong',[{text:'Ok'}])
   
      })
  }
    return (
        <View style1={{flex:1}}>
            <HeaderNav navigation={navigation}/>   
            <View style={{flexDirection:'row',justifyContent:'space-evenly',alignItems:'center',width:'100%',height:50,borderColor:'#009999',borderWidth:1}}>
                <Text style={{fontSize:15,fontWeight:'700'}}>Products</Text>
                <TextInput value={SearchText} onChangeText={(text)=>setSearchText(text)} placeholder="Search.." style={{borderWidth:1,borderColor:'#009999',width:150,height:'75%',borderRadius:5}}/>
                <View style={{flexDirection:'column'}}>
                    <Text style={{fontSize:12,color:'#009999'}}>Filter by</Text>
                <Picker
            style={{height: 20, width: 50}}
            onValueChange={(itemValue) =>{
            //console.log(itemValue)
            setSearchFilter(itemValue)
            }
            }>
            <Picker.Item label="Select" value="product_name" />
            <Picker.Item label="Crop Name" value="product_name" />
            <Picker.Item label="Category" value="category" />
            </Picker>
                </View>
                <TouchableOpacity style={{flexDirection:'column',justifyContent:'center',alignItems:'center'}} onPress={()=>setSortOrder(!sortOrder)}>
                {
                (sortOrder)?
                returnAscending()
                :
                returnDescending()
                }
                </TouchableOpacity>
            </View>
            <Modal 
            style={{justifyContent:'center',alignItems:'center'}}
            isVisible={isRequestVisible}
            backdropColor="#B4B3DB"
            backdropOpacity={0.8}
            animationIn="zoomInDown"
            animationOut="zoomOutUp"
            animationInTiming={600}
            animationOutTiming={600}
            backdropTransitionInTiming={600}
            backdropTransitionOutTiming={600}
            >
         <View style={{width:'90%',height:450,backgroundColor:'#fff',borderRadius:5}}>
             <View style={{width:'100%',height:40,backgroundColor:'#009999',justifyContent:'center',alignItems:'center'}}>
                 <Text style={{fontSize:18,color:'#fff'}}>Buy Request</Text>
             </View>
             <Text style={{fontSize:16,margin:5,textAlign:'center'}}>Product: <Text style={{fontSize:16,color:'#009999'}}>{productName}</Text></Text>
             <Text style={{fontSize:16,margin:5,textAlign:'center'}}>I want to buy this product at rate</Text>
             <View style={{flexDirection:'row',justifyContent:'space-evenly',alignItems:'center'}}>
             <TextInput onChangeText={(text)=>setBuyCost(text)} placeholder="cost/kg (Rs)" style={{borderRadius:3,height:40,width:120,borderWidth:1,borderColor:'#009999'}}/>
             <TextInput onChangeText={(text)=>setBuyQuantity(text)}  placeholder="quantity (kg)" style={{borderRadius:3,height:40,width:120,borderWidth:1,borderColor:'#009999'}}/>
             </View>
            
             <Text style={{fontSize:16,textAlign:'center',margin:5}}>Above price will be valid till</Text>
             <TextInput onChangeText={(text)=>setBuyValidDate(text)}  placeholder="Date (dd/mm/yy)" style={{marginLeft:14,borderRadius:3,height:40,width:'90%',borderWidth:1,borderColor:'#009999'}}/>
             <TextInput value={EnquiryNumber} onChangeText={(text)=>setEnquiryNumber(text)} placeholder="Mobile Number" style={{marginTop:30,marginLeft:14,borderRadius:3,height:40,width:'90%',borderWidth:1,borderColor:'#009999'}}/>        
             { validnumber ? null : 
            <Animatable.View animation="fadeInLeft" duration={500}>
            <Text style={styles.errorMsg}>Phone number must have 10 digits and  start with 6-9</Text>
            </Animatable.View>
            }
             <Text style={{fontSize:16,textAlign:'center',margin:5}}>My Quality Terms</Text>
             <TextInput onChangeText={(text)=>setBuyTerms(text)}  placeholder="Terms" style={{marginLeft:14,borderRadius:3,height:40,width:'90%',borderWidth:1,borderColor:'#009999'}}/>        
             <View style={{marginTop:20,flexDirection:'row',height:50,width:'100%',justifyContent:'space-evenly',alignItems:'center'}}>
             <TouchableOpacity onPress={()=>setRequestVisible(!isRequestVisible)} style={{backgroundColor:'#fff',width:100,height:45,justifyContent:'center',alignItems:'center',borderRadius:5,borderColor:'#009999',borderWidth:1}}>
                    <Text style={{color:'#009999',fontSize:17}}>Back</Text>
                </TouchableOpacity>
            <TouchableOpacity onPress={()=>BuyRequest()} style={{backgroundColor:'#fff',width:100,height:45,justifyContent:'center',alignItems:'center',borderRadius:5,borderWidth:1,borderColor:'#009999'}}>
                    <Text style={{color:'#009999',fontSize:17}} >Submit</Text>
                </TouchableOpacity>

             </View>
         </View>
        </Modal>
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
             <TouchableOpacity onPress={()=>setEnquiryVisible(!isEnquiryVisible)} style={{backgroundColor:'#fff',width:100,height:45,justifyContent:'center',alignItems:'center',borderRadius:5,borderColor:'#009999',borderWidth:2}}>
                    <Text style={{color:'#009999',fontSize:17}}>Back</Text>
                </TouchableOpacity>
            <TouchableOpacity onPress={()=>postEnquiry()} style={{backgroundColor:'#fff',width:100,height:45,justifyContent:'center',alignItems:'center',borderRadius:5,borderWidth:2,borderColor:'#009999'}}>
                    <Text style={{color:'#009999',fontSize:17}}>Submit</Text>
                </TouchableOpacity>

             </View>
         </View>
        </Modal>
        {
            (filteredData.length)?
            <FlatList
            data={filteredData}
            renderItem={({item})=>{
                
                return(
                    <View style={{margin:8,flexDirection:'column',width:'96%',height:200,borderWidth:2,borderRadius:5,borderColor:'#ccc',marginBottom:5,justifyContent:'space-between',alignItems:'flex-start'}}>
                    <Text style={{fontSize:18,fontWeight:'700',paddingLeft:20,paddingTop:5}}>{item.product_name}</Text>
                    <View style={{justifyContent:'space-evenly',alignItems:'center',flexDirection:'row',height:120,width:'100%'}}>
                        <Image source={{uri:item.product_image}} style={{width:100,height:100}}/>
                        <View style={{flexDirection:'column',justifyContent:'flex-start',alignItems:'center',height:70,width:135}}>
                            <Text style={{fontSize:17}}>Quantity: {item.quantity}</Text>
                            <Text style={{fontSize:17}}>Price: {item.price}</Text>
                            <Text style={{fontSize:17}}>Category: {item.category}</Text>
                            <TouchableOpacity onPress={()=>navigation.navigate('Product Details',{productdata:JSON.stringify(item)})}>
                            <Text style={{fontSize:17,color:'#009999'}} >More Details</Text>
                            </TouchableOpacity>
                            
                        </View>
                        <View style={{width:50,height:50}}>
                        </View>
                    </View>
                    {
                        (item.seller_id!==User._id)?
                        <View style={{flexDirection:'row',justifyContent:'space-evenly',alignItems:'center',width:'100%',height:45}}>
                        <Text style={{fontSize:15,color:'#009999'}}>{item.available_flag}</Text>
                        <TouchableOpacity onPress={()=>buyrequest(item.product_name,item.seller_id,item)} style={{backgroundColor:'#009999',width:120,height:35,borderRadius:3,justifyContent:'center',alignItems:'center',borderColor:'#ccc',borderWidth:1}}>
                            <Text style={{color:'#fff',fontSize:15}}>Buy Request</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>enquiry(item.product_name,item.seller_id,item)} style={{backgroundColor:'#009999',width:120,height:35,borderRadius:3,justifyContent:'center',alignItems:'center',borderColor:'#ccc',borderWidth:1}}>
                            <Text style={{color:'#fff',fontSize:15}}>Enquiry</Text>
                        </TouchableOpacity>
                    </View>
                    :
                    <View style={{flexDirection:'row',justifyContent:'space-evenly',alignItems:'center',width:'100%',height:45}}>

                    </View>
                    }
                   
                    </View>
                )
            }}
            keyExtractor={(item)=>item._id}
            />
            :
            <ActivityIndicator size="large" color='#009999' style={{marginTop:150}}/>
        }
            
                
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
export default AllProductPage;

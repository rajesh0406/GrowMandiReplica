import React,{useEffect,useState} from 'react'
import { View, Text,Image,TextInput,TouchableOpacity,StyleSheet,Alert } from 'react-native'
import Storage from '../global';
import Modal from 'react-native-modal';
import * as Animatable from 'react-native-animatable';
const ProductPage = ({navigation,route}) => {
    const [User,setUser]=useState([]);
    const [Token,setToken]=useState("");
    const [isLoaderVisible, setLoaderVisible] = useState(false);
    const [isEnquiryVisible, setEnquiryVisible] = useState(false);
    const [isRequestVisible, setRequestVisible] = useState(false);
    const [productName,setProductName]=useState("");
    const [EnquiryNumber,setEnquiryNumber]=useState("");
    const [EnquiryMessage,setEnquiryMessage]=useState("");
    const [validnumber,setvalidnumber]=useState(true);
    const [BuyCost,setBuyCost]=useState("")
    const [BuyQuantity,setBuyQuantity]=useState("")
    const [BuyTerms,setBuyTerms]=useState("")
    const [BuyValidDate,setBuyValidDate]=useState("")

    let {productdata}=route.params;
    productdata=JSON.parse(productdata)
    
    useEffect(() => {
        Storage.load({
            key:'user'
        }).then(auth=>{
            const d=JSON.parse(auth.user)
            setUser(d)
            setToken(auth.token)
        }).catch(e=>{
            console.log(e)
        })
    }, [])
    //console.log(productdata._id)
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
    const postEnquiry=()=>{
        if(EnquiryNumber==="" || EnquiryMessage==="")
        {
            Alert.alert('Error','Enter all details',[{text:'ok'}])
            return;
        }
        //console.log(productName,SellId,EnquiryMessage,EnquiryNumber,EnquiredProduct)
        const data={
            seller_id:productdata.seller_id,
            product_name:productdata.product_name,
            message:EnquiryMessage,
            mobile_number:EnquiryNumber,
            enquired_product:productdata
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
        .then(d=>{
            setEnquiryMessage("")
            setEnquiryNumber("")
            setEnquiryVisible(false)
            
        }).catch(e=>{
          Alert.alert('Error','Something went wrong',[{text:'Ok'}])
            setEnquiryMessage("")
            setEnquiryNumber("")
            setEnquiryVisible(false)
        })
    }
    const BuyRequest=()=>{
        if( BuyTerms==="" || BuyValidDate==="" || BuyCost==="" || BuyQuantity==="")
        {
            Alert.alert('Error','Enter all details',[{text:'ok'}])
            return;
        }
        //console.log(productName,SellId,EnquiryMessage,EnquiryNumber,EnquiredProduct)
        const data={
            seller_id:productdata.seller_id,
            product_name:productdata.product_name,
            cost:BuyCost,
            unit:BuyQuantity,
            price_validity_date:BuyValidDate,
            quality_terms:BuyTerms,
            mobile_number:EnquiryNumber,
            buy_request_product:productdata         
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
           setRequestVisible(false)
            
        }).catch(e=>{
          setBuyTerms("")
          setBuyCost("")
          setBuyQuantity("")
          setBuyValidDate("")
          setRequestVisible(false)
          Alert.alert('Error','Something went wrong',[{text:'Ok'}])
        })
    }
    return (
        <View style={{flex:1}}>
            <Image source={{uri:productdata.product_image}} style={{width:200,height:200,marginLeft:80,marginTop:10,marginBottom:3}}/>
            <Text style={{fontSize:20,fontWeight:'700',textAlign:'center'}}>{productdata.product_name}</Text>
            <View style={{width:'90%',height:200,marginLeft:40,paddingTop:30}}>
                <Text style={{fontSize:20}}>Variety: <Text style={{fontSize:20,color:'#009999'}}>{productdata.variety}</Text></Text>
                <Text style={{fontSize:20}}>Quantity: <Text style={{fontSize:20,color:'#009999'}}>{productdata.quantity}</Text></Text>
                <Text style={{fontSize:20}}>Price: <Text style={{fontSize:20,color:'#009999'}}>{productdata.price}</Text></Text>
                <Text style={{fontSize:20}}>Availability Date: <Text style={{fontSize:20,color:'#009999'}}>{productdata.availability_date}</Text></Text>
                <Text style={{fontSize:20}}>Expiry Date: <Text style={{fontSize:20,color:'#009999'}}>{productdata.expiry_date}</Text></Text>
                <Text style={{fontSize:20}}>Quality Certificate: <Text style={{fontSize:20,color:'#009999'}}>{productdata.quality_certificate}</Text></Text>
            </View>
            {(productdata.seller_id!==User._id)?
             <View style={{flexDirection:'row',justifyContent:'space-evenly',alignItems:'center',width:'80%',height:50,marginLeft:40,marginTop:30}}>
             <TouchableOpacity onPress={()=>setRequestVisible(true)} style={{backgroundColor:'#009999',width:140,height:45,borderRadius:3,justifyContent:'center',alignItems:'center',borderRadius:5}}>
                     <Text style={{color:'#fff',fontSize:17}}>Buy Request</Text>
                 </TouchableOpacity>
             <TouchableOpacity onPress={()=>setEnquiryVisible(true)} style={{backgroundColor:'#009999',width:140,height:45,borderRadius:3,justifyContent:'center',alignItems:'center',borderRadius:5}}>
                     <Text style={{color:'#fff',fontSize:17}}>Enquiry</Text>
                 </TouchableOpacity>
             </View>
             :
             null
            }
           
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
             <TextInput onChangeText={(text)=>setBuyCost(text)} placeholder="cost (Rs)" style={{borderRadius:3,height:40,width:120,borderWidth:1,borderColor:'#009999'}}/>
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
             <TouchableOpacity onPress={()=>setRequestVisible(false)} style={{backgroundColor:'#fff',width:100,height:45,justifyContent:'center',alignItems:'center',borderRadius:5,borderColor:'#009999',borderWidth:1}}>
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
             <TouchableOpacity onPress={()=>setEnquiryVisible(false)} style={{backgroundColor:'#fff',width:100,height:45,justifyContent:'center',alignItems:'center',borderRadius:5,borderColor:'#009999',borderWidth:2}}>
                    <Text style={{color:'#009999',fontSize:17}}>Back</Text>
                </TouchableOpacity>
            <TouchableOpacity onPress={()=>postEnquiry()} style={{backgroundColor:'#fff',width:100,height:45,justifyContent:'center',alignItems:'center',borderRadius:5,borderWidth:2,borderColor:'#009999'}}>
                    <Text style={{color:'#009999',fontSize:17}}>Submit</Text>
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
export default ProductPage;
/*  const postEnquiry=()=>{
        if(productName==="" || SellId==="" || EnquiryNumber==="" || EnquiryMessage==="")
        {
            Alert.alert('Error','Enter all details',[{text:'ok'}])
            return;
        }
        //console.log(productName,SellId,EnquiryMessage,EnquiryNumber,EnquiredProduct)
        const data={
            seller_id:productdata.seller_id,
            product_name:productdata.product_name,
            message:EnquiryMessage,
            mobile_number:EnquiryNumber,
            enquired_product:productdata
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
        .then(d=>{
            
            setEnquiryMessage("")
            setEnquiryNumber("")
           
            setEnquiryVisible(false)
            
        }).catch(e=>{
          Alert.alert('Error','Something went wrong',[{text:'Ok'}])
            setEnquiryMessage("")
            setEnquiryNumber("")
            
            setEnquiryVisible(false)
        })
    }
    const BuyRequest=()=>{
        if( BuyTerms==="" || BuyValidDate==="" || BuyCost==="" || BuyQuantity==="")
        {
            Alert.alert('Error','Enter all details',[{text:'ok'}])
            return;
        }
        //console.log(productName,SellId,EnquiryMessage,EnquiryNumber,EnquiredProduct)
        const data={
            seller_id:productdata.seller_id,
            product_name:productdata.product_name,
            cost:BuyCost,
            unit:BuyQuantity,
            price_validity_date:BuyValidDate,
            quality_terms:BuyTerms,
            mobile_number:EnquiryNumber,
            buy_request_product:productdata         
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
         
           setRequestVisible(false)
            
        }).catch(e=>{
          setBuyTerms("")
          setBuyCost("")
          setBuyQuantity("")
          setBuyValidDate("")
        
          setRequestVisible(false)
          Alert.alert('Error','Something went wrong',[{text:'Ok'}])
     
        })
    }*/
/*  <Modal 
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
             <TextInput onChangeText={(text)=>setBuyCost(text)} placeholder="cost (Rs)" style={{borderRadius:3,height:40,width:120,borderWidth:1,borderColor:'#009999'}}/>
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
        </Modal>*/
        /* const buyrequest=(Pname,Sid)=>{
       
        setProductName(Pname)
        setSellId(Sid)
        setRequestVisible(true)
    }
    const enquiry=(Pname,Sid)=>{
     
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
        //console.log(productName,SellId,EnquiryMessage,EnquiryNumber,EnquiredProduct)
        const data={
            seller_id:SellId,
            product_name:productName,
            message:EnquiryMessage,
            mobile_number:EnquiryNumber,
            enquired_product:productdata
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
           
            setEnquiryVisible(false)
            
        }).catch(e=>{
          Alert.alert('Error','Something went wrong',[{text:'Ok'}])
            setEnquiryMessage("")
            setEnquiryNumber("")
            
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
            buy_request_product:productdata         
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
         
           setRequestVisible(false)
            
        }).catch(e=>{
          setBuyTerms("")
          setBuyCost("")
          setBuyQuantity("")
          setBuyValidDate("")
        
          setRequestVisible(false)
          Alert.alert('Error','Something went wrong',[{text:'Ok'}])
     
        })
    }*/
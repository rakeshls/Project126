import *as React from 'react'
import {Button,Image,View,Platform} from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import * as Permissions from 'expo-permissions'
export default class ImagePrediction extends React.Component{
    state = {
        image: null
    }
    getPermission = async()=>{
        if(!Platform.OS==='web'){
            const {status}=await Permissions.askAsync(Permissions.CAMERA_ROLL)
            if(status!=='granted'){
                alert('Sorry we need premission')
            }
        }
    }
    uploadImage = async(uri)=>{
        const data = new FormData()
        let filename = uri.split('/')[uri.split('/').length-1]
        let type = `image/${uri.split('.')[uri.split('.').length-1]}`
        const filetoupload = {
            uri : uri,
            name : filename,
            type :type
        }
        data.append('alphabet',filetoupload)
        fetch('http://b56b-115-96-216-22.ngrok.io/predict-alphabet', {
            mode:'no-cors',
            method:'POST',
            body:data,
            headers : {
                'content-type':'multipart/form-data',
            }
        })
        .then((response)=>response.json())
        .then((result)=>{
            console.log("success:",result)
        })
        .catch((error)=>{
            console.log("error:",error)
        })
    }
    pickImage = async()=>{
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes:ImagePicker.MediaTypeOptions.All,
                allowsEditing : true,
                aspect : [4,3],
                quality:1
            })
            if(!result.cancelled){
                this.setState({
                    image : result.data
                })
                this.uploadImage(result.uri)
            }
        } catch (error) {
            console.log(error)
        }
    }
    componentDidMount(){
        this.getPermission()
    }
    render(){
        let{image}=this.state
        return(
            <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                <Button title='Select An Image'
                onPress={this.pickImage}
                >                    
                </Button>
            </View>
        )
    }
}
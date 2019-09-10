import React from "react";
import {
  Platform,
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Keyboard,
  TextInput,
  Dimensions,
  Text
} from "react-native";
import { Input, Button } from 'react-native-elements'

import { Ionicons } from "@expo/vector-icons";
import { Stitch, RemoteMongoClient } from "mongodb-stitch-react-native-sdk";
// import Confetti from "react-native-confetti";



var height = Dimensions.get("window").height;
var width = Dimensions.get("window").width;
const emptyState={
  text: "",
  buttonLoading: false,
  error: true
}

export default class AddNewLesson extends React.Component {
    static navigationOptions = {
        title: '',
        headerStyle: {
            borderBottomWidth: 0,
            shadowColor: 'transparent',
          }
      };
  
    constructor(props) {
    super(props);
    this.state = {
      // value: false,
      text: "",
      buttonLoading: false,
      error: true
    };
  }
  componentDidMount(){

  }

 

  handleSubmit = (classId) => {
    Keyboard.dismiss();
    const stitchAppClient = Stitch.defaultAppClient;
    const mongoClient = stitchAppClient.getServiceClient(
      RemoteMongoClient.factory,
      "mongodb-atlas"
    );
    const db = mongoClient.db("smartedu");
    const lessons = db.collection("lessons");
    // const classes = db.collection("classes")
    const lesson = {
        title: this.state.text,
        class: classId
    }
    if (this.state.text != "") {
        this.setState({ buttonLoading: true });

        lessons
        .insertOne({
          ...lesson
        })
        .then((lesson) => {
            
            let lessonId = lesson.insertedId
            console.log("the new lesson id is ")
            console.log(lessonId)
            console.log("belonging to class")
            console.log(lesson['class'])
            // classes
            // .findOneAndUpdate(
            //     {_id: classId },  
            //     {$push:{ lessons:lessonId}} 
            // ).then((res)=>{
            //     console.log('update class successfully')
            //     console.log(res)
                this.setState({ ...emptyState });
                // // go to next page
                this.props.navigation.goBack()
            // }).catch(err => {
            //     console.warn(err);
            //   });
        })
        .catch(err => {
          console.warn(err);
        });
    }else{
      this.setState({error: true})
    }
  };

  

  render() {
    const { navigation } = this.props;
    const classId = navigation.getParam('classId', 'NO-ID')
    console.log("add lesson page render")
    console.log(classId)

    return (
      <View style={styles.container}>
        {/* <Confetti
          confettiCount={50}
          timeout={10}
          duration={2000}
          ref={node => (this._confettiView = node)}
        /> */}
        {/* <Title text="新建班级"/> */}
        <View style={{marginTop: height/4-60}}>
        <Input
          placeholder="请输入本节课程名称"
          leftIcon={{ name: "class", color: "#909090" }}
          leftIconContainerStyle={{marginRight:8}}
          label="新建课程"
          labelStyle={{color:"black", fontSize: 32, fontWeight: "bold",  marginTop: 8,
          marginBottom: 20,}}
          onChangeText={text => {
              this.setState({ text })
              this.setState({error: false})
              console.log(text)
        }}
          value={this.state.text}
          onSubmitEditing={() => this.handleSubmit()}
        />
        {this.state.error? 
            (<Text style={{marginLeft: 8, marginTop: 16, color: "red"}}>请输入课程名称</Text>) 
            : (<Text style={{marginLeft: 8, marginTop: 16, color: "red"}}> </Text>)}
        <View style={{flexDirection:"row", marginTop: 16}}>
            <Button 
                title="取消"
                type="clear"
                buttonStyle={{width:width/2}}
                titleStyle={{textAlign:'left'}}
                onPress={() => this.props.navigation.goBack()}
            />
            <Button 
                // icon={{name: "arrow-forward", color: "#4089D6", size:16}}
                title="确认"
                type="clear"
                onPress={() => this.handleSubmit(classId)}
                buttonStyle={{width:width/2}}
                titleStyle={{textAlign:'right'}}
                loading={this.state.buttonLoading}
            />
        </View>
        <ScrollView
          contentContainerStyle={{ flex: 1 }}
          keyboardShouldPersistTaps="handled"
        />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginLeft: 16,
    marginRight: 16
  }
});
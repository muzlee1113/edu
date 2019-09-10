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

export default class AddNewClass extends React.Component {
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
  handleSubmit = () => {
    Keyboard.dismiss();
    const stitchAppClient = Stitch.defaultAppClient;
    const mongoClient = stitchAppClient.getServiceClient(
      RemoteMongoClient.factory,
      "mongodb-atlas"
    );
    const db = mongoClient.db("smartedu");
    const classes = db.collection("classes");
    if (this.state.text != "") {
        this.setState({ buttonLoading: true });
        classes
        .insertOne({
          title: this.state.text,
        })
        .then(() => {
        //   if (this._confettiView) {
        //     this._confettiView.startConfetti();
        //   }
          this.props.navigation.navigate("AddStudents",{ fromWhere: 'Class' })
          // this.setState({ value: !this.state.value });
          this.setState({ ...emptyState });
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
          placeholder="请输入1-15字班级名称"
          leftIcon={{ name: "school", color: "#909090" }}
          leftIconContainerStyle={{marginRight:8}}
          label="新建班级"
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
            (<Text style={{marginLeft: 8, marginTop: 16, color: "red"}}>请输入班级名称</Text>) 
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
                onPress={() => this.handleSubmit()}
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
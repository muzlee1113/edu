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
  Text,
  Picker,
  ActivityIndicator
} from "react-native";
import { Input, Button } from 'react-native-elements'
import { Stitch, RemoteMongoClient } from "mongodb-stitch-react-native-sdk";
import RNPickerSelect, { defaultStyles } from 'react-native-picker-select';
import { Ionicons } from '@expo/vector-icons';
import MultiSelect from 'react-native-multiple-select';


var height = Dimensions.get("window").height;
const emptyText = {
  nameText: "",
  birthdayText: "",
  gradeText: "",
  schoolText: "",
  parentText: "",
  phoneText: "",
  buttonOneLoading: false,
  buttonTwoLoading: false,
  error: true,
  loading: false,
  selectedItems: [],
}


export default class AddStudents extends React.Component {
  static navigationOptions = {
    title: '',
    headerRight: (
      <Button
        title="批量添加"
        type='clear'
        titleStyle={{ fontSize: 16 }}
      //   onPress={()=>navigation.navigate("AddNewClass")}
      />),
    headerStyle: {
      borderBottomWidth: 0,
      shadowColor: 'transparent',

    }
  };

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      nameText: "",
      birthdayText: "",
      gradeText: "",
      schoolText: "",
      parentText: "",
      phoneText: "",
      buttonOneLoading: false,
      buttonTwoLoading: false,
      error: true,
      classes: [],
      selectedClass: [],
      // passedSelectedClass: false,
      selectedClassName: ''
    };
  }
  componentDidMount() {
    this._loadClasses();
    let {classId, className} = this.props.navigation.state.params
    if(classId){
      console.log('=======tryingh to set selected class to '  + classId + ' =====')
      console.log('class name is ' + className)
      this.setState({
        selectedClass: [...this.state.selectedClass, classId],
        selectedClassName: className
      })
    }
  }

  _loadClasses() {
    this.setState({ loading: true })
    console.log("loading classes")
    const stitchAppClient = Stitch.defaultAppClient;
    const mongoClient = stitchAppClient.getServiceClient(
      RemoteMongoClient.factory,
      "mongodb-atlas"
    );
    const db = mongoClient.db("smartedu");
    const classes = db.collection("classes");
    classes
      .find({})
      .asArray()
      .then(docs => {
        this.setState({ classes: [...docs],loading: false });
      })
      .catch(err => {
        console.warn(err);
      });
  }

  handleSubmit = (navTo) => {
    Keyboard.dismiss();
    const stitchAppClient = Stitch.defaultAppClient;
    const mongoClient = stitchAppClient.getServiceClient(
      RemoteMongoClient.factory,
      "mongodb-atlas"
    );
    const db = mongoClient.db("smartedu");
    const students = db.collection("students");
    // const classes = db.collection("classes");
    let newStudent = {
      name: this.state.nameText,
      birthday: this.state.birthdayText,
      grade: this.state.gradeText,
      school: this.state.schoolText,
      parent: this.state.parentText,
      phone: this.state.phoneText,
      class: this.state.selectedClass[0] || ''
    }
    console.log('========here are the new student data========')
    console.log(newStudent)
    console.log('========we are navigating to========')
    console.log(navTo)
   
    if (this.state.nameText != "") {
      this.setState({
        [navTo === 'AddNewStudents' ? 'buttonOneLoading' : 'buttonTwoLoading']: true,
        error: false,
      })
      
      // upload data to database
      students
        .insertOne({
          ...newStudent
        })
        .then((data) => {
          console.log('successfully add a new student, here are the data')
          console.log(data)
          // Add student to class
          // if(newStudent.class){
          //   classes.findOneAndUpdate({_id: newStudent.class}, {$push:{ students: data.insertedId}})
          //   .then((data)=>{
          //     console.log('successfully add a new student to class ' + newStudent.class)
          //     console.log(data)
          //     this.setState({
          //       ...emptyText
          //     })
          //     this.navOut(navTo)
          //   })
          //   .catch(err=>{
          //     console.log(err)
          //   })
          // }else{
          //   this.setState({
          //     ...emptyText
          //   })
          //   this.navOut(navTo)
          // }
          this.setState({
            ...emptyText
          })
          this.navOut(navTo)
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      this.setState({ error: true })
    }
  };

  onSelectedItemsChange = selectedItems => {
    this.setState({ selectedClass: selectedItems })
  };

  navOut = navTo => {
    if (navTo === 'AddNewStudents') {
    } else {
      console.log("navigating to " + navTo)
      this.props.navigation.goBack()
    }
  }




  render() {
    const { navigation, classId } = this.props;
    const fromWhere = navigation.getParam('fromWhere', 'NO-WHERE')
    const {selectedClass, classes} = this.state
    console.log('after render, class id from props is ')
    console.log(classId)



    return (
      this.state.loading ? (
        <View style={[styles.loadingContainer, styles.horizontal]}>
          <ActivityIndicator size="small" color="#0000ff" />
        </View>
      ) : (
          <ScrollView style={styles.container}>
            <Input
              placeholder="姓名"
              leftIcon={{ name: "person", color: "#909090" }}
              leftIconContainerStyle={{ marginRight: 8 }}
              label="增加学生"
              labelStyle={{
                color: "black", fontSize: 32, fontWeight: "bold", marginTop: 8,
                marginBottom: 20,
              }}
              onChangeText={text => {
                this.setState({ nameText: text })
                this.setState({ error: false })
              }}
              value={this.state.nameText}
              onSubmitEditing={() => this.handleSubmit()}
            />
            <Input
              placeholder="出生年月日"
              leftIcon={{ name: "cake", color: "#909090" }}
              leftIconContainerStyle={{ marginRight: 8 }}
              onChangeText={text => {
                this.setState({ birthdayText: text })
              }}
              value={this.state.birthdayText}
              onSubmitEditing={() => this.handleSubmit()}
            />
            <Input
              placeholder="年级"
              leftIcon={{ name: "grade", color: "#909090" }}
              leftIconContainerStyle={{ marginRight: 8 }}
              onChangeText={text => {
                this.setState({ gradeText: text })
              }}
              value={this.state.gradeText}
              onSubmitEditing={() => this.handleSubmit()}
            />
            <Input
              placeholder="学校"
              leftIcon={{ name: "school", color: "#909090" }}
              leftIconContainerStyle={{ marginRight: 8 }}
              onChangeText={text => {
                this.setState({ schoolText: text })
              }}
              value={this.state.schoolText}
              onSubmitEditing={() => this.handleSubmit()}
            />
            <Input
              placeholder="父母"
              leftIcon={{ name: "people", color: "#909090" }}
              leftIconContainerStyle={{ marginRight: 8 }}
              onChangeText={text => {
                this.setState({ parentText: text })
              }}
              value={this.state.parentText}
              onSubmitEditing={() => this.handleSubmit()}
            />
            <Input
              placeholder="父母联系方式"
              leftIcon={{ name: "phone", color: "#909090" }}
              leftIconContainerStyle={{ marginRight: 8 }}
              onChangeText={text => {
                this.setState({ phoneText: text })
              }}
              value={this.state.phoneText}
              onSubmitEditing={() => this.handleSubmit()}
            />
            {/* <Input
              placeholder="班级"
              leftIcon={{ name: "class", color: "#909090" }}
              leftIconContainerStyle={{ marginRight: 8 }}
              value={this.state.selectedClass}
              onSubmitEditing={() => this.handleSubmit()}
            /> */}
            {this.state.selectedClassName?(
            <View style={styles.displayTextContainer}>
              <Text style={styles.displayText}>班级: {this.state.selectedClassName}</Text>
              {/* <Text style={styles.displayText}>{this.state.selectedClassName}</Text> */}
            </View>):(<MultiSelect
              // hideTags
              single={true}
              items={classes}
              uniqueKey="_id"
              ref={(component) => { this.multiSelect = component }}
              onSelectedItemsChange={this.onSelectedItemsChange}
              selectedItems={selectedClass}
              selectText="班级"
              searchInputPlaceholderText="搜索班级名"
              searchInputStyle={pickerSelectStyles.searchText}
              onChangeInput={ (text)=> console.log(text)}
              fontSize={18}
              tagRemoveIconColor="#4089D6"
              tagBorderColor="#4089D6"
              tagTextColor="#4089D6"
              selectedItemTextColor="#4089D6"
              selectedItemIconColor="#4089D6"
              itemTextColor="#CFCFD3"
              displayKey="title"
              searchInputStyle={{ color: '#4089D6' }}
              submitButtonColor="#4089D6"
              submitButtonText="完成"
              removeSelected
              styleMainWrapper={pickerSelectStyles.wrapper}
              styleInputGroup={pickerSelectStyles.inputContainer}
              textInputProps={pickerSelectStyles.inputText}
              itemFontSize={18}
              iconSearch={true}
              textColor = '#CFCFD3'
              selectedTextColor = '#000'
              leftIconName = 'account-group'
            />)}
            {this.state.error ?
              (<Text style={{ marginLeft: 8, marginTop: 16, color: "red" }}>请输入学生姓名</Text>)
              : (<Text style={{ marginLeft: 8, marginTop: 16, color: "red" }}> </Text>)}
            <View style={{ alignItems: "flex-end", marginTop: 16 }}>
              <Button
                title="确认并继续添加"
                type="clear"
                onPress={() => this.handleSubmit('AddNewStudents')}
                loading={this.state.buttonOneLoading}
              />
              <Button
                title="确认并返回"
                type="clear"
                onPress={() => this.handleSubmit(fromWhere)}
                loading={this.state.buttonTwoLoading}
              />
              <Button
                title="取消"
                type="clear"
                onPress={() => this.props.navigation.goBack()}
              />
              <ScrollView
                contentContainerStyle={{ flex: 1 }}
                keyboardShouldPersistTaps="handled"
              />
            </View>
          </ScrollView>)
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginLeft: 16,
    marginRight: 16
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center'
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10
  },
  displayTextContainer:{
    marginLeft: 8,
    marginTop: 8,
  },
  displayText:{
    fontSize: 18
  }
});

const pickerSelectStyles = StyleSheet.create({
  wrapper: {
    marginLeft: 8,
    marginRight: 8
  },
  dropdownText: {
    fontSize: 18
  },
  inputContainer: {
    borderBottomColor: '#86939e',
    paddingHorizontal: 16,
    paddingVertical: 8
  },
  searchText:{
    fontSize: 18
  },
  inputText:{
    fontSize: 18,
    // color: '#e6e6e6'
  }
});
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
import { Ionicons } from '@expo/vector-icons';
import MultiSelect from 'react-native-multiple-select';



var height = Dimensions.get("window").height;
const emptyText = {
  loading: false,
  selectedStudent: '',
}

export default class SelectStudents extends React.Component {
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
      error: true,
      students: [],
      selectedItems: [],
      buttonLoading: false
      // selectedStudent: '',
      // studentsPickerData: []
      //
      //   favSport4:''
    };
  }
  componentDidMount() {
    this._loadStudents();

  }

  _loadStudents() {

    this.setState({ loading: true })
    console.log("loading students")
    const stitchAppClient = Stitch.defaultAppClient;
    const mongoClient = stitchAppClient.getServiceClient(
      RemoteMongoClient.factory,
      "mongodb-atlas"
    );
    const db = mongoClient.db("smartedu");
    const students = db.collection("students");
    students
      .find({})
      .asArray()
      .then(docs => {
        console.log("=======get students to fill picker!!!=========")
        this.setState({
          students: [...docs],
          loading: false
        })
      })
      .catch(err => {
        console.warn(err);
      });
  }



  handleSubmit = (classId) => {
    Keyboard.dismiss();
    console.log("HANDLE SUBMIT!!!")

    const stitchAppClient = Stitch.defaultAppClient;
    const mongoClient = stitchAppClient.getServiceClient(
      RemoteMongoClient.factory,
      "mongodb-atlas"
    );
    const db = mongoClient.db("smartedu");
    const students = db.collection("students");
    // const classes = db.collection("classes")
    console.log(this.state.selectedItems)
    if (this.state.selectedItems != []) {
      this.setState({
        buttonLoading: true
      })

      this.state.selectedItems.map(studentId => {
        console.log('looking for a student ' + studentId + ' by Id and update')
        students.findOneAndUpdate(
          { _id: studentId },
          { $set: { class: classId } }
        ).then((data) => {
          console.log("successfully add class to student " + studentId + ' to class ' + classId)
          console.log(data)
          this.setState({
            buttonLoading: false
          })
          this.props.navigation.goBack()
        })
          .catch(err => {
            console.log(err)
          })
      })

      // classes
      //   .findOneAndUpdate(
      //     { _id: classId },
      //     { $push: { students: { $each: [...this.state.selectedItems] } } }
      //   ).then((data) => {
         
      //     console.log(data)
      //     console.log("successfully add students to class " + classId)

          
      //     // console.log(data)
      //     // if (navTo === 'AddNewStudents') {
      //     //   this.props.navigation.push("AddNewStudents")
      //     // } else {
      //     //   console.log("navigating to " + navTo)
      //     //   this.props.navigation.navigate(navTo)
      //     // }

      //   })
      //   .catch(err => {
      //     console.log(err);
      //   });



    } else {
      this.setState({ error: true })
    }
  };

  onSelectedItemsChange = selectedItems => {
    this.setState({ selectedItems })
  };

  render() {
    const { navigation } = this.props;
    const classId = navigation.getParam('classId', 'NO-ID')
    const { selectedItems } = this.state;
    console.log("select student page render")
    console.log(classId)

    return (
      this.state.loading ? (
        <View style={[styles.loadingContainer, styles.horizontal]}>
          <ActivityIndicator size="small" color="#0000ff" />
        </View>
      ) : (<ScrollView style={styles.container}>
        <MultiSelect
          items={this.state.students}
          uniqueKey="_id"
          ref={(component) => { this.multiSelect = component }}
          onSelectedItemsChange={this.onSelectedItemsChange}
          selectedItems={selectedItems}
          selectText="选择至少一位学生"
          searchInputPlaceholderText="搜索学生姓名"
          onChangeInput={(text) => console.log(text)}
          fontSize={18}
          itemFontSize={18}
          tagRemoveIconColor="#4089D6"
          tagBorderColor="#4089D6"
          tagTextColor="#4089D6"
          selectedItemTextColor="#4089D6"
          selectedItemIconColor="#4089D6"
          itemTextColor="#CFCFD3"
          displayKey="name"
          searchInputStyle={{ color: '#4089D6' }}
          submitButtonColor="#4089D6"
          submitButtonText="完成"
          removeSelected
          styleMainWrapper={pickerSelectStyles.wrapper}
          styleInputGroup={pickerSelectStyles.inputContainer}
          textInputProps={pickerSelectStyles.inputText}
          textColor = "#CFCFD3"
          selectedTextColor = '#000'
          leftIconName = 'notebook'
        />

        <View style={{ alignItems: "flex-end", marginTop: 16 }}>
          <Button
            title="确认"
            type="clear"
            onPress={() => this.handleSubmit(classId)}
            loading={this.state.buttonLoading}
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
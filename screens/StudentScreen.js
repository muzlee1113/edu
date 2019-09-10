import React from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  View
} from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import { Icon, Button } from 'react-native-elements'
import { Stitch, RemoteMongoClient } from "mongodb-stitch-react-native-sdk";



import Title from '../components/Title';
import StudentList from '../components/InfoList';

export default class StudentScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: '',
      headerBackTitle: '学生',
      headerStyle: {
        borderBottomWidth: 0,
        shadowColor: 'transparent'
      }
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      students: [],
      loading: false
    };
  }

  componentDidMount() {
    this._loadStudents();

  }

  _loadStudents() {
    this.setState({loading: true})
    console.log("loading classes")
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
        this.setState({ students: docs, loading: false });
        console.log(docs)
      })
      .catch(err => {
        console.warn(err);
      });
  }

  _onRefresh = () => {
    this.setState({ refreshing: true });
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
        this.setState({ students: docs });
        this.setState({ refreshing: false });
      })
      .catch(err => {
        console.warn(err);
      });

  }



  render() {
    const { navigation } = this.props;
    return (
      this.state.loading ? (
        <View style={[styles.loadingContainer, styles.horizontal]}>
          <ActivityIndicator size="small" color="#0000ff" />
        </View>
      ) : (
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}
          />}
      >
        <Title text="学生" />
        <StudentList
              listIcon='person'
              items={this.state.students}
              titleName='name'
              navigation={navigation}
              pageModel="StudentItemDetails"
            />
        <Button
          icon={{
            name: "add",
            size: 15,
            color: "#4089D6"
          }}
          buttonStyle={{
            marginLeft: 16,
            marginRight: 16,
            marginTop: 8,
            marginBottom: 8,
            height: 40,
          }}
          color="#4089D6"
          type="clear"
          title="增加学生"
          onPress={() => navigation.navigate("AddNewStudents", { fromWhere: 'Student' })}
        />
      </ScrollView>)
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginLeft: 16,
    marginRight: 16,
    backgroundColor: '#fff',
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

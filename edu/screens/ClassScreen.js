import React from 'react';
import {
  RefreshControl,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator
} from 'react-native';
import { Icon, Button } from 'react-native-elements'
import { Stitch, RemoteMongoClient } from "mongodb-stitch-react-native-sdk";


import Title from '../components/Title';

import ClassList from '../components/InfoList';





const classList = [
  {
    _id: '123456',
    title: '一班',
    icon: 'school',
    lessons: [
      {
        lesson_id: '1234561',
        title: "第一课",
        duration: "30",
        icon: 'class',
        activities: [
          {
            title: "演讲"
          },
          {
            title: "课前小测"
          }
        ]
      },
      {
        lesson_id: '1234562',
        title: "第二课",
        duration: "60",
        icon: 'class'
      }
    ]
  },
  {
    _id: '123457',
    title: '二班',
    icon: 'school',
    lessons: []
  },
]



export default class ClassScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: '',
      headerBackTitle: '班级',
      headerStyle: {
        borderBottomWidth: 0,
        shadowColor: 'transparent'
      }
    }
  };
  constructor(props) {
    super(props);
    this.state = {
      classes: [],
      refreshing: false,
      loading: false
    };

  }

  componentDidMount() {
    this._loadClasses();

  }

  _loadClasses() {
    this.setState({loading: true})
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
        this.setState({ classes: docs, loading: false });
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
    const classes = db.collection("classes");
    classes
      .find({})
      .asArray()
      .then(docs => {
        this.setState({ classes: docs });
        this.setState({ refreshing: false });
      })
      .catch(err => {
        console.warn(err);
      });

  }


  render() {

    console.log("render")
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
            <Title text="班级" />
            <ClassList
              listIcon='school'
              items={this.state.classes}
              titleName='title'
              navigation={navigation}
              pageModel="ClassItemDetails"
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
              title="添加班级"
              onPress={() => navigation.navigate("AddNewClass")}
            />
          </ScrollView>
        )
    );
  }


}

const styles = StyleSheet.create({

  //Original
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginLeft: 16,
    marginRight: 16
  },
  contentContainer: {
    paddingTop: 16,
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

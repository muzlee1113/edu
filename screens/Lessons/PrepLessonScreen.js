import React from 'react';
import { ScrollView, 
        StyleSheet,
        ActivityIndicator,
        RefreshControl,
        View
        } from 'react-native';
import { Button } from 'react-native-elements';
import ActivityList from '../../components/InfoList'
import { Stitch, RemoteMongoClient } from "mongodb-stitch-react-native-sdk";


export default class prepLessonScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
        return {
            title: '课前准备',
            headerBackTitle: navigation.getParam('lessonName', '未命名课程'),
            headerStyle: {
                borderBottomWidth: 0,
                shadowColor: 'transparent'
            },
            // headerRight: (
            //     <Button
            //       title="设置"
            //       type='clear'
            //       titleStyle={{ fontSize: 16 }}
            //       onPress={()=>{
            //         //   navigation.navigate("AddNewClass")
            //         }}
            //     />),
        };
    };
  constructor(){

      super()
      this.state = {
          activities:[],
          loading: false,
          refreshing: false,

      }
  }
  componentDidMount(){
     this._loadActivities()

  }

  _loadActivities=()=> {
    this.setState({loading: true})
    const lessonId = this.props.navigation.state.params.lessonId
    console.log("loading activities")
    const stitchAppClient = Stitch.defaultAppClient;
    const mongoClient = stitchAppClient.getServiceClient(
      RemoteMongoClient.factory,
      "mongodb-atlas"
    );
    const db = mongoClient.db("smartedu");
    const activities = db.collection("activities");
    activities
      .find({lesson_id: lessonId})
      .asArray()
      .then(docs => {
        this.setState({ activities: docs, loading: false });
        console.log(docs)
      })
      .catch(err => {
        console.warn(err);
      });
  }


  

  render() {
    const { navigation } = this.props;
    const {lessonId, lessonName} = this.props.navigation.state.params
    return (this.state.loading ? (
      <View style={[styles.loadingContainer, styles.horizontal]}>
        <ActivityIndicator size="small" color="#0000ff" />
      </View>
    ):(<ScrollView 
        style={styles.container}
        refreshControl={
        <RefreshControl
              refreshing={this.state.loading}
              onRefresh={this._loadActivities}
        />}
      >
        <ActivityList
          titleName='title'
          listIcon='palette'
          items={this.state.activities}
          navigation={navigation}
          pageModel="ActivityItemDetails"
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
          title="添加课堂活动"
          onPress={() => (navigation.navigate("AddNewActivity", { lessonId: lessonId, lessonName: lessonName}))}
        />
    </ScrollView>)
      
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});

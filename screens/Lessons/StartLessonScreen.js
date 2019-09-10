import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';

import { ListItem, Button, Badge } from 'react-native-elements';
import TouchableScale from 'react-native-touchable-scale'; // https://github.com/kohver/react-native-touchable-scale
import LinearGradient from 'react-native-linear-gradient'; // Only if no expo
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
// database
import { ButtonGroup } from 'react-native-elements';
import { Stitch, RemoteMongoClient } from "mongodb-stitch-react-native-sdk";




// components
import SeatsMap from '../../components/SeatsMap'
// import StudentList from '../../components/InfoList';


export default class startLessonScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerBackTitle: navigation.getParam('lessonName', '未命名课程'),

      // title: 'Links',
    }
  };

  constructor() {
    super()
    this.state = {
      selectedIndex: 0,
      applaud: true,
      className: "",
      students: [],
      seatsMap: [],
      loading: false,

    }
    this.updateIndex = this.updateIndex.bind(this)
  }

  componentDidMount() {
    // console.log(this.props.navigation.state.params['lessonId'])
    // console.log(this.props.navigation.state.params['classId'])
    this.setState({
      loading: true
    })
    // ask students data
    this._subscribe = this.props.navigation.addListener('didFocus', () => {
      this.loadData();
    });

  }

  loadData = () => {
    let classId = this.props.navigation.state.params['classId']

    const stitchAppClient = Stitch.defaultAppClient;
    const mongoClient = stitchAppClient.getServiceClient(
      RemoteMongoClient.factory,
      "mongodb-atlas"
    );
    const db = mongoClient.db("smartedu");
    const classes = db.collection("classes")
    const students = db.collection("students");
    students
      .find({ class: classId })
      .asArray()
      .then(docs => {
        this.setState({ students: docs });
        console.log("find students with class Id " + classId)
        // console.log(docs)

        // find seatMap
        console.log("loading seatsMap")
        classes.findOne({ _id: classId })
          .then((data) => {
            console.log('get class seatsMap with class Id' + classId)
            this.setState({
              className: data['title'],
              seatsMap: data['seatsMap'] || [],
              loading: false
            })
          })
          .catch(err => {
            console.log(err)
          })
      })
      .catch(err => {
        console.warn(err);
      });


  }

  touchEventHandler = (rowIndex, seatIndex) => {
    console.log('touch student in row ' + rowIndex + ', seat ' + seatIndex)
  }

  updateIndex (selectedIndex) {
    this.setState({
        selectedIndex: selectedIndex
    })
  }

  toggleApplaud=()=>{
    this.setState({
      applaud: !this.state.applaud
    })
  }



  render() {
    const { students, seatsMap, className } = this.state;
    const classId = this.props.navigation.state.params['classId']

    // view tabs
    const buttons = ['花名册','座位图']
    const { selectedIndex } = this.state


    return (this.state.loading ? (
      <View style={[styles.loadingContainer, styles.horizontal]}>
        <ActivityIndicator size="small" color="#0000ff" />
      </View>
    ) : (<>
        <ScrollView
          style={styles.container}
          refreshControl={
            <RefreshControl
              refreshing={this.state.loading}
              onRefresh={this.loadData}
            />}
        >
          <ButtonGroup
            onPress={this.updateIndex}
            selectedIndex={selectedIndex}
            buttons={buttons}
          // containerStyle={{height: 100}}
          />
          {/* show content according to selectedIndex */}
          {(selectedIndex === 0) ?
            (<>
            {students.map((student,i)=>{
              return (
                <ListItem
                  Component={TouchableScale}
                  friction={90} //
                  tension={100} // These props are passed to the parent component (here TouchableScale)
                  activeScale={0.98} //
                  rightElement={this.state.applaud?(<Badge value="1" status="error"/>):(<Badge value="1" status="primary"/>)}
                  containerStyle={styles.listContainerStyle}
                  key={i}
                  title={student.name}
                  titleStyle={styles.listItem}
                  // bottomDivider={true}
                  onPress={()=>{console.log("press student" + student._id)}}
                />
              );
            })}
            </>  
            )
            : (<>{seatsMap.length > 0 ?
              (<View style={styles.seatsMapContainer}>
                  <SeatsMap
                    withStudents={true}
                    students={students}
                    seatsMap={seatsMap}
                    // seatsMapData={this.state.seatsMapData}
                    // seatNum = {this.state.seatNum}
                    touchEventHandler={this.touchEventHandler}
                  />
                </View>)
              : (<><Text>
                <Text style={{ fontSize: 16 }}>{`还未设置座位，前往 `}</Text>
                <Text
                  style={{ color: '#4089D6', fontSize: 16 }}
                  onPress={() => { navigation.navigate('CreateSeatsMap', { startingStep: 0, classId: classId, className: className, students: students }) }}>{`设置座位`}</Text>
                <Text style={{ fontSize: 16 }}>{` 吧`}</Text>
              </Text></>)
            }</>)}
          
            
        </ScrollView>
        <ActionButton 
          buttonColor={this.state.applaud?("rgba(228,79,80,1)"):("rgba(64,137,214,1)")}
          position="right"
          renderIcon= {(active)=>{
            console.log("here is from renderIcon")
            console.log(active)
            if(this.state.applaud)
            {
              return <Icon name="md-happy" style={styles.actionButtonIcon} />
            } else{
              return <Icon name="md-sad" style={styles.actionButtonIcon} />
            }
          }}
          onPress={this.toggleApplaud}
          >
            
        </ActionButton>
        </>)
    );
  }
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center'
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10
  },
  container: {
    flex: 1,
    marginHorizontal: 16,
    paddingTop: 15,
    // backgroundColor: '#fff',
  },
  seatsMapContainer: {
    // paddingHorizontal: 8,
    marginVertical: 16,
    // minHeight: height*0.6-16,
    // minWidth: width,
    // borderWidth: 1,
    // borderColor: 'lightgray'
  },
  listContainerStyle:{
    marginVertical: 8,
    backgroundColor: '#EAE8E8'
  },
  listItem:{
    fontSize: 18,
    height: 24,
  },
  actionButtonIcon: {
    fontSize: 30,
    height: 30,
    color: 'white',
  },
});

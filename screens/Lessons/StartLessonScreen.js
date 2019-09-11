import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  RefreshControl,
  Modal
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

const Loader = props => {
  const {
    updateLoading
  } = props;

  return (
    <Modal
      transparent={true}
      animationType={'none'}
      visible={updateLoading}
      onRequestClose={() => {console.log('close modal')}}>
      <View style={styles.modalBackground}>
        <View style={styles.activityIndicatorWrapper}>
          <ActivityIndicator
            animating={updateLoading} />
        </View>
      </View>
    </Modal>
  )
}


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
      isGood: true,
      class:{},
      lessonId:"",
      students: [],
      seatsMap: [],
      loading: false,
      lessonPerformances:[],
      updateLoading:false
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
    let lessonId = this.props.navigation.state.params['lessonId']
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
      .then(data => {
        this.setState({ students: data });
        console.log("find students with class Id " + classId)
        // console.log(data)

        // find seatMap
        console.log("loading seatsMap")
        classes.findOne({ _id: classId })
          .then((data) => {
            console.log('get class seatsMap with class Id' + classId)
            this.setState({
              lessonId: lessonId,
              class: data,
            },()=>{
              this.registerStudentsInLesson()
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

  registerStudentsInLesson=()=>{
    console.log("Start registering")
    const stitchAppClient = Stitch.defaultAppClient;
    const mongoClient = stitchAppClient.getServiceClient(
      RemoteMongoClient.factory,
      "mongodb-atlas"
    );
    const db = mongoClient.db("smartedu");
    const lessonPerformances = db.collection("lessonPerformances");
    const students = this.state.students
    let count = 0

      //check if the student has been registered
      students.map((student,i)=>{
        lessonPerformances
        .findOne( { $and: [ 
          { lesson_id: this.state.lessonId }, 
          { student_id: student._id } 
        ] } )
        
        .then(res=>{
          console.log(res)
          if(res){
            console.log('registered')
            count++
            if(count===students.length){
              console.log("++++++=======The End=========++++++")
              this.updateLessonPerformances()   
            }              
          }else{
            console.log('hasnt registered')
            // registered the student
            let newLessonPerformance = {
              student_id: student._id,
              lesson_id: this.state.lessonId,
              attend: true,
              goods: [],
              bads: [],
              comment_tags:[],
              activity_performance:[],
              comment:"" 
            }
            lessonPerformances
            .insertOne({
              ...newLessonPerformance
            })
            .then((data) => {
              console.log("registered one student " + i + " successfully!")
              console.log(data)
              count++
              if(count===students.length){
                console.log("++++++=======The End=========++++++")
                this.updateLessonPerformances()   
              }   
            })
            .catch(err => {
              console.log(err);
            });
          }
        }).catch(err=>{
          console.log(err)
        })
        
      })   
  }

  updateLessonPerformances=()=>{
    console.log("========Start updating performances==========")
    const stitchAppClient = Stitch.defaultAppClient;
    const mongoClient = stitchAppClient.getServiceClient(
      RemoteMongoClient.factory,
      "mongodb-atlas"
    );
    const db = mongoClient.db("smartedu");
    const lessonPerformances = db.collection("lessonPerformances");
    lessonPerformances
    .find({ lesson_id: this.state.lessonId })
    .asArray()
    .then(data=>{
      // const newLessonPerformances = []
      // data.map((item=>{
      //   let matchingStudentId = data.find( ({ student_id }) => student_id === item.student_id );
      //   if(matchingStudentId){

      //   }else{
      //     newLessonPerformances.push(item)
      //   }
      // }))
      console.log("========got data==========")
      console.log(data)
      this.setState({
        lessonPerformances: data,
        loading:false,
        updateLoading:false
      })
    })
    .catch(err=>{
      console.log(err)
    })
  }

  touchEventHandler = (rowIndex, seatIndex) => {
    console.log('touch student in row ' + rowIndex + ', seat ' + seatIndex)
  }

  updateIndex (selectedIndex) {
    this.setState({
        selectedIndex: selectedIndex
    })
  }

  toggleIsGood=()=>{
    this.setState({
      isGood: !this.state.isGood
    })
  }

  touchListHandler=(studentId)=>{
    this.setState({
      updateLoading: true
    })
    console.log('touch '+studentId)
    const stitchAppClient = Stitch.defaultAppClient;
    const mongoClient = stitchAppClient.getServiceClient(
      RemoteMongoClient.factory,
      "mongodb-atlas"
    );
    const db = mongoClient.db("smartedu");
    const lessonPerformances = db.collection("lessonPerformances");
    const timeStamp = new Date().getTime()
    if(this.state.isGood){
      lessonPerformances
      
      .findOneAndUpdate(
        { $and: [ 
          { lesson_id: this.state.lessonId }, 
          { student_id: studentId } 
        ] },  
          {$push:{ goods:timeStamp}} 
      ).then((res)=>{
          console.log('update student '+studentId+' performance successfully: goods + 1 at ' + timeStamp)
          console.log(res)
          // update performance
          this.updateLessonPerformances()   

      }).catch(err => {
          console.warn(err);
      });
    }else{
      lessonPerformances
      .findOneAndUpdate(
        { $and: [ 
          { lesson_id: this.state.lessonId }, 
          { student_id: studentId } 
        ] },  
          {$push:{ bads:timeStamp}} 
      ).then((res)=>{
          console.log('update student '+studentId+' performance successfully: bads + 1 at ' + timeStamp)
          console.log(res)
           // update performance
           this.updateLessonPerformances()   
      }).catch(err => {
          console.warn(err);
      });
    }
  }



  render() {
    const { students, lessonPerformances } = this.state;
    console.log("hello I'm rendering, now the lessonPerformances is")
    console.log(lessonPerformances)
    const { seatsMap, className } = this.state.class
    const classId = this.props.navigation.state.params['classId']

    // view tabs
    const buttons = ['花名册','座位图']
    const { selectedIndex } = this.state


    return (this.state.loading ? (
      <View style={[styles.loadingContainer, styles.horizontal]}>
        <ActivityIndicator size="small" color="#0000ff" />
      </View>
    ) : (<>
        <Loader updateLoading={this.state.updateLoading}/>
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
              console.log('=====the student id '+student._id )
              const performance = lessonPerformances.find(performance =>performance['student_id'].toString()===student._id.toString());
              console.log(performance)
              const {goods, bads} = performance
              return (
                <ListItem
                  Component={TouchableScale}
                  friction={90} //
                  tension={100} // These props are passed to the parent component (here TouchableScale)
                  activeScale={0.98} //
                  rightElement={this.state.isGood?(goods.length===0?(<></>):(<Badge value={goods.length} status="error"/>)):(bads.length===0?(<></>):(<Badge value={bads.length} status="primary"/>))}
                  containerStyle={styles.listContainerStyle}
                  key={i}
                  title={student.name}
                  titleStyle={styles.listItem}
                  // bottomDivider={true}
                  onPress={()=>this.touchListHandler(student._id)}
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
          buttonColor={this.state.isGood?("rgba(228,79,80,1)"):("rgba(64,137,214,1)")}
          position="right"
          renderIcon= {(active)=>{
            console.log("here is from renderIcon")
            if(this.state.isGood)
            {
              return <Icon name="md-happy" style={styles.actionButtonIcon} />
            } else{
              return <Icon name="md-sad" style={styles.actionButtonIcon} />
            }
          }}
          onPress={this.toggleIsGood}
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
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000040'
  },
  activityIndicatorWrapper: {
    backgroundColor: '#FFFFFF',
    height: 100,
    width: 100,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around'
  }
});

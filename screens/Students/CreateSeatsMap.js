import React from 'react';
import {
    Text,
    StyleSheet,
    ScrollView,
    View,
    ActivityIndicator,
    RefreshControl,
    Dimensions,
    TouchableOpacity
    // Button
} from 'react-native';
import { Input, Button, Icon } from 'react-native-elements'

// import { Icon } from 'expo';
import { Stitch, RemoteMongoClient } from "mongodb-stitch-react-native-sdk";


// components
import SeatsMap from '../../components/SeatsMap'
import SeatsMapEmpty from '../../components/SeatsMapEmpty'




var height = Dimensions.get("window").height;
var width = Dimensions.get("window").width;


class SetRows extends React.Component {

    render() {
        
        return (<View style={{marginTop: 16}}>
            <Input
                placeholder="请输整数"
                //   leftIcon={{ name: "school", color: "#909090" }}
                //   leftIconContainerStyle={{marginRight:8}}
                label="教室一共几行座位？"
                labelStyle={{
                    color: "black", fontSize: 24, fontWeight: "bold", marginTop: 8,
                    marginBottom: 20,
                }}
                onChangeText={(num)=>this.props.handleNumChange(num, 'rowNum')}
                value={this.props.rowNum}
            //   onSubmitEditing={() => this.handleSubmit()}
            />
        </View>)
    }
}

class SetSeats extends React.Component {
    render() {
        return (<View style={{marginTop: 16}}>
            <Input
                placeholder="请输整数"
                //   leftIcon={{ name: "school", color: "#909090" }}
                //   leftIconContainerStyle={{marginRight:8}}
                label="每行有几个座位？"
                labelStyle={{
                    color: "black", fontSize: 24, fontWeight: "bold", marginTop: 8,
                    marginBottom: 20,
                }}
                onChangeText={(num)=>this.props.handleNumChange(num, 'seatNum')}
                value={this.props.seatNum}
            //   onSubmitEditing={() => this.handleSubmit()}
            />
        </View>)
    }
}


class SetAisles extends React.Component {
    
    
    render() {
        console.log('the max aisle index is now ' + this.props.aisleMaxIndexInRow)
        return (<View style={{marginTop: 16}}>
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    marginBottom: 8,
                    marginTop: 8, 
                }}
            >
            <Text
                style={{
                    color: "black", fontSize: 24, fontWeight: "bold", marginRight: 16, 
                }}
            >共 {this.props.aisleMap.length} 个过道</Text>
           <TouchableOpacity
            style={{ 
            // borderRadius: '50%',
            // borderWidth: 1,
            // borderColor: '#707070',
            height: 30, 
            width: 30,
            alignItems: 'center', 
            justifyContent: 'center' 
            }}
            onPress={this.props.handleAddAisle}
            >
                <Icon 
                    name= "add"
                    size= {30}
                    color= "#707070"
                />
             </TouchableOpacity>
            </View>
            {this.props.aisleMap.length>0?(
                this.props.aisleMap.map((indexInRow, index)=>{
            return <View
                key={index}
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}
            >
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginVertical: 4
                }}
            >
                <TouchableOpacity
                style={{ 
                // borderRadius: '50%',
                // borderWidth: 1,
                // borderColor: '#707070',
                height: 30, 
                width: 30,
                alignItems: 'center', 
                justifyContent: 'center' 
                }}
                onPress={()=>this.props.handleAisleMapChange(index, indexInRow<=1?(indexInRow):(indexInRow-1))}
                >
                    <Icon 
                        name= "chevron-left"
                        size= {30}
                        color= "#707070"
                    />
                </TouchableOpacity>
                <Text
                style={{
                    color: "black", 
                    fontSize: 18, 
                    marginHorizontal: 24, 
                }}
                >过道 {index+1}</Text>
                <TouchableOpacity
                style={{ 
                // borderRadius: '50%',
                // borderWidth: 1,
                // borderColor: '#707070',
                height: 30, 
                width: 30,
                alignItems: 'center', 
                justifyContent: 'center' 
                }}
                onPress={()=>this.props.handleAisleMapChange(index, (indexInRow>=this.props.aisleMaxIndexInRow)?(indexInRow):(indexInRow+1))}
                >
                    <Icon 
                        name= "chevron-right"
                        size= {30}
                        color= "#707070"
                    />
                </TouchableOpacity>
            </View>
            <TouchableOpacity
                style={{ 
                // borderRadius: '50%',
                // borderWidth: 1,
                // borderColor: '#707070',
                height: 30, 
                width: 30,
                alignItems: 'center', 
                justifyContent: 'center',
                marginLeft: 32
                }}
                onPress={()=>this.props.handleAisleMapChange(index, null)}
                
                // onLongPress={move}
                // onPressOut={moveEnd}
                >
                    <Icon 
                        name= "remove"
                        size= {24}
                        color= "#707070"
                    />
                </TouchableOpacity>
                </View>
            })



            ):(<></>)}
            
        </View>)
    }
}

export default class CreateSeatsMap extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            step: 0,
            seatsMap: [],
            rowNum: '0',
            seatNum: '0',
            aisleMap: [],
            onScreenStudentIndex: 0,
            onScreenStudent:{},
            students:[],
            studentsToBeAssigned:[],
            studentsHaveBeenAssigned:[],
            buttonLoading: false,
        };

    }
    

    static navigationOptions = ({ navigation }) => {

        return {
            title: '座位设置',
            headerLeft: navigation.state.params.headerLeft,
            headerRight: (
                <Button
                    title="关闭"
                    type='clear'
                    titleStyle={{ fontSize: 16 }}
                    onPress={() => {
                        navigation.goBack()
                    }}
                />),
        };
    };

    _setNavigationParams() {
        let headerLeft = <Button 
                            title="上一步"
                            type='clear'
                            // disabled={this.state.step?(false):(true)}
                            titleStyle={{ fontSize: 16 }}
                            onPress={this._prevStep} 
                            />;

        this.props.navigation.setParams({
            headerLeft,
        });
    }

    componentWillMount() {
        // console.log('willmount willmount willmount')
        // console.log(this.state)
        this._setNavigationParams();

    }

    componentDidMount(){
        if(this.props.navigation.state.params.startingStep===0){
            
        }
        // seatsMap: [],
        //     rowNum: '0',
        //     seatNum: '0',
        //     aisleMap: [],
        //     onScreenStudentIndex: 0,
        //     onScreenStudent:{},
        //     students:[],
        //     studentsToBeAssigned:[],
        //     studentsHaveBeenAssigned:[],
        //     buttonLoading: false,
        this.setState({
            students: this.props.navigation.getParam('students', []), 
            step: this.props.navigation.getParam('startingStep', 0),
            seatsMap: this.props.navigation.getParam('seatsMap', []),
        },()=>{
            this.checkRemainingStudents(this.setOnScreenStudent)
        })
    }

    _prevStep = () =>{
        console.log('move one step backward')
        if(this.state.step === 0){
            alert('已经到头啦！')
        }else{
            this.setState({
                step: this.state.step - 1
            })
        }
    }
    

    _nextStep = () => {
        console.log('move one step forward')
        switch (this.state.step) {
            case 2:
                console.log('!!!!!!!!!!!!!!!!now is step 2!!!!!!!!!!!!!!!');
                this.submitSeatsMap(()=>{
                    this.setState({
                        step : this.state.step + 1,
                        buttonLoading: false
                    });
                })
                break;
            case 3:
                console.log("!!!!!!!!!!!!!!now is step 3 Go to assign students!!!!!!!!!!!!!!")
                
            default:
              this.setState({
                  step : this.state.step + 1
              });
          }
        
    }

    configSeatsMap = (callback)=>{
        const stitchAppClient = Stitch.defaultAppClient;
        const mongoClient = stitchAppClient.getServiceClient(
        RemoteMongoClient.factory,
            "mongodb-atlas"
        );
        const db = mongoClient.db("smartedu");
        const classes = db.collection("classes");
        const classId = this.props.navigation.state.params.classId
        classes.findOne({_id: classId})
        .then((data)=>{
            console.log('get class seatsMap')
            this.setState({
                seatsMap: data['seatsMap']
            },()=>{
                callback()
            })
        })
        .catch(err=>{
            console.log(err)
        })
    }


    checkRemainingStudents=(callback)=>{
        console.log("checking remaining students")
        console.log(this.state.students)
        let studentsToBeAssigned = this.state.students.filter((student) => student.hasOwnProperty('seat') === false);
        this.setState({
            studentsToBeAssigned: [...studentsToBeAssigned]
        },()=>{

            callback()
        
        })
    }

    setOnScreenStudent=()=>{
        this.setState({
            // onScreenStudentIndex: nextStudentIndex,
            onScreenStudent: this.state.studentsToBeAssigned[0]
        },()=>{
            console.log("students have been assigned is =>>>>>>>>>>>>>>>")
            console.log(this.state.studentsHaveBeenAssigned)
            console.log("students to be assigned is =>>>>>>>>>>>>>>>")
            console.log(this.state.studentsToBeAssigned)
        })
    }

    submitSeatsMap = (callback) =>{
        console.log('submiting seatsMap to database')
        this.setState({
            buttonLoading: true
        })
        const stitchAppClient = Stitch.defaultAppClient;
        const mongoClient = stitchAppClient.getServiceClient(
        RemoteMongoClient.factory,
            "mongodb-atlas"
        );
        const db = mongoClient.db("smartedu");
        const classes = db.collection("classes");
        const classId = this.props.navigation.state.params.classId
        classes.findOneAndUpdate({_id: classId}, {$set:{seatsMap:this.state.seatsMap}})
        .then((data)=>{
            console.log('add new seatsMap')
            console.log(data)
            console.log(data)
            // this.configSeatsMap(callback)

            callback()
        })
        .catch(err=>{
            console.log(err)
        })
    }

    handleNumChange = (num, target)=>{
        
        this.setState({ [target]: num }, ()=>this.updateSeatsMap())
        // this.setState({ error: false })
        console.log('has ' + num + '' + target)
      
    }

    handleAddAisle = ()=>{  
        let aisleMap = [...this.state.aisleMap]
        const newAisle = (Number.parseInt(this.state.seatNum)+this.state.aisleMap.length-1)
        if(aisleMap.length>=Number.parseInt(this.state.seatNum)-1){
            alert("已经放不下啦！")
        }else{
            aisleMap.push(newAisle)
            this.setState({ aisleMap: [...aisleMap] }, ()=>this.updateSeatsMap())
        }
    }

    handleAisleMapChange = (index, indexInRow)=>{
        let aisleMap = [...this.state.aisleMap]
        if(indexInRow===null){
            aisleMap.splice(index,1)
        }else{
            aisleMap[index] = indexInRow
        }
        this.setState({ aisleMap: [...aisleMap] }, ()=>this.updateSeatsMap())     
    }

    updateSeatsMap = ()=>{
        let {rowNum, seatNum, aisleMap} = this.state
        let seatsMap = [];
        let row = [];

        // for(let i = 0; i< Number.parseInt(aisleNum);i++){
        //     row.push(null)
        // }

        // map seats
        for (let i = 0; i < Number.parseInt(seatNum); i ++){
            row.push({studentName: "", studentId: ""})
        }
        // map aisles
        for(let i = 0; i<aisleMap.length;i++){
            row.splice(aisleMap[i], 0, null)
        }
        // map row with such seats and aisles
        for (let i = 0; i< Number.parseInt(rowNum); i ++){
            seatsMap.push([...row])
        }
        
        this.setState({
            seatsMap: [...seatsMap],
        })

        console.log('seatsMap change!!')
  
    }

    // assign students
    touchEventHandler=(rowIndex, seatIndex, studentId, callback)=>{
        let onScreenStudent = this.state.onScreenStudent
        let seat = {rowIndex:rowIndex, seatIndex:seatIndex}
        // let studentsToBeAssigned = {}
        let students = [...this.state.students]
        console.log("+=_=+------------===============----------------+-_-+")

        console.log("you click a seat!!")
        console.log(seat)
        console.log("with studentId")
        console.log(studentId)

        // update student data in state
        let updatedStudents = students.map((student,i)=>{
            // click seat already with student
            if(studentId === student._id){
                console.log("you click a seat already has student!!")
                delete student.seat;
            }
            // set on screen student to the seat
            if(onScreenStudent._id===student._id){
                student.seat = {...seat}
            }
            return student
        })

        this.setState({
            students: [...updatedStudents]
        },()=>{
            // move to the next student
            this.nextStudent()        
        })
    }

    clearUpStudentSeat=()=>{
        // get students from state
        const students = [...this.state.students]
        let updatedStudents = students.map((student,i)=>{
            // delete all the seat property
            if(student.hasOwnProperty('seat')){
                delete student.seat;
            }
            return student
        })

        this.setState({
            students: [...updatedStudents]
        },()=>{
            console.log("clear up seats!")
        })
    }

    nextStudent=()=>{
        // let nextStudentIndex = this.state.onScreenStudentIndex+1,
        // here move the assigned students to another array
        this.setState({
            studentsHaveBeenAssigned:[...this.state.studentsHaveBeenAssigned, this.state.onScreenStudent],
        },()=>{
            // updateRemaining students
            this.checkRemainingStudents(this.setOnScreenStudent)
        })
    }

   

    prevStudent=()=>{
        
        // rewind the set seat of previous student
        let preStudent = this.state.studentsHaveBeenAssigned[this.state.studentsHaveBeenAssigned.length-1]
        // delete seat data of prev student in students data
        let updatedStudents = this.state.students.map((student,i)=>{
            if(student._id===preStudent._id){
                delete student.seat;
            }
            return student
        })
        // remove the students from havebeenassigned array
        let updatedHaveBeenAssigned = [...this.state.studentsHaveBeenAssigned]
        updatedHaveBeenAssigned.pop()

        this.setState({
            students: [...updatedStudents],
            studentsHaveBeenAssigned: [...updatedHaveBeenAssigned]
        },
        ()=>{
            console.log("students data now look like")
            console.log(this.state.students)
            // the following function should auto move the prev student back to tobeassigned array
            this.checkRemainingStudents(this.setOnScreenStudent)
        }
        )
    }

    submitStudents=(callback)=>{
        const stitchAppClient = Stitch.defaultAppClient;
        const mongoClient = stitchAppClient.getServiceClient(
        RemoteMongoClient.factory,
            "mongodb-atlas"
        );
        const db = mongoClient.db("smartedu");
        const students = db.collection("students");
        // const classId = this.props.navigation.state.params.classId
        const newStudentsData = [...this.state.students]
        newStudentsData.forEach(student=>{
            students.findOneAndUpdate({_id: student._id}, {$set:{seat: student.seat}})
            .then((data)=>{
               console.log("updated a student's seat")
               console.log(data)
            })
            .catch(err=>{
                console.log(err)
            })

        })
        callback()
        
    }

   

    render() {
        let {classId, className, students} = this.props.navigation.state.params        
        console.log("here is from create seat map")
        // get class Id from navigation
        console.log(classId)
        console.log('now is step ' + this.state.step)
        return (
            <ScrollView 
            style={styles.container}
            >

                {this.state.step === 0 ? (
                    <SetRows 
                        rowNum={this.state.rowNum} 
                        handleNumChange={this.handleNumChange}/>
                ) : (this.state.step === 1 ? (
                    <SetSeats 
                        seatNum={this.state.seatNum} 
                        handleNumChange={this.handleNumChange}/>
                ) : (this.state.step === 2 ? (
                    <SetAisles 
                        aisleMap={this.state.aisleMap} 
                        handleAddAisle={this.handleAddAisle}
                        handleAisleMapChange={this.handleAisleMapChange}
                        aisleMaxIndexInRow = {Number.parseInt(this.state.seatNum)+this.state.aisleMap.length-2}
                    />
                ) : (this.state.step === 3 ? (<></>
                    
                ) : (<></>))))}
                {/* seat map */}
                <View style={styles.seatsMapContainer}>
                    <SeatsMapEmpty 
                    seatsMap = {this.state.seatsMap}
                    />
                    {/* <SeatsMap 
                        // seatsMapData = {this.state.seatsMapData}
                        seatsMap = {this.state.seatsMap}
                        students = {this.state.students}
                        // seatNum = {this.state.seatNum}
                        touchEventHandler={this.touchEventHandler}
                    /> */}
                </View>
                <View>
                    <Button
                        title={this.state.step===3?('前往安排学生座位'):(this.state.step===2?('完成'):('下一步'))}
                        onPress={this.state.step===3?(() => {this.props.navigation.navigate('AssignStudentsToSeats',{classId:classId, className:className, students: students})}):(this._nextStep)}
                        loading={this.state.buttonLoading}
                        // disabled={this.state.step===3?(this.state.studentsHaveBeenAssigned.length<this.state.students.length?(true):(false)):(false)}
                    />
                </View>
            
            <ScrollView
                contentContainerStyle={{ flex: 1 }}
                keyboardShouldPersistTaps="handled"
            />
            </ScrollView>
            
        )
    }
}


const styles = StyleSheet.create({
    container: {
        // flex: 1,
        backgroundColor: "#fff",
        marginLeft: 16,
        marginRight: 16
      },
    seatsMapContainer:{
        // paddingHorizontal: 8,
        marginVertical: 16,
        // minHeight: height*0.6-16,
        // minWidth: width,
        // borderWidth: 1,
        // borderColor: 'lightgray'
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
})

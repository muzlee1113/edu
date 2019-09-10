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
import { Input, Button, Icon, ListItem } from 'react-native-elements'
import TimePicker from "react-native-24h-timepicker";
import MultiSelect from 'react-native-multiple-select';



// import { Icon } from 'expo';
import { Stitch, RemoteMongoClient } from "mongodb-stitch-react-native-sdk";


// components
import SeatsMap from '../../components/SeatsMap'
import SeatsMapEmpty from '../../components/SeatsMapEmpty'




var height = Dimensions.get("window").height;
var width = Dimensions.get("window").width;
const emptyState={
    step: 0,
    title: "",
    duration: 0,
    assessment:{
        type: "",
        total: null,
        rubrics_id: ""
    },
    rubrics_name:'',
    buttonLoading: false,
  }


class SetTitle extends React.Component {

    render() {
        
        return (<>
        <View style={{marginTop: 16}}>
            <Input
                placeholder="比如第一次课前小测"
                //   leftIcon={{ name: "school", color: "#909090" }}
                //   leftIconContainerStyle={{marginRight:8}}
                label="给此活动取个名字"
                labelStyle={styles.label}
                onChangeText={(text)=>this.props.handleTextChange(text, 'title')}
                value={this.props.title}
            //   onSubmitEditing={() => this.handleSubmit()}
            />
        </View>
        </>)
    }
}

class SetDuration extends React.Component {
    constructor() {
        super();
      }
     
      
    onCancel=()=> {
        this.TimePicker.close();
      }
     
    onConfirm=(hour, minute)=> {
        this.props.onTimePickerConfirm(hour, minute, ()=>{
            this.TimePicker.close();
        })     
    }

    render() {
        return (<View style={{marginTop: 16}}>
            <Text
                style={styles.label}
                >此项活动预计时长为</Text>
            <TouchableOpacity 
                onPress={() => this.TimePicker.open()}
                style={{
                    flexDirection: 'row',
                    borderBottomWidth: 1,
                    alignItems: 'center',
                    borderColor: '#86939e',
                }}
            >
            {this.props.duration?
            (<Text style={styles.input}>{Math.floor(this.props.duration/60)}小时{this.props.duration%60}分</Text>)
            :(<Text style={styles.input}>请选择时间</Text>)}
            </TouchableOpacity>
            <TimePicker
                ref={ref => {
                    this.TimePicker = ref;
                }}
                hourUnit=' 小时'
                minuteUnit=' 分'
                textConfirm='确定'
                textCancel='取消'
                onCancel={() => this.onCancel()}
                onConfirm={(hour, minute) => this.onConfirm(hour, minute)}
            />
        </View>)
    }
}


class SetAssessment extends React.Component {
    
    
    render() {
        return (<View style={{marginTop: 16}}>
                 <Text style={styles.label}>你希望如何评估学生的表现</Text>
                 <View>
                    <ListItem
                        titleStyle={styles.item}
                        key='score'
                        title="基于总分"
                        chevron={true}
                        bottomDivider={true}
                        subtitleStyle={{ color: '#707070', fontSize: 16 }}
                        subtitle="基于一个总分评价，比如100分、10分..."
                        onPress={() => {
                            this.props.onPickAssessment('score')
                        }}
                    
                    />
                    <ListItem
                        titleStyle={styles.item}
                        key='level'
                        title="基于级别"
                        chevron={true}
                        bottomDivider={true}
                        subtitleStyle={{ color: '#707070', fontSize: 16 }}
                        subtitle="基于一定的级别评价，比如A, B, C..."
                        onPress={() => {
                            this.props.onPickAssessment('level')
                        }}
                    />
                    <ListItem
                        titleStyle={styles.item}
                        key='rubrics'
                        title="基于多维评估标准"
                        subtitleStyle={{ color: '#707070', fontSize: 16 }}
                        subtitle="基于多个维度评价，比如内容5分、语言5分..."
                        chevron={true}
                        bottomDivider={true}
                        onPress={() => {
                            this.props.onPickAssessment('rubrics')
                        }}
                    />
                    <ListItem
                        titleStyle={styles.item}
                        key='null'
                        title="不评分"
                        subtitleStyle={{ color: '#707070', fontSize: 16 }}
                        subtitle="不评价学生表现"
                        chevron={true}
                        bottomDivider={true}
                        onPress={() => {
                            this.props.onPickAssessment(null)
                        }}
                    />
                </View>
            </View>)
    }
}

class SetAssessmentDetails extends React.Component{
    constructor(){
        super();
        this.state = {
            rubrics:[],
            selectedRubrics:[]
        };

    }
    componentDidMount(){
        this.setState({
            rubrics: [{
                _id: 'abc123',
                name: '个人演讲',
                sum_operation_type: 'sum',
                total: 10,
                parameters: [
                    {name: '内容', total: 6, increment: 1, weight: 0.6},
                    {name: '语言', total: 2, increment: 1, weight: 0.2},
                    {name: '肢体', total: 2, increment: 1, weight: 0.2}
                ]
            },
            {
                _id: 'abc456',
                name: '托福口语',
                sum_operation_type: 'average',
                total: 4,
                parameters: [
                    {name: '内容', total: 4, increment: 0.1, weight: 0.25},
                    {name: '语言', total: 4, increment: 0.1, weight: 0.25},
                    {name: '连接', total: 4, increment: 0.1, weight: 0.25},
                    {name: '逻辑', total: 4, increment: 0.1, weight: 0.25}
                ]
            }
        ]
        })
    }

    onSelectedItemsChange = (selectedItems, callback) => {
        // const callbackFunction = callback
        this.setState({ selectedRubrics: selectedItems }, 
            ()=>{
                const selectedRubrics = this.state.rubrics.find(rubrics => rubrics._id === selectedItems[0])
                console.log('trigger callback to set RUBRICS_ID')
                callback(selectedRubrics._id, selectedRubrics.name)
            }
        )
    };

    render(){
        const {selectedRubrics, rubrics} = this.state

        return (<View style={{marginTop: 16}}>
            {this.props.assessment['type'] === 'score' ? (
                    <Input
                        placeholder="请输入大于0的整数"
                        //   leftIcon={{ name: "school", color: "#909090" }}
                        //   leftIconContainerStyle={{marginRight:8}}
                        label="总分为？"
                        labelStyle={styles.label}
                        onChangeText={(text)=>this.props.handleTextChange(text, 'total')}
                        value={this.props.assessment['total']}
                    //   onSubmitEditing={() => this.handleSubmit()}
                    />
                ) : (this.props.assessment['type'] === 'level' ? (
                    <Input
                        placeholder="请输入大于0的整数"
                        //   leftIcon={{ name: "school", color: "#909090" }}
                        //   leftIconContainerStyle={{marginRight:8}}
                        label="共分为几级？"
                        labelStyle={styles.label}
                        onChangeText={(text)=>this.props.handleTextChange(text, 'total')}
                        value={this.props.assessment['total']}
                    //   onSubmitEditing={() => this.handleSubmit()}
                    />               
                ) : (this.props.assessment['type'] === 'rubrics' ? (<>
                    <Text style={styles.label}>选择一个评估标准</Text>
                    <MultiSelect
                        // hideTags
                        single={true}
                        items={rubrics}
                        uniqueKey="_id"
                        ref={(component) => { this.multiSelect = component }}
                        onSelectedItemsChange={(selectedItems)=>this.onSelectedItemsChange(selectedItems, this.props.onPickRubrics)}
                        selectedItems={selectedRubrics}
                        selectText="评估标准"
                        searchInputPlaceholderText="查找评估标准"
                        searchInputStyle={pickerSelectStyles.searchText}
                        onChangeInput={ (text)=> console.log(text)}
                        fontSize={18}
                        tagRemoveIconColor="#4089D6"
                        tagBorderColor="#4089D6"
                        tagTextColor="#4089D6"
                        selectedItemTextColor="#4089D6"
                        selectedItemIconColor="#4089D6"
                        itemTextColor="black"
                        displayKey="name"
                        searchInputStyle={{ color: '#4089D6' }}
                        submitButtonColor="#4089D6"
                        submitButtonText="完成"
                        removeSelected
                        styleMainWrapper={pickerSelectStyles.wrapper}
                        styleInputGroup={pickerSelectStyles.inputContainer}
                        textInputProps={pickerSelectStyles.inputText}
                        itemFontSize={18}
                        iconSearch={true}
                        textColor = 'black'
                        selectedTextColor = '#000'
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
                            title="添加评分标准"
                            onPress={() => this.props.navigation.navigate("AddNewRubrics")}
                        />
                </>) : (<></>)))}    
        </View>)
    }
}

class ActivityReview extends React.Component {
    
    
    render() {
        const {title, duration, assessment, rubrics_name} = this.props.activity
        return (<View style={{marginTop: 16}}>
                <Text style={styles.input}>活动名称: {title}</Text>
                <Text style={styles.input}>活动时长: {Math.floor(duration/60)}小时{duration%60}分</Text>
                <Text style={styles.input}>评估方式: {assessment['type']==='score'?('基于总分'):(assessment['type']==='level'?('基于级别'):(assessment['type']==='rubrics'?('基于多维评估标准'):('不评分')))}</Text>
                {assessment['type']==='score'?(<Text style={styles.input}>总分: {assessment['total']}分</Text>)
                :(assessment['type']==='level'?(<Text style={styles.input}>级别: {assessment['total']}级</Text>)
                :(assessment['type']==='rubrics'?(<Text style={styles.input}>评估标准: {rubrics_name}({assessment['rubrics_id']})</Text>)
                :(<></>)))}     
            </View>)
    }
}




export default class AddNewActivity extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            step: 0,
            title: "",
            duration:0,
            assessment:{
                type: "",
                total: null,
                rubrics_id: ""
            },
            rubrics_name:'',
            buttonLoading: false,
        };

    }
    

    static navigationOptions = ({ navigation }) => {

        return {
            title: '新建课堂活动',
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
            case 4:
                console.log('!!!!!!!!!!!!!!!!EVERYTHING IS DONE!!!!!!!!!!!!!!!');
                this.submitActivity()
                break;

            default:
              this.setState({
                  step : this.state.step + 1
              });
          }
        
    }

    handleTextChange=(text, target)=>{
        if(target === 'total'){
            this.setState({
                assessment: {...this.state.assessment, total: Number.parseInt(text)}
            })
        }else{
            this.setState({ [target]: text })
        }
        // this.setState({ error: false })
        console.log( target + ' is ' + text + '' )
    }

    //time picker

    onTimePickerConfirm=(hour, minute,callback)=> {
        const duration = Number.parseInt(hour)*60+Number.parseInt(minute)
        console.log('duration is '+ duration)
        this.setState({ duration: duration });
        callback();
    }

    // assessment
    onPickAssessment = (type)=>{
        console.log(type)
        this.setState({
            assessment:{...this.state.assessment, type: type}
        },()=>{this._nextStep()})
       
    }

    onPickRubrics = (rubrics_id, rubrics_name)=>{
        this.setState({
            assessment:{...this.state.assessment, rubrics_id: rubrics_id},
            rubrics_name: rubrics_name
        },()=>{console.log(this.state.assessment)})
    }


    submitActivity = (callback) =>{
        console.log('submiting new activity to database')
        this.setState({
            buttonLoading: true
        })
        const stitchAppClient = Stitch.defaultAppClient;
        const mongoClient = stitchAppClient.getServiceClient(
        RemoteMongoClient.factory,
            "mongodb-atlas"
        );
        const db = mongoClient.db("smartedu");
        const activities = db.collection("activities");
        const lessonId = this.props.navigation.state.params.lessonId
        const newActivity = {
            title: this.state.title,
            duration: this.state.duration,
            assessment:{...this.state.assessment},
            lesson_id:lessonId 
        }
        console.log("++++++++++++++++++++++")
        console.log(newActivity)
        activities.insertOne({
            ...newActivity
        })
        .then((activity)=>{
            console.log('add new activity')
            let activityId = activity.insertedId
            console.log(activityId)
            this.setState({
                ...emptyState
            })
            //go to prev page
            this.props.navigation.goBack()
        })
        .catch(err=>{
            console.log(err)
        })
    }


   

    render() {
        let {lessonId, lessonName} = this.props.navigation.state.params        
        console.log("here is from add activity")
        // get class Id from navigation
        console.log(lessonId)
        console.log('now is step ' + this.state.step)
        return (
            <ScrollView 
            style={styles.container}
            >

                {this.state.step === 0 ? (
                    <SetTitle 
                        handleTextChange={this.handleTextChange}
                        title={this.state.title}
                    />
                ) : (this.state.step === 1 ? (
                    <SetDuration 
                        duration={this.state.duration}
                        onTimePickerConfirm={this.onTimePickerConfirm}
                    />     
                                   
                ) : (this.state.step === 2 ? (
                    <SetAssessment 
                        onPickAssessment={this.onPickAssessment}
                    />
                ) : (this.state.step === 3 ? (
                    <SetAssessmentDetails
                        assessment = {this.state.assessment}
                        handleTextChange={this.handleTextChange}
                        onPickRubrics={this.onPickRubrics}
                    />
                ) : (this.state.step === 4 ? (
                    <ActivityReview
                        activity = {{
                            title: this.state.title,
                            duration: this.state.duration,
                            assessment: this.state.assessment,
                            rubrics_name: this.state.rubrics_name
                        }}
                        navigation={this.props.navigation}
                    />
                ) : (<></>)))))}              
                <View style={{marginVertical: 16}}>
                    {this.state.step===2?(<></>):(<Button
                        title={this.state.step===4?('完成'):('下一步')}
                        onPress={this._nextStep}
                        loading={this.state.buttonLoading}
                    />)}  
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center'
    },
    horizontal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10
    },
    input: {
        color: 'black',
        fontSize: 18,
        flex: 1,
        minHeight: 40,
    },
    label: {
        color: "black", 
        fontSize: 24, 
        fontWeight: "bold", 
        marginTop: 8,
        marginBottom: 20,
    },
    item: {
        // paddingLeft: 16,
        // paddingRight: 16,
        paddingTop: 8,
        paddingBottom: 8,
        fontSize: 18,
        height: 40,
    }
})


const pickerSelectStyles = StyleSheet.create({
    wrapper: {
    //   marginLeft: 8,
    //   marginRight: 8
    },
    dropdownText: {
      fontSize: 18
    },
    inputContainer: {
      borderBottomColor: '#86939e',
    //   paddingHorizontal: 16,
    //   paddingVertical: 8
    },
    searchText:{
      fontSize: 18
    },
    inputText:{
      fontSize: 18,
      // color: '#e6e6e6'
    }
});
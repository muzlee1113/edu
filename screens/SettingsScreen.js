// import React from 'react';
// import { StyleSheet, View, FlatList, RefreshControl, TouchableOpacity, Text, Dimensions } from 'react-native';
// import { ListItem } from 'react-native-elements'
// import { createStackNavigator, createAppContainer } from 'react-navigation';
// import { ExpoConfigView } from '@expo/samples';
// import seatsMapData from '../components/DummySeatsMap.json'
// import DraggableFlatList from 'react-native-draggable-flatlist'

// var height = Dimensions.get("window").height;
// var width = Dimensions.get("window").width;


// export default class SettingsScreen extends React.Component {

//   componentDidMount(){
//     // console.log(seatsMapData)
//   }
//   render() {
//     return (
//       <View style={{ padding: 16 }}>
//           {seatsMapData.map((row,i) => {
//               return (
//                 <View key={i} style={{ 
//                   // display:'flex',
//                   flexDirection: 'row', 
//                   justifyContent: 'center', 
//                   alignItems: 'center', 
//                   width: '100%'
//                   }}>
//                     {row.map((seat,j) => {
                      
//                         let seatNum = row.length
//                         let seatWidth = Math.floor(((width/seatNum)-16-8*seatNum))
//                         let seatHeight = Math.floor((seatWidth/3*2))
//                         let seatPadding = Math.floor((seatHeight-16)/2)
//                         let aisleWidth = (seatWidth/3)>16?Math.floor((seatWidth/3)):16
//                         console.log('seatWidth ' + seatWidth)
//                         console.log('seatHeight ' + seatHeight)
//                         console.log('seatPadding ' + seatPadding)
//                         console.log('aisleWidth ' + aisleWidth)



//                         return seat?(<View key={j} style={{ 
//                           maxWidth: 46,
//                           maxHeight: 30,
//                           width: seatWidth, 
//                           height: seatHeight, 
//                           backgroundColor: 'lightgray', 
//                           marginHorizontal: 8 , 
//                           marginVertical: 12, 
//                           borderTopLeftRadius: 16, 
//                           borderTopRightRadius: 14, 
//                           borderBottomLeftRadius: 2, 
//                           borderBottomRightRadius: 2}}><Text style={{textAlign: "center", paddingVertical: seatPadding, fontSize: 16, overflow:'hidden'}}>{seat.studentName}</Text></View>)
//                         :(<View key={j} style={{ width: aisleWidth, height: seatHeight, backgroundColor: 'white', margin: 0 }}/>);
//                     }
//                 )}
//             </View>
//          );
//           })
//          }
//          <View style={{width:'100%', 
//          height:46, 
//          backgroundColor: 'lightgray', 
//          marginTop: 32}}><Text style={{textAlign:'center', paddingVertical: 16}}>讲台</Text></View>
//       </View>
//       );
//   }
// }
// import React, { Component } from 'react'
// import { View, TouchableOpacity, Text } from 'react-native'
// import DraggableFlatList from 'react-native-draggable-flatlist'

// class Example extends Component {

//   state = {
//     data: [...Array(20)].map((d, index) => ({
//       key: `item-${index}`,
//       label: index,
//       backgroundColor: `rgb(${Math.floor(Math.random() * 255)}, ${index * 5}, ${132})`,
//     }))
//   }

//   renderItem = ({ item, index, move, moveEnd, isActive }) => {
//     return (
//       <TouchableOpacity
//         style={{ 
//           height: 100, 
//           backgroundColor: isActive ? 'blue' : item.backgroundColor,
//           alignItems: 'center', 
//           justifyContent: 'center' 
//         }}
//         onLongPress={move}
//         onPressOut={moveEnd}
//       >
//         <Text style={{ 
//           fontWeight: 'bold', 
//           color: 'white',
//           fontSize: 32,
//         }}>{item.label}</Text>
//       </TouchableOpacity>
//     )
//   }

//   render() {
//     return (
//       <View style={{ flex: 1 }}>
//         <DraggableFlatList
//           data={this.state.data}
//           renderItem={this.renderItem}
//           keyExtractor={(item, index) => `draggable-item-${item.key}`}
//           scrollPercent={5}
//           onMoveEnd={({ data }) => this.setState({ data })}
//         />
//       </View>
//     )
//   }
// }

// export default Example

// import React, { Component } from "react";
// import { View, Text, TouchableOpacity } from "react-native";
// import DateTimePicker from "react-native-modal-datetime-picker";
// import { Input, Button, Icon } from 'react-native-elements'


// export default class DateTimePickerTester extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       isDateTimePickerVisible: false,
//       duration: 0
//     };
//   }

//   showDateTimePicker = () => {
//     this.setState({ isDateTimePickerVisible: true });
//   };

//   hideDateTimePicker = () => {
//     this.setState({ isDateTimePickerVisible: false });
//   };

//   handleDatePicked = date => {
//     console.log("A date has been picked: ", date);
//     this.setState({ duration: date });
//     this.hideDateTimePicker();
// };

//   render() {
//     return (
//       <>
//         <Text
//           style={{
//               color: "black", fontSize: 24, fontWeight: "bold", marginTop: 8,
//               marginBottom: 20,
//           }}
//             >此项活动预计时长为</Text>
//         <TouchableOpacity 
//           onPress={()=>this.showDateTimePicker()}
//           style={{
//             // flexDirection: 'row',
//             borderBottomWidth: 1,
//             // alignItems: 'center',
//             borderColor: '#86939e',
//           }}
//           >
//         {this.state.duration?(<Text style={{fontSize: 18}}>{this.state.date}</Text>)
//         :(<Text style={{fontSize: 18}}>请选择时间</Text>)}
//         </TouchableOpacity>
//         <DateTimePicker
//           cancelTextIOS={'取消'}
//           confirmTextIOS={'确定'}
//           titleIOS={'设置时长'}
//           mode={'time'}
//           locale="en_GB"           
//           isVisible={this.state.isDateTimePickerVisible}
//           onConfirm={this.handleDatePicked}
//           onCancel={this.hideDateTimePicker}
//         />
//       </>
//     );
//   }
// }



// //===========================================
// import React, { Component } from "react";
// import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
// import TimePicker from "react-native-24h-timepicker";
 
// class Example extends Component {
//   constructor() {
//     super();
//     this.state = {
//       hour: 0,
//       minute:0
//     };
//   }
 
//   onCancel() {
//     this.TimePicker.close();
//   }
 
//   onConfirm(hour, minute) {
//     this.setState({ hour, minute });
//     this.TimePicker.close();
//   }
 
//   render() {
//     return (
//       <View style={styles.container}>
//         <Text
//           style={{
//               color: "black", fontSize: 24, fontWeight: "bold", marginTop: 8,
//               marginBottom: 20,
//           }}
//             >此项活动预计时长为</Text>
//         <TouchableOpacity 
//           onPress={() => this.TimePicker.open()}
//           style={{
//             // flexDirection: 'row',
//             borderBottomWidth: 1,
//             // alignItems: 'center',
//             borderColor: '#86939e',
//           }}
//           >
//         {this.state.hour||this.state.minute?(<Text style={{fontSize: 18}}>{this.state.hour}小时 {this.state.minute}分</Text>)
//         :(<Text style={{fontSize: 18}}>请选择时间</Text>)}
//         </TouchableOpacity>
//         {/* <TouchableOpacity
//           onPress={() => this.TimePicker.open()}
//           style={styles.button}
//         >
//           <Text style={styles.buttonText}>TIMEPICKER</Text>
//         </TouchableOpacity>
//         <Text style={styles.text}>{this.state.time}</Text> */}
//         <TimePicker
//           ref={ref => {
//             this.TimePicker = ref;
//           }}
//           hourUnit=' 小时'
//           minuteUnit=' 分'
//           textConfirm='确定'
//           textCancel='取消'
//           onCancel={() => this.onCancel()}
//           onConfirm={(hour, minute) => this.onConfirm(hour, minute)}
//         />
//       </View>
//     );
//   }
// }
 
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: "center",
//     backgroundColor: "#fff",
//     paddingTop: 100
//   },
//   text: {
//     fontSize: 20,
//     marginTop: 10
//   },
//   button: {
//     backgroundColor: "#4EB151",
//     paddingVertical: 11,
//     paddingHorizontal: 17,
//     borderRadius: 3,
//     marginVertical: 50
//   },
//   buttonText: {
//     color: "#FFFFFF",
//     fontSize: 16,
//     fontWeight: "600"
//   }
// });
 
// export default Example;


//=======================
// import React from 'react';
// import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';
// import { ListItem, Button, Badge } from 'react-native-elements';
// import TouchableScale from 'react-native-touchable-scale'; // https://github.com/kohver/react-native-touchable-scale

// import { Navigation } from 'react-native-navigation';
// import Modalize from 'react-native-modalize';
// import faker from 'faker';
// import commentTags from '../components/DummyCommentTags.json'


// export default class FixedContent extends React.Component {

//   modal = React.createRef();

//   componentDidMount() {
//     this.openModal();
//   }

//   renderContent = () => {
//     return (
//       <View style={s.content}>
//         <Text style={s.content__subheading}>{'Comment Tags'.toUpperCase()}</Text>
//         <Text style={s.content__heading}>选择评价标签</Text>
//         <View style={styles.container}>
//           <View style={styles.column}>
//           {commentTags.map((tag,i)=>{
//           if(tag.type==='good'){
//             return <ListItem
//               Component={TouchableScale}
//               friction={90} //
//               tension={100} // These props are passed to the parent component (here TouchableScale)
//               activeScale={0.98} //
//               leftIcon={ {name:'thumb-up'}}
//               containerStyle={styles.listContainerStyle}
//               key={i}
//               title={tag.title}
//               titleStyle={styles.listItem}
//               // bottomDivider={true}
//               onPress={()=>{console.log('select a good tag!')}}
//             />
//           }else {
//             return <></>
//           }
//         })}
//           </View>
//           <View style={styles.column}>
//           {commentTags.map((tag,i)=>{
//           if(tag.type==='bad'){
//             return <ListItem
//               Component={TouchableScale}
//               friction={90} //
//               tension={100} // These props are passed to the parent component (here TouchableScale)
//               activeScale={0.98} //
//               leftIcon={ {name:'thumb-down'}}
//               containerStyle={styles.listContainerStyle}
//               key={i}
//               title={tag.title}
//               titleStyle={styles.listItem}
//               // bottomDivider={true}
//               onPress={()=>{console.log('select a bad tag!')}}
//             />
//           }else{
//             return <></>
//           }
//         })}
//           </View>
//         </View>
//         {/* <Text style={s.content__description}>{faker.lorem.paragraph()}</Text>
//         <TextInput style={s.content__input} placeholder="Type your username" /> */}
        
//         {/* <TouchableOpacity
//           style={s.content__button}
//           activeOpacity={0.9}
//           onPress={this.closeModal}
//         >
//           <Text style={s.content__buttonText}>'确定'</Text>
//         </TouchableOpacity> */}
//       </View>
//     );
//   }

//   // onClosed = () => {
//   //   Navigation.dismissOverlay(this.props.componentId);
//   // }

//   openModal = () => {
//     if (this.modal.current) {
//       this.modal.current.open();
//     }
//   }

//   closeModal = () => {
//     if (this.modal.current) {
//       this.modal.current.close();
//     }
//   }

//   render() {
//     return (
//       <Modalize
//         ref={this.modal}
//         // onClosed={this.onClosed}
//         adjustToContentHeight
//       >
//         {this.renderContent()}
//       </Modalize>
//     );
//   }
// }

// const s = StyleSheet.create({
//   content: {
//     padding: 20,
//   },

//   content__icon: {
//     width: 32,
//     height: 32,

//     marginBottom: 20,
//   },

//   content__subheading: {
//     marginBottom: 2,

//     fontSize: 16,
//     fontWeight: '600',
//     color: '#ccc',
//   },

//   content__heading: {
//     fontSize: 24,
//     fontWeight: '600',
//     color: '#333',
//   },

//   content__description: {
//     paddingTop: 10,
//     paddingBottom: 10,

//     fontSize: 15,
//     fontWeight: '200',
//     lineHeight: 22,
//     color: '#666',
//   },

//   content__input: {
//     paddingVertical: 15,
//     marginBottom: 20,

//     width: '100%',

//     borderWidth: 1,
//     borderColor: 'transparent',
//     borderBottomColor: '#cdcdcd',
//     borderRadius: 6,
//   },

//   content__button: {
//     paddingVertical: 15,

//     width: '100%',

//     backgroundColor: '#333',
//     borderRadius: 6,
//   },

//   content__buttonText: {
//     color: '#fff',
//     fontSize: 15,
//     fontWeight: '600',
//     textAlign: 'center',
//   },
// });



// const styles = StyleSheet.create({
//   modalBackground: {
//     flex: 1,
//     alignItems: 'center',
//     flexDirection: 'column',
//     justifyContent: 'space-around',
//     backgroundColor: '#00000040'
//   },
//   container: {
//     marginTop:8,
//     flex: 1,
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//     alignItems: 'center' // if you want to fill rows left to right
//   },
//   column: {

//     width: '48%' // is 50% of container width

//   },
//   listContainerStyle:{
//       marginVertical: 8,
//       marginHorizontal:8,
//       backgroundColor: '#EAE8E8'
//   },
//   listItem:{
//       fontSize: 18,
//       height: 24,
//   }
//   // activityIndicatorWrapper: {
//   //   backgroundColor: '#FFFFFF',
//   //   height: 100,
//   //   width: 100,
//   //   borderRadius: 10,
//   //   display: 'flex',
//   //   alignItems: 'center',
//   //   justifyContent: 'space-around'
//   // }
// });


  
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Modalize from 'react-native-modalize';
import faker from 'faker';

export default class AlwaysOpen extends React.Component {

  modal = React.createRef();

  renderContent = () => (
    <View style={s.content}>
      <Text style={s.content__subheading}>{'Introduction'.toUpperCase()}</Text>
      <Text style={s.content__heading}>Always open modal!</Text>
      <Text style={s.content__description}>{faker.lorem.paragraph()}</Text>
    </View>
  )

  render() {
    return (
      <Modalize
        ref={this.modal}
        modalStyle={s.content__modal}
        alwaysOpen={85}
        handlePosition="inside"
      >
        {this.renderContent()}
      </Modalize>
    );
  }
}

const s = StyleSheet.create({
  content: {
    padding: 20,
  },

  content__modal: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
  },

  content__subheading: {
    marginBottom: 2,

    fontSize: 16,
    fontWeight: '600',
    color: '#ccc',
  },

  content__heading: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
  },

  content__description: {
    paddingTop: 10,
    paddingBottom: 10,

    fontSize: 15,
    fontWeight: '200',
    lineHeight: 22,
    color: '#666',
  },
});

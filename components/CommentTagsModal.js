import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';
import { ListItem, Button, Badge } from 'react-native-elements';
import TouchableScale from 'react-native-touchable-scale'; // https://github.com/kohver/react-native-touchable-scale

import { Navigation } from 'react-native-navigation';
import Modalize from 'react-native-modalize';
import faker from 'faker';
import commentTags from '../components/DummyCommentTags.json'


export default class FixedContent extends React.Component {

//   modal = React.createRef();

  componentDidMount() {
    // this.openModal();
  }

  renderContent = () => {
    return (
      <View style={s.content}>
        <Text style={s.content__subheading}>{'Comment Tags'.toUpperCase()}</Text>
        <Text style={s.content__heading}>选择评价标签</Text>
        <View style={styles.container}>
          <View style={styles.column}>
          {commentTags.map((tag,i)=>{
          if(tag.type==='good'){
            return <ListItem
              Component={TouchableScale}
              friction={90} //
              tension={100} // These props are passed to the parent component (here TouchableScale)
              activeScale={0.98} //
              leftIcon={ {name:'thumb-up'}}
              containerStyle={styles.listContainerStyle}
              key={i}
              title={tag.title}
              titleStyle={styles.listItem}
              // bottomDivider={true}
              onPress={()=>{console.log('select a good tag!')}}
            />
          }else {
            return <></>
          }
        })}
          </View>
          <View style={styles.column}>
          {commentTags.map((tag,i)=>{
          if(tag.type==='bad'){
            return <ListItem
              Component={TouchableScale}
              friction={90} //
              tension={100} // These props are passed to the parent component (here TouchableScale)
              activeScale={0.98} //
              leftIcon={ {name:'thumb-down'}}
              containerStyle={styles.listContainerStyle}
              key={i}
              title={tag.title}
              titleStyle={styles.listItem}
              // bottomDivider={true}
              onPress={()=>{console.log('select a bad tag!')}}
            />
          }else{
            return <></>
          }
        })}
          </View>
        </View>
        {/* <Text style={s.content__description}>{faker.lorem.paragraph()}</Text>
        <TextInput style={s.content__input} placeholder="Type your username" /> */}
        
        {/* <TouchableOpacity
          style={s.content__button}
          activeOpacity={0.9}
          onPress={this.closeModal}
        >
          <Text style={s.content__buttonText}>'确定'</Text>
        </TouchableOpacity> */}
      </View>
    );
  }

  onClosed = () => {
    // Navigation.dismissOverlay(this.props.componentId);
    this.props.onClosed()
  }

  render() {
    return (
      <Modalize
        ref={(e)=>this.props.setModalRef(e)}
        // onClosed={this.onClosed}
        adjustToContentHeight
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

  content__icon: {
    width: 32,
    height: 32,

    marginBottom: 20,
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

  content__input: {
    paddingVertical: 15,
    marginBottom: 20,

    width: '100%',

    borderWidth: 1,
    borderColor: 'transparent',
    borderBottomColor: '#cdcdcd',
    borderRadius: 6,
  },

  content__button: {
    paddingVertical: 15,

    width: '100%',

    backgroundColor: '#333',
    borderRadius: 6,
  },

  content__buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
});



const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000040'
  },
  container: {
    marginTop:8,
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center' // if you want to fill rows left to right
  },
  column: {

    width: '48%' // is 50% of container width

  },
  listContainerStyle:{
      marginVertical: 8,
      marginHorizontal:8,
      backgroundColor: '#EAE8E8'
  },
  listItem:{
      fontSize: 18,
      height: 24,
  }
  // activityIndicatorWrapper: {
  //   backgroundColor: '#FFFFFF',
  //   height: 100,
  //   width: 100,
  //   borderRadius: 10,
  //   display: 'flex',
  //   alignItems: 'center',
  //   justifyContent: 'space-around'
  // }
});

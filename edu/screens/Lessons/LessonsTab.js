import React from 'react';
import {
    // Button,
    StyleSheet,
    Text,
    ScrollView,
    View,
    ActivityIndicator,
    RefreshControl
} from 'react-native';
// import { Icon } from 'expo';
import { Button } from 'react-native-elements';
import { Stitch, RemoteMongoClient } from "mongodb-stitch-react-native-sdk";


// components
import LessonList from '../../components/InfoList';



export default class LessonsTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // lessons: [],
            // refreshing: false,
            // loading: false
        };

    }

    render() {
        const { navigation, lessons, classId } = this.props;
        console.log("here is from lesson tab")
        console.log(classId)


        return (
        //     this.state.loading ? (
        // <View style={[styles.loadingContainer, styles.horizontal]}>
        //         <ActivityIndicator size="small" color="#0000ff" />
        //     </View>
        //     ) : (
                 <ScrollView
                    style={styles.container}
                    refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this._onRefresh}
                    />}
                >
                <LessonList
                    titleName='title'
                    listIcon='class'
                    items={lessons}
                    navigation={this.props.navigation}
                    pageModel="LessonItemDetails"
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
                    title="添加课程"
                    classId = {classId}
                    onPress={() => (navigation.navigate("AddNewLesson", { classId: classId }))}
                />
            </ScrollView>
            )
        // )
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
    }
})

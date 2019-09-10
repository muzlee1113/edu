import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import StudentScreen from '../screens/StudentScreen';
import SettingsScreen from '../screens/SettingsScreen';

// Class related screen
import ClassScreen from '../screens/ClassScreen';
import ClassItemDetails from "../screens/ClassItemDetails";
import AddNewClass from "../screens/AddNewClass";

// Student related screen
import AddNewStudents from "../screens/Students/AddNewStudents";
import SelectStudents from "../screens/Students/SelectStudents"
import CreateSeatsMap from "../screens/Students/CreateSeatsMap"
import AssignStudentsToSeats from "../screens/Students/AssignStudentsToSeats"
// Lesson related screeen
import LessonItemDetails from "../screens/Lessons/LessonItemDetails"
import PrepLessonScreen from '../screens/Lessons/PrepLessonScreen'
import StartLessonScreen from '../screens/Lessons/StartLessonScreen'
import ReplyLessonScreen from '../screens/Lessons/ReplyLessonScreen'
import AddNewLesson from "../screens/Lessons/AddNewLesson"
import AddNewActivity from "../screens/Lessons/AddNewActivity"
import AddNewRubrics from "../screens/Lessons/AddNewRubrics"
import ActivityItemDetails from "../screens/Lessons/ActivityItemDetails"




// class tab
const ClassStack = createStackNavigator(
  {
    Class: ClassScreen,
    ClassItemDetails: ClassItemDetails,
    AddNewClass: AddNewClass,
    AddNewStudents: AddNewStudents,
    SelectStudents: SelectStudents,
    AddNewLesson: AddNewLesson,
    AddNewActivity: AddNewActivity,
    AddNewRubrics: AddNewRubrics,
    LessonItemDetails: LessonItemDetails,
    LessonPrepLesson: PrepLessonScreen,
    LessonStartLesson: StartLessonScreen,
    LessonReplyLesson: ReplyLessonScreen,
    CreateSeatsMap: CreateSeatsMap,
    AssignStudentsToSeats: AssignStudentsToSeats,
    ActivityItemDetails: ActivityItemDetails
  },
  {
    initialRouteName: "Class"
  }
);

ClassStack.navigationOptions = {
  tabBarLabel: '班级',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-school`
          : 'md-school'
      }
    />
  ),
};


// student tab
const StudentStack = createStackNavigator({
  Student: StudentScreen,
  AddNewStudents: AddNewStudents,
},
{
  initialRouteName: "Student"
}
);

StudentStack.navigationOptions = {
  tabBarLabel: '学生',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? `ios-people`
      : 'md-people'}
    />
  ),
};

// setting tab
const SettingsStack = createStackNavigator({
  Settings: SettingsScreen,
});

SettingsStack.navigationOptions = {
  tabBarLabel: '设置',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-options' : 'md-options'}
    />
  ),
};


// tab navigator
export default createBottomTabNavigator({
  ClassStack,
  StudentStack,
  SettingsStack,
});

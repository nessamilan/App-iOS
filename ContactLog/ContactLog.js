import React, {Component} from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import colors from '../assets/colors';
import Locations from './Locations';
import People from './People';
import CustomIcon from '../assets/icons/CustomIcon.js';
import {updateContactLog} from './actions.js';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Calendar from '../views/Calendar';
import TabView from '../views/TabView';
import DateConverter from '../utils/date';
import {getDaysWithLocations} from '../realm/realmLocationTasks';
import {strings} from '../locales/i18n';

class ContactLog extends Component {
  constructor() {
    super();
    this.state = {
      date: DateConverter.calendarFormat(new Date()),
      weekView: true,
      markedDates: {},
    };
  }

  componentDidMount() {
    this.fetchMarkedDays();
  }

  fetchMarkedDays = async () => {
    let markedDates = {};
    const dates = await getDaysWithLocations();

    dates.forEach(date => {
      markedDates[date] = {marked: true};
    });

    this.setState({
      markedDates,
    });
  };

  updateCalendarState = () => {
    this.setState({
      weekView: !this.state.weekView,
    });
  };

  render() {
    return (
      <>
        <SafeAreaView style={styles.status_bar} />
        <View style={styles.header}>
          <View style={styles.title_container}>
            <Image
              style={styles.logo}
              source={require('../assets/home/logo.png')}
            />
            <Text style={styles.title}>{strings("bottom.sheet_menu_item_contact_log")}</Text>
          </View>
          <TouchableOpacity
            style={styles.calendar_button}
            onPress={() => {
              this.updateCalendarState();
            }}>
            <CustomIcon
              name={'calendar24'}
              color={
                !this.state.weekView ? colors.primary_theme : colors.gray_icon
              }
              size={24}
            />
          </TouchableOpacity>
        </View>
        <Calendar
          current={this.state.date}
          markedDates={this.state.markedDates}
          handleDayPress={day => {
            this.setState({
              date: day.dateString,
              weekView: true,
            });
          }}
          weekView={this.state.weekView}>
          <TabView>
            <Locations tabLabel={strings('locations.text')} date={this.state.date} />
            <People tabLabel={strings('people.text')} />
          </TabView>
        </Calendar>
      </>
    );
  }
}

const styles = StyleSheet.create({
  status_bar: {
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.card_border,
    justifyContent: 'space-between',
  },
  title_container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 24,
    height: 24,
    marginRight: 5,
  },
  title: {
    fontSize: 24,
    color: colors.section_title,
    fontWeight: '500',
  },
});

ContactLog.propTypes = {
  updateContactLog: PropTypes.func,
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
  updateContactLog
}, dispatch);

export default connect(
  null,
  mapDispatchToProps,
)(ContactLog);

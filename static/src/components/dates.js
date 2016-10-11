import React, { Component } from 'react';
import { DateRangePicker, CalendarMonth } from 'react-dates';
import { START_DATE } from 'react-dates/constants';
import moment from 'moment';

export default class DateRangePickerWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      focusedInput: null,
    };

    this.onDatesChange = this.onDatesChange.bind(this);
    this.onFocusChange = this.onFocusChange.bind(this);
  }

  onDatesChange({ startDate, endDate }) {
    this.props.onDatesChange({ startDate, endDate });
  }

  onFocusChange(focusedInput) {
    this.setState({ focusedInput });
  }

  render() {
    const { focusedInput } = this.state;
    const { startDate, endDate} = this.props;
    return (
      <div className="dates">
        <DateRangePicker
          {...this.props}
          initialVisibleMonth = {function(){
            return moment(startDate);
          }}
          onDatesChange={this.onDatesChange}
          onFocusChange={this.onFocusChange}
          focusedInput={focusedInput}
          startDate={startDate}
          endDate={endDate}
          month={startDate}
        />
      </div>
    );
  }
}

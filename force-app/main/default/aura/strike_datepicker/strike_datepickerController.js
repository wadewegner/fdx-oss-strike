({
    init: function (component, event, helper) {
        component.set('v.dateDebouncer', helper.debounceCreator(component, 1, helper.processDateValue));
        helper.createLocaleDatePatternMap(component);
        helper.processDateValue(component);

        component.closeDatepicker = function(){
            if(component.isValid()){
                component.set('v.datePickerOpen', false);
            } else {
                window.removeEventListener('click', component.closeDatepicker);
            }
        }

        window.addEventListener('click', $A.getCallback(component.closeDatepicker));
    },
    valueChanged: function(component, event, helper) {
        var dateDebouncer = component.get('v.dateDebouncer');
        var value = component.get('v.value');
        var clickedValue = component.get('v.clickedValue');

        if(value == clickedValue){
            return;
        }

        component.set('v.clickedValue', null);
        dateDebouncer(component);
    },
    processNewDate: function(component, event, helper) {
        var currentValue = component.get('v.value');
        var displayDate = component.get('v.displayDate');
        var datePattern = component.get('v.valueFormat');
        var locale = helper.getLocale();
        var localeDatePattern = component.get('v.datePatternMap')[locale];

        var selectedDate = $A.localizationService.parseDateTime(displayDate, localeDatePattern, null, true);

        if(selectedDate == null){
            component.set('v.value', null);
            component.set('v.timestamp', null);
            return;
        }

        var formattedDisplayDate = $A.localizationService.formatDate(selectedDate.toString(), datePattern);

        if(currentValue == formattedDisplayDate){
            return;
        }

        component.set('v.value', formattedDisplayDate);
    },
    focusDateInput: function (component, event, helper) {
        var displayDate = component.get('v.displayDate');

        if(!$A.util.isEmpty(displayDate)){
            component.set('v.datePickerOpen', false);
        }
    },
    clickedDateInput: function(component, event, helper) {
        event.preventDefault();
        event.stopPropagation();
        var notDisabled = !component.get('v.disabled');
        var displayDate = component.get('v.displayDate');

        if(notDisabled && $A.util.isEmpty(displayDate)){
            helper.determineReadOnly(component);
            component.set('v.datePickerOpen', true);
        }
    },
    clickedDateIcon: function (component, event, helper) {
        event.preventDefault();
        event.stopPropagation();
        var notDisabled = !component.get('v.disabled');

        if(notDisabled){
            component.set('v.datePickerOpen', true);
        }
    },
    selectToday: function (component, event, helper) {
        var currentDate = new Date();
        var datePattern = component.get('v.valueFormat');
        var formattedValueDate = $A.localizationService.formatDate(currentDate.toString(), datePattern);

        component.set('v.value', formattedValueDate);
        component.set('v.datePickerOpen', false);
    },
    clickNext: function (component, event, helper) {
        event.stopPropagation();
        var currentMonth = Number(component.get('v.selectedMonth'));
        var monthLabels = component.get('v.monthLabels');
        var nextMonth;

        if (currentMonth === 11) {
            nextMonth = 0;
            helper.setSelectedYear(component, Number(component.get('v.selectedYear')) + 1);
        } else {
            nextMonth = currentMonth + 1;
        }

        component.set('v.selectedMonth', nextMonth);
        component.set('v.calendarRows', helper.getCalendarRows(component));
        component.set('v.selectedMonthText', monthLabels[nextMonth].fullName);
    },
    clickPrev: function (component, event, helper) {
        event.stopPropagation();
        var currentMonth = Number(component.get('v.selectedMonth'));
        var monthLabels = component.get('v.monthLabels');
        var prevMonth;

        if (currentMonth === 0) {
            prevMonth = 11;
            helper.setSelectedYear(component, Number(component.get('v.selectedYear')) - 1);
        } else {
            prevMonth = currentMonth - 1;
        }

        component.set('v.selectedMonth', prevMonth);
        component.set('v.calendarRows', helper.getCalendarRows(component));
        component.set('v.selectedMonthText', monthLabels[prevMonth].fullName);
    },
    yearChanged: function (component, event, helper) {
        component.set('v.calendarRows', helper.getCalendarRows(component));
    },
    preventBlur: function(component, event, helper){
        event.preventDefault();
    },
    clickDate: function (component, event, helper) {
        var selectedRowIndex = component.get('v.selectedDateRowIndex');
        var selectedColIndex = component.get('v.selectedDateColIndex');

        if (!$A.util.isEmpty(selectedRowIndex) && !$A.util.isEmpty(selectedRowIndex)) {
            var selectedDayObj = component.get('v.calendarRows')[selectedRowIndex][selectedColIndex];
            selectedDayObj.isSelected = false;
        }

        var clickedRowIndex = parseInt(event.currentTarget.dataset.row_index);
        var clickedColIndex = parseInt(event.currentTarget.dataset.col_index);
        var calendarRows = component.get('v.calendarRows');
        var clickedDayObj = component.get('v.calendarRows')[clickedRowIndex][clickedColIndex];

        clickedDayObj.isSelected = true;

        component.set('v.selectedDateRowIndex', clickedRowIndex);
        component.set('v.selectedDateColIndex', clickedColIndex);
        component.set('v.calendarRows', calendarRows);

        var selectedDay = parseInt(event.currentTarget.dataset.day);
        var selectedMonth = parseInt(event.currentTarget.dataset.month);
        var selectedYear = component.get('v.selectedYear');
        var timeStamp = Date.UTC(selectedYear, selectedMonth, selectedDay);

        var currentDate = new Date(selectedYear, selectedMonth, selectedDay);
        var datePattern = component.get('v.valueFormat');
        var localeDatePattern = component.get('v.datePatternMap')[helper.getLocale()];
        var formattedDisplayDate = $A.localizationService.formatDate(currentDate.toString(), localeDatePattern);
        var value = $A.localizationService.formatDate(currentDate.toString(), datePattern);

        component.set('v.clickedValue', value);
        component.set('v.value', value);
        component.set('v.displayDate', formattedDisplayDate);
        component.set('v.timestamp', timeStamp);
        component.set('v.currentDate', currentDate);
        component.set('v.datePickerOpen', false);

        helper.determineReadOnly(component);
    },
    preventDatePickerClose: function (component, event, helper) {
        event.stopPropagation();
    },
    showError: function(component, event, helper) {
        var errorMessage = event.getParam('arguments').errorMessage;

        component.set('v.errorMessage', errorMessage);
        component.set('v.error', true);
    },
    hideError: function(component, event, helper) {
        component.set('v.errorMessage', null);
        component.set('v.error', false);
    }
})
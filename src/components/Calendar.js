import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Button, Modal, Portal, Provider } from 'react-native-paper';

import { CalendarHeight, Color, KeyNotExistError, PresetHeight } from '../utils/Constants';
import { getCurrentDate } from '../utils/Functions';
import UserStorage from '../utils/UserStorage';
import { useMutation, useQuery } from '@apollo/client';
import { FETCH_POSTS_QUERY, FETCH_USER_MONTH_POSTS_QUERY } from '../utils/graphql/queries';
import DayEntryList from './YNDayEntryList';
import { DELETE_POST } from '../utils/graphql/mutations';

const breakfast = { color: Color.breakfast };
const lunch = { color: Color.lunch };
const dinner = { color: Color.dinner };
const midnightSnack = { color: Color.midnightSnack };

// const breakfast = { key: 'breakfast', color: Color.breakfast };
// const lunch = { key: 'lunch', color: Color.lunch };
// const dinner = { key: 'dinner', color: Color.dinner };
// const midnightSnack = { key: 'midnightSnack', color: Color.midnightSnack };

const styles = StyleSheet.create({
    containerStyle: {
        backgroundColor: 'white',
        paddingTop: 20,
        paddingHorizontal: 20,
        margin: 20,
        borderRadius: 5,
    }
})

function CustomizedCalendar() {
    const [visible, setVisible] = React.useState(false);
    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);
    const [deletePostId, setDeletePostId] = useState('');

    const storage = new UserStorage();
    const today = new Date();

    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [selectedDate, setSelectedDate] = useState(getCurrentDate());
    // const [markedDates, setMarkedDates] = useState({
    //     '2021-11-18': { dots: [breakfast, lunch, dinner], marked: true },
    //     '2021-11-22': { dots: [dinner, midnightSnack], marked: true },
    //     '2021-11-24': { dots: [breakfast, dinner, midnightSnack], marked: true },
    // });
    const [markedDates, setMarkedDates] = useState({
        [selectedDate]: { selected: true, selectedColor: Color.primary },
    });

    const { loading, data, refetch } = useQuery(FETCH_USER_MONTH_POSTS_QUERY, {
        variables: {
            month: (today.getMonth() + 1).toString(),
            year: (today.getFullYear()).toString()
        },
        notifyOnNetworkStatusChange: true,
    });

    useEffect(() => {
        refetch();
    });

    useEffect(() => {
        if (data) {
            if (data.getUserMonthPosts) {
                setPosts(data.getUserMonthPosts);
                const markedDatesObj = {};
                var iterateDate = '';
                for (let post of data.getUserMonthPosts) {
                    const currDate = post.ateTime.substring(0, 10);
                    if (iterateDate == currDate) {
                        const dotsList = markedDatesObj[currDate].dots;
                        dotsList.push({ ...breakfast, key: dotsList.length });
                    }
                    else {
                        markedDatesObj[currDate] = { dots: [{ ...breakfast, key: 0 }], marked: true };
                    }
                    iterateDate = currDate;
                }
                setMarkedDates({ ...markedDates, ...markedDatesObj });
            }
        }
        if (!loading) {
            setIsLoading(false);
        }

    }, [loading]);

    const [deletePost, { }] = useMutation(DELETE_POST, {
        update(proxy, result) {
            setPosts(posts.filter(post => post.id !== deletePostId));
            const newDotsList = markedDates[selectedDate].dots;
            newDotsList.pop();
            setMarkedDates({
                ...markedDates,
                [selectedDate]: { ...markedDates[selectedDate], dots: newDotsList }
            });
            const currYear = (new Date(selectedDate).getFullYear()).toString();
            const currMonth = (new Date(selectedDate).getMonth() + 1).toString();

            const data = proxy.readQuery({
                query: FETCH_USER_MONTH_POSTS_QUERY,
                variables: {
                    year: currYear,
                    month: currMonth
                }
            });
            const newData = data.getUserMonthPosts.filter(post => post.id !== deletePostId);
            proxy.writeQuery({
                query: FETCH_USER_MONTH_POSTS_QUERY,
                data: { getUserMonthPosts: newData },
                variables: {
                    year: currYear,
                    month: currMonth
                }
            });

            const allPosts = proxy.readQuery({ query: FETCH_POSTS_QUERY });
            const afterDeletedPosts = allPosts.getPosts.filter(post => post.id !== deletePostId);
            proxy.writeQuery({ query: FETCH_POSTS_QUERY, data: { getPosts: afterDeletedPosts } });
        },
        variables: {
            postId: deletePostId
        }
    });



    // useEffect(() => {
    //     async function fetchDots() {
    //         console.log('fetch dot');
    //         const dateString = selectedDate.split('-');
    //         const endDate = new Date(dateString[0], dateString[1] - 1, 0).getDate();
    //         setMarkedDates({});
    //         var result;
    //         for (var i = 1; i <= endDate; i++) {
    //             const date = i < 10 ? '0' + i : i.toString();
    //             result = await storage.retrieveOneDayData(dateString[0], dateString[1], date);

    //             if (result != KeyNotExistError) {
    //                 var newDotsList = [];
    //                 for (var keyId = 0; keyId < result.length; keyId++) {
    //                     var newDot;
    //                     if (result[keyId]['meal'] == 'breakfast') {
    //                         newDot = { ...breakfast, key: keyId };
    //                     }
    //                     else if (result[keyId]['meal'] == 'lunch') {
    //                         newDot = { ...lunch, key: keyId };
    //                     }
    //                     else if (result[keyId]['meal'] == 'dinner') {
    //                         newDot = { ...dinner, key: keyId };
    //                     }
    //                     else {
    //                         newDot = { ...midnightSnack, key: keyId };
    //                     }
    //                     newDotsList.push(newDot);
    //                 }
    //                 setMarkedDates({ ...markedDates, [dateString[0] + '-' + dateString[1] + '-' + date]: { dots: newDotsList }, marked: true });
    //             }
    //         }
    //     }
    //     fetchDots();
    // }, [selectedDate]);



    return (
        <View>
            <Calendar
                style={{
                    height: CalendarHeight,
                    borderBottomWidth: 2,
                    borderBottomColor: Color.gray300
                }}
                markingType={'multi-dot'}
                markedDates={markedDates}
                // Initially visible month. Default = Date()
                //current={'2012-03-01'}
                // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
                minDate={'2012-05-10'}
                // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
                maxDate={getCurrentDate()}
                // Handler which gets executed on day press. Default = undefined
                onDayPress={(day) => {
                    const dateKey = day.dateString;

                    // TODO: marked dot soft code (has to move to other section) (adding dot example code)
                    // var newDotsList = [breakfast];
                    // if (dateKey in markedDates && 'dots' in markedDates[dateKey]) {
                    //     newDotsList = newDotsList.concat(markedDates[dateKey]['dots']);
                    // }

                    // TODO: marked dot soft code ("dots: newDotsList" has to be removed)
                    setMarkedDates({
                        ...markedDates,
                        [selectedDate]: { ...markedDates[selectedDate], selected: false },
                        [dateKey]: { ...markedDates[dateKey], selected: true, selectedColor: Color.primary }
                    });
                    setSelectedDate(dateKey);
                }}
                // Handler which gets executed on day long press. Default = undefined
                onDayLongPress={(day) => { console.log('selected day', day) }}
                // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
                monthFormat={'MMMM yyyy'}
                // Handler which gets executed when visible month changes in calendar. Default = undefined
                onMonthChange={(dateObj) => {
                    refetch({
                        year: dateObj.year.toString(),
                        month: dateObj.month.toString(),
                    });
                }}
                // Hide month navigation arrows. Default = false
                hideArrows={false}
                // Replace default arrows with custom ones (direction can be 'left' or 'right')
                // renderArrow={(direction) => (<Arrow/>)}
                // Do not show days of other months in month page. Default = false
                hideExtraDays={true}
                // If hideArrows = false and hideExtraDays = false do not switch month when tapping on greyed out
                // day from another month that is visible in calendar page. Default = false
                disableMonthChange={false}
                // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday
                firstDay={1}
                // Hide day names. Default = false
                hideDayNames={false}
                // Show week numbers to the left. Default = false
                showWeekNumbers={false}
                // Handler which gets executed when press arrow icon left. It receive a callback can go back month
                onPressArrowLeft={subtractMonth => subtractMonth()}
                // Handler which gets executed when press arrow icon right. It receive a callback can go next month
                onPressArrowRight={addMonth => addMonth()}
                // Disable left arrow. Default = false
                disableArrowLeft={false}
                // Disable right arrow. Default = false
                disableArrowRight={false}
                // Disable all touch events for disabled days. can be override with disableTouchEvent in markedDates
                disableAllTouchEventsForDisabledDays={true}
                // Replace default month and year title with custom one. the function receive a date as parameter
                // renderHeader={(date) => {/*Return JSX*/}}
                // Enable the option to swipe between months. Default = false
                enableSwipeMonths={true}

                theme={{
                    todayTextColor: Color.primary,
                    arrowColor: Color.primary
                }}
            />

            <DayEntryList
                posts={posts.filter(post => post.ateTime.substring(0, 10) == selectedDate)}
                showModal={showModal}
                deletePost={(postId) => {
                    setDeletePostId(postId);
                }}
                loading={isLoading}
            />

            <Provider>
                <Portal>
                    <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.containerStyle}>
                        <Text style={{ fontSize: 15, color: Color.gray900 }}>Are you sure you want to delete this post?</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Button mode="text" onPress={hideModal} color={Color.gray500} style={{ width: 100, marginVertical: 10 }}>
                                Cancel
                            </Button>
                            <Button
                                mode="text"
                                onPress={() => {
                                    deletePost();
                                    hideModal();
                                }}
                                color={Color.errorText}
                                style={{ width: 100, marginVertical: 10 }}
                            >
                                YES
                            </Button>
                        </View>
                    </Modal>
                </Portal>
            </Provider>
        </View>

    );
};

export default CustomizedCalendar;
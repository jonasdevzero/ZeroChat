import moment from "moment"
import dateUtil from './dateUtil'
import { GroupMessage, ContactMessage } from "../types/user"

/*
    Takes the messages and returns an object with the key equal to the day of the messages
    and the value is an array with the messages.

    ex:
    {
        '2021-05-21': [...messages],
        '2021-05-22': [...messages],
        '2021-05-23': [...messages],
    }
*/
function messagesDay(messages: GroupMessage[] & ContactMessage[]) {
    return messages.reduce((acc, crr) => {
        const messageDay = moment(crr.created_at).format("YYYY-MM-DD");
        return acc[messageDay] ? { ...acc, [messageDay]: acc[messageDay].concat([crr]) } : { ...acc, [messageDay]: [crr] };
    }, {});
};

/*
    Receive the messages, separate them using the messages Day function,
    sort the messages, and put everything together in a single array
*/
function orderMessages(messages: GroupMessage[] & ContactMessage[]) {
    if (!messages) return [];

    const days = messagesDay(messages)
    const sortedDays = Object.keys(days).sort((x, y) => moment(y, "YYYY-MM-DD").unix() - moment(x, "YYYY-MM-DD").unix())

    const sortedMessages = sortedDays.reduce((acc: any, date) => {
        const dateFormat = dateUtil.getDay(days[date][0].created_at)
        const sortedMessages = days[date].sort((x, y) =>  moment(x.created_at).unix() - moment(y.created_at).unix())

        return [{ type: "day", date: dateFormat, id: date }, ...sortedMessages].concat(acc)
    }, [])

    return sortedMessages
}

// Replace a position room
function orderRooms<T extends any[]>(arr: T, from: number, to: number) {
    arr?.splice(to, 0, arr?.splice(from, 1)[0]);
    return arr;
}

export default {
    orderMessages,
    orderRooms,
}

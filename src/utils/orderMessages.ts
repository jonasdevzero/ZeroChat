import moment from "moment";
import { GroupMessageI, ContactMessageI } from "../types/user";

function getDay(day: Date) {
    const dayFormated = moment(day).format('YYYY-MM-DD');
    const dayUnix = moment(day).unix();
    const date = new Date();

    if (dayFormated === moment(date).format('YYYY-MM-DD')) {
        return 'Today';
    } else if (dayFormated === moment(date.getDay() - 1).format('YYYY-MM-DD')) {
        return 'Yesterday'
    } else if (dayUnix >= moment(date.getDay() - 4).unix() && dayUnix <= moment(date.getDay() - 2).unix()) {
        return moment(day).format('dddd');
    }

    return dayFormated;
};

function messagesDay(messages: GroupMessageI[] & ContactMessageI[]) {
    return messages.reduce((acc, crr) => {
        const messageDay = moment(crr.created_at).format("YYYY-MM-DD");

        if (acc[messageDay]) {
            return { ...acc, [messageDay]: acc[messageDay].concat([crr]) };
        };

        return { ...acc, [messageDay]: [crr] };
    }, {});
};

export default function orderMessages(messages: GroupMessageI[] & ContactMessageI[]) {
    if (!messages) return [];

    const days = messagesDay(messages);
    const sortedDays = Object.keys(days).sort((x, y) => moment(y, "YYYY-MM-DD").unix() - moment(x, "YYYY-MM-DD").unix());

    const items = sortedDays.reduce((acc: any, date) => {
        const dateFormat = getDay(days[date][0].created_at);
        const sortedMessages = days[date].sort((x, y) =>  moment(x.created_at).unix() - moment(y.created_at).unix());

        return [{ type: "day", date: dateFormat, id: date }, ...sortedMessages].concat(acc);
    }, []);

    return items;
};

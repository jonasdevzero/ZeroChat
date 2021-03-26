import moment from "moment";
import { GroupMessageI, ContactMessageI } from "../types/user";

function messagesDay(messages: GroupMessageI[] & ContactMessageI[]) {
    return messages.reduce((acc, crr) => {
        const messageDay = moment(crr.posted_at).format("YYYY-MM-DD");
        if (acc[messageDay]) {
            return { ...acc, [messageDay]: acc[messageDay].concat([crr]) };
        };

        return { ...acc, [messageDay]: [crr] };
    }, {});
};

export default function orderMessages(messages: GroupMessageI[] & ContactMessageI[]) {
    const days = messagesDay(messages);
    const sortedDays = Object.keys(days).sort((x, y) => moment(y, "YYYY-MM-DD").unix() - moment(x, "YYYY-MM-DD").unix());

    const items = sortedDays.reduce((acc: any, date) => {
        const sortedMessages = days[date].sort((x, y) => y.posted_at - x.posted_at);

        return [{ type: "day", date: date.replace(/-/g, "/"), id: date }, ...sortedMessages].concat(acc);
    }, []);

    return items;
};

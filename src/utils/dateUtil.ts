import moment from "moment"

function getDay(day: Date) {
    const dayFormated = moment(day).format('YYYY-MM-DD');
    const dayUnix = moment(day).unix();
    const date = new Date();

    if (dayFormated === moment(date).format('YYYY-MM-DD')) {
        return 'Today';
    } else if (dayFormated === moment(date.getDay() - 1).format('YYYY-MM-DD')) {
        return 'Yesterday'
    } else if (dayUnix >= moment(date.getDay() - 4).unix() && dayUnix <= moment(date.getDay() - 2).unix()) {
        return moment(day).format('dddd')
    }

    return dayFormated
}

function convertSeconds(time: number) {
    const measuredTime = new Date(null)
    measuredTime.setSeconds(time)

    return measuredTime.toISOString().substr(11, 8)
}

export default {
    getDay,
    convertSeconds,
}


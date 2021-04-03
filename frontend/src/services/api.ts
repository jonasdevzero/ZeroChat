import axios from "axios";

export default axios.create({
    baseURL: "https://back-zerochat.herokuapp.com/",
});

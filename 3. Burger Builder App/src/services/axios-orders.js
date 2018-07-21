import axios from "axios";

const instance = axios.create({
  baseURL: "https://my-burger-builder-react-app.firebaseio.com"
});

export default instance;

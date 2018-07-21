import axios from "./../axios-orders";

class OrderService {
  static order(data, succeed, failed) {
    axios
      .post("/orders.json", data)
      .then(response => {
        console.log("Got the response", response);
      })
      .then(() => {
        succeed();
      })
      .catch(e => {
        console.log(e);
        failed();
      });
  }
}

export default OrderService;

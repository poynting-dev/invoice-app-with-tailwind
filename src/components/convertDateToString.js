import { Timestamp } from "firebase/firestore";
import { fDate } from "../utils/formatTime";

export default function convertDateToString(date) {
  var formattedDate = date.toDate();
  formattedDate = formattedDate.toDateString();
  // console.log(formattedDate + "| type: " + typeof formattedDate);
  return fDate(formattedDate);
}

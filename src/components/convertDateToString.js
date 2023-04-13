import { Timestamp } from "firebase/firestore";

export default function convertDateToString(date) {
  //   const istTime = date.toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
  //   const istDate = new Date(istTime);
  //   const istTimestamp = Timestamp.fromDate(istDate);
  //   console.log("Time:-" + istTimestamp.toDate().toDateString());

  console.log("Type: " + typeof date);
  console.log("Date: " + date);
  //   var newDate = date.toDate();
  //   var dateString = date.toDateString();

  return date;
}

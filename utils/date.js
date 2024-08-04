function timestampToDate(timestamp) {
  // Create a new Date object based on the timestamp
  const date = new Date(timestamp);

  // Extract date components
  const month = date.getMonth() + 1; // Months are zero indexed
  const day = date.getDate();
  const year = date.getFullYear();

  // Format the date as mm -- dd -- yyyy
  const formattedDate = `${month.toString().padStart(2, "0")}-${day
    .toString()
    .padStart(2, "0")}-${year}`;

  return formattedDate;
}

function timestampToDateWithTime(timestamp) {
  const date = new Date(timestamp);

  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  hours = hours ? hours : 12; // Handle midnight (0 hours)

  const formattedDateTime = `${month}-${day}-${year} ${hours.toString().padStart(2, "0")}:${minutes}:${seconds} ${ampm}`;

  return formattedDateTime;
}



module.exports = { timestampToDate,timestampToDateWithTime };

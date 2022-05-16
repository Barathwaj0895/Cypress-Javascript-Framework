const path = require('path');
const fse = require("fs-extra");

let cypressReportFolderPath = path.join(__dirname, "reports");
let HistoryReports = path.join(__dirname, "HistoryReports");
let date_obj = new Date();
let now_date = date_obj.getDate();
let now_month = date_obj.getMonth() + 1;
let now_year = date_obj.getFullYear();
let time_stamp = date_obj.getTime();
let todays_date = `${now_month}${now_date}${now_year}${time_stamp}`.toString();
let folderToCopyReport = path.join(__dirname + "/HistoryReports", `reports_${todays_date}`);


fse.mkdir(HistoryReports, {}, err => {
  if (err) {

  }
  else {
    console.log("HistoryReports folder created successfully for archieving!")
  }
})

fse.mkdir(folderToCopyReport, {}, err => {
  if (err) {

  }
})

if (fse.existsSync(cypressReportFolderPath)) {
  console.log("Reports folder exists, good for archieving!")
}
else {
  console.log("Reports folder does not exists, archieving might fail!")
}

fse.copy(cypressReportFolderPath, folderToCopyReport, function (err) {
  if (err) {
    console.error(err);
  } else {
    console.log("Reports archieved!");
  }
});

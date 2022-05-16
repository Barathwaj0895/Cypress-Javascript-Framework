let fs = require('fs');
let  nodemailer = require('nodemailer');
const archiver = require('archiver');
const path = require('path');

let date_obj = new Date();
let now_date = date_obj.getDate();
let now_month = date_obj.getMonth()+1;
let now_year = date_obj.getFullYear();
let todays_date = `${now_month}${now_date}${now_year}`.toString();
let zipped_dir_path = `./cypress/reports-${todays_date}.zip`;

function compressDirectory(source,out) {
  const archive = archiver('zip');
  const stream = fs.createWriteStream(out);

  return new Promise((resolve, reject) => {
    archive.pipe(stream)
    stream.on('close', () => resolve());
    archive.on('error', err => reject(err))
    
    archive.directory(source, false)
    archive.finalize();
    console.log(`Reports folder compressed successfully!`)
  });
}

compressDirectory("./cypress/reports", `${zipped_dir_path}`)

let mail = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'asdftesting4@gmail.com',
      pass: 'Testing@123'
    }
  });

let email_body = fs.readFileSync ("./results_to_email_body", 'utf8');


let mailOptions = {
    from: 'asdftesting4@gmail.com',
    to: 'nagaharika.kowkuntla@contractors.glossier.com',
    subject: `CI Testing Email - ${todays_date}`,
    text: `${email_body}`,
    attachments: [{
        path: `${zipped_dir_path}`
    }]
  }
   
  mail.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

const nodemailer=require('nodemailer')
const pug=require('pug')
const htmlToText=require('html-to-text')
const catchAsync = require("./../utils/catchAsync");

const sendinBlue = require('nodemailer-sendinblue-transport');

//new Email(user,url).sendWelcome()

module.exports=class Email{
    constructor(user,url){
        this.to=user.email
        this.firstName=user.name.split(' ')[0]
        this.url=url
        this.from=`Evwerhamre Israel <${process.env.EMAIL_FROM}>`
    }

    newTransport(){
        if(process.env.NODE_ENV==='production'){
            //sendgrid
            //return 1
            return nodemailer.createTransport({
             //service: 'SendinBlue', // no need to set host or port etc.
             host:'smtp-relay.sendinblue.com',
            port:'587',
                auth: {
                  user: process.env.SENDINBLUE_USERNAME,
                  pass:process.env.SENDINBLUE_PASSWORD 
                }
              });
        }
        return nodemailer.createTransport({
            host:process.env.EMAIL_HOST,
            port:process.env.EMAIL_PORT,
            auth:{
                user:process.env.EMAIL_USERNAME,
                pass:process.env.EMAIL_PASSWORD
            }
            //Activate in gmail "Less secure app option" i.e, if you want to use Gmail
        })
    }
    
    //send the actual email
    async send(template,subject){
        //1.Render Html based on a pug template
        const html=pug.renderFile(`${__dirname}/../views/emails/${template}.pug`,{
            firstName:this.firstName,
            url:this.url,
            subject
        })
        //2. define email options
        const mailOptions={
            from:this.from,
            to:this.to,
            subject,
            html,
            text:htmlToText.fromString(html)
        }

        //3. Create a transport and send email
        await this.newTransport().sendMail(mailOptions)
    }

    async sendWelcome(){
        await this.send('welcome','welcome to the Natours family!')
    }
    async sendPasswordReset(){
        await this.send('passwordReset','Your password reset token valid for only 10 minutes')
    }
}





/*
const sendEmail=catchAsync(async options=>{
    //1.Create a transporter
    const transporter=nodemailer.createTransport({
        host:process.env.EMAIL_HOST,
        port:process.env.EMAIL_PORT,
        auth:{
            user:process.env.EMAIL_USERNAME,
            pass:process.env.EMAIL_PASSWORD
        }
        //Activate in gmail "Less secure app option" i.e, if you want to use Gmail
    })
    //2.Define the email options
    const mailOptions={
        from:'Evwerhamre Israel <kpos@gmail.com>',
        to:options.email,
        subject:options.subject,
        text:options.message,
    }
    //3.send the email
   await transporter.sendMail(mailOptions)
})

module.exports=sendEmail
*/

//const sendinBlue = require('nodemailer-sendinblue-transport');
//return nodemailer.createTransport({
//  service: 'SendinBlue', // no need to set host or port etc.
//  auth: {
//    user: 'your email',
//    pass: 'password'
//  }
//});

//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
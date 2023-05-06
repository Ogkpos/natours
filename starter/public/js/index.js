import '@babel/polyfill'
import {displayMap} from './leaflet'
import {login,logout,signup} from './login'
import { updateSettings } from './updateSettings'
import { bookTour } from './stripe'
import { leaveReview, deleteReview, editReview } from './review';
import { showAlert } from './alerts'


//DOM ElEMENTS
const leaflet=document.getElementById('map')
const signupForm=document.querySelector('.form--signup')
const loginForm=document.querySelector('.form--login')
const logoutButton=document.querySelector('.nav__el--logout')
const userDataForm=document.querySelector('.form-user-data')
const userPasswordForm=document.querySelector('.form-user-password')
const bookBtn=document.getElementById('book-tour')
const reviewDataForm=document.querySelector('.review--form')
const reviews=document.querySelector('.reviews')


//DELEGATION
if(leaflet){
    const locations = JSON.parse(document.getElementById('map').dataset.locations);
    displayMap(locations)
}

if(signupForm){
    signupForm.addEventListener('submit',e=>{
        e.preventDefault()
        const name=document.getElementById('name').value
        const email=document.getElementById('email').value
        const password=document.getElementById('password').value
        const passwordConfirm=document.getElementById('passwordConfirm').value
        signup(name,email,password,passwordConfirm)
    })
}

if(loginForm){ 
document.querySelector('.form').addEventListener('submit',(e)=>{
    e.preventDefault()
    const email=document.getElementById('email').value
    const password=document.getElementById('password').value
    login(email,password)
})
}

if(logoutButton){
    logoutButton.addEventListener('click',logout)
}
 
if(userDataForm){
    userDataForm.addEventListener('submit',e=>{
        e.preventDefault()

        //const name= document.getElementById('name').value
        //const email=document.getElementById('email').value
        //updateSettings({name,email},'data')

        const form=new FormData()
        form.append('name' ,document.getElementById('name').value)
        form.append('email',document.getElementById('email').value)
        form.append('photo',document.getElementById('photo').files[0])
        

        updateSettings(form,'data') 

        
        
    }) 
}
if(userPasswordForm){
    userPasswordForm.addEventListener('submit',async e=>{
        document.querySelector('.btn--save-password').textContent='Updating...'

        e.preventDefault()
        const passwordCurrent=document.getElementById('password-current').value
        const password=document.getElementById('password').value
        const passwordConfirm=document.getElementById('password-confirm').value
        await updateSettings({password,passwordCurrent,passwordConfirm},'password')

        document.querySelector('.btn--save-password').textContent='SAVE PASSWORD'
        document.getElementById('password-current').value=''
        document.getElementById('password').value=''
        document.getElementById('password-confirm').value=''

    })  
}

if(bookBtn){
    bookBtn.addEventListener('click',e=>{
        e.target.textContent='processing...'
        const {tourId}=e.target.dataset

        bookTour(tourId)
    }) 
}

const alertMessage=document.querySelector('body').dataset.alert
if(alert) showAlert('success',alertMessage,20)



if(reviewDataForm){
    reviewDataForm.addEventListener('submit',e=>{
        e.preventDefault()
        const review = document.getElementById('review').value;
        const rating = document.getElementById('rating').value;
        const {user,tour}=JSON.parse(reviewDataForm.dataset.ids)
        leaveReview(review,rating,tour,user)
        document.getElementById('review').textContent = '';
        document.getElementById('rating').textContent = '';
    }) 
}

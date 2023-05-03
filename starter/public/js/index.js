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



//if (reviews)
//  reviews.addEventListener('click', (e) => {
//    if (e.target.tagName === 'BUTTON') {
//      const button = e.target;
//      const reviewsCard = button.closest('.reviews__card');
//      const reviews = reviewsCard.parentNode;
//      if (button.textContent === 'Delete') {
//        const reviewId = button.dataset.reviewId;
//        deleteReview(reviewId);
//        setTimeout(() => {
//          reviews.removeChild(reviewsCard);
//        }, 500);
//      } else if (button.textContent === 'Edit') {
//        const reviewText = reviewsCard.querySelector('.reviews__text');
//        const reviewRatingBox = reviewsCard.querySelector('.reviews__rating');
//
//        /// Cancel button
//        let cancel = document.createElement('button');
//        cancel.className = 'review__change review__cancel';
//        cancel.id = 'review__cancel';
//        cancel.textContent = 'Cancel';
//        cancel.setAttribute('data-review-text', reviewText.textContent);
//
//        /// Find the rating number
//        const stars = reviewsCard.querySelectorAll('.reviews__star--active');
//
//        // InputReview
//        const inputReview = document.createElement('textarea');
//        inputReview.style.width = '25.8rem';
//        inputReview.className = 'reviews__text';
//        inputReview.value = reviewText.textContent;
//
//        // InputRating
//        const inputRating = document.createElement('input');
//        inputRating.className = 'reviews__rating-input';
//        inputRating.type = 'number';
//        inputRating.value = stars.length;
//
//        reviewsCard.insertBefore(inputReview, reviewText);
//        reviewsCard.insertBefore(inputRating, reviewRatingBox);
//        reviewsCard.append(cancel);
//
//        reviewsCard.removeChild(reviewText);
//        button.textContent = 'Save';
//        button.setAttribute('data-review-id', button.dataset.reviewId);
//      } else if (button.textContent === 'Cancel') {
//        const cancelBtn = reviewsCard.querySelector('.review__cancel');
//        const editBtn = reviewsCard.querySelector('.review__edit');
//        const reviewTextContent = cancelBtn.dataset.reviewText;
//        const inputReview = reviewsCard.querySelector('.reviews__text');
//        const inputRating = reviewsCard.querySelector('.reviews__rating-input');
//
//        const reviewText = document.createElement('p');
//        reviewText.className = 'reviews__text';
//        reviewText.textContent = reviewTextContent;
//
//        reviewsCard.insertBefore(reviewText, inputReview);
//
//        reviewsCard.removeChild(inputReview);
//        reviewsCard.removeChild(inputRating);
//
//        reviewsCard.removeChild(cancelBtn);
//        editBtn.textContent = 'Edit';
//      } else if (button.textContent === 'Save') {
//        const inputReview = reviewsCard.querySelector('.reviews__text');
//        const inputRating = reviewsCard.querySelector('.reviews__rating-input');
//        const cancelBtn = reviewsCard.querySelector('.review__cancel');
//        reviewsCard.removeChild(cancelBtn);
//
//        const reviewText = document.createElement('p');
//        reviewText.className = 'reviews__text';
//        reviewText.textContent = inputReview.value;
//        reviewsCard.insertBefore(reviewText, inputReview);
//
//        reviewsCard.removeChild(inputReview);
//        reviewsCard.removeChild(inputRating);
//
//        editReview(
//          +inputRating.value,
//          reviewText.textContent,
//          button.dataset.reviewId
//        );
//
//        button.textContent = 'Edit';
//      }
//    }
//  });
//
//const alertMessage = document.querySelector('body').dataset.alert;
//if (alertMessage) showAlert('success', alertMessage, 6);
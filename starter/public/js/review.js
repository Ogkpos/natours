import axios from 'axios'
import {showAlert} from '/alerts'

export const leaveReview=async (review,rating,tour,user)=>{
try {
    const res=await axios({
        method:'POST',
        url:`/api/v1/tours/${tour}/reviews`,
        data:{
            review,
            rating,
            tour,
            user
        }

    })
    if(res.data.status==='success'){
        showAlert('success','Review was successfully uploaded')
        window.setTimeout(()=>{
            location.reload(true)
        },1500)
    }
    
} catch (err) {
    showAlert('error','You can leave only one review')
}
}

export const editReview=async (review,rating,reviewId)=>{
    try {
        const res=await axios({
            method:'PATCH',
            url:`/api/v1/reviews/${reviewId}`,
            data:{
                review,
                rating
            }
        })
        if(res.data.status=='success'){
            showAlert('success','Review was succesfully edited!')
            window.setTimeout(()=>{
                location.reload(true)
            },1500)
        }
        
    } catch (err) {
        showAlert('error','Error with editing review!')
        
    }
}


export const deleteReview = async (reviewId) => {
    try {
      const res = await axios({
        method: 'DELETE',
        url: `/api/v1/reviews/${reviewId}`,
      });
  
      if (res.status === 204) {
        showAlert('success', 'Review was succesfully deleted!');
        window.setTimeout(() => {
          location.reload(true);
        }, 600);
      }
    } catch (err) {
      showAlert('error', 'Error with deleting review!');
    }
  };
import axios from 'axios'
import { showAlert } from './alerts'
const stripe=Stripe('pk_test_51MplX2LIpXlIR1WA7rjoSdURfF9LOEKTpVQg11EQ2CWA6TdILgpDKIjLWFiAZ1shm6Z0IgZ8w5kBQwlurbaklPjW00JfF4CsAf')

export const bookTour=async function(tourId){
    try{
    //1 Get checkout utsession from endpooint/api
    const session=await axios(`/api/v1/bookings/checkout-session/${tourId}`)
    
    //2 create checkout form+charge the credit card
    await stripe.redirectToCheckout({
        sessionId:session.data.session.id
    })
    }catch(err){
        
        showAlert('error',err)
    }
}
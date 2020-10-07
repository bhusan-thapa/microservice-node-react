import {useState} from 'react';
import userRequest from '../hooks/use-request';

export default ({comments,id}) =>{
  const [rating,setRating] = useState(5);
  const [review,setReview] = useState('');
  const {doRequest,errors} = userRequest({
    url: `/api/products/add-comment/${id}`,
    method: 'put',
    body:{
      rating,
      comments:review   
     },
    onSuccess: console.log('done')
})
const renderStar = count =>{
  let stars = [];
 for(let i =1; i<=count; i++){
    stars.push(<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-star-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.283.95l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
  </svg>);
}
return stars.map((obj,i)=> obj);
}
  const renderComments = ()=>{
    console.log(comments);
    if(comments==-undefined || comments.length === 0){
      return <h5>No comments to show</h5>
    }else{
      return comments.map(comment=>{
        return(
        <a href="#" class="list-group-item list-group-item-action">
            <div class="d-flex w-100 justify-content-between">
        <h5 class="mb-1">{renderStar(parseInt(comment.rating))}</h5>
            <small>{comment.comments}</small>
            </div>
            
        </a>
            );
      })
    }
  }

  return (
    <div>
      <div class="list-group">
      {renderComments()}
    </div>
    <div class="input-group">
  <div class="input-group-prepend">
    <span class="input-group-text">Rating and Review</span>
  </div>
  <input 
  value={rating}
  onChange= {e=>setRating(e.target.value)}
  type="number" aria-label="rating" class="form-control"/>
  <input 
   value={review}
   onChange={e=>setReview(e.target.value)}
  type="text" aria-label="review" class="form-control"/>
  <button 
            onClick={()=>doRequest()}
            class="btn btn-outline-secondary" type="button" id="button-addon1">Submit</button>
  
</div>
{errors}
 </div>
    
  );
}
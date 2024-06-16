import React from 'react'
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import { CiCirclePlus } from "react-icons/ci";
import { CiCircleMinus } from "react-icons/ci";


function UpdateQty({item}) {
   
  return (
    <div>
          <a className="btn " data-bs-toggle="offcanvas" href="#offcanvasExample" role="button" aria-controls="offcanvasExample">
       edit
   </a>

<div className="offcanvas offcanvas-start"  id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
  <div className="offcanvas-header">
    <h5 className="offcanvas-title" id="offcanvasExampleLabel">Edit Product</h5>
    <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close">X</button>
  </div>
  <div className="offcanvas-body">
  <div className='edit'>
        <div className="editImg">
            <img src={item.thumbnail} alt="" />
        </div>
        <div className="editInfo">
            <p>{item.title.length > 15 ? item.title.slice(0 ,13)+"..." : item.title}</p>
            <p> ₹ {item.price}</p>
            <div className="btns">
             <span>Qty :</span>
            <CiCircleMinus className='qtyUpdate'/>
             <p>{item.qty}</p>
             <CiCirclePlus className='qtyUpdate'/>
            </div>
        </div>
       

    </div>
    

  </div>

</div>  
     
    </div>
  )
}

export default UpdateQty



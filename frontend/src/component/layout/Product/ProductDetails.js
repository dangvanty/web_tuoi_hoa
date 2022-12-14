import React, { Fragment, useEffect, useState } from 'react'
import Carousel from 'react-material-ui-carousel'
import './ProductDetails.scss'

import { useSelector, useDispatch } from 'react-redux'
import {
  getProductDetails,
  clearErrors,
  newReview,
  getProductForCata,
} from '../../../actions/productAction'

import MetaData from '../MetaData'
import { Link, useParams } from 'react-router-dom'
import ReviewCard from './ReviewCard '
import Loader from '../Loader/Loader'
import Footer from '../Home/Footer/Footer'
import { useAlert } from 'react-alert'
import { addItemsToCart } from '../../../actions/cartAction'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from '@material-ui/core'
import { Rating } from '@material-ui/lab'
import { formatNumber } from '../../helper/formatPrice'
import { NEW_PRODUCT_RESET } from '../../../constants/productContant'
import ProductCard from '../Home/ProductCard/ProductCard'

const ProductDetails = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const alert = useAlert()
  const { product, loading, error } = useSelector(
    (state) => state.productDetails
  )
  const { success, error: reviewError } = useSelector(
    (state) => state.newReview
  )
  const { user } = useSelector((state) => state.user)
  const test= ()=>{
    if(!user){
      return false
    }
    if(
      product.review
    ){
      for (let review of product.reviews) {
      
        if (user._id === review.userID) {
          return true
        }
        
      }
    }
  }
  const {
    products,
  } = useSelector((state) => state.productCata)

  const options = {
    size: 'large',
    value: product.ratings,
    readOnly: true,
    precision: 0.5,
  }

  const [quantity, setQuantity] = useState(1)
  const [open, setOpen] = useState(false)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')

  const increaseQuantity = () => {
    if (product.Stock <= quantity) return

    const qty = quantity + 1
    setQuantity(qty)
  }

  const decreaseQuantity = () => {
    if (1 >= quantity) return

    const qty = quantity - 1
    setQuantity(qty)
  }

  const addToCartHandler = () => {
    if (product.Stock === 0) {
      return alert.error('S???n ph???m ???? b??n h???t, m???i b???n ch???n s???n ph???m kh??c!')
    }
    const checkItems = JSON.parse(localStorage.getItem('cartItems'))||[]
    for (let item of checkItems) {
      console.log(item)
      if (item.product === id) {
        return alert.info('S???n ph???m ???? c?? trong gi??? h??ng!')
      }
    }
    dispatch(addItemsToCart(id, quantity))
    alert.success('Th??m v??o gi??? h??ng th??nh c??ng!')
  }
  const submitReviewToggle = () => {
    open ? setOpen(false) : setOpen(true)
  }

  const reviewSubmitHandler = () => {
    if(!user){
      return alert.error("B???n ph???i ????ng nh???p m???i g???i ????nh gi??!")
    }
    const myForm = new FormData()

    myForm.set('rating', rating)
    myForm.set('comment', comment)
    myForm.set('productId', id)

    dispatch(newReview(myForm))

    setOpen(false)
  }

  let arr=[]
  const check = ()=>{
    let b = products.sort(() => Math.random() - 0.5)
    let a =0 
    b.map(item=>{
      if(a<4){
        if(item.category === product.category){
          if(item._id !== product._id){
            arr.push(item)
            a++
          }
        }
      }
    })
    
  } 
  check()
  useEffect(() => {
    window.scrollTo(0, 0);
    // if (error) {
    //   alert.error(error)
    //   dispatch(clearErrors())
    // }

    if (reviewError) {
      alert.error('Kh??ng g???i ???????c!')
      dispatch(clearErrors())
    }

    if (success) {
      alert.success('G???i ????nh gi?? th??nh c??ng!')
      dispatch({ type: NEW_PRODUCT_RESET })
    }
    dispatch(getProductDetails(id))
    dispatch(getProductForCata())
  }, [dispatch, id, error, alert, reviewError, success])

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title={`${product.name} | Tuoi Hoa`} />
          <div className="ProductDetails">
            <div>
              <Carousel>
                {product.images &&
                  product.images.map((item, i) => (
                    <img
                      className="CarouselImage"
                      key={i}
                      src={item.url}
                      alt={`${i} Slide`}
                    />
                  ))}
              </Carousel>
            </div>
            <div>
              <div className="detailsBlock-1">
                <h2>{product.name}</h2>
                <p>Product # {product._id}</p>
              </div>
              <div className="detailsBlock-2">
                <Rating {...options} />
                <span className="detailsBlock-2-span">
                  {' '}
                  ({product.numOfReviews} l?????t ????nh gi??)
                </span>
              </div>
              {product.category ==="xe m??y" ? (
                <div className="detailsBlock-3">
                <div className="btn-lienhe">
                <Link to={`/contact`}>Li??n h??? mua h??ng</Link>
               </div>

                <p>
                  Tr???ng th??i:
                  <b className={product.Stock < 1 ? 'redColor' : 'greenColor'}>
                    {product.Stock < 1 ? ' B??n h???t' : ' C??n h??ng'}
                  </b>
                </p>
              </div>
              ):(
                <div className="detailsBlock-3">
                <h1>{`${formatNumber(product.price)} ??`}</h1>
                <div className="detailsBlock-3-1">
                  <div className="detailsBlock-3-1-1">
                    <button onClick={decreaseQuantity}>-</button>
                    <input readOnly type="number" value={quantity} />
                    <button onClick={increaseQuantity}>+</button>
                  </div>
                  <button onClick={addToCartHandler}>Th??m v??o gi???</button>
                </div>

                <p>
                  Tr???ng th??i:
                  <b className={product.Stock < 1 ? 'redColor' : 'greenColor'}>
                    {product.Stock < 1 ? ' B??n h???t' : ' C??n h??ng'}
                  </b>
                </p>
              </div>
              )}
              <div className="detailsBlock-4">
                M?? t??? : <p>{product.description}</p>
              </div>

              <button onClick={submitReviewToggle} className="submitReview">
              {test()===true ? "S???a ????nh gi??" : "G???i ????nh gi??"}
              </button>
            </div>
          </div>

          <h3 className="reviewsHeading">????nh gi?? s???n ph???m</h3>
          <div className="reviewsHeading-line"></div>

          <Dialog
            aria-labelledby="simple-dialog-title"
            open={open}
            onClose={submitReviewToggle}
          >
            <DialogTitle>G???i ????nh gi??</DialogTitle>
            <DialogContent className="submitDialog">
              <Rating
                onChange={(e) => setRating(e.target.value)}
                value={rating}
                size="large"
              />

              <textarea
                className="submitDialogTextArea"
                cols="30"
                rows="5"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              ></textarea>
            </DialogContent>
            <DialogActions>
              <Button onClick={submitReviewToggle} color="secondary">
                H???y
              </Button>
              <Button onClick={reviewSubmitHandler} color="primary">
                ????nh gi??
              </Button>
            </DialogActions>
          </Dialog>

          {product.reviews && product.reviews[0] ? (
            <div className="reviews">
              {product.reviews &&
                product.reviews.map((review) => (
                  <ReviewCard key={review._id} review={review} />
                ))}
            </div>
          ) : (
            <p className="noReviews">Ch??a c?? ????nh gi?? n??o!</p>
          )}
          <h3 className="reviewsHeading">S???n ph???m li??n quan</h3>
           <div className="reviewsHeading-line"></div>
           <div className="products">
           
              {arr &&
                arr.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
          </div>
        </Fragment>
      )}
      <Footer />
    </Fragment>
  )
}

export default ProductDetails

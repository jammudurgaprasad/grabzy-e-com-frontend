import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';
import '../css/ShowProduct.css';
import Navbar from './Navbar';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';



export default function ShowProduct() {
  const { id } = useParams();
  const [p, setP] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [user, setUser] = useState(null);
  const nav = useNavigate();
  const [showCartAnim, setShowCartAnim] = useState(false);
  const [showWishlistAnim, setShowWishlistAnim] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);





const Skeleton = () => (
  <div className="show-wrapper">
    <div className="image-section">
      <div className="main-image image-skeleton" />
      <div className="thumbnail-row desktop-only">
        {[...Array(4)].map((_, i) => (
          <div className="thumb-skeleton" key={i} />
        ))}
      </div>
    </div>

    <div className="info-skeleton">
      <div className="text-line title-skeleton" />
      <div className="text-line price-skeleton" />
      <div className="text-line short-line" />

      {/* Simulated size buttons */}
      <div className="size-skeleton">
        {[...Array(4)].map((_, i) => (
          <div className="size-btn-skeleton" key={i} />
        ))}
      </div>

      {/* Description block */}
      <div className="text-line desc-line" />
      <div className="text-line desc-line" />
      <div className="text-line desc-line short-line" />

      <div className="button-skeleton-row">
        <div className="button-skeleton" />
        <div className="button-skeleton" />
      </div>
    </div>
  </div>
);

  useEffect(() => {
  const fetchData = async () => {
    try {
      const userRes = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/users/check-user-auth`, { withCredentials: true });
      setUser(userRes.data);

      const productRes = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/product/${id}`);
      setP(productRes.data);

      if (userRes.data?.userId) {
        const wishlistCheckRes = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/wishlist/check`, {
          params: {
            userId: userRes.data.userId,
            productId: productRes.data.productId,
          },
          withCredentials: true,
        });
        setInWishlist(wishlistCheckRes.data);
      }

    } catch (error) {
      nav('/login');
    }
  };

  fetchData();
}, [id, nav]);


  const images = [p?.image1, p?.image2, p?.image3, p?.image4].filter(Boolean);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => setActiveIndex((prev) => (prev + 1) % images.length),
    onSwipedRight: () => setActiveIndex((prev) => (prev - 1 + images.length) % images.length),
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

const addToCart = async () => {
  if (Array.isArray(p.sizes) && p.sizes.length > 0 && !selectedSize) {
    alert('Please select a size.');
    return;
  }

  if (!user?.userId) {
    alert('User not authenticated.');
    return;
  }

  try {
    await axios.post(`${process.env.REACT_APP_API_BASE_URL}/carts`, {
      product: { productId: p.productId },
      user: { id: user.userId },
      quantity: 1,
      size: selectedSize || ''
    }, { withCredentials: true });

    setShowCartAnim(true);

    // Wait 2 seconds before redirecting to /cart
    setTimeout(() => {
      nav('/cart');
    }, 3000); // Adjust duration to match animation length
  } catch {
    alert('Failed to add to cart.');
  }
};


const toggleWishlist = async () => {
  if (!user?.userId) {
    alert('User not authenticated.');
    return;
  }

  try {
    if (inWishlist) {
      // Remove from wishlist
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/wishlist/remove`, {
        params: {
          userId: user.userId,
          productId: p.productId,
        },
        withCredentials: true,
      });
      setInWishlist(false);
    } else {
      // Add to wishlist
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/wishlist`, {
        user: { id: user.userId },
        product: { productId: p.productId }
      }, { withCredentials: true });

      setShowWishlistAnim(true);
      setTimeout(() => setShowWishlistAnim(false), 3000);
      setInWishlist(true);
    }
  } catch (err) {
    console.error(err);
    alert('Wishlist action failed.');
  }
};




  if (!p) return (
  <>
    <Navbar />
    <div className="show-container">
      <Skeleton />
    </div>
  </>
);


  return (
    <>
    <Navbar/>
{showWishlistAnim && (
  <div style={{
    position: 'fixed',
    top: 0, left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(255,255,255,0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999
  }}>
    <div style={{ width: '250px', height: '250px' }}>
      <DotLottieReact
        src="https://lottie.host/25c695b0-c0bf-4162-86b9-8cff35fbd346/WkM8SXutR3.lottie"
        autoplay
      />
    </div>
  </div>
)}



{showCartAnim && (
  <div style={{
    position: 'fixed',
    top: 0, left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(255,255,255,0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999
  }}>
    <div style={{ width: '250px', height: '250px' }}>
      <DotLottieReact
        src="https://lottie.host/50465224-dfdb-448c-8499-78457f626a30/TxJE0ZvLGB.lottie"
        autoplay
      />
    </div>
  </div>
)}


    <div className="show-container">
      <div className="show-wrapper">
        {/* Image section */}
        <div className="image-section">
          <div className="main-image" {...swipeHandlers}>
            <img src={images[activeIndex]} alt="main" />
          </div>
          <div className="thumbnail-row desktop-only">
            {images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`thumb-${idx}`}
                className={`thumb ${activeIndex === idx ? 'active' : ''}`}
                onClick={() => setActiveIndex(idx)}
              />
            ))}
          </div>
        </div>

        {/* Info section */}
        <div className="info-section">
          <h2>{p.productName}</h2>
          
<div className="sp-price-details">
  <span className="sp-discount-price">₹{Math.floor(p.discountPrice)}</span>
  <span className="sp-actual-price">₹{Math.floor(p.actualPrice)}</span>
  <span className="sp-discount-percent">({p.discountPercentage}% OFF)</span>
</div>


          {/* Size selection */}
          {Array.isArray(p.sizes) && p.sizes.length > 0 && (
            <div className="sizes">
              <p>Select Size:</p>
              <div className="size-options">
                {p.sizes.map((s, i) => (
                  <button
                    key={i}
                    className={`size-btn ${selectedSize === s ? 'selected' : ''}`}
                    onClick={() => setSelectedSize(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          {/* <div className="description" dangerouslySetInnerHTML={{ __html: p.description }} /> */}

          {/* Buttons */}
          <div className="actions">
            <button className="add-cart" onClick={addToCart}>Add to Cart</button>
            {/* <button className="wishlist-btn" onClick={addToWishlist}>Add to Wishlist</button> */}
            <button className="wishlist-btn" onClick={toggleWishlist}>
              {inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
            </button>
          </div>
          {/* Description */}
          <div className="description" dangerouslySetInnerHTML={{ __html: p.description }} />
        </div>
      </div>
    </div>
    </>
  );
}

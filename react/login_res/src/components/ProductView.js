import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/navbar';
import axios from 'axios';
import './productview.css';

const ProductView = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('overview'); // State for tabs

  const userData = JSON.parse(localStorage.getItem('userData'));

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productResponse = await axios.get(`${process.env.REACT_APP_API_URL}/ProductView/${id}`);
        const productData = productResponse.data;

        if (productData.status === 'ok') {
          setProduct(productData.data);
        } else {
          setError(productData.message);
        }

        const reviewsResponse = await axios.get(`${process.env.REACT_APP_API_URL}/productReviews/${id}`);
        const reviewsData = reviewsResponse.data;

        if (reviewsData.status === 'ok') {
          setReviews(reviewsData.data);
        } else {
          setError(reviewsData.message);
        }
      } catch (error) {
        setError('An error occurred: ' + error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  const handleEnquiry = async (e) => {
    e.preventDefault();

    if (!userData) {
      window.localStorage.setItem('redirectAfterLogin', window.location.pathname);
      window.location.href = '/login';
      return;
    }

    const form = e.target;
    const formData = new FormData(form);

    const enquiryData = {
      productname: formData.get('name'),
      product_id: id,
      productPrice: product.sellingPrice,
      vendorId: product.vendorId._id,
      UserId: userData._id,
      Username: userData.fname,
      UserNumber: userData.number,
    };

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/sendEnquiry`, enquiryData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = response.data;

      if (data.status === 'ok') {
        setMessage('Enquiry sent successfully!');
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage('An error occurred: ' + error.message);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container1 mt-4">
        {product ? (
          <div className="row">
            <div className="col-md-9 productDetails">
              <div className="row productrow">
                <div className="col-md-5">
                  {product.image ? (
                    <img
                      src={`${process.env.REACT_APP_API_URL}/${product.image.replace('\\', '/')}`}
                      className="img-fluid"
                      alt={product.name}
                    />
                  ) : (
                    <img
                      src="path_to_default_image.jpg"
                      className="img-fluid"
                      alt="default"
                    />
                  )}
                </div>
                <div className="col-md-7">
                  <h3 className='productName'>{product.name}</h3>
                
                  <p className="des">{product.smalldescription}</p>
                  <div className="enquirydetails">
                <p className='reviewcount'>⭐ 0.0 (0 Reviews)</p>
                <span className="sellingprice">₹{product.sellingPrice}</span>
                <span className="originalprice">
                  <s>₹{product.originalPrice}</s>
                </span>
               
                <form onSubmit={handleEnquiry}>
                  <button className="btn btn-primary sendenq">Send Enquiry</button>
                </form>
                {message && <p>{message}</p>}
              </div>
                </div>
              </div>
            </div>
            <div className="col-md-3 sellerDetails">
             
              <div className="seller">
                <h3>Seller Details</h3>
                {product.vendorId ? (
                  <>
                    <h6 className='Proprietor'><i class='far fa-user'></i> Proprietor</h6>
                    <p>{product.vendorId.fname}</p>
                    <h6 className='Proprietor'> <i class='fas fa-landmark'></i> Company</h6>
                   
                    <p>{product.vendorId.businessName}</p>
                    <h6 className='Proprietor'>  <i class='fas fa-mail-bulk'></i>Email</h6>
                   
                    <p> {product.vendorId.email}</p>
                    <h6 className='Proprietor'><i class="fa fa-phone"></i>Contact Number</h6>
                    <p>{product.vendorId.number}</p>
                    <h6 className='Proprietor'> <i class='fas fa-map-marker-alt'></i>Address</h6>
                    <p>{product.vendorId.Address}</p>
                   
                  </>
                ) : (
                  <p>No vendor details available.</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <p>Product not found.</p>
        )}

        {/* Tab Navigation */}
        <div className='overview'>
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => handleTabClick('overview')}
          >
            Product Overview
          </button>
          <button
            className={`tab ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => handleTabClick('reviews')}
          >
            Reviews
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content mt-4">
          {activeTab === 'overview' && (
            <div className="productOverview">
              <h3>Product Overview</h3>
              <p className="des">{product.description}</p>
            </div>
          )}
          {activeTab === 'reviews' && (
            <div className="allreviews">
              <h2>All Reviews</h2>
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <div key={review._id} className="review-card">
                    <div className="review-header">
                      <h5>{review.Username}</h5>
                      <p className="review-date">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="review-body row">
                      <div className="col-sm-3">
                        {review.image && (
                          <img
                            src={`${process.env.REACT_APP_API_URL}/${review.image.replace(
                              '\\',
                              '/'
                            )}`}
                            alt="Review"
                            className="review-image"
                          />
                        )}
                      </div>
                      <div className="review-rating col-sm-2">
                        <span className="rating-label">Rating:</span>
                        <span className={`rating-stars rating-${review.starRate}`}></span>
                      </div>
                      <p className="col-sm-3">
                        <strong>Response:</strong>{' '}
                        {review.Response ? '👍' : '👎'}
                      </p>
                      <p className="col-sm-2">
                        <strong>Quality:</strong>{' '}
                        {review.Quality ? '👍' : '👎'}
                      </p>
                      <p className="col-sm-2">
                        <strong>Delivery:</strong>{' '}
                        {review.Delivery ? '👍' : '👎'}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p>No reviews yet.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div></div>
  );
};

export default ProductView;

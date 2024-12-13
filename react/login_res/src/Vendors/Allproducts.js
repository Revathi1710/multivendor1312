import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import VendorHeader from './vendorHeader';
import '../SuperAdmin/addcategory.css';
import './sidebar2.css';
import './UserProfile.css';
import './allproduct.css';

const Allproducts = () => {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);
  const [activeSubMenu, setActiveSubMenu] = useState(null);
  const [vendorData, setVendorData] = useState({ selectType: '' }); // Define vendorData state

  useEffect(() => {
    const vendorId = localStorage.getItem('vendorId');
    if (!vendorId) {
      alert('Vendor ID not found in local storage');
      return;
    }

    // You need to define vendortoken or remove this request if not used
    const vendortoken =  localStorage.getItem('vendortoken'); // Define or get vendortoken if needed

    axios.post(`${process.env.REACT_APP_API_URL}/vendorData`, { vendortoken })
      .then(response => {
        if (response.data.status === 'ok') {
          setVendorData(response.data.data);
        } else {
          setError(response.data.message);
        }
      })
      .catch(error => {
        console.error('Error:', error);
        setError(error.message);
      });

    fetch(`${process.env.REACT_APP_API_URL}/getVendorProduct`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ vendorId })
    })
    .then(response => response.json())
    .then(data => {
      if (data.status === 'ok') {
        setProducts(data.data);
      } else {
        console.error('Error:', data.message);
        setMessage('Error fetching products: ' + data.message);
      }
    })
    .catch(error => {
      console.error('Fetch error:', error);
      setMessage('Error fetching products');
    });
  }, []);

  const handleUpdate = (productId) => {
    window.location.href = `/Vendor/UpdateProduct/${productId}`;
  };

  const handleSubMenuToggle = (index) => {
    setActiveSubMenu(activeSubMenu === index ? null : index);
  };

  const handleDelete = (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      fetch(`${process.env.REACT_APP_API_URL}/deleteProductVendor`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId })
      })
      .then(response => response.json())
      .then(data => {
        if (data.status === 'ok') {
          // Remove the deleted product from the state
          setProducts(products.filter(product => product._id !== productId));
          setMessage('Product deleted successfully');
        } else {
          console.error('Error:', data.message);
          setMessage('Error deleting product: ' + data.message);
        }
      })
      .catch(error => {
        console.error('Delete error:', error);
        setMessage('Error deleting product');
      });
    }
  };

  return (
    <div>
      <VendorHeader />
      <div className="content row mt-4">
        <div className='col-sm-2 mt-5'>
          <ul className='VendorList'>
            <li className='list'><i className="fa fa-laptop"></i> Dashboard</li>
          </ul>
          <ul className="nano-content VendorList">
            <li className={`sub-menu list ${activeSubMenu === 5 ? 'active' : ''}`}>
              <a href="#!" onClick={() => handleSubMenuToggle(5)}>
                <i className="fa fa-cogs"></i><span>Profile</span><i className="arrow fa fa-angle-right pull-right"></i>
              </a>
              <ul style={{ display: activeSubMenu === 5 ? 'block' : 'none' }}>
                <li><Link to="/Vendor/UserProfile">User Profile</Link></li>
                <li><Link to="/Vendor/BusinessProfile">Business Profile</Link></li>
                <li><Link to="/Vendor/BankDetails">Bank Details</Link></li>
              </ul>
            </li>
            <li className={`sub-menu list ${activeSubMenu === 0 ? 'active' : ''}`}>
              <a href="#!" onClick={() => handleSubMenuToggle(0)}>
                <i className="fa fa-cogs"></i><span>Category</span><i className="arrow fa fa-angle-right pull-right"></i>
              </a>
              <ul style={{ display: activeSubMenu === 0 ? 'block' : 'none' }}>
                <li><Link to="/Vendor/AllCategory">All Categories</Link></li>
                <li><Link to="/Vendor/AddCategory">Add New Category</Link></li>
              </ul>
            </li>
            {vendorData.selectType === "Product Based Company" && (
              <li className={`sub-menu list ${activeSubMenu === 3 ? 'active' : ''}`}>
                <a href="#!" onClick={() => handleSubMenuToggle(3)}>
                  <i className="fa fa-cogs"></i><span>Product</span><i className="arrow fa fa-angle-right pull-right"></i>
                </a>
                <ul style={{ display: activeSubMenu === 3 ? 'block' : 'none' }}>
                  <li><Link to="/Vendor/AllProduct">All Product</Link></li>
                  <li><Link to="/Vendor/AddProductVendor">Add Product</Link></li>
                </ul>
              </li>
            )}
            {vendorData.selectType === "Service Based Company" && (
              <li className={`sub-menu list ${activeSubMenu === 1 ? 'active' : ''}`}>
                <a href="#!" onClick={() => handleSubMenuToggle(1)}>
                  <i className="fa fa-cogs"></i><span>Service</span><i className="arrow fa fa-angle-right pull-right"></i>
                </a>
                <ul style={{ display: activeSubMenu === 1 ? 'block' : 'none' }}>
                  <li><Link to="/Vendor/AllService">All Service</Link></li>
                  <li><Link to="/Vendor/AddService">Add Service</Link></li>
                </ul>
              </li>
            )}
            <li className={`sub-menu list ${activeSubMenu === 2 ? 'active' : ''}`}>
              <a href="#!" onClick={() => handleSubMenuToggle(2)}>
                <i className="fa fa-cogs"></i><span>Enquiry</span><i className="arrow fa fa-angle-right pull-right"></i>
              </a>
              <ul style={{ display: activeSubMenu === 2 ? 'block' : 'none' }}>
                <li><Link to="/Vendor/AllEnquiry">All Enquiry</Link></li>
              </ul>
            </li>
            <ul className='VendorList'>
              <li className='list'><Link to="/Vendor/MyOrders" className='listout'><i className="fa fa-laptop"></i>My Orders</Link></li>
            </ul>
          </ul>
        </div>
        <div className='col-sm-7'>
        <div className="title">
              <h2>All Products</h2>
            </div>
          <div  className='allproductDetails'>
            

            {message && <p>{message}</p>}
            {products.length > 0 ? (

              <div className="">
                
                
                  {products.map((product) => (
                    <div className="productDetailsvendor row" key={product._id}>
                      <div className='col-sm-4'>
                        {product.image ? (
                          <img
                            src={`${process.env.REACT_APP_API_URL}/${product.image.replace('\\', '/')}`}
                            alt={product.name}
                            style={{ width: '150px', height: '150px' }}
                          />
                        ) : (
                          <span>No Image</span>
                        )}
                      </div>
                      <div className='col-sm-6'>
                        <h4>{product.name}</h4>
                      <div class="price"><s>₹{product.originalPrice}</s>
                      ₹{product.sellingPrice}</div>
                      </div>
                        <div className='col-sm-2'>
                        <button onClick={() => handleUpdate(product._id)} className="btn btn-warning"><i class='fas fa-edit'></i></button>
                        <button onClick={() => handleDelete(product._id)} className="btn btn-danger"><i class='fas fa-trash-alt'></i></button>
                        </div>
                    </div>
                  ))}
                
              </div>
            ) : (
              <p>No products found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Allproducts;

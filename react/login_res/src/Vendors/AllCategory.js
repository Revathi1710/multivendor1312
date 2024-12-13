import React, { useState, useEffect } from 'react';
import Sidebar from './Vendorsidebar '; // Ensure the correct path
import '../SuperAdmin/addcategory.css';
import './table.css';

const AllCategory = () => {
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const vendorId = localStorage.getItem('vendorId');
    if (!vendorId) {
      alert('Vendor ID not found in local storage');
      return;
    }

    fetch(`${process.env.REACT_APP_API_URL}/getVendorCategory`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ vendorId })
    })
    .then(response => response.json())
    .then(data => {
      if (data.status === 'ok') {
        setCategories(data.data);
      } else {
        console.error('Error:', data.message);
        setMessage('Error fetching categories: ' + data.message);
      }
    })
    .catch(error => {
      console.error('Fetch error:', error);
      setMessage('Error fetching categories');
    });
  }, []);

  const handleUpdate = (categoryId) => {
    window.location.href = `/Vendor/UpdateCategory/${categoryId}`;
  };

  const handleDelete = (categoryId) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      fetch(`${process.env.REACT_APP_API_URL}/deleteCategoryVendor`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ categoryId })
      })
      .then(response => response.json())
      .then(data => {
        if (data.status === 'ok') {
          // Remove the deleted category from the state
          setCategories(categories.filter(category => category._id !== categoryId));
          alert('Category deleted successfully');
        } else {
          console.error('Error:', data.message);
          setMessage('Error deleting category: ' + data.message);
        }
      })
      .catch(error => {
        console.error('Delete error:', error);
        setMessage('Error deleting category');
      });
    }
  };

  return (
    <div>
      <Sidebar />
      <div className="" style={{ marginLeft: '250px' }}>
        <div class="title">
        <h2>All Categories</h2></div>
        {message && <p>{message}</p>}
        {categories.length > 0 ? (
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Name</th>
                <th>Slug</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category._id}>
                  <td>{category.name}</td>
                  <td>{category.slug}</td>
                  <td>
                    <span className={`badge ${category.active ? 'bg-success' : 'bg-danger'}`}>
                      {category.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm me-2"
                      onClick={() => handleUpdate(category._id)}
                    >
                      Update
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(category._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No Categories found</p>
        )}
      </div>
    </div>
  );
};

export default AllCategory;

"use client";
import React, { useState } from "react";
import styles from "./AddProductForm.module.scss";
import axios from "axios";

const AddProductForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    thumbnail: "",
    desc: "",
    rating: "",
    availableQty: "",
    category: "",
    imgs: ["", "", "", ""],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleImgChange = (e, index) => {
    const newImgs = [...formData.imgs];
    newImgs[index] = e.target.value;
    setFormData({
      ...formData,
      imgs: newImgs,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSubmit = {
      ...formData,
      imgs: formData.imgs.filter((img) => img.trim() !== ""),
    };

    try {
      const req = await axios.post(
        `${process.env.NEXT_PUBLIC_HOST_NAME}/api/Products`,
        { formData: formDataToSubmit }
      );
      if (req.data.success) {
        alert("data added");
      } else {
        alert("error in adding data");
      }
    } catch (err) {
      return;
    }

    setFormData({
      ...formData,
      title: "",
      price: "",
      thumbnail: "",
      desc: "",
      rating: "",
      availableQty: "",
      category: "",
      imgs: ["", "", "", ""],
    });
    return;
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.h2}>Add Product</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
        </div>
        <div className={styles.formGroup}>
          <label>Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
          />
        </div>
        <div className={styles.formGroup}>
          <label>Thumbnail URL</label>
          <input
            type="text"
            name="thumbnail"
            value={formData.thumbnail}
            onChange={handleChange}
          />
        </div>
        <div className={styles.formGroup}>
          <label>Description</label>
          <textarea
            name="desc"
            value={formData.desc}
            onChange={handleChange}
          ></textarea>
        </div>
        <div className={styles.formGroup}>
          <label>Rating</label>
          <input
            type="number"
            step="0.1"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
          />
        </div>
        <div className={styles.formGroup}>
          <label>Available Quantity</label>
          <input
            type="number"
            name="availableQty"
            value={formData.availableQty}
            onChange={handleChange}
          />
        </div>
        <div className={styles.formGroup}>
          <label>Category</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
          />
        </div>
        <div className={styles.formGroup}>
          <label>Image URLs</label>
          {formData.imgs.map((img, index) => {
              return <div key={index}>
              <input
              type="text"
              name={`img${index}`}
              value={img}
              onChange={(e) => handleImgChange(e, index)}
            />
            <br /><br />
            </div>
          })}
        </div>
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
};

export default AddProductForm;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Dash = () => {
  const [products, setProducts] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [myOrders, setMyOrders] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [contactInfo, setContactInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    image: null,
    description: "",
    price: "",
    contact: "",
  });

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) {
      toast.error("Please login to access dashboard.");
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
      return;
    }
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:6002/products");
      setProducts(response.data);
    } catch (err) {
      toast.error("Failed to fetch products");
    } finally {
      setMyOrders(false);
      setLoading(false);
    }
  };

  const fetchMyOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:6002/myOrders", { userId });
      setProducts(res.data);
      setMyOrders(true);
    } catch (err) {
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      toast.error("You must be logged in to add a product.");
      return;
    }

    const data = new FormData();
    data.append("name", formData.name);
    data.append("image", formData.image);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("contact", formData.contact);
    data.append("userId", userId);

    try {
      await axios.post("http://localhost:6002/addProduct", data);
      toast.success("Product added successfully");
      fetchProducts();
      setFormVisible(false);
    } catch (err) {
      toast.error("Failed to upload product");
    }
  };

  const handleBuy = async (productId, contact) => {
    try {
      await axios.post("http://localhost:6002/buyProduct", {
        productId,
        buyerId: userId,
      });
      toast.success("Purchase successful!");
      setContactInfo(contact);
      setShowModal(true);
      fetchProducts();
    } catch (err) {
      toast.error("Error during purchase");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPrice = priceFilter ? parseFloat(product.price) <= parseFloat(priceFilter) : true;
    if (myOrders) return product.buyerId === userId && matchesSearch && matchesPrice;
    return !product.sold && matchesSearch && matchesPrice;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-700 text-white p-6">
      <ToastContainer />

      <div className="flex justify-between items-center mb-8 border-b border-slate-500 pb-4">
        <h2 className="text-4xl font-extrabold text-emerald-400 tracking-wide">♻️ E-Waste Market</h2>
        <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 transition px-4 py-2 rounded-lg font-medium shadow-lg">
          Logout
        </button>
      </div>

      <div className="space-x-4 mb-8 flex flex-wrap">
        <button onClick={fetchProducts} className="bg-indigo-600 hover:bg-indigo-700 transition text-white px-4 py-2 rounded-md shadow-md">
          All Products
        </button>
        <button onClick={fetchMyOrders} className="bg-yellow-500 hover:bg-yellow-600 transition text-black px-4 py-2 rounded-md shadow-md">
          My Orders
        </button>
        {userId && (
          <button onClick={() => setFormVisible(!formVisible)} className="bg-green-600 hover:bg-green-700 transition text-white px-4 py-2 rounded-md shadow-md">
            {formVisible ? "Close Form" : "Add Product"}
          </button>
        )}
      </div>

      <div className="mb-8 flex gap-4 flex-wrap">
        <input
          type="text"
          placeholder="Search by description"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 rounded-md border border-slate-500 bg-slate-800 text-white placeholder:text-gray-400 w-64"
        />
        <input
          type="number"
          placeholder="Max Price"
          value={priceFilter}
          onChange={(e) => setPriceFilter(e.target.value)}
          className="p-2 rounded-md border border-slate-500 bg-slate-800 text-white placeholder:text-gray-400 w-64"
        />
      </div>

      {formVisible && (
        <form onSubmit={handleProductSubmit} className="space-y-4 bg-slate-800 p-6 rounded-xl shadow-2xl max-w-xl mx-auto mb-12">
          <h3 className="text-2xl font-semibold text-emerald-400 mb-2">Upload Your E-Waste Product</h3>
          <input type="file" name="image" onChange={handleInputChange} required className="w-full border border-slate-500 p-2 rounded-md bg-slate-700 text-white" />
          <input type="text" name="name" placeholder="Product Name" onChange={handleInputChange} required className="w-full border border-slate-500 p-2 rounded-md bg-slate-700 text-white" />
          <input type="text" name="description" placeholder="Description" onChange={handleInputChange} required className="w-full border border-slate-500 p-2 rounded-md bg-slate-700 text-white" />
          <input type="text" name="price" placeholder="Price" onChange={handleInputChange} required className="w-full border border-slate-500 p-2 rounded-md bg-slate-700 text-white" />
          <input type="text" name="contact" placeholder="Contact Info" onChange={handleInputChange} required className="w-full border border-slate-500 p-2 rounded-md bg-slate-700 text-white" />
          <button type="submit" className="bg-emerald-500 hover:bg-emerald-600 transition text-white px-4 py-2 rounded-md shadow">
            Submit
          </button>
        </form>
      )}

      {loading ? (
        <p className="text-white text-center text-lg">Loading products...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="bg-slate-800 rounded-xl shadow-lg p-4 hover:shadow-2xl hover:scale-105 transition-all duration-300 border border-slate-700"
            >
              <img
                src={`http://localhost:6002/uploads/${product.image}`}
                alt={product.description}
                className="w-full h-52 object-cover rounded-md"
              />
              <h3 className="mt-4 text-2xl font-bold text-emerald-300">{product.name}</h3>
              <p className="text-white mt-1">{product.description}</p>
              <p className="text-emerald-400 text-lg mb-4">💰 ₹{product.price}</p>

              {!myOrders && (
                <button
                  onClick={() => handleBuy(product._id, product.contact)}
                  className="bg-indigo-600 hover:bg-indigo-700 transition text-white px-3 py-2 rounded-md"
                >
                  Buy
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl text-center max-w-sm w-full">
            <h3 className="text-xl font-bold text-green-600 mb-2">🎉 Contact Seller</h3>
            <p className="text-gray-800 text-lg">{contactInfo}</p>
            <button onClick={() => setShowModal(false)} className="mt-4 bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dash;

import { Link } from 'react-router-dom'
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">Shop</h3>
            <p className="text-sm mb-4">
              Your one-stop destination for quality products at great prices.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-white">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-white">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-white">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-white">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-white">Home</Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-white">Products</Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-white">Cart</Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-white">Orders</Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Customer Service</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/contact" className="hover:text-white">Contact Us</Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white">FAQ</Link>
              </li>
              <li>
                <Link to="/shipping" className="hover:text-white">Shipping Info</Link>
              </li>
              <li>
                <Link to="/returns" className="hover:text-white">Returns & Exchanges</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <Mail className="w-5 h-5" />
                <span>support@shop.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-5 h-5" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin className="w-5 h-5 mt-0.5" />
                <span>123 Commerce St<br />New York, NY 10001</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Shop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

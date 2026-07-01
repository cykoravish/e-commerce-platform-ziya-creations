import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { FaInstagram, FaFacebookF, FaYoutube } from "react-icons/fa";

export const footerContent = {
  about: {
    title: "About Us",
    content: (
      <>
        <p className="mb-5">
          Welcome to <strong>Ziya Creations</strong> – your trusted destination
          for premium artificial jewellry.
        </p>

        <p className="mb-5">
          We specialize in crafting exquisite anti-tarnish, skin-friendly
          jewellery that combines traditional elegance with modern designs. From
          mangalsutras to bangles, necklaces to earrings, every piece is
          carefully curated to make you shine on every occasion.
        </p>

        <p className="mb-6">
          Founded with a vision to make luxury jewellery accessible to everyone,
          we ensure top-notch quality at affordable prices. Our jewellery is
          perfect for daily wear, weddings, festivals, and gifting.
        </p>

        <h3 className="font-bold text-lg mb-3">Why Choose Us?</h3>

        <ul className="list-disc ml-6 space-y-2">
          <li>100% Anti-Tarnish Guarantee</li>
          <li>Skin-Friendly Materials</li>
          <li>Premium Quality at Best Price</li>
          <li>Fast Shipping Across India</li>
        </ul>
      </>
    ),
  },

  contact: {
    title: "Contact Us",
    content: (
      <div className="space-y-6">
        <div className="flex gap-3">
          <Phone className="text-orange-500 mt-1" size={18} />
          <div>
            <h4 className="font-semibold">Mobile Number</h4>
            <p>6204061746</p>
          </div>
        </div>

        <div className="flex gap-3">
          <Phone className="text-green-500 mt-1" size={18} />
          <div>
            <h4 className="font-semibold">WhatsApp</h4>
            <p>6204061746 - Chat with us</p>
          </div>
        </div>

        <div className="flex gap-3">
          <Mail className="text-orange-500 mt-1" size={18} />
          <div>
            <h4 className="font-semibold">Email</h4>
            <p>ziyacreations01@gmail.com</p>
          </div>
        </div>

        <div className="flex gap-3">
          <FaInstagram className="text-pink-500 mt-1 text-lg" />
          <div>
            <h4 className="font-semibold">Instagram</h4>
            <p>@Ziya Creation</p>
          </div>
        </div>

        <div className="flex gap-3">
          <FaFacebookF className="text-blue-600 mt-1 text-lg" />
          <div>
            <h4 className="font-semibold">Facebook</h4>
            <p>Ziya Creation</p>
          </div>
        </div>

        <div className="flex gap-3">
          <FaYoutube className="text-red-500 mt-1 text-lg" />
          <div>
            <h4 className="font-semibold">YouTube</h4>
            <p>Ziya Creation</p>
          </div>
        </div>
      </div>
    ),
  },

  store: {
    title: "Store Locator",
    content: (
      <div className="space-y-8">
        <Store
          title="Patna Store 01"
          address="Boring Road Chauraha, Wholesaler Gali near HDFC Bank, Nageshwar Colony, Patna, Bihar - 800001"
          timing="10:00 AM - 9:00 PM (All Days)"
          phone="6204061746, 9334382039"
        />

        <Store
          title="Patna Store 02"
          address="Maharaj Ghat Machratta near Post Office, Patna City, Bihar - 800008"
          timing="10:00 AM - 9:00 PM (All Days)"
          phone="9229400233, 9334382039"
        />

        <Store
          title="Kolkata Store"
          address="Shantiniketan Abasan, Thana Road, Khardah, Block-A, Kolkata, West Bengal - 700116"
          timing="10:30 AM - 8:30 PM (Mon-Sat)"
          phone="8777633964, 6289063643"
        />
      </div>
    ),
  },

  shipping: {
    title: "Shipping Policy",
    content: (
      <div className="space-y-5">
        <p>
          <strong>Delivery Time:</strong> 7–9 business days across India.
        </p>

        <p>
          <strong>Shipping Charges:</strong> ₹99 for Cash on Delivery orders.
          Free shipping on prepaid orders above ₹999.
        </p>

        <p>
          <strong>Order Processing:</strong> Orders are processed within 24
          hours. Tracking details are shared once shipped.
        </p>

        <p>
          <strong>Shipping Partners:</strong> Blue Dart, Delhivery and India
          Post.
        </p>

        <p>
          <strong>Note:</strong> Delivery time may vary during festivals or
          remote areas.
        </p>
      </div>
    ),
  },

  returns: {
    title: "Return Policy",
    content: (
      <>
        <p className="mb-4">
          Returns are accepted within 7 days of delivery for eligible products.
        </p>

        <ul className="list-disc ml-6 space-y-2">
          <li>Item must be unused.</li>
          <li>Original packaging is required.</li>
          <li>Customized jewellery cannot be returned.</li>
          <li>Refunds are processed after quality inspection.</li>
        </ul>
      </>
    ),
  },

  replacement: {
    title: "Replacement & Damage Claim Policy",
    content: (
      <>
        <p className="mb-4">
          If you receive a damaged or incorrect product, contact us within 48
          hours of delivery.
        </p>

        <ul className="list-disc ml-6 space-y-2">
          <li>Share product photos.</li>
          <li>Share unboxing video.</li>
          <li>Replacement will be shipped after verification.</li>
        </ul>
      </>
    ),
  },

  faq: {
    title: "FAQ",
    content: (
      <>
        <h4 className="font-semibold mb-2">Is the jewellery anti-tarnish?</h4>
        <p className="mb-5">Yes.</p>

        <h4 className="font-semibold mb-2">Do you offer COD?</h4>
        <p className="mb-5">Yes, Cash on Delivery is available.</p>

        <h4 className="font-semibold mb-2">How long does shipping take?</h4>
        <p>Usually 7–9 business days.</p>
      </>
    ),
  },

  privacy: {
    title: "Privacy Policy",
    content: (
      <p>
        We respect your privacy. Your personal information is securely stored
        and never sold to third parties. Information is only used for order
        processing and customer support.
      </p>
    ),
  },

  refund: {
    title: "Refund Policy",
    content: (
      <p>
        Refunds are initiated after returned products pass inspection. The
        amount will be credited to the original payment method within 5–7
        business days.
      </p>
    ),
  },

  terms: {
    title: "Terms & Conditions",
    content: (
      <>
        <ul className="list-disc ml-6 space-y-2">
          <li>Orders cannot be cancelled after dispatch.</li>
          <li>Cash on Delivery charges may apply.</li>
          <li>Prices may change without notice.</li>
          <li>Misuse of offers may lead to cancellation.</li>
        </ul>
      </>
    ),
  },
};

function Store({
  title,
  address,
  timing,
  phone,
}: {
  title: string;
  address: string;
  timing: string;
  phone: string;
}) {
  return (
    <div className="border-l-4 border-orange-500 pl-5">
      <h3 className="font-bold text-lg mb-2">{title}</h3>

      <div className="space-y-2 text-gray-700">
        <div className="flex gap-2">
          <MapPin size={17} className="mt-1" />
          <span>{address}</span>
        </div>

        <div className="flex gap-2">
          <Clock size={17} className="mt-1" />
          <span>{timing}</span>
        </div>

        <div className="flex gap-2">
          <Phone size={17} className="mt-1" />
          <span>{phone}</span>
        </div>
      </div>
    </div>
  );
}

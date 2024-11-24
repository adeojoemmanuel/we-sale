import React, { useState } from "react";
import Modal from "react-modal";
import QRCode from "react-qr-code";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import axios from "axios";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Currency from "react-currency-formatter";
import { useSelector } from "react-redux";
import CheckoutProduct from "../components/CheckoutProduct";
import Header from "../components/Header";
import { selectItems, selectTotal } from "../slices/basketSlice";

let stripePromise: Promise<Stripe | null>;

Modal.setAppElement("#__next"); // For accessibility, binds modal to the root div

type Props = {};

const Checkout = (props: Props) => {
  const items = useSelector(selectItems);
  const total = useSelector(selectTotal);
  const { data: session } = useSession();
  const [modalIsOpen, setModalIsOpen] = useState(false);

  // Sample wallet addresses
  const walletAddresses = {
    eth: "0xYourEthereumWalletAddress",
    sol: "YourSolanaWalletAddress",
    btc: "YourBitcoinWalletAddress",
  };

  const [selectedWallet, setSelectedWallet] = useState<keyof typeof walletAddresses>("eth");

  const toggleModal = () => {
    setModalIsOpen(!modalIsOpen);
  };

  const handlePayment = async () => {
    // You can process the user's details here if needed
    alert("Payment receipt will be processed after transaction verification.");
    setModalIsOpen(false);
  };

  return (
    <div className="bg-gray-100">
      <Header />
      <main className="lg:flex max-w-screen-2xl mx-auto">
        {/* Left */}
        <div className="flex-grow m-5 shadow-sm">
          <Image
            className="object-contain"
            src="/earphones.png"
            width={1020}
            height={250}
            alt="earphones ad"
          />
          <div className="flex flex-col p-5 space-y-10 bg-white">
            <h1 className="text-3xl border-b pb-4">
              {items.length === 0
                ? "Your Fast Basket is empty."
                : "Shopping Basket"}
            </h1>
            {items.map((item) => (
              <CheckoutProduct key={item.id} product={item} />
            ))}
          </div>
        </div>
        {/* Right */}
        <div className="flex flex-col bg-white p-10 shadow-md">
          {items.length > 0 && (
            <>
              <h2 className="whitespace-nowrap">
                Subtotal ({items.length} items):
                <span className="font-bold">
                  {" "}
                  <Currency quantity={total} currency="CAD" />
                </span>
              </h2>
              <button
                role="link"
                onClick={toggleModal}
                disabled={!session}
                className={`button mt-2 ${
                  !session &&
                  "from-gray-500 to-gray-200 border-gray-200 cursor-not-allowed"
                }`}
              >
                {!session ? "Sign in to checkout" : "Proceed to Payment"}
              </button>
            </>
          )}
        </div>
      </main>

      {/* Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={toggleModal}
        className="bg-white p-6 rounded shadow-lg max-w-md mx-auto mt-20"
        overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center"
      >
        <h2 className="text-xl font-bold mb-4">Pay with Crypto</h2>
        <div className="mb-4">
          <label htmlFor="wallet" className="block font-medium">
            Select Wallet:
          </label>
          <select
            id="wallet"
            className="border p-2 rounded w-full"
            value={selectedWallet}
            onChange={(e) =>
              setSelectedWallet(e.target.value as keyof typeof walletAddresses)
            }
          >
            <option value="eth">Ethereum</option>
            <option value="sol">Solana</option>
            <option value="btc">Bitcoin</option>
          </select>
        </div>
        <div className="mb-4">
          <p className="font-medium">Wallet Address:</p>
          <p className="bg-gray-100 p-2 rounded break-all">
            {walletAddresses[selectedWallet]}
          </p>
        </div>
        <div className="mb-4">
          <p className="font-medium">QR Code:</p>
          <QRCode value={walletAddresses[selectedWallet]} size={128} />
        </div>
        <form className="space-y-4">
          <div>
            <label htmlFor="email" className="block font-medium">
              Email for Receipt:
            </label>
            <input
              type="email"
              id="email"
              className="border p-2 rounded w-full"
              placeholder="Enter your email"
              required
            />
          </div>
          <button
            type="button"
            onClick={handlePayment}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Confirm Payment
          </button>
        </form>
        <button
          onClick={toggleModal}
          className="mt-4 text-red-500 underline hover:text-red-700"
        >
          Close
        </button>
      </Modal>
    </div>
  );
};

export default Checkout;

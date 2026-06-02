export default function CheckoutSection({
  checkoutData,
  setCheckoutData,
  submitCheckout,
  creatingPayment,
  cartLength,
  orderSuccess,
  gatewayError,
  children
}) {
  return (
    <section id="kontak" className="section checkout-form-wrap">
      <div className="section-head">
        <h3>Checkout</h3>
        <p>Isi data pemesanan untuk proses pembayaran manual dan konfirmasi admin.</p>
      </div>
      <form className="checkout-form" onSubmit={submitCheckout}>
        <input
          required
          placeholder="Nama lengkap"
          value={checkoutData.name}
          onChange={(event) =>
            setCheckoutData((prev) => ({ ...prev, name: event.target.value }))
          }
        />
        <input
          required
          placeholder="Nomor WhatsApp"
          value={checkoutData.phone}
          onChange={(event) =>
            setCheckoutData((prev) => ({ ...prev, phone: event.target.value }))
          }
        />
        <textarea
          required
          placeholder="Alamat pemasangan / pengiriman"
          value={checkoutData.address}
          onChange={(event) =>
            setCheckoutData((prev) => ({
              ...prev,
              address: event.target.value
            }))
          }
        />
        <select
          value={checkoutData.payment}
          onChange={(event) =>
            setCheckoutData((prev) => ({ ...prev, payment: event.target.value }))
          }
        >
          <option>Transfer Bank</option>
          <option>Bayar di Tempat</option>
        </select>
        <button
          className="btn btn-primary"
          type="submit"
          disabled={!cartLength || creatingPayment}
        >
          {creatingPayment ? "Membuat Pesanan..." : "Buat Pesanan"}
        </button>
        {orderSuccess && <p className="order-success">{orderSuccess}</p>}
        {gatewayError && <p className="gateway-error">{gatewayError}</p>}
      </form>
      {children}
    </section>
  );
}

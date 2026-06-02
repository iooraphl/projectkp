export default function GatewayPanel({
  gatewaySession,
  setWaitingConfirmation,
  markOrderPaid,
  refreshGatewayStatus,
  cancelGatewaySession,
  formatIDR
}) {
  if (!gatewaySession) return null;

  return (
    <article className="gateway-box">
      <div className="gateway-head">
        <h4>Pembayaran ({gatewaySession.provider})</h4>
        <span className={`gateway-badge ${String(gatewaySession.status).toLowerCase()}`}>
          {gatewaySession.status}
        </span>
      </div>
      <p>
        Referensi: <strong>{gatewaySession.refCode}</strong>
      </p>
      <p>
        Order ID: <strong>{gatewaySession.orderId}</strong>
      </p>
      <p>
        Metode: <strong>{gatewaySession.methodLabel}</strong>
      </p>
      <p>
        Nominal: <strong>{formatIDR(gatewaySession.amount)}</strong>
      </p>
      {gatewaySession.method === "Transfer Bank" && gatewaySession.bankInfo && (
        <>
          <p>
            Bank: <strong>{gatewaySession.bankInfo.bank}</strong>
          </p>
          <p>
            No. Rekening: <strong>{gatewaySession.bankInfo.accountNumber}</strong>
          </p>
          <p>
            Atas Nama: <strong>{gatewaySession.bankInfo.accountName}</strong>
          </p>
        </>
      )}
      {gatewaySession.vaNumber && gatewaySession.vaNumber !== "-" && (
        <p>
          Kode bayar / VA: <strong>{gatewaySession.vaNumber}</strong>
        </p>
      )}

      <div className="gateway-actions">
        <button className="btn btn-primary" type="button" onClick={setWaitingConfirmation}>
          Saya Sudah Bayar
        </button>
        <button className="btn btn-ghost" type="button" onClick={refreshGatewayStatus}>
          Cek Status
        </button>
        <button className="btn btn-ghost" type="button" onClick={markOrderPaid}>
          Simulasikan Lunas
        </button>
        <button className="btn btn-ghost" type="button" onClick={cancelGatewaySession}>
          Batalkan Sesi
        </button>
      </div>
      <p className="muted">Mode manual aktif: verifikasi pembayaran dilakukan oleh admin.</p>
    </article>
  );
}

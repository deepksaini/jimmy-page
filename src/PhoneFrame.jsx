export default function PhoneFrame({ children, status }) {
  return (
    <div className="phone-frame-wrap">
      {status}
      <div className="phone-frame" aria-hidden="false">
        <div className="phone-notch" />
        <div className="phone-frame-screen">{children}</div>
      </div>
    </div>
  )
}

const Notification = ({ notif }) => {
  if (notif === null) {
    return null
  }
  const { message, isErr } = notif
  return (
    <div className={isErr ? 'error' : 'success'}>
      {message}
    </div>
  )
}

export default Notification
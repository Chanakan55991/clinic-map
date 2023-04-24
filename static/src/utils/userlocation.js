const getUserLocation = () => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        resolve(pos)
      }, () => {
        reject('Please allow this website to access your geolocation data')
      })
    } else reject('Your browser does not support geolocation')
  })
}
export { getUserLocation }

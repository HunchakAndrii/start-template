export default (fn, ms) => {
  let isThrottled = false
  let savedArgs
  let saveThis

  function wrapper() {
    if(isThrottled) {
      savedArgs = arguments
      saveThis = this
      return
    }

    fn.apply(this, arguments)

    isThrottled = true

    setTimeout(() => {
      isThrottled = false
      if(savedArgs) {
        wrapper.apply(saveThis, savedArgs)
        savedArgs = saveThis = null
      }
    }, ms)
  }

  return wrapper
}
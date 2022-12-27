import { throttle } from 'lodash'
import { useCallback, useEffect, useRef } from 'react'

// function useDebouncedFn(cb: any, delay: number) {
//   // ...
//   const inputsRef = useRef({cb, delay}); // mutable ref like with useThrottle
//   useEffect(() => { inputsRef.current = { cb, delay }; }); //also track cur. delay
//   return useCallback(
//     _.debounce((...args) => {
//         // Debounce is an async callback. Cancel it, if in the meanwhile
//         // (1) component has been unmounted (see isMounted in snippet)
//         // (2) delay has changed
//         if (inputsRef.current.delay === delay && isMounted())
//           inputsRef.current.cb(...args);
//       }, delay, options
//     ),
//     [delay, _.debounce]
//   );
// }
export function useThrottle(cb: Function, delay: number) {
  const options = { leading: false, trailing: true } // add custom lodash options
  const cbRef = useRef(cb)
  // use mutable ref to make useCallback/throttle not depend on `cb` dep
  useEffect(() => {
    cbRef.current = cb
  })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(
    throttle((...args) => cbRef.current(...args), delay, options),
    [delay],
  )
}


import { useEffect, useLayoutEffect, useRef } from 'react'

const useInterval = (fn: () => void, delay: number | undefined) => {
    // useRef to save the callback function of the CURRENT state
    const callback = useRef(fn);

    // useLayoutEffect: fire before the rendering of the screen at the cost of performance
    // use case: need to know certain information (of the rendering) before the logic execution

    useLayoutEffect(() => {
        callback.current = fn
    }, [fn])

    useEffect(() => {
        if (!delay && delay !== 0) {
            return ;
        }

        const id = setInterval(() => callback.current(), delay);

        // clean up
        return () => clearInterval(id);
    }, [delay])
}

export default useInterval
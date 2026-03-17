import { useSyncExternalStore } from "react"

const subscribe = () => {
    return () => undefined
}

export default function useMounted() {
    return useSyncExternalStore(subscribe, () => true, () => false)
}

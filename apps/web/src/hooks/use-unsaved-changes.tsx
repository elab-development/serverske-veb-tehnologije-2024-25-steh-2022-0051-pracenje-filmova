import { useRef, useState } from "react"

export const useUnsavedChanges = <T,>(data: T) => {
  const [state, setState] = useState<T>(data)
  const unsavedChanges = useRef<T>(data)

  const setUnsavedChanges = (newData: T | ((prevData: T) => T)) => {
    if (typeof newData === "function") {
      // TypeScript type guard for function
      unsavedChanges.current = (newData as (prevData: T) => T)(
        unsavedChanges.current,
      )
    } else {
      unsavedChanges.current = newData
    }
  }

  const saveChanges = () => {
    setState(unsavedChanges.current)
  }

  return {
    state,
    setState,
    saveChanges,
    setUnsavedChanges,
    unsavedChanges,
  }
}

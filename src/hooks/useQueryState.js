import { useQueryState } from 'next-usequerystate'

const useLocalizedQueryState = ({ prefix, defaults, defaultValues }) => {
  const useCustomQueryState = ({ key, parser, parsed }) => {
    const formattedKey = `${prefix ? prefix + '-' : ''}${key}`
    const initialValue = parsed ? parsed : parser.withDefault(defaults?.[key] || defaultValues[key])

    const [value, setValue] = useQueryState(formattedKey, initialValue)

    return [value, setValue]
  }

  return useCustomQueryState
}

export default useLocalizedQueryState

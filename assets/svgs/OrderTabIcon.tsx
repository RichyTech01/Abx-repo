import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"
const SvgComponent = (props: SvgProps) => (
  <Svg
    width={20}
    height={22}
    fill="none"
    {...props}
  >
    <Path
      stroke="#929292"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M1 10c0-3.75 0-5.625.955-6.939A5 5 0 0 1 3.06 1.955C4.375 1 6.251 1 10 1c3.75 0 5.625 0 6.939.955a5 5 0 0 1 1.106 1.106C19 4.375 19 6.251 19 10v2c0 3.75 0 5.625-.955 6.939a5 5 0 0 1-1.106 1.106C15.625 21 13.749 21 10 21c-3.75 0-5.625 0-6.939-.955a5 5 0 0 1-1.106-1.106C1 17.625 1 15.749 1 12v-2ZM13 11H5m3 5H5"
    />
  </Svg>
)
export default SvgComponent

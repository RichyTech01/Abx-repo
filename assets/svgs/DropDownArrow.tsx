import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"
const DropDownArrow = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={12}
    height={6}
    fill="none"
    {...props}
  >
    <Path
      stroke="#424242"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M10.5.75S7.186 5.25 6 5.25 1.5.75 1.5.75"
    />
  </Svg>
)
export default DropDownArrow

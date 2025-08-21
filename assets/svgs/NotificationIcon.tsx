import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"
const NotificationIcon = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={25}
    height={25}
    fill="none"
    {...props}
  >
    <Path
      stroke="#2D2220"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M2.635 15.385c-.221 1.452.77 2.46 1.982 2.962 4.648 1.926 11.118 1.926 15.766 0 1.213-.502 2.203-1.51 1.982-2.962-.136-.893-.81-1.636-1.308-2.361-.654-.962-.718-2.012-.719-3.128 0-4.315-3.509-7.813-7.838-7.813-4.33 0-7.838 3.498-7.838 7.813 0 1.116-.065 2.166-.719 3.128-.498.725-1.172 1.469-1.308 2.36Z"
    />
    <Path
      stroke="#2D2220"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M8.333 19.792c.478 1.797 2.162 3.125 4.167 3.125s3.69-1.328 4.167-3.125"
    />
  </Svg>
)
export default NotificationIcon

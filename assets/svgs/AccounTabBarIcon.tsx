import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"
const AccounTabBarIcon = (props: SvgProps) => (
  <Svg
    width={20}
    height={22}
    fill="none"
    {...props}
  >
    <Path
      fill={props.fill || "#929292"}
      stroke={props.stroke || "#929292"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M4.578 14.482c-1.415.842-5.125 2.562-2.865 4.715C2.816 20.248 4.045 21 5.59 21h8.818c1.545 0 2.775-.752 3.878-1.803 2.26-2.153-1.45-3.873-2.865-4.715a10.663 10.663 0 0 0-10.844 0Z"
    />
    <Path
      fill={props.fill || "#929292"}
      stroke={props.stroke || "#929292"}
      strokeWidth={1.5}
      d="M14.5 5.5a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z"
    />
  </Svg>
)
export default AccounTabBarIcon

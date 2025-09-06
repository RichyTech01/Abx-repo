import * as React from "react"
import Svg, { SvgProps, G, Path, Defs, ClipPath } from "react-native-svg"
const TrackingOrderIcon = (props: SvgProps) => (
  <Svg
    width={14}
    height={15}
    fill="none"
    {...props}
  >
    <G stroke={props.stroke || "#05A85A"} strokeWidth={1.2} clipPath="url(#a)">
      <Path d="M12.833 7.9a5.833 5.833 0 1 0-11.666 0 5.833 5.833 0 0 0 11.666 0Z" />
      <Path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.667 8.192 6.125 9.65l3.208-3.5"
      />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M0 .9h14v14H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)
export default TrackingOrderIcon

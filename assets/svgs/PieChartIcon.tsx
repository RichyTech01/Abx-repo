import * as React from "react"
import Svg, { SvgProps, G, Path, Defs, ClipPath } from "react-native-svg"
const PieChartIcon = (props: SvgProps) => (
  <Svg
    width={16}
    height={16}
    fill="none"
    {...props}
  >
    <G fill={props.fill || "#BEBEBE"} clipPath="url(#a)">
      <Path d="M8.667.697v4.378a3.006 3.006 0 0 1 2.26 2.258h4.376A7.334 7.334 0 0 0 8.667.697Zm6.636 7.97h-4.376c-.076.33-.207.644-.387.93l3.096 3.096a7.3 7.3 0 0 0 1.667-4.026Z" />
      <Path d="M12.693 13.636 9.597 10.54a3 3 0 1 1-2.264-5.465V.697a7.334 7.334 0 1 0 5.36 12.938" />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M0 0h16v16H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)
export default PieChartIcon

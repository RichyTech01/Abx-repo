import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"
const SupportTabIcon = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={19}
    height={20}
    fill="none"
    {...props}
  >
    <Path
      fill={props.fill|| "#929292"}
      stroke={props.stroke|| "#929292"}
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M2.648 9.952c-.79-1.378-1.171-2.502-1.401-3.643-.34-1.686.438-3.333 1.728-4.384.545-.445 1.17-.293 1.492.285l.728 1.306c.576 1.034.865 1.552.808 2.1-.058.549-.447.996-1.224 1.889l-2.13 2.447Zm0 0c1.6 2.788 4.109 5.299 6.9 6.9m0 0c1.378.79 2.503 1.171 3.643 1.401 1.686.34 3.334-.438 4.385-1.727.444-.546.292-1.17-.286-1.493l-1.305-.727c-1.035-.577-1.553-.865-2.101-.808-.549.057-.995.446-1.889 1.224l-2.447 2.13Z"
    />
  </Svg>
)
export default SupportTabIcon

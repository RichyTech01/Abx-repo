import * as React from "react"
import Svg, { SvgProps, G, Path, Defs, ClipPath } from "react-native-svg"
const EditIcon = (props: SvgProps) => (
  <Svg
    width={12}
    height={12}
    fill="none"
    {...props}
  >
    <G
      stroke={props.stroke || "#05A85A"}
      strokeLinejoin="round"
      strokeWidth={1.5}
      clipPath="url(#a)"
    >
      <Path d="M7.037 1.943c.372-.404.559-.606.757-.724a1.553 1.553 0 0 1 1.551-.023c.201.112.393.308.777.7.385.393.577.589.686.794a1.647 1.647 0 0 1-.023 1.585c-.115.203-.313.393-.708.773l-4.702 4.53c-.749.72-1.123 1.081-1.591 1.264-.468.183-.982.17-2.011.142l-.14-.003c-.314-.009-.47-.013-.561-.116-.091-.103-.079-.263-.054-.582l.014-.173c.07-.898.104-1.347.28-1.75.175-.405.478-.732 1.083-1.388l4.642-5.03ZM6.5 2 10 5.5" />
      <Path strokeLinecap="round" d="M7 11h4" />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M0 0h12v12H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)
export default EditIcon


